import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import Timeline from '../../components/Timeline';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Building,
  User,
  Phone,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Star,
  FileText,
  Wrench,
  XCircle,
} from 'lucide-react';

export const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [satisfactionLevel, setSatisfactionLevel] = useState('Satisfied');
  const [feedbackComments, setFeedbackComments] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [submittingReopen, setSubmittingReopen] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await api.getComplaintById(id);
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      error(err.message || 'Could not load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleWithdraw = async () => {
    if (!window.confirm('Are you sure you want to withdraw this pending complaint?')) return;
    try {
      const res = await api.withdrawComplaint(id);
      if (res.success) {
        success('Complaint withdrawn successfully.');
        fetchDetails();
      }
    } catch (err) {
      error(err.message || 'Failed to withdraw complaint.');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const res = await api.submitFeedback({
        complaintId: id,
        rating,
        satisfactionLevel,
        comments: feedbackComments,
      });
      if (res.success) {
        success('Thank you for rating our municipal service!');
        setFeedbackModalOpen(false);
        fetchDetails();
      }
    } catch (err) {
      error(err.message || 'Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleReopenSubmit = async (e) => {
    e.preventDefault();
    if (!reopenReason.trim()) {
      error('Please state reason for reopening.');
      return;
    }
    setSubmittingReopen(true);
    try {
      const res = await api.reopenComplaint(id, reopenReason.trim());
      if (res.success) {
        success('Complaint reopened for administrative investigation.');
        setReopenModalOpen(false);
        fetchDetails();
      }
    } catch (err) {
      error(err.message || 'Failed to reopen complaint.');
    } finally {
      setSubmittingReopen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-bg">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-8 h-8 border-3 border-teal-700 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!data?.complaint) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-bg">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-lg font-bold text-navy-800">Complaint Not Found</h2>
          <p className="text-xs text-charcoal-500 mt-1">This record does not exist or access is restricted.</p>
          <Link to="/citizen/complaints" className="mt-4 px-4 py-2 bg-navy-800 text-white rounded text-xs">
            Return to Complaints
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { complaint, statusHistory, assignments, repairUpdates, feedback } = data;

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8">
          {/* Breadcrumb & Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to={user?.role === 'admin' ? '/admin/complaints' : user?.role === 'field_worker' ? '/worker' : '/citizen/complaints'}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-navy-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to overview
            </Link>

            {/* Quick Actions for Citizen */}
            {user?.role === 'citizen' && (
              <div className="flex items-center gap-2">
                {complaint.status === 'Pending' && (
                  <button
                    onClick={handleWithdraw}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-civic text-xs font-semibold transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Withdraw Complaint
                  </button>
                )}

                {complaint.status === 'Resolved' && !feedback && (
                  <button
                    onClick={() => setFeedbackModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-civic text-xs font-semibold transition-colors shadow-sm"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    Rate Resolution Quality
                  </button>
                )}

                {complaint.status === 'Resolved' && (
                  <button
                    onClick={() => setReopenModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 text-charcoal-700 hover:bg-slate-50 rounded-civic text-xs font-semibold transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reopen Ticket
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Primary Details Card */}
          <div className="bg-white rounded-civic border border-surface-border p-6 shadow-subtle mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-sm font-mono font-extrabold text-navy-800 bg-navy-50 px-2.5 py-1 rounded border border-navy-200">
                    {complaint.complaintCode}
                  </span>
                  <StatusBadge status={complaint.status} />
                  <PriorityBadge priority={complaint.priority} />
                </div>
                <h1 className="text-xl font-bold text-navy-900">{complaint.title}</h1>
              </div>

              <div className="flex flex-col sm:items-end text-xs text-charcoal-500 font-mono">
                <span>Submitted: {new Date(complaint.submissionDate).toLocaleString()}</span>
                {complaint.resolutionDeadline && (
                  <span className="text-amber-800 font-semibold mt-0.5">
                    SLA Target: {new Date(complaint.resolutionDeadline).toLocaleString()}
                  </span>
                )}
                {complaint.resolvedAt && (
                  <span className="text-emerald-700 font-semibold mt-0.5">
                    Resolved: {new Date(complaint.resolvedAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Description & Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 mb-1">
                    Problem Description
                  </h4>
                  <p className="text-xs text-charcoal-800 leading-relaxed bg-surface-bg p-4 rounded-civic border border-slate-200">
                    {complaint.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-surface-bg rounded-civic border border-slate-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1">
                      Infrastructure Domain
                    </span>
                    <p className="text-xs font-semibold text-navy-800">
                      {complaint.categoryId?.name}
                    </p>
                    <p className="text-[11px] text-teal-700 mt-0.5">
                      {complaint.categoryId?.departmentId?.name || 'Municipal Works'}
                    </p>
                  </div>

                  <div className="p-3 bg-surface-bg rounded-civic border border-slate-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1">
                      Location & Ward
                    </span>
                    <p className="text-xs font-semibold text-navy-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      {complaint.locationAddress}
                    </p>
                    <p className="text-[11px] text-charcoal-500 mt-0.5">
                      Ward {complaint.wardId?.wardNumber} ({complaint.wardId?.name})
                      {complaint.landmark && ` • Landmark: ${complaint.landmark}`}
                    </p>
                  </div>
                </div>

                {complaint.adminRemarks && (
                  <div className="p-3 bg-amber-50 rounded-civic border border-amber-200 text-xs">
                    <span className="font-bold text-amber-900 block mb-0.5">Administrative Remarks:</span>
                    <p className="text-amber-800">{complaint.adminRemarks}</p>
                  </div>
                )}
              </div>

              {/* Citizen Uploaded Image Evidence */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 mb-1">
                  Citizen Photo Evidence
                </h4>
                {complaint.imageUrl ? (
                  <a
                    href={complaint.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block group relative w-full h-48 rounded-civic overflow-hidden border border-slate-200 bg-slate-100"
                  >
                    <img
                      src={complaint.imageUrl}
                      alt="Complaint evidence"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                      View Full Size
                    </div>
                  </a>
                ) : (
                  <div className="w-full h-48 rounded-civic bg-surface-bg border border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs">
                    <FileText className="w-8 h-8 mb-1" />
                    <span>No photograph attached</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assigned Technician & Department Card */}
          {complaint.assignedWorkerId && (
            <div className="bg-white rounded-civic border border-surface-border p-6 shadow-subtle mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 mb-3">
                Assigned Municipal Field Specialist
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-civic bg-teal-50/50 border border-teal-200/60">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-navy-800 text-white font-bold text-base flex items-center justify-center shrink-0">
                    {complaint.assignedWorkerId.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-navy-900">
                        {complaint.assignedWorkerId.fullName}
                      </h4>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded">
                        {complaint.assignedWorkerId.employeeCode}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-600 mt-0.5">
                      {complaint.assignedWorkerId.skillSpecialization || 'Field Engineer'}
                    </p>
                    <p className="text-[11px] text-charcoal-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {complaint.assignedWorkerId.phone || 'Direct line with department'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded border border-slate-200 text-xs font-semibold text-charcoal-700">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{complaint.assignedWorkerId.ratingAvg || '5.0'} / 5.0 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Field Repair Updates & Before/After Photographs */}
          {repairUpdates && repairUpdates.length > 0 && (
            <div className="bg-white rounded-civic border border-surface-border p-6 shadow-subtle mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-navy-800">Field Repair Documentation</h3>
              </div>

              <div className="space-y-4">
                {repairUpdates.map((update, idx) => (
                  <div key={update._id || idx} className="p-4 bg-surface-bg rounded-civic border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-navy-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {update.updateType}
                      </span>
                      <span className="text-[11px] text-charcoal-500 font-mono">
                        {new Date(update.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-charcoal-800 leading-relaxed">{update.updateNotes}</p>

                    {update.materialsUsed && (
                      <p className="text-[11px] text-charcoal-500 mt-2">
                        <strong className="text-charcoal-700">Materials:</strong> {update.materialsUsed}
                      </p>
                    )}

                    {/* Photographs side-by-side */}
                    {(update.beforeImageUrl || update.afterImageUrl) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-200">
                        {update.beforeImageUrl && (
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1">
                              Before Work
                            </span>
                            <img
                              src={update.beforeImageUrl}
                              alt="Before repair"
                              className="w-full h-36 object-cover rounded-civic border border-slate-300"
                            />
                          </div>
                        )}
                        {update.afterImageUrl && (
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                              After Repair Completion
                            </span>
                            <img
                              src={update.afterImageUrl}
                              alt="After repair"
                              className="w-full h-36 object-cover rounded-civic border border-emerald-300"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Citizen Feedback Showcase if resolved */}
          {feedback && (
            <div className="bg-white rounded-civic border border-emerald-200 p-6 shadow-subtle mb-6 bg-emerald-50/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Citizen Satisfaction Evaluation
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(feedback.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-charcoal-700 italic">"{feedback.comments || 'No written comment'}"</p>
              <p className="text-[11px] text-charcoal-400 mt-2">
                Level: <strong className="text-charcoal-600">{feedback.satisfactionLevel}</strong> • Submitted{' '}
                {new Date(feedback.submittedAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Status Lifecycle Audit Trail */}
          <div className="bg-white rounded-civic border border-surface-border p-6 shadow-subtle">
            <h3 className="text-sm font-bold text-navy-800 mb-4">
              Chronological Audit Trail & Status History
            </h3>
            <Timeline events={statusHistory} />
          </div>
        </main>
      </div>

      {/* Modal: Citizen Feedback */}
      <Modal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        title="Rate Repair Resolution Quality"
      >
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Overall Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${star <= rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-navy-800 ml-2">{rating} of 5</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Satisfaction Level
            </label>
            <select
              value={satisfactionLevel}
              onChange={(e) => setSatisfactionLevel(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
            >
              <option value="Very Satisfied">Very Satisfied</option>
              <option value="Satisfied">Satisfied</option>
              <option value="Neutral">Neutral</option>
              <option value="Unsatisfied">Unsatisfied</option>
              <option value="Very Unsatisfied">Very Unsatisfied</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Feedback Remarks
            </label>
            <textarea
              rows={3}
              value={feedbackComments}
              onChange={(e) => setFeedbackComments(e.target.value)}
              placeholder="How satisfied are you with the timeliness and quality of the field repair?"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setFeedbackModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-civic"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingFeedback}
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-civic disabled:opacity-50"
            >
              {submittingFeedback ? 'Submitting...' : 'Submit Evaluation'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Reopen Ticket */}
      <Modal
        isOpen={reopenModalOpen}
        onClose={() => setReopenModalOpen(false)}
        title="Reopen Infrastructure Ticket"
      >
        <form onSubmit={handleReopenSubmit} className="space-y-4">
          <p className="text-xs text-charcoal-500">
            If the repair was incomplete, substandard, or if the infrastructure defect has resurfaced, provide your justification below.
          </p>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Reopen Reason / Justification *
            </label>
            <textarea
              rows={4}
              required
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="State why this complaint requires further municipal intervention..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setReopenModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-civic"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingReopen}
              className="px-4 py-1.5 text-xs font-semibold bg-navy-800 hover:bg-navy-900 text-white rounded-civic disabled:opacity-50"
            >
              {submittingReopen ? 'Submitting...' : 'Confirm Reopen'}
            </button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
};

export default ComplaintDetailsPage;
