import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Edit3, Save, X,
  FileText, Briefcase, DollarSign, FolderOpen, User,
} from 'lucide-react';
import { getUsers } from '../lib/api';
import StatusBadge from '../components/StatusBadge';

const tabs = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'job', label: 'Job Details', icon: Briefcase },
  { id: 'salary', label: 'Salary', icon: DollarSign },
];

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allEmployees, setAllEmployees] = useState([]);

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const users = await getUsers();
        setAllEmployees(users);
        const emp = users.find(e => e.id === id);
        setEmployee(emp);
      } catch (err) {
        console.error('Failed to fetch employee:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployee();
  }, [id]);

  const empIndex = allEmployees.findIndex(e => e.id === id);
  const prevEmp = empIndex > 0 ? allEmployees[empIndex - 1] : null;
  const nextEmp = empIndex < allEmployees.length - 1 ? allEmployees[empIndex + 1] : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <User size={48} className="mb-3 opacity-60 text-[#d4af37]" />
        <p className="text-lg font-medium">Employee not found</p>
        <Link to="/admin/employees" className="mt-4 text-sm text-[#d4af37] font-semibold hover:underline">← Back to list</Link>
      </div>
    );
  }

  const initials = employee.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??';

  const startEditing = () => { setFormData({ ...employee }); setEditing(true); };
  const saveEdits = () => { setEditing(false); setFormData(null); };
  const cancelEdits = () => { setEditing(false); setFormData(null); };
  const updateField = (field, value) => { setFormData((prev) => ({ ...prev, [field]: value })); };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <button onClick={() => navigate('/admin/employees')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#d4af37] mb-4 transition-colors">
          <ArrowLeft size={16} /> ← Back to Employees
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#0B0E14] flex items-center justify-center text-[#d4af37] font-bold text-xl">{initials}</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">{employee.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-500">{employee.employeeId}</span>
                <StatusBadge status={employee.role === 'ADMIN' ? 'Active' : 'Active'} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {prevEmp && <button onClick={() => navigate(`/admin/employees/${prevEmp.id}`)} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-[#d4af37] hover:border-[#d4af37] transition" title={`Previous: ${prevEmp.name}`}><ChevronLeft size={18} /></button>}
            {nextEmp && <button onClick={() => navigate(`/admin/employees/${nextEmp.id}`)} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-[#d4af37] hover:border-[#d4af37] transition" title={`Next: ${nextEmp.name}`}><ChevronRight size={18} /></button>}
            {!editing ? (
              <button onClick={startEditing} className="inline-flex items-center gap-2 bg-[#d4af37] text-[#0B0E14] px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition"><Edit3 size={16} /> Edit Profile</button>
            ) : (
              <div className="flex gap-2">
                <button onClick={saveEdits} className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition"><Save size={16} /> Save</button>
                <button onClick={cancelEdits} className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"><X size={16} /> Cancel</button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${activeTab === tab.id ? 'border-[#d4af37] text-[#d4af37]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Name" value={editing ? formData.name : employee.name} editing={editing} onChange={(v) => updateField('name', v)} />
              <Field label="Email" value={editing ? formData.email : employee.email} editing={editing} onChange={(v) => updateField('email', v)} />
              <Field label="Phone" value={editing ? formData.phone : employee.phone} editing={editing} onChange={(v) => updateField('phone', v)} />
              <Field label="Address" value={editing ? formData.address : employee.address} editing={editing} onChange={(v) => updateField('address', v)} />
            </div>
          </div>
        )}
        {activeTab === 'job' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Employee ID" value={employee.employeeId} disabled />
              <Field label="Department" value={editing ? formData.department : employee.department} editing={editing} onChange={(v) => updateField('department', v)} />
              <Field label="Job Title" value={editing ? formData.jobTitle : employee.jobTitle} editing={editing} onChange={(v) => updateField('jobTitle', v)} />
              <Field label="Role" value={employee.role} disabled />
            </div>
          </div>
        )}
        {activeTab === 'salary' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Salary Information</h2>
            <p className="text-sm text-gray-500">Salary details are managed by the payroll system.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function Field({ label, value, editing, onChange, disabled }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-wide uppercase text-gray-500 mb-1.5">{label}</label>
      {editing && !disabled ? (
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition" />
      ) : (
        <p className="text-sm text-gray-900 py-2">{value || '—'}</p>
      )}
    </div>
  );
}
