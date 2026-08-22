import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Save,
  X,
  FileText,
  Briefcase,
  DollarSign,
  FolderOpen,
  User,
} from 'lucide-react';
import { employees } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

const tabs = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'job', label: 'Job Details', icon: Briefcase },
  { id: 'salary', label: 'Salary', icon: DollarSign },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
];

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  const employee = employees.find((e) => e.id === id);
  const empIndex = employees.findIndex((e) => e.id === id);

  const prevEmp = empIndex > 0 ? employees[empIndex - 1] : null;
  const nextEmp = empIndex < employees.length - 1 ? employees[empIndex + 1] : null;

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <User size={48} className="mb-3 opacity-60 text-[#d4af37]" />
        <p className="text-lg font-medium">Employee not found</p>
        <Link
          to="/employees"
          className="mt-4 text-sm text-[#d4af37] font-semibold hover:underline"
        >
          ← Back to list
        </Link>
      </div>
    );
  }

  const startEditing = () => {
    setFormData({ ...employee });
    setEditing(true);
  };

  const saveEdits = () => {
    // In a real app, this would save to an API
    setEditing(false);
    setFormData(null);
  };

  const cancelEdits = () => {
    setEditing(false);
    setFormData(null);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => navigate('/employees')}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#d4af37] mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Employees
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#0B0E14] flex items-center justify-center text-[#d4af37] font-bold text-xl">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                {employee.firstName} {employee.lastName}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-500">{employee.id}</span>
                <StatusBadge status={employee.status} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev/Next navigation */}
            {prevEmp && (
              <button
                onClick={() => navigate(`/employees/${prevEmp.id}`)}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-[#d4af37] hover:border-[#d4af37] transition"
                title={`Previous: ${prevEmp.firstName} ${prevEmp.lastName}`}
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {nextEmp && (
              <button
                onClick={() => navigate(`/employees/${nextEmp.id}`)}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-[#d4af37] hover:border-[#d4af37] transition"
                title={`Next: ${nextEmp.firstName} ${nextEmp.lastName}`}
              >
                <ChevronRight size={18} />
              </button>
            )}

            {/* Edit button */}
            {!editing ? (
              <button
                onClick={startEditing}
                className="inline-flex items-center gap-2 bg-[#d4af37] text-[#0B0E14] px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={saveEdits}
                  className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={cancelEdits}
                  className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#d4af37] text-[#d4af37]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
      >
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="First Name"
                value={editing ? formData.firstName : employee.firstName}
                editing={editing}
                onChange={(v) => updateField('firstName', v)}
              />
              <Field
                label="Last Name"
                value={editing ? formData.lastName : employee.lastName}
                editing={editing}
                onChange={(v) => updateField('lastName', v)}
              />
              <Field
                label="Email"
                value={editing ? formData.email : employee.email}
                editing={editing}
                onChange={(v) => updateField('email', v)}
              />
              <Field
                label="Phone"
                value={editing ? formData.phone : employee.phone}
                editing={editing}
                onChange={(v) => updateField('phone', v)}
              />
              <Field
                label="Date of Birth"
                value={editing ? formData.dateOfBirth : employee.dateOfBirth}
                editing={editing}
                onChange={(v) => updateField('dateOfBirth', v)}
              />
              <Field
                label="Gender"
                value={editing ? formData.gender : employee.gender}
                editing={editing}
                onChange={(v) => updateField('gender', v)}
              />
              <div className="md:col-span-2">
                <Field
                  label="Address"
                  value={editing ? formData.address : employee.address}
                  editing={editing}
                  onChange={(v) => updateField('address', v)}
                  full
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'job' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Job Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="Employee ID"
                value={employee.id}
                disabled
              />
              <Field
                label="Department"
                value={editing ? formData.department : employee.department}
                editing={editing}
                onChange={(v) => updateField('department', v)}
              />
              <Field
                label="Designation"
                value={editing ? formData.designation : employee.designation}
                editing={editing}
                onChange={(v) => updateField('designation', v)}
              />
              <Field
                label="Date of Joining"
                value={employee.dateOfJoining}
                disabled
              />
              <Field
                label="Status"
                value={editing ? formData.status : employee.status}
                editing={editing}
                onChange={(v) => updateField('status', v)}
              />
            </div>
          </div>
        )}

        {activeTab === 'salary' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Salary Structure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Basic Salary" value={`₹${employee.salary.basic.toLocaleString()}`} disabled />
              <Field label="HRA" value={`₹${employee.salary.hra.toLocaleString()}`} disabled />
              <Field label="Allowances" value={`₹${employee.salary.allowances.toLocaleString()}`} disabled />
              <Field label="Deductions" value={`₹${employee.salary.deductions.toLocaleString()}`} disabled />
              <div className="md:col-span-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900">
                    Net Salary
                  </span>
                  <span className="text-2xl font-bold tabular-nums text-[#d4af37]">
                    ₹{employee.salary.netSalary.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Documents</h2>
            {employee.documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <FolderOpen
                  size={36}
                  className="mb-2 opacity-60 text-[#d4af37]"
                />
                <p className="text-sm">No documents uploaded</p>
              </div>
            ) : (
              <div className="space-y-3">
                {employee.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#0B0E14]/5 flex items-center justify-center">
                        <FileText
                          size={18}
                          className="text-[#d4af37]"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {doc.type} · {doc.date}
                        </p>
                      </div>
                    </div>
                    <button className="text-xs text-[#d4af37] font-semibold hover:underline">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function Field({ label, value, editing, onChange, disabled, full }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-wide uppercase text-gray-500 mb-1.5">
        {label}
      </label>
      {editing && !disabled ? (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition ${
            full ? 'md:col-span-2' : ''
          }`}
        />
      ) : (
        <p className="text-sm text-gray-900 py-2">{value || '—'}</p>
      )}
    </div>
  );
}
