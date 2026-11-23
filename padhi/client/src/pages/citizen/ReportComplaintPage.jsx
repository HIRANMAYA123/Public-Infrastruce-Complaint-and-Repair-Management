import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import {
  Camera,
  Upload,
  X,
  MapPin,
  AlertTriangle,
  Building,
  Check,
  Send,
  HelpCircle,
  Clock,
} from 'lucide-react';

export const ReportComplaintPage = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(''); // starts empty, set after categories load
  const [wardId, setWardId] = useState(user?.wardId?._id || '');
  const [locationAddress, setLocationAddress] = useState(user?.address || '');
  const [landmark, setLandmark] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Auto generated preview code
  const [previewCode] = useState(() => {
    return `CF-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, wardRes] = await Promise.all([api.getCategories(), api.getWards()]);
        if (catRes.success && catRes.categories) {
          setCategories(catRes.categories);
          if (catRes.categories.length > 0) {
            // setCategoryId(catRes.categories[0]._id); // Disabled to allow free-form input
          }
        }
        if (wardRes.success && wardRes.wards) {
          setWards(wardRes.wards);
          if (!wardId && wardRes.wards.length > 0) {
            setWardId(wardRes.wards[0]._id);
          }
        }
      } catch (err) {
        console.warn('Metadata loading error:', err.message);
      } finally {
        setLoadingMeta(false);
      }
    };
    fetchMetadata();
  }, [wardId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        error('Image size must be below 8MB.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const selectedCategory = categories.find((c) => c._id === categoryId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !categoryId || !wardId || !locationAddress.trim()) {
      error('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('categoryId', categoryId);
      formData.append('wardId', wardId);
      formData.append('locationAddress', locationAddress.trim());
      formData.append('landmark', landmark.trim());
      formData.append('priority', priority);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await api.submitComplaint(formData);
      if (res.success && res.complaint) {
        success(`Complaint #${res.complaint.complaintCode} registered successfully!`);
        navigate(`/citizen/complaints/${res.complaint._id}`);
      }
    } catch (err) {
      error(err.message || 'Failed to submit complaint.');
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
          <div className="max-w-3xl">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  NEW TICKET: {previewCode}
                </span>
                <span className="text-xs text-charcoal-400">
                  • Date: {new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-navy-800">Report an Infrastructure Issue</h1>
              <p className="text-xs text-charcoal-500 mt-1">
                Detail the public defect below. Your report is assigned an official tracking code and logged directly into the municipal engineering triage queue.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-civic border border-surface-border p-6 sm:p-8 shadow-subtle">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Infrastructure Category & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                      Infrastructure Category *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                      disabled={loadingMeta}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
                    >
                      <option value="" disabled>Select infrastructure category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                    {selectedCategory && (
                      <p className="text-[11px] text-teal-800 mt-1 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        Managed by {selectedCategory.departmentId?.name || 'Municipal Works'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                      Reported Severity Priority *
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
                    >
                      <option value="Low">Low – Non-urgent maintenance</option>
                      <option value="Medium">Medium – Standard defect</option>
                      <option value="High">High – Traffic / Safety impact</option>
                      <option value="Urgent">Urgent – Immediate hazard / Emergency</option>
                    </select>
                  </div>
                </div>

                {/* 2. Title */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Complaint Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Deep pothole crater near Metro pillar 42 causing skidding"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>

                {/* 3. Detailed Description */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Detailed Problem Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide specific details about the issue: dimensions, duration, impact on pedestrians or vehicular traffic, and any acute hazards..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 leading-relaxed"
                  />
                </div>

                {/* 4. Ward & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                      Municipal Ward / Zone *
                    </label>
                    <select
                      value={wardId}
                      onChange={(e) => setWardId(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
                    >
                      {wards.map((w) => (
                        <option key={w._id} value={w._id}>
                          Ward {w.wardNumber} – {w.name} ({w.zone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                      Nearby Landmark
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Opposite City Center Mall Gate 2"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                    />
                  </div>
                </div>

                {/* 5. Exact Street Location */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Street Location / Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={locationAddress}
                      onChange={(e) => setLocationAddress(e.target.value)}
                      placeholder="Street number, cross road, colony or boulevard name"
                      className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                    />
                  </div>
                </div>

                {/* 6. Photo Evidence Upload */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Upload Photographic Evidence (Recommended)
                  </label>
                  {imagePreview ? (
                    <div className="relative w-full h-48 rounded-civic overflow-hidden border border-slate-300 bg-slate-50">
                      <img
                        src={imagePreview}
                        alt="Evidence preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-navy-900/80 text-white hover:bg-rose-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 rounded-civic cursor-pointer bg-slate-50/50 hover:bg-slate-50 hover:border-teal-600 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <p className="text-xs text-charcoal-600 font-semibold">
                          Click to upload photograph
                        </p>
                        <p className="text-[11px] text-charcoal-400 mt-0.5">
                          JPEG, PNG, or WebP up to 8MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-[11px] text-charcoal-400">
                    Complaints are public municipal records subject to grievance verification.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-civic shadow-sm transition-all disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? 'Registering Issue...' : 'Submit Official Complaint'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ReportComplaintPage;
