import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Calendar, Briefcase, Building,
  Users, Lock, Camera, FileText, Download, Edit, X, Check, Shield
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { getUsers } from '../lib/api';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ phone: '', address: {} });
  const [savedData, setSavedData] = useState({ phone: '', address: {} });

  useEffect(() => {
    async function fetchUser() {
      try {
        const users = await getUsers();
        // Find the employee user
        const emp = users.find(u => u.role === 'EMPLOYEE');
        if (emp) {
          setEmployee(emp);
          const data = { phone: emp.phone || '', address: emp.address || '' };
          setEditData(data);
          setSavedData({ ...data });
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleSave = () => {
    setSavedData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...savedData });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Profile
            </h1>
            <p className="uppercase text-xs font-semibold tracking-widest text-[#d4af37] mt-1">
              Manage your personal information
            </p>
          </div>
          {isEditing && (
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={handleCancel} className="text-gray-500 hover:text-gray-900">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full ring-4 ring-[#d4af37]/30 flex items-center justify-center overflow-hidden ${!employee?.avatarUrl ? 'bg-[#d4af37]/10' : ''}`}>
                    {employee?.avatarUrl ? (
                      <img src={employee.avatarUrl} alt={employee.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-[#d4af37]" />
                    )}
                  </div>
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="w-6 h-6 text-white mb-1" />
                      <span className="text-[10px] text-white font-medium">Change Photo</span>
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mt-4">{employee?.name || authUser?.name || 'Employee'}</h2>
                <p className="text-sm text-gray-500">{employee?.jobTitle || 'N/A'}</p>
                
                <div className="inline-flex items-center bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold rounded-full px-3 py-1 mt-2">
                  EMP: {employee?.employeeId || 'N/A'}
                </div>

                <div className="flex items-center text-sm text-gray-500 mt-3">
                  <Building className="w-4 h-4 mr-1.5" />
                  {employee?.department || 'N/A'}
                </div>

                <div className="mt-6 w-full">
                  {!isEditing ? (
                    <Button variant="secondary" className="w-full justify-center" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button variant="ghost" className="w-full justify-center border border-gray-200" onClick={handleCancel}>
                      Cancel Editing
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Section 1: Personal Information */}
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center justify-between opacity-60">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {employee?.email || 'N/A'}
                    </div>
                    <Lock className="w-4 h-4 text-gray-400" title="Contact HR to update this field" />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="phone"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="w-full text-sm border-gray-300 rounded-md focus:ring-[#d4af37] focus:border-[#d4af37] p-2 border"
                      aria-label="Phone Number"
                    />
                  ) : (
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {savedData.phone || 'N/A'}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="Address"
                      value={editData.address || ''}
                      onChange={(e) => setEditData({...editData, address: e.target.value})}
                      className="w-full text-sm border-gray-300 rounded-md focus:ring-[#d4af37] focus:border-[#d4af37] p-2 border"
                      aria-label="Address"
                    />
                  ) : (
                    <div className="flex items-center text-sm text-gray-900 mt-1">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 shrink-0" />
                      <span>{savedData.address || 'N/A'}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Section 2: Job Information */}
            <Card className="bg-gray-50 border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-bold text-gray-900">Job Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 opacity-60">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Designation
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-900">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                      {employee?.jobTitle || 'N/A'}
                    </div>
                    <Lock className="w-4 h-4 text-gray-400" title="Contact HR to update this field" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-900">
                      <Building className="w-4 h-4 mr-2 text-gray-400" />
                      {employee?.department || 'N/A'}
                    </div>
                    <Lock className="w-4 h-4 text-gray-400" title="Contact HR to update this field" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Employee ID
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-900">
                      <Shield className="w-4 h-4 mr-2 text-gray-400" />
                      {employee?.employeeId || 'N/A'}
                    </div>
                    <Lock className="w-4 h-4 text-gray-400" title="Contact HR to update this field" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Role
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      {employee?.role === 'ADMIN' ? 'Admin' : 'Employee'}
                    </div>
                    <Lock className="w-4 h-4 text-gray-400" title="Contact HR to update this field" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 3: Documents (placeholder) */}
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-lg font-bold text-gray-900">Documents</h3>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <FileText size={40} className="text-[#d4af37] opacity-60 mb-3" />
                <p className="text-sm font-medium text-gray-600">
                  No documents uploaded yet
                </p>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;
