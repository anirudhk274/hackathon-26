import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Calendar, Briefcase, Building,
  Users, Lock, Camera, FileText, Download, Edit, X, Check, Shield
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Card from '../components/Card';
import Button from '../components/Button';
import employee from '../data/employee';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    phone: employee.phone,
    address: { ...employee.address }
  });
  
  // Dummy state to mock saving locally
  const [savedData, setSavedData] = useState({ ...editData });

  const handleSave = () => {
    // TODO: enforce server-side
    setSavedData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...savedData });
    setIsEditing(false);
  };

  const handleAddressChange = (e) => {
    setEditData({
      ...editData,
      address: {
        ...editData.address,
        [e.target.name]: e.target.value
      }
    });
  };

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
                  <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full ring-4 ring-[#d4af37]/30 flex items-center justify-center overflow-hidden ${!employee.profilePicture ? 'bg-[#d4af37]/10' : ''}`}>
                    {employee.profilePicture ? (
                      <img src={employee.profilePicture} alt={employee.name} className="w-full h-full object-cover" />
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

                <h2 className="text-xl font-bold text-gray-900 mt-4">{employee.name}</h2>
                <p className="text-sm text-gray-500">{employee.designation}</p>
                
                <div className="inline-flex items-center bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold rounded-full px-3 py-1 mt-2">
                  EMP: {employee.id}
                </div>

                <div className="flex items-center text-sm text-gray-500 mt-3">
                  <Building className="w-4 h-4 mr-1.5" />
                  {employee.department}
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
                    Date of Birth
                  </label>
                  <div className="flex items-center justify-between opacity-60">
                    <span className="text-sm text-gray-900">{new Date(employee.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <Lock className="w-4 h-4 text-gray-400" title="Contact HR to update this field" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Gender
                  </label>
                  <div className="flex items-center justify-between opacity-60">
                    <span className="text-sm text-gray-900">{employee.gender}</span>
                    <Lock className="w-4 h-4 text-gray-400" title="Contact HR to update this field" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center justify-between opacity-60">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {employee.email}
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
                      {savedData.phone}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Address
                  </label>
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="line1"
                        placeholder="Line 1"
                        value={editData.address.line1 || ''}
                        onChange={handleAddressChange}
                        className="w-full text-sm border-gray-300 rounded-md focus:ring-[#d4af37] focus:border-[#d4af37] p-2 border"
                        aria-label="Address Line 1"
                      />
                      <input
                        type="text"
                        name="line2"
                        placeholder="Line 2"
                        value={editData.address.line2 || ''}
                        onChange={handleAddressChange}
                        className="w-full text-sm border-gray-300 rounded-md focus:ring-[#d4af37] focus:border-[#d4af37] p-2 border"
                        aria-label="Address Line 2"
                      />
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={editData.address.city || ''}
                        onChange={handleAddressChange}
                        className="w-full text-sm border-gray-300 rounded-md focus:ring-[#d4af37] focus:border-[#d4af37] p-2 border"
                        aria-label="City"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="state"
                          placeholder="State"
                          value={editData.address.state || ''}
                          onChange={handleAddressChange}
                          className="w-full text-sm border-gray-300 rounded-md focus:ring-[#d4af37] focus:border-[#d4af37] p-2 border"
                          aria-label="State"
                        />
                        <input
                          type="text"
                          name="pin"
                          placeholder="PIN Code"
                          value={editData.address.pin || ''}
                          onChange={handleAddressChange}
                          className="w-full text-sm border-gray-300 rounded-md focus:ring-[#d4af37] focus:border-[#d4af37] p-2 border"
                          aria-label="PIN Code"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start text-sm text-gray-900 mt-1">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 shrink-0" />
                      <span>
                        {savedData.address.line1}, {savedData.address.line2 && `${savedData.address.line2}, `}
                        {savedData.address.city}, {savedData.address.state} - {savedData.address.pin}
                      </span>
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
                      {employee.designation}
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
                      {employee.department}
                    </div>
                    <Lock className="w-4 h-4 text-gray-400" title="Contact HR to update this field" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Joining Date
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(employee.joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <Lock className="w-4 h-4 text-gray-400" title="Contact HR to update this field" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Reporting Manager
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      {employee.manager || "N/A"}
                    </div>
                    <Lock className="w-4 h-4 text-gray-400" title="Contact HR to update this field" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Employment Type
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-900">
                      <Shield className="w-4 h-4 mr-2 text-gray-400" />
                      {employee.employmentType || "Full-time"}
                    </div>
                    <Lock className="w-4 h-4 text-gray-400" title="Contact HR to update this field" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 3: Salary Information */}
            <Card>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Salary Information</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2 text-gray-400 uppercase text-xs tracking-wider">CTC Band:</span>
                    <span className="font-semibold">{employee.ctcBand || "N/A"}</span>
                  </div>
                </div>
                <Link to="/payroll" className="text-sm font-medium text-[#d4af37] hover:text-[#b8962e] flex items-center shrink-0">
                  View detailed payroll &rarr;
                </Link>
              </div>
            </Card>

            {/* Section 4: Documents */}
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-lg font-bold text-gray-900">Documents</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {employee.documents && employee.documents.length > 0 ? (
                  employee.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors bg-white">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#d4af37]/10 rounded-md shrink-0">
                          <FileText className="w-4 h-4 text-[#d4af37]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.type}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-500 shrink-0" aria-label={`Download ${doc.name}`}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors bg-white">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#d4af37]/10 rounded-md shrink-0">
                          <FileText className="w-4 h-4 text-[#d4af37]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">Offer Letter</p>
                          <p className="text-xs text-gray-500">PDF Document</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-500 shrink-0">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors bg-white">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#d4af37]/10 rounded-md shrink-0">
                          <FileText className="w-4 h-4 text-[#d4af37]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">ID Proof</p>
                          <p className="text-xs text-gray-500">Image</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-500 shrink-0">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;
