import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Modal from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import {
  Building2,
  PlusCircle,
  Mail,
  Phone,
  User,
  DollarSign,
  FileText,
  CheckCircle,
  HardHat,
} from 'lucide-react';

export const DepartmentManagementPage = () => {
  const { success, error } = useToast();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    headName: '',
    contactEmail: '',
    helplineNumber: '',
    budgetAllocated: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminDepartments();
      if (res.success && res.departments) {
        setDepartments(res.departments);
      }
    } catch (err) {
      error(err.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.headName) {
      error('Department Name, Code, and Head Name are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createDepartment({
        ...formData,
        budgetAllocated: formData.budgetAllocated ? parseFloat(formData.budgetAllocated) : 0,
      });
      if (res.success) {
        success(`Department ${res.department?.name} created.`);
        setModalOpen(false);
        setFormData({
          name: '',
          code: '',
          description: '',
          headName: '',
          contactEmail: '',
          helplineNumber: '',
          budgetAllocated: '',
        });
        fetchDepartments();
      }
    } catch (err) {
      error(err.message || 'Failed to create department');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-navy-800">Municipal Departments Directory</h1>
              <p className="text-xs text-charcoal-500 mt-1">
                Oversee municipal operational wings, heads of department, budgetary allocations, and caseloads.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white text-xs font-semibold rounded-civic shadow-sm transition-colors shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
              Add Department
            </button>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="p-12 text-center text-xs text-charcoal-400">
              <div className="w-6 h-6 border-2 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading municipal departments...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {departments.map((dept) => (
                <div
                  key={dept._id}
                  className="bg-white rounded-civic border border-surface-border p-6 shadow-subtle hover:shadow-card transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-surface-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-civic bg-navy-800 text-white flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-navy-900">{dept.name}</h3>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border">
                          {dept.code}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-charcoal-600 mt-3 leading-relaxed">
                    {dept.description || 'Primary municipal civil infrastructure maintenance jurisdiction.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 p-3 bg-surface-bg rounded-civic border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-0.5">
                        Department Head
                      </span>
                      <p className="font-semibold text-navy-800">{dept.headName}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-0.5">
                        Helpline / Hotline
                      </span>
                      <p className="font-mono text-charcoal-700">{dept.helplineNumber}</p>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-0.5">
                        Official Liaison Email
                      </span>
                      <p className="font-mono text-charcoal-700">{dept.contactEmail}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-charcoal-400 block uppercase">Total Issues</span>
                      <span className="text-sm font-bold font-mono text-navy-800">{dept.totalComplaints || 0}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-charcoal-400 block uppercase">Resolved</span>
                      <span className="text-sm font-bold font-mono text-emerald-700">{dept.resolvedComplaints || 0}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-charcoal-400 block uppercase">Field Staff</span>
                      <span className="text-sm font-bold font-mono text-teal-800">{dept.workersCount || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal: Add Department */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Register New Municipal Department"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Department Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Roads & Bridges Department"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Department Code *
              </label>
              <input
                type="text"
                name="code"
                required
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. DEPT-ROADS"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Head of Department Name *
              </label>
              <input
                type="text"
                name="headName"
                required
                value={formData.headName}
                onChange={handleChange}
                placeholder="e.g. Dr. Rajesh Deshmukh"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Contact Email *
              </label>
              <input
                type="email"
                name="contactEmail"
                required
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="roads.dept@civicfix.gov.in"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Helpline Hotline *
              </label>
              <input
                type="text"
                name="helplineNumber"
                required
                value={formData.helplineNumber}
                onChange={handleChange}
                placeholder="1800-202-0101"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Department Scope & Description
            </label>
            <textarea
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="State jurisdiction, road network coverage, or engineering duties..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-civic"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 text-xs font-semibold bg-navy-800 hover:bg-navy-900 text-white rounded-civic disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Register Department'}
            </button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
};

export default DepartmentManagementPage;
