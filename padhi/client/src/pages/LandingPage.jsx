import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import {
  Shield,
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  Wrench,
  Construction,
  Droplets,
  Lightbulb,
  Waves,
  Trash2,
  ShieldAlert,
  Zap,
  HelpCircle,
  TrendingUp,
  MapPin,
  Building,
  Users,
} from 'lucide-react';

export const LandingPage = () => {
  const [publicStats, setPublicStats] = useState({
    totalComplaints: 1280,
    resolvedComplaints: 1140,
    inProgressComplaints: 95,
    citizensCount: 3420,
    wardsCount: 15,
    resolutionRate: 89,
    avgFixDays: '2.4 days',
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getPublicStats();
        if (res.success) {
          if (res.stats) setPublicStats(res.stats);
          if (res.recentPublicComplaints) setRecentComplaints(res.recentPublicComplaints);
        }
      } catch (err) {
        console.warn('Could not load public stats:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const categories = [
    {
      title: 'Road Damage & Potholes',
      desc: 'Crater hazards, asphalt erosion, pavement settlement, broken medians.',
      icon: Construction,
      dept: 'Roads & Bridges Department',
      sla: '48h SLA',
    },
    {
      title: 'Water Supply & Leakage',
      desc: 'Pipeline bursts, water contamination, zero pressure supply alerts.',
      icon: Droplets,
      dept: 'Water Supply & Sewerage Board',
      sla: '24h SLA',
    },
    {
      title: 'Broken Streetlights',
      desc: 'Dark arterial stretches, unlit sodium fixtures, broken lamps.',
      icon: Lightbulb,
      dept: 'Public Lighting & Electrical',
      sla: '36h SLA',
    },
    {
      title: 'Clogged Drainage & Flooding',
      desc: 'Desilting culverts, monsoon water stagnation, missing manhole covers.',
      icon: Waves,
      dept: 'Stormwater & Flood Control',
      sla: '24h SLA',
    },
    {
      title: 'Garbage & Waste Disposal',
      desc: 'Community bin overflows, roadside illegal dumping, bio-hazard piles.',
      icon: Trash2,
      dept: 'Solid Waste Management',
      sla: '24h SLA',
    },
    {
      title: 'Electrical & Transformers',
      desc: 'Sparking transmission lines, hanging high voltage lines, transformer oil leaks.',
      icon: Zap,
      dept: 'Public Lighting & Electrical',
      sla: '12h Urgent SLA',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-surface-border pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(#142D4E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            Empowering Responsive Municipal Governance
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-800 tracking-tight max-w-4xl mx-auto leading-tight">
            Better Infrastructure. <br />
            <span className="text-teal-700">Stronger Communities.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-charcoal-500 max-w-2xl mx-auto leading-relaxed">
            Report public infrastructure issues, track repairs, and help build cleaner, safer and better-connected neighbourhoods.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/citizen/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-navy-800 hover:bg-navy-900 text-white font-semibold text-sm rounded-civic shadow-card transition-all"
            >
              Report an Issue
              <ArrowRight className="w-4 h-4 text-teal-400" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-surface-bg hover:bg-slate-100 text-navy-800 font-semibold text-sm rounded-civic border border-slate-300 transition-colors"
            >
              Explore Staff & Citizen Portals
            </Link>
          </div>

          {/* Municipal Proof Points */}
          <div className="mt-14 pt-10 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-navy-800 font-mono">
                {publicStats.resolvedComplaints}+
              </p>
              <p className="text-xs text-charcoal-500 font-medium mt-1">Issues Resolved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-700 font-mono">
                {publicStats.resolutionRate}%
              </p>
              <p className="text-xs text-charcoal-500 font-medium mt-1">Resolution Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-navy-800 font-mono">
                {publicStats.avgFixDays}
              </p>
              <p className="text-xs text-charcoal-500 font-medium mt-1">Average Turnaround</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-700 font-mono">
                {publicStats.wardsCount}
              </p>
              <p className="text-xs text-charcoal-500 font-medium mt-1">Municipal Wards</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-surface-bg border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-800">
              The Transparent Civic Workflow
            </h2>
            <p className="mt-2 text-sm text-charcoal-500">
              From identification to field repair and verification, every lifecycle transition is recorded in our relational audit ledger.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-civic border border-surface-border shadow-subtle relative">
              <div className="w-10 h-10 rounded-civic bg-navy-800 text-teal-400 font-bold flex items-center justify-center text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-navy-800">Snap & Submit</h3>
              <p className="text-xs text-charcoal-500 mt-2 leading-relaxed">
                Citizens submit an issue with geo-location, category, photograph, and landmark. A unique tracking ID is generated instantly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-civic border border-surface-border shadow-subtle relative">
              <div className="w-10 h-10 rounded-civic bg-teal-700 text-white font-bold flex items-center justify-center text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-navy-800">Triage & Dispatch</h3>
              <p className="text-xs text-charcoal-500 mt-2 leading-relaxed">
                Municipal administrative teams review the complaint, attach default SLA hours, and assign specialized field technicians.
              </p>
            </div>

            <div className="bg-white p-6 rounded-civic border border-surface-border shadow-subtle relative">
              <div className="w-10 h-10 rounded-civic bg-navy-800 text-teal-400 font-bold flex items-center justify-center text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-navy-800">Field Repair</h3>
              <p className="text-xs text-charcoal-500 mt-2 leading-relaxed">
                Field crew updates task progress, provides on-site repair notes, and uploads before-and-after photographic evidence.
              </p>
            </div>

            <div className="bg-white p-6 rounded-civic border border-surface-border shadow-subtle relative">
              <div className="w-10 h-10 rounded-civic bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-navy-800">Verified & Rated</h3>
              <p className="text-xs text-charcoal-500 mt-2 leading-relaxed">
                Administration verifies repair completion. Citizens receive notifications to validate the fix and rate quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Categories Grid */}
      <section className="py-20 bg-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-800">
                Civic Service Domains
              </h2>
              <p className="mt-2 text-sm text-charcoal-500">
                Managed in accordance with municipal department jurisdictions and service-level commitments.
              </p>
            </div>
            <Link
              to="/citizen/report"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              Report within any category
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-civic border border-surface-border bg-surface-bg/40 hover:bg-white hover:border-teal-700/40 hover:shadow-card transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-civic bg-navy-50 text-navy-800 border border-navy-200 flex items-center justify-center group-hover:bg-navy-800 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-charcoal-700">
                      {cat.sla}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-navy-900 mt-4">{cat.title}</h3>
                  <p className="text-xs text-charcoal-500 mt-2 leading-relaxed">{cat.desc}</p>
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-charcoal-400">
                    <span>{cat.dept}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Impact / Recent Activity Showcase */}
      {recentComplaints.length > 0 && (
        <section className="py-20 bg-surface-bg border-b border-surface-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-800">
                Live Civic Redressal Feed
              </h2>
              <p className="mt-2 text-sm text-charcoal-500">
                Transparent real-time resolution updates from field repair teams across the city.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="bg-white rounded-civic border border-surface-border p-5 shadow-subtle flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono font-bold text-navy-800">
                        {complaint.complaintCode}
                      </span>
                      <StatusBadge status={complaint.status} />
                    </div>
                    {complaint.imageUrl && (
                      <div className="w-full h-40 rounded-civic overflow-hidden mb-3 bg-slate-100">
                        <img
                          src={complaint.imageUrl}
                          alt={complaint.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h4 className="text-sm font-bold text-navy-900 line-clamp-1">{complaint.title}</h4>
                    <p className="text-xs text-charcoal-500 mt-1 line-clamp-2">{complaint.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-charcoal-500">
                    <span className="flex items-center gap-1 truncate max-w-[60%]">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{complaint.locationAddress}</span>
                    </span>
                    <PriorityBadge priority={complaint.priority} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Municipal CTA Banner */}
      <section className="py-16 bg-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            See an Infrastructure Defect in Your Neighbourhood?
          </h2>
          <p className="mt-3 text-sm text-slate-300 max-w-xl mx-auto">
            Take a photo, pin the location, and let municipal engineering crews dispatch repair teams immediately.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/citizen/report"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-civic shadow-card transition-colors"
            >
              Report an Issue Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy-700 hover:bg-navy-600 text-slate-200 font-semibold text-sm rounded-civic border border-navy-600 transition-colors"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
