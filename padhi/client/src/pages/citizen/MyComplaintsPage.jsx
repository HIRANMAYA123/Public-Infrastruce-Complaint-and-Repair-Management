import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { api } from '../../services/api';
import {
  Search,
  Filter,
  PlusCircle,
  FileText,
  MapPin,
  Calendar,
  ArrowRight,
  RefreshCw,
  Clock,
} from 'lucide-react';

export const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.getMyComplaints(params);
      if (res.success && res.complaints) {
        setComplaints(res.complaints);
      }
    } catch (err) {
      console.warn('Error fetching complaints:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        if (res.success && res.categories) setCategories(res.categories);
      } catch (err) {}
    };
    fetchCats();
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, priorityFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
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
              <h1 className="text-2xl font-bold text-navy-800">My Registered Complaints</h1>
              <p className="text-xs text-charcoal-500 mt-1">
                Track status updates, assigned municipal crews, and resolution outcomes.
              </p>
            </div>
            <Link
              to="/citizen/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-civic shadow-sm transition-colors shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report New Issue
            </Link>
          </div>

          {/* Search & Filters Bar */}
          <div className="bg-white rounded-civic border border-surface-border p-4 shadow-subtle mb-6">
            <div className="flex flex-col lg:flex-row items-center gap-3">
              {/* Search input */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Complaint ID (e.g. CF-2026), title, or location..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-civic text-charcoal-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                />
              </form>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full lg:w-40 text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending Triage</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Work Completed">Work Completed</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
                <option value="Reopened">Reopened</option>
              </select>

              {/* Priority filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full lg:w-36 text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* Category filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full lg:w-44 text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={fetchComplaints}
                className="p-2 text-charcoal-500 hover:text-navy-800 hover:bg-slate-100 rounded-civic transition-colors shrink-0"
                title="Refresh complaints"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Complaints List */}
          {loading ? (
            <div className="bg-white rounded-civic border border-surface-border p-12 text-center text-xs text-charcoal-400">
              <div className="w-6 h-6 border-2 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Fetching complaint records from database...
            </div>
          ) : complaints.length === 0 ? (
            <div className="bg-white rounded-civic border border-surface-border p-12 text-center">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-navy-800">No complaints found</h3>
              <p className="text-xs text-charcoal-400 mt-1 max-w-sm mx-auto">
                No matching grievances were found for the selected query or filter parameters.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="bg-white rounded-civic border border-surface-border p-4 sm:p-5 shadow-subtle hover:shadow-card hover:border-teal-700/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {complaint.imageUrl ? (
                      <img
                        src={complaint.imageUrl}
                        alt={complaint.title}
                        className="w-16 h-16 rounded-civic object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-civic bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono font-bold text-navy-800 bg-navy-50 px-2 py-0.5 rounded border border-navy-100">
                          {complaint.complaintCode}
                        </span>
                        <PriorityBadge priority={complaint.priority} />
                        <StatusBadge status={complaint.status} />
                      </div>

                      <h3 className="text-sm font-bold text-navy-900">{complaint.title}</h3>
                      <p className="text-xs text-charcoal-500 mt-0.5 line-clamp-1">
                        {complaint.description}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-[11px] text-charcoal-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {complaint.locationAddress} (Ward {complaint.wardId?.wardNumber})
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Submitted {new Date(complaint.submissionDate).toLocaleDateString()}
                        </span>
                        {complaint.assignedWorkerId && (
                          <span className="text-teal-700 font-semibold">
                            Technician: {complaint.assignedWorkerId.fullName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                    <Link
                      to={`/citizen/complaints/${complaint._id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy-800 hover:bg-navy-900 text-white text-xs font-semibold rounded-civic transition-colors"
                    >
                      Track Details
                      <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MyComplaintsPage;
