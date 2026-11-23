import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  PlusCircle,
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.getMyComplaints();
        if (res.success && res.complaints) {
          setComplaints(res.complaints);
        }
      } catch (err) {
        console.warn('Error fetching citizen complaints:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => ['Assigned', 'In Progress'].includes(c.status)).length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8">
          {/* Welcome & Quick Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-navy-800">
                Welcome back, {user?.fullName}
              </h1>
              <p className="text-xs text-charcoal-500 mt-1">
                Citizen Portal — Monitor public grievance status, track field repairs, and submit issues.
              </p>
            </div>
            <Link
              to="/citizen/report"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-civic shadow-sm transition-colors shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              Report an Issue
            </Link>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Submitted"
              value={total}
              subtitle="All registered complaints"
              icon={FileText}
              color="navy"
            />
            <StatCard
              title="Pending Triage"
              value={pending}
              subtitle="Awaiting admin review"
              icon={Clock}
              color="amber"
            />
            <StatCard
              title="Active Repairs"
              value={inProgress}
              subtitle="Crews dispatched / working"
              icon={Wrench}
              color="blue"
            />
            <StatCard
              title="Resolved Issues"
              value={resolved}
              subtitle="Verified municipal fixes"
              icon={CheckCircle2}
              color="emerald"
            />
          </div>

          {/* Recent Complaint Activity */}
          <div className="bg-white rounded-civic border border-surface-border shadow-subtle overflow-hidden">
            <div className="p-5 border-b border-surface-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-navy-800">Recent Complaint Activity</h3>
                <p className="text-xs text-charcoal-400 mt-0.5">
                  Latest status updates on your reported grievances.
                </p>
              </div>
              <Link
                to="/citizen/complaints"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
              >
                View all ({total})
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-charcoal-400">
                <div className="w-6 h-6 border-2 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading your complaint records...
              </div>
            ) : complaints.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-navy-800">No complaints submitted yet</h4>
                <p className="text-xs text-charcoal-500 mt-1 max-w-sm mx-auto">
                  Have you noticed a pothole, broken streetlight, or burst water pipeline? Report it directly to municipal engineering.
                </p>
                <Link
                  to="/citizen/report"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white text-xs font-semibold rounded-civic transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-teal-400" />
                  Submit First Issue
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-surface-border">
                {complaints.slice(0, 5).map((complaint) => (
                  <Link
                    key={complaint._id}
                    to={`/citizen/complaints/${complaint._id}`}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors block"
                  >
                    <div className="flex items-start gap-3.5">
                      {complaint.imageUrl ? (
                        <img
                          src={complaint.imageUrl}
                          alt={complaint.title}
                          className="w-12 h-12 rounded-civic object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-civic bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-800 shrink-0">
                          <AlertCircle className="w-5 h-5 text-teal-700" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-navy-800">
                            {complaint.complaintCode}
                          </span>
                          <span className="text-xs text-slate-300">•</span>
                          <span className="text-xs font-medium text-charcoal-600">
                            {complaint.categoryId?.name}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-navy-900 mt-0.5">{complaint.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-charcoal-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {complaint.locationAddress}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {new Date(complaint.submissionDate).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                      <PriorityBadge priority={complaint.priority} />
                      <StatusBadge status={complaint.status} />
                      <ArrowRight className="w-4 h-4 text-slate-300 hidden sm:block" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CitizenDashboard;
