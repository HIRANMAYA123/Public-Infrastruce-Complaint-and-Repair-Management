import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import Modal from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import {
  Search,
  Filter,
  UserCheck,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  MapPin,
  Clock,
  HardHat,
  ArrowUpDown,
} from 'lucide-react';

export const ComplaintManagementPage = () => {
  const { success, error } = useToast();

  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wards, setWards] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [wardFilter, setWardFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Assign Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [submittingAssign, setSubmittingAssign] = useState(false);

  // Status Change Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('In Progress');
  const [newPriority, setNewPriority] = useState('Medium');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [submittingStatus, setSubmittingStatus] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (wardFilter !== 'all') params.ward = wardFilter;
      if (search.trim()) params.search = search.trim();
      if (sortBy) params.sortBy = sortBy;

      const res = await api.getAllComplaints(params);
      if (res.success && res.complaints) {
        setComplaints(res.complaints);
      }
    } catch (err) {
      error(err.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, wardRes, workerRes] = await Promise.all([
          api.getCategories(),
          api.getWards(),
          api.getAdminWorkers(),
        ]);
        if (catRes.success) setCategories(catRes.categories);
        if (wardRes.success) setWards(wardRes.wards);
        if (workerRes.success) setWorkers(workerRes.workers);
      } catch (err) {}
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, priorityFilter, categoryFilter, wardFilter, sortBy]);

  const openAssignModal = (complaint) => {
    setSelectedComplaint(complaint);
    setSelectedWorkerId(complaint.assignedWorkerId?._id || (workers.length > 0 ? workers[0]._id : ''));
    setAssignmentNotes(complaint.adminRemarks || '');
    setAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint || !selectedWorkerId) return;

    setSubmittingAssign(true);
    try {
      const res = await api.assignComplaint({
        complaintId: selectedComplaint._id,
        workerId: selectedWorkerId,
        notes: assignmentNotes,
      });
      if (res.success) {
        success(res.message);
        setAssignModalOpen(false);
        fetchComplaints();
      }
    } catch (err) {
      error(err.message || 'Assignment failed.');
    } finally {
      setSubmittingAssign(false);
    }
  };

  const openStatusModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setNewPriority(complaint.priority);
    setAdminRemarks(complaint.adminRemarks || '');
    setStatusModalOpen(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setSubmittingStatus(true);
    try {
      const res = await api.updateStatus({
        complaintId: selectedComplaint._id,
        status: newStatus,
        priority: newPriority,
        remarks: adminRemarks,
      });
      if (res.success) {
        success(res.message);
        setStatusModalOpen(false);
        fetchComplaints();
      }
    } catch (err) {
      error(err.message || 'Status transition failed.');
    } finally {
      setSubmittingStatus(false);
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
              <h1 className="text-2xl font-bold text-navy-800">Master Grievance Triage Registry</h1>
              <p className="text-xs text-charcoal-500 mt-1">
                Filter, triage, assign field crews, and enforce municipal resolution SLAs across all wards.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-civic text-navy-800">
                {complaints.length} Records Found
              </span>
              <button
                onClick={fetchComplaints}
                className="p-2 bg-white border border-surface-border text-charcoal-600 hover:text-navy-800 rounded-civic shadow-subtle"
                title="Reload"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search & Multi-Filters */}
          <div className="bg-white rounded-civic border border-surface-border p-4 shadow-subtle mb-6 space-y-3">
            <div className="flex flex-col lg:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchComplaints()}
                  placeholder="Search by code (CF-2026-...), title, citizen name, or street location..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-civic text-charcoal-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full lg:w-36 text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">By Priority</option>
                <option value="status">By Status</option>
              </select>
            </div>

            {/* Sub-Filters Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-1.5 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none bg-white"
              >
                <option value="all">Status: All</option>
                <option value="Pending">Pending Triage</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Work Completed">Work Completed</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
                <option value="Reopened">Reopened</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs px-3 py-1.5 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none bg-white"
              >
                <option value="all">Priority: All</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs px-3 py-1.5 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none bg-white"
              >
                <option value="all">Category: All</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
                className="text-xs px-3 py-1.5 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none bg-white"
              >
                <option value="all">Ward: All</option>
                {wards.map((w) => (
                  <option key={w._id} value={w._id}>
                    Ward {w.wardNumber} ({w.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Master Table */}
          <div className="bg-white rounded-civic border border-surface-border shadow-subtle overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-charcoal-400">
                <div className="w-6 h-6 border-2 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Querying relational records...
              </div>
            ) : complaints.length === 0 ? (
              <div className="p-12 text-center text-xs text-charcoal-500">
                No complaint records found matching your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-surface-border text-charcoal-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Ticket Code & Title</th>
                      <th className="py-3 px-4">Category & Ward</th>
                      <th className="py-3 px-4">Citizen Contact</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Assigned Crew</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {complaints.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-navy-800 block">
                            {c.complaintCode}
                          </span>
                          <span className="font-semibold text-charcoal-800 line-clamp-1 max-w-xs">
                            {c.title}
                          </span>
                          <span className="text-[11px] text-charcoal-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {c.locationAddress}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-medium text-navy-800 block">
                            {c.categoryId?.name}
                          </span>
                          <span className="text-[11px] text-charcoal-500">
                            Ward {c.wardId?.wardNumber} ({c.wardId?.zone})
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-charcoal-800 block">
                            {c.citizenId?.fullName || 'Citizen User'}
                          </span>
                          <span className="text-[11px] text-charcoal-400 font-mono">
                            {c.citizenId?.phone || c.citizenId?.email}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <PriorityBadge priority={c.priority} />
                        </td>

                        <td className="py-3 px-4">
                          <StatusBadge status={c.status} />
                        </td>

                        <td className="py-3 px-4">
                          {c.assignedWorkerId ? (
                            <div>
                              <span className="font-semibold text-teal-800 block">
                                {c.assignedWorkerId.fullName}
                              </span>
                              <span className="text-[10px] text-charcoal-400 font-mono">
                                {c.assignedWorkerId.employeeCode}
                              </span>
                            </div>
                          ) : (
                            <span className="text-amber-700 italic text-[11px] font-medium">
                              Unallocated
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => openAssignModal(c)}
                            className="px-2.5 py-1 rounded bg-teal-50 text-teal-800 hover:bg-teal-100 font-semibold text-[11px] transition-colors border border-teal-200"
                            title="Assign to Field Worker"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => openStatusModal(c)}
                            className="px-2.5 py-1 rounded bg-navy-50 text-navy-800 hover:bg-navy-100 font-semibold text-[11px] transition-colors border border-navy-200"
                            title="Transition Status"
                          >
                            Status
                          </button>
                          <Link
                            to={`/citizen/complaints/${c._id}`}
                            className="px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-[11px] transition-colors inline-block"
                            title="Audit View"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal: Assign Field Worker */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign Technician: ${selectedComplaint?.complaintCode}`}
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Select Qualified Field Technician *
            </label>
            <select
              value={selectedWorkerId}
              onChange={(e) => setSelectedWorkerId(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
            >
              <option value="">-- Choose Field Specialist --</option>
              {workers.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.fullName} ({w.employeeCode}) – {w.departmentId?.name || 'Municipal Works'} [
                  {w.activeTasksCount || 0} active tasks]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Administrative Work Order Notes / Instructions
            </label>
            <textarea
              rows={3}
              value={assignmentNotes}
              onChange={(e) => setAssignmentNotes(e.target.value)}
              placeholder="Provide specific instructions regarding site safety, asphalt machinery, or utility shutoff..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-civic"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingAssign}
              className="px-4 py-1.5 text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white rounded-civic disabled:opacity-50"
            >
              {submittingAssign ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Transition Complaint Status */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={`Update Grievance Status: ${selectedComplaint?.complaintCode}`}
      >
        <form onSubmit={handleStatusSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                New Target Status *
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
              >
                <option value="Pending">Pending Triage</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Work Completed">Work Completed</option>
                <option value="Resolved">Resolved (Close & Verify)</option>
                <option value="Rejected">Rejected</option>
                <option value="Reopened">Reopened</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Set Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Administrative Audit Remarks
            </label>
            <textarea
              rows={3}
              value={adminRemarks}
              onChange={(e) => setAdminRemarks(e.target.value)}
              placeholder="State verification observations, inspection outcome, or reason for status transition..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStatusModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-civic"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingStatus}
              className="px-4 py-1.5 text-xs font-semibold bg-navy-800 hover:bg-navy-900 text-white rounded-civic disabled:opacity-50"
            >
              {submittingStatus ? 'Updating...' : 'Commit Status Transition'}
            </button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
};

export default ComplaintManagementPage;
