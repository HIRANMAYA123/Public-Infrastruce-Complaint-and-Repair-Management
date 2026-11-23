import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { User, Mail, Phone, MapPin, Building, ShieldCheck, Save } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateProfile(formData);
      if (res.success && res.user) {
        updateUser(res.user);
        success('Profile updated successfully.');
      }
    } catch (err) {
      error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-3xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-navy-800">Account Profile & Identification</h1>
              <p className="text-xs text-charcoal-500 mt-1">
                Manage your personal contact details, verified address, and municipal credentials.
              </p>
            </div>

            <div className="bg-white rounded-civic border border-surface-border p-6 shadow-subtle mb-6">
              <div className="flex items-center gap-4 pb-6 border-b border-surface-border">
                <div className="w-16 h-16 rounded-full bg-navy-800 text-white font-extrabold text-2xl flex items-center justify-center">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy-800">{user?.fullName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border">
                      {user?.role?.toUpperCase()}
                    </span>
                    {user?.employeeCode && (
                      <span className="text-xs font-mono font-bold text-teal-700">
                        {user.employeeCode}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSave} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                      Registered Email (Immutable)
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full text-xs px-3 py-2 border border-slate-200 bg-slate-50 rounded-civic text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                      Street / Area Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Residential address"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-civic text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                    />
                  </div>
                </div>

                {user?.wardId && (
                  <div className="p-3 bg-slate-50 rounded-civic border border-slate-200 text-xs">
                    <span className="font-semibold text-charcoal-700">Assigned Ward: </span>
                    <span className="text-charcoal-600">
                      Ward {user.wardId.wardNumber} – {user.wardId.name} ({user.wardId.zone})
                    </span>
                  </div>
                )}

                {user?.departmentId && (
                  <div className="p-3 bg-slate-50 rounded-civic border border-slate-200 text-xs">
                    <span className="font-semibold text-charcoal-700">Department: </span>
                    <span className="text-charcoal-600">
                      {user.departmentId.name} ({user.departmentId.code})
                    </span>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs rounded-civic shadow-subtle transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 text-teal-400" />
                    {saving ? 'Saving...' : 'Save Profile Changes'}
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

export default ProfilePage;
