import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Modal from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import {
  MapPin,
  PlusCircle,
  Users,
  Phone,
  Building,
  CheckCircle,
  Clock,
  Compass,
} from 'lucide-react';

export const WardManagementPage = () => {
  const { success, error } = useToast();

  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    wardNumber: '',
    name: '',
    zone: 'Central Zone',
    councillorName: '',
    councillorPhone: '',
    officeAddress: '',
    population: '',
    areaSqKm: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchWards = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminWards();
      if (res.success && res.wards) {
        setWards(res.wards);
      }
    } catch (err) {
      error(err.message || 'Failed to load wards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWards();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.wardNumber || !formData.name || !formData.councillorName) {
      error('Ward Number, Name, and Councillor Name are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createWard({
        ...formData,
        wardNumber: parseInt(formData.wardNumber),
        population: formData.population ? parseInt(formData.population) : 0,
        areaSqKm: formData.areaSqKm ? parseFloat(formData.areaSqKm) : 0,
      });
      if (res.success) {
        success(`Ward ${res.ward?.wardNumber} created successfully.`);
        setModalOpen(false);
        setFormData({
          wardNumber: '',
          name: '',
          zone: 'Central Zone',
          councillorName: '',
          councillorPhone: '',
          officeAddress: '',
          population: '',
          areaSqKm: '',
        });
        fetchWards();
      }
    } catch (err) {
      error(err.message || 'Failed to create ward');
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
              <h1 className="text-2xl font-bold text-navy-800">Municipal Wards & Zones</h1>
              <p className="text-xs text-charcoal-500 mt-1">
                Geographic delineations, elected ward representatives, population demographics, and complaint density.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-civic shadow-sm transition-colors shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Define New Ward
            </button>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="p-12 text-center text-xs text-charcoal-400">
              <div className="w-6 h-6 border-2 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading ward geographical directory...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wards.map((ward) => (
                <div
                  key={ward._id}
                  className="bg-white rounded-civic border border-surface-border p-5 shadow-subtle hover:shadow-card transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-extrabold text-navy-800 bg-navy-50 px-2.5 py-1 rounded border border-navy-200">
                        WARD #{ward.wardNumber}
                      </span>
                      <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {ward.zone}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-navy-900">{ward.name}</h3>

                    <div className="space-y-1.5 text-xs text-charcoal-600 mt-3 p-3 bg-surface-bg rounded-civic border border-slate-200">
                      <p>
                        <strong className="text-navy-800">Councillor:</strong> {ward.councillorName}
                      </p>
                      <p className="flex items-center gap-1.5 text-[11px] text-charcoal-500">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {ward.councillorPhone}
                      </p>
                      <p className="flex items-center gap-1.5 text-[11px] text-charcoal-500">
                        <Building className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{ward.officeAddress}</span>
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-charcoal-500">
                      <span>Demographics:</span>
                      <span className="font-mono font-semibold text-navy-800">
                        {ward.population ? ward.population.toLocaleString() : 'N/A'} citizens
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-charcoal-400 block uppercase">Total</span>
                      <span className="text-sm font-bold font-mono text-navy-800">{ward.totalComplaints || 0}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-amber-700 block uppercase">Pending</span>
                      <span className="text-sm font-bold font-mono text-amber-800">{ward.pendingComplaints || 0}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-emerald-700 block uppercase">Resolved</span>
                      <span className="text-sm font-bold font-mono text-emerald-800">{ward.resolvedComplaints || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal: Define Ward */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Define New Municipal Administrative Ward"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Ward Number *
              </label>
              <input
                type="number"
                name="wardNumber"
                required
                value={formData.wardNumber}
                onChange={handleChange}
                placeholder="e.g. 106"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Zonal Region *
              </label>
              <select
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
              >
                <option value="Central Zone">Central Zone</option>
                <option value="North Zone">North Zone</option>
                <option value="South Zone">South Zone</option>
                <option value="East Zone">East Zone</option>
                <option value="West Zone">West Zone</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Ward Name / Locality Title *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ward 106 - Lakeview Residency"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Elected Councillor Name *
              </label>
              <input
                type="text"
                name="councillorName"
                required
                value={formData.councillorName}
                onChange={handleChange}
                placeholder="e.g. Shri Arvind Hegde"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Councillor Phone *
              </label>
              <input
                type="text"
                name="councillorPhone"
                required
                value={formData.councillorPhone}
                onChange={handleChange}
                placeholder="+91 98450 XXXXX"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Ward Office Address *
            </label>
            <input
              type="text"
              name="officeAddress"
              required
              value={formData.officeAddress}
              onChange={handleChange}
              placeholder="Municipal Ward Office, Main Boulevard"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Estimated Population
              </label>
              <input
                type="number"
                name="population"
                value={formData.population}
                onChange={handleChange}
                placeholder="e.g. 52000"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Area (Sq Km)
              </label>
              <input
                type="number"
                step="0.1"
                name="areaSqKm"
                value={formData.areaSqKm}
                onChange={handleChange}
                placeholder="e.g. 4.5"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
              />
            </div>
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
              {submitting ? 'Registering...' : 'Register Ward'}
            </button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
};

export default WardManagementPage;
