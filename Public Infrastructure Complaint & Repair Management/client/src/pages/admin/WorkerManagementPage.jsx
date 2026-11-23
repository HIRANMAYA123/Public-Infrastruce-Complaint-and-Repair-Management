import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Modal from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import {
  HardHat,
  PlusCircle,
  Star,
  Phone,
  Mail,
  Building2,
  CheckCircle,
  Briefcase,
  Search,
} from 'lucide-react';

export const WorkerManagementPage = () => {
  const { success, error } = useToast();

  const [workers, setWorkers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Create Worker Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: 'Password123!',
    phone: '',
    departmentId: '',
    employeeCode: '',
    skillSpecialization: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const [workerRes, deptRes] = await Promise.all([
        api.getAdminWorkers(),
        api.getAdminDepartments(),
      ]);
      if (workerRes.success && workerRes.workers) setWorkers(workerRes.workers);
      if (deptRes.success && deptRes.departments) {
        setDepartments(deptRes.departments);
        if (deptRes.departments.length > 0) {
          setFormData((prev) => ({ ...prev, departmentId: deptRes.departments[0]._id }));
        }
      }
    } catch (err) {
      error(err.message || 'Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateWorker = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.departmentId) {
      error('Full Name, Email, and Department are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createWorker(formData);
      if (res.success) {
        success(`Field Specialist ${res.worker?.fullName} registered.`);
        setModalOpen(false);
        setFormData({
          fullName: '',
          email: '',
          password: 'Password123!',
          phone: '',
          departmentId: departments[0]?._id || '',
          employeeCode: '',
          skillSpecialization: '',
        });
        fetchWorkers();
      }
    } catch (err) {
      error(err.message || 'Failed to create worker');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredWorkers = workers.filter(
    (w) =>
      w.fullName.toLowerCase().includes(search.toLowerCase()) ||
      w.email.toLowerCase().includes(search.toLowerCase()) ||
      (w.employeeCode && w.employeeCode.toLowerCase().includes(search.toLowerCase())) ||
      (w.departmentId?.name && w.departmentId.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-navy-800">Field Specialists & Crew Management</h1>
              <p className="text-xs text-charcoal-500 mt-1">
                Directory of certified municipal field repair specialists, task caseloads, and satisfaction ratings.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-civic shadow-sm transition-colors shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Register New Specialist
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-civic border border-surface-border p-4 shadow-subtle mb-6">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search field technicians by name, employee code, or department..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
              />
            </div>
          </div>

          {/* Workers Grid */}
          {loading ? (
            <div className="p-12 text-center text-xs text-charcoal-400">
              <div className="w-6 h-6 border-2 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading field worker directory...
            </div>
          ) : filteredWorkers.length === 0 ? (
            <div className="bg-white rounded-civic border border-surface-border p-12 text-center text-xs text-charcoal-500">
              No field technicians match the search query.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkers.map((worker) => (
                <div
                  key={worker._id}
                  className="bg-white rounded-civic border border-surface-border p-5 shadow-subtle hover:shadow-card transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-navy-800 text-teal-400 font-bold flex items-center justify-center shrink-0">
                          {worker.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-navy-900">{worker.fullName}</h3>
                          <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                            {worker.employeeCode}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-charcoal-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{worker.ratingAvg || '5.0'}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-charcoal-600 mt-2">
                      <p className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{worker.departmentId?.name || 'Municipal Works'}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{worker.skillSpecialization || 'General Infrastructure Repair'}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{worker.phone || '+91 91234 56780'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 bg-surface-bg rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-charcoal-400 block uppercase">Active Tasks</span>
                      <span className="text-base font-extrabold font-mono text-navy-800">
                        {worker.activeTasksCount || 0}
                      </span>
                    </div>
                    <div className="p-2 bg-surface-bg rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-charcoal-400 block uppercase">Completed</span>
                      <span className="text-base font-extrabold font-mono text-emerald-700">
                        {worker.completedTasksCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal: Register Specialist */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Register New Field Repair Specialist"
      >
        <form onSubmit={handleCreateWorker} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Ramesh Kumar"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Official Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="worker@civicfix.gov.in"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Direct Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 91234 56780"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Assigned Department *
              </label>
              <select
                name="departmentId"
                required
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
              >
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Employee Code (Optional)
              </label>
              <input
                type="text"
                name="employeeCode"
                value={formData.employeeCode}
                onChange={handleChange}
                placeholder="e.g. FW-RDS-105"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Skill Specialization & Equipment Qualification
            </label>
            <input
              type="text"
              name="skillSpecialization"
              value={formData.skillSpecialization}
              onChange={handleChange}
              placeholder="e.g. Asphalt paver, hydraulic leak clamp, high-mast LED pole"
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
              className="px-4 py-1.5 text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white rounded-civic disabled:opacity-50"
            >
              {submitting ? 'Registering...' : 'Register Specialist'}
            </button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
};

export default WorkerManagementPage;
