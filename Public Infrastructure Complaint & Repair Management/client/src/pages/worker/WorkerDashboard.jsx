import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Camera,
  Upload,
  ArrowRight,
  RefreshCw,
  HardHat,
  Play,
  FileCheck,
} from 'lucide-react';

export const WorkerDashboard = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Repair Modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updateNotes, setUpdateNotes] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState('');
  const [costIncurred, setCostIncurred] = useState('');
  const [updateType, setUpdateType] = useState('Work Finished');
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [submittingUpdate, setSubmittingUpdate] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab !== 'all') {
        params.status = activeTab;
      }
      const res = await api.getWorkerTasks(params);
      if (res.success) {
        setTasks(res.tasks || []);
        if (res.metrics) setMetrics(res.metrics);
      }
    } catch (err) {
      error(err.message || 'Failed to fetch assigned tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeTab]);

  const handleStartWork = async (taskId) => {
    try {
      const res = await api.updateWorkerTaskStatus(taskId, 'In Progress', 'Field technician arrived on site and commenced repairs.');
      if (res.success) {
        success('Work status set to In Progress. Repair commenced!');
        fetchTasks();
      }
    } catch (err) {
      error(err.message || 'Failed to update status');
    }
  };

  const openUpdateModal = (task) => {
    setSelectedTask(task);
    setUpdateNotes('');
    setMaterialsUsed('');
    setCostIncurred('');
    setUpdateType('Work Finished');
    setBeforeFile(null);
    setAfterFile(null);
    setUpdateModalOpen(true);
  };

  const handleRepairSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask || !updateNotes.trim()) {
      error('Please write repair notes describing the work done.');
      return;
    }

    setSubmittingUpdate(true);
    try {
      const formData = new FormData();
      formData.append('updateNotes', updateNotes.trim());
      formData.append('materialsUsed', materialsUsed.trim());
      formData.append('costIncurred', costIncurred || 0);
      formData.append('updateType', updateType);

      if (beforeFile) formData.append('beforeImage', beforeFile);
      if (afterFile) formData.append('afterImage', afterFile);

      const res = await api.submitWorkerRepairUpdate(selectedTask._id, formData);
      if (res.success) {
        success('Repair documentation logged! Task submitted for municipal verification.');
        setUpdateModalOpen(false);
        fetchTasks();
      }
    } catch (err) {
      error(err.message || 'Failed to submit repair update.');
    } finally {
      setSubmittingUpdate(false);
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
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  FIELD CREW DISPATCH DESK
                </span>
                <span className="text-xs text-charcoal-400 font-mono">
                  Technician: {user?.fullName} ({user?.employeeCode || 'FW-01'})
                </span>
              </div>
              <h1 className="text-2xl font-bold text-navy-800">My Assigned Work Orders</h1>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Execute field repairs, photograph before-and-after work, and submit completion reports.
              </p>
            </div>

            <button
              onClick={fetchTasks}
              className="p-2 bg-white border border-surface-border text-charcoal-600 hover:text-navy-800 rounded-civic transition-colors shadow-subtle shrink-0"
              title="Refresh Tasks"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Assigned"
              value={metrics.total}
              subtitle="All work orders"
              icon={Wrench}
              color="navy"
            />
            <StatCard
              title="Pending Start"
              value={metrics.pending}
              subtitle="Awaiting site arrival"
              icon={Clock}
              color="amber"
            />
            <StatCard
              title="In Progress"
              value={metrics.inProgress}
              subtitle="Actively repairing"
              icon={HardHat}
              color="blue"
            />
            <StatCard
              title="Completed / Closed"
              value={metrics.completed}
              subtitle="Verified fixes"
              icon={CheckCircle2}
              color="emerald"
            />
          </div>

          {/* Status Tabs Bar */}
          <div className="flex items-center gap-2 mb-6 border-b border-surface-border pb-3 overflow-x-auto">
            {[
              { id: 'all', label: 'All Tasks' },
              { id: 'Assigned', label: 'Pending Start' },
              { id: 'In Progress', label: 'In Progress' },
              { id: 'Work Completed', label: 'Completed (Pending Admin)' },
              { id: 'Resolved', label: 'Resolved' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-civic text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-navy-800 text-white shadow-sm'
                    : 'bg-white text-charcoal-600 hover:bg-slate-100 border border-surface-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tasks List */}
          {loading ? (
            <div className="bg-white rounded-civic border border-surface-border p-12 text-center text-xs text-charcoal-400">
              <div className="w-6 h-6 border-2 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading assigned work orders...
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-civic border border-surface-border p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-navy-800">No active work orders in this category</h3>
              <p className="text-xs text-charcoal-400 mt-1 max-w-sm mx-auto">
                All assigned municipal infrastructure tasks have been addressed or none match your selected tab.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white rounded-civic border border-surface-border p-5 shadow-subtle hover:shadow-card transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {task.imageUrl ? (
                        <img
                          src={task.imageUrl}
                          alt={task.title}
                          className="w-20 h-20 rounded-civic object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-civic bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                          <Wrench className="w-7 h-7" />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-mono font-bold text-navy-800 bg-navy-50 px-2 py-0.5 rounded border border-navy-100">
                            {task.complaintCode}
                          </span>
                          <PriorityBadge priority={task.priority} />
                          <StatusBadge status={task.status} />
                        </div>

                        <h3 className="text-base font-bold text-navy-900">{task.title}</h3>
                        <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
                          {task.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-charcoal-500">
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                            <span className="font-semibold text-charcoal-800 truncate">
                              {task.locationAddress}
                            </span>
                            {task.landmark && <span className="text-slate-400">({task.landmark})</span>}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>
                              SLA Deadline:{' '}
                              {task.resolutionDeadline
                                ? new Date(task.resolutionDeadline).toLocaleString()
                                : 'Standard 48h'}
                            </span>
                          </div>
                        </div>

                        {task.adminRemarks && (
                          <div className="mt-2.5 p-2 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900">
                            <strong>Admin Instruction:</strong> {task.adminRemarks}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons for Worker */}
                    <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2 pt-3 md:pt-0 border-t md:border-t-0">
                      {task.status === 'Assigned' && (
                        <button
                          onClick={() => handleStartWork(task._id)}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-civic shadow-sm transition-colors"
                        >
                          <Play className="w-3.5 h-3.5" />
                          Start Repair
                        </button>
                      )}

                      {task.status === 'In Progress' && (
                        <button
                          onClick={() => openUpdateModal(task)}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-civic shadow-sm transition-colors"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          Submit Completion
                        </button>
                      )}

                      {task.status === 'Work Completed' && (
                        <div className="text-center p-2 bg-teal-50 border border-teal-200 rounded text-[11px] font-semibold text-teal-800">
                          Awaiting Admin Verification
                        </div>
                      )}

                      <Link
                        to={`/citizen/complaints/${task._id}`}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 border border-slate-300 text-charcoal-700 hover:bg-slate-50 font-semibold text-xs rounded-civic transition-colors"
                      >
                        Inspect Full Audit
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal: Submit Repair Documentation */}
      <Modal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        title={`Log Repair Evidence: ${selectedTask?.complaintCode}`}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleRepairSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Field Work Milestone *
            </label>
            <select
              value={updateType}
              onChange={(e) => setUpdateType(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
            >
              <option value="Work Finished">Work Finished (Ready for Admin Verification)</option>
              <option value="Repair In Progress">Intermediate Progress Report</option>
              <option value="Inspection Completed">Inspection & Diagnosis Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Repair Observations & Technical Actions *
            </label>
            <textarea
              rows={3}
              required
              value={updateNotes}
              onChange={(e) => setUpdateNotes(e.target.value)}
              placeholder="Detail actions taken: e.g. excavated road surface, installed cold-mix asphalt, leveled with road roller..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Materials & Equipment Deployed
              </label>
              <input
                type="text"
                value={materialsUsed}
                onChange={(e) => setMaterialsUsed(e.target.value)}
                placeholder="e.g. 50kg bitumen, 2x IP66 LED lamps"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Estimated Incurred Cost (₹)
              </label>
              <input
                type="number"
                value={costIncurred}
                onChange={(e) => setCostIncurred(e.target.value)}
                placeholder="e.g. 4500"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 font-mono"
              />
            </div>
          </div>

          {/* Before & After Photo Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Before Repair Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBeforeFile(e.target.files[0])}
                className="block w-full text-xs text-charcoal-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-charcoal-700 hover:file:bg-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                After Repair Completion Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAfterFile(e.target.files[0])}
                className="block w-full text-xs text-charcoal-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setUpdateModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-civic"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingUpdate}
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-civic disabled:opacity-50"
            >
              {submittingUpdate ? 'Submitting...' : 'Save & Mark Completed'}
            </button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
};

export default WorkerDashboard;
