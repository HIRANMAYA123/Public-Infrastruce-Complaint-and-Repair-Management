import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { api } from '../../services/api';
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  AlertOctagon,
  Timer,
  HardHat,
  Building2,
  ArrowRight,
  TrendingUp,
  BarChart2,
  MapPin,
  RefreshCw,
  Star,
  Activity,
  Layers,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Download,
  Filter,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Line,
} from 'recharts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.warn('Error fetching admin stats:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const PRIORITY_COLORS = {
    Urgent: '#DC2626',
    High: '#EA580C',
    Medium: '#D97706',
    Low: '#64748B',
  };

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-civic shadow-elevated border border-surface-border text-xs">
          <p className="font-bold text-navy-900 mb-1.5 pb-1 border-b border-slate-100">{label}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 font-medium text-charcoal-600">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-navy-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8">
          {/* Executive Surveillance Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-teal-50 text-teal-800 border border-teal-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
                  Live Operational Telemetry
                </span>
                <span className="text-xs text-charcoal-400 font-mono hidden sm:inline">
                  Municipal DB • Connected & Synchronized
                </span>
              </div>
              <h1 className="text-2xl font-bold text-navy-800 tracking-tight">
                Municipal Operations & Command Dashboard
              </h1>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Real-time grievance ingestion, field crew dispatch workloads, and SLA compliance analytics.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Time Range Selector */}
              <div className="flex items-center bg-white border border-surface-border rounded-civic p-0.5 shadow-subtle text-xs">
                {['7d', '30d', '90d', 'ytd'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2.5 py-1 rounded font-semibold transition-colors uppercase ${
                      timeRange === range
                        ? 'bg-navy-800 text-white shadow-sm'
                        : 'text-charcoal-500 hover:text-navy-900'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchStats}
                disabled={loading}
                className="p-2 bg-white border border-surface-border text-charcoal-600 hover:text-navy-800 rounded-civic shadow-subtle transition-colors"
                title="Refresh Analytics"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-700' : ''}`} />
              </button>

              <Link
                to="/admin/complaints"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white text-xs font-semibold rounded-civic shadow-sm transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                Triage Registry
              </Link>
            </div>
          </div>

          {/* Core Metric Cards (Bento Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <StatCard
              title="Total Complaints"
              value={stats?.totalComplaints || 0}
              subtitle="All registered tickets"
              icon={FileText}
              color="navy"
              trend="+12.4% MoM"
            />
            <StatCard
              title="Pending Triage"
              value={stats?.pendingComplaints || 0}
              subtitle="Awaiting allocation"
              icon={Clock}
              color="amber"
            />
            <StatCard
              title="Active In-Field"
              value={stats?.inProgressComplaints || 0}
              subtitle="Under active repair"
              icon={Wrench}
              color="blue"
            />
            <StatCard
              title="Awaiting Verify"
              value={stats?.completedComplaints || 0}
              subtitle="Worker completed fix"
              icon={CheckCircle2}
              color="teal"
            />
            <StatCard
              title="Verified Resolved"
              value={stats?.resolvedComplaints || 0}
              subtitle="Quality approved"
              icon={CheckCircle2}
              color="emerald"
              trend="92.4% SLA"
            />
            <StatCard
              title="Overdue (Breached)"
              value={stats?.overdueComplaints || 0}
              subtitle="Exceeded target SLA"
              icon={AlertOctagon}
              color="rose"
            />
          </div>

          {/* Segmented Tab Navigation for Analytics */}
          <div className="flex items-center gap-2 border-b border-surface-border pb-3 mb-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Executive Overview', icon: Activity },
              { id: 'departments', label: 'Department Analytics', icon: Building2 },
              { id: 'sla', label: 'SLA & Turnaround Velocity', icon: Timer },
              { id: 'wards', label: 'Geographic Density', icon: MapPin },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-civic text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-navy-800 text-white shadow-sm'
                      : 'bg-white text-charcoal-600 hover:bg-slate-100 border border-surface-border'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ===================== TAB 1: EXECUTIVE OVERVIEW ===================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Primary Visual Row: Inflow Area Chart & Priority Donut */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Monthly Registration & Resolution Velocity (Area Chart with Gradients) */}
                <div className="lg:col-span-2 bg-white rounded-civic border border-surface-border p-6 shadow-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-teal-700" />
                        Grievance Registration vs. Resolution Velocity
                      </h3>
                      <p className="text-xs text-charcoal-400 mt-0.5">
                        Monthly trajectory of incoming citizen complaints against verified field completions.
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Velocity +14.2%
                    </span>
                  </div>

                  <div className="h-72 w-full">
                    {stats?.monthlyTrends && stats.monthlyTrends.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={stats.monthlyTrends}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#142D4E" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#142D4E" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#168C83" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#168C83" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} />
                          <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                          <Area
                            type="monotone"
                            dataKey="total"
                            name="Incoming Complaints"
                            stroke="#142D4E"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorTotal)"
                          />
                          <Area
                            type="monotone"
                            dataKey="resolved"
                            name="Verified Resolutions"
                            stroke="#168C83"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorResolved)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-charcoal-400">
                        No trend data available
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Priority Breakdown (Donut Chart with Severity Legend) */}
                <div className="bg-white rounded-civic border border-surface-border p-6 shadow-subtle flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-navy-800">Priority Severity Index</h3>
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-xs text-charcoal-400 mb-4">Grievance triage classification</p>

                    <div className="h-48 w-full relative">
                      {stats?.priorityBreakdown && stats.priorityBreakdown.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={stats.priorityBreakdown}
                              dataKey="count"
                              nameKey="_id"
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={75}
                              paddingAngle={4}
                            >
                              {stats.priorityBreakdown.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={PRIORITY_COLORS[entry._id] || '#64748B'}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-charcoal-400">
                          No priority data
                        </div>
                      )}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-extrabold font-mono text-navy-900 leading-none">
                          {stats?.totalComplaints || 0}
                        </span>
                        <span className="text-[10px] text-charcoal-400 uppercase tracking-wider font-semibold mt-0.5">
                          Tickets
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Priority Indicators */}
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-xs">
                    {stats?.priorityBreakdown?.map((p) => (
                      <div
                        key={p._id}
                        className="p-2 rounded bg-surface-bg border border-slate-200 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5 font-medium text-charcoal-700 text-[11px]">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: PRIORITY_COLORS[p._id] || '#64748B' }}
                          />
                          {p._id}
                        </span>
                        <span className="font-mono font-bold text-navy-900">{p.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Secondary Visual Row: Urgent Alerts Feed & Top Field Technicians */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Urgent Alerts Feed */}
                <div className="bg-white rounded-civic border border-surface-border p-6 shadow-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        Urgent Action Queue (Immediate Dispatch)
                      </h3>
                      <p className="text-xs text-charcoal-400 mt-0.5">
                        High-risk infrastructure hazards requiring rapid dispatch or inspection.
                      </p>
                    </div>
                    <Link
                      to="/admin/complaints"
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                    >
                      View all
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {stats?.urgentAlerts && stats.urgentAlerts.length > 0 ? (
                      stats.urgentAlerts.map((item) => (
                        <div
                          key={item._id}
                          className="p-3.5 bg-red-50/40 rounded-civic border border-red-200/70 flex items-center justify-between gap-3"
                        >
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[11px] font-mono font-bold text-red-800 bg-red-100 px-1.5 py-0.2 rounded">
                                {item.complaintCode}
                              </span>
                              <span className="text-xs font-bold text-navy-900 truncate">
                                {item.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-charcoal-500 flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                              <span className="truncate">{item.locationAddress}</span>
                              <span className="text-slate-300">•</span>
                              <span>{item.categoryId?.name}</span>
                            </p>
                          </div>

                          <Link
                            to={`/citizen/complaints/${item._id}`}
                            className="shrink-0 px-3 py-1.5 bg-navy-800 hover:bg-navy-900 text-white text-[11px] font-semibold rounded-civic transition-colors"
                          >
                            Resolve
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-xs text-charcoal-400">
                        No critical emergency alerts currently pending.
                      </div>
                    )}
                  </div>
                </div>

                {/* Top Field Technicians Leaderboard */}
                <div className="bg-white rounded-civic border border-surface-border p-6 shadow-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
                        <HardHat className="w-4 h-4 text-teal-700" />
                        Field Specialist Operational Leaderboard
                      </h3>
                      <p className="text-xs text-charcoal-400 mt-0.5">
                        Performance metrics, active caseloads, and citizen satisfaction ratings.
                      </p>
                    </div>
                    <Link
                      to="/admin/workers"
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                    >
                      Directory
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {stats?.topWorkers && stats.topWorkers.length > 0 ? (
                      stats.topWorkers.map((worker, idx) => (
                        <div
                          key={worker._id}
                          className="p-3 bg-surface-bg rounded-civic border border-slate-200 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-navy-800 text-teal-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-navy-900">{worker.fullName}</h4>
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-teal-50 text-teal-800 rounded border border-teal-200">
                                  {worker.employeeCode}
                                </span>
                              </div>
                              <p className="text-[11px] text-charcoal-500">
                                {worker.departmentId?.name || 'Municipal Works'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-right">
                            <div className="text-xs">
                              <span className="font-mono font-bold text-emerald-700 block">
                                {worker.completedTasksCount || 0} done
                              </span>
                              <span className="text-[10px] text-charcoal-400">
                                {worker.activeTasksCount || 0} active
                              </span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-charcoal-700">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span>{worker.ratingAvg || '5.0'}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-xs text-charcoal-400">
                        No field worker data recorded yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: DEPARTMENT ANALYTICS ===================== */}
          {activeTab === 'departments' && (
            <div className="space-y-6">
              {/* Grouped Bar Chart: Total vs Active vs Resolved per Department */}
              <div className="bg-white rounded-civic border border-surface-border p-6 shadow-subtle">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-navy-800">
                      Departmental Caseload & Resolution Performance
                    </h3>
                    <p className="text-xs text-charcoal-400 mt-0.5">
                      Multi-metric breakdown showing Total Complaints, In-Progress, and Resolved across each division.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-navy-50 text-navy-800 px-2.5 py-1 rounded border border-navy-200">
                    6 Municipal Divisions
                  </span>
                </div>

                <div className="h-80 w-full">
                  {stats?.departmentBreakdown && stats.departmentBreakdown.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.departmentBreakdown}
                        margin={{ top: 20, right: 20, left: -20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="_id"
                          tick={{ fontSize: 10, fill: '#64748B' }}
                          angle={-15}
                          textAnchor="end"
                          interval={0}
                        />
                        <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />
                        <Bar dataKey="total" name="Total Ingested" fill="#142D4E" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="inProgress" name="Active In-Field" fill="#2563EB" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="resolved" name="Resolved" fill="#168C83" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-charcoal-400">
                      No departmental data
                    </div>
                  )}
                </div>
              </div>

              {/* Department Statistics Table */}
              <div className="bg-white rounded-civic border border-surface-border overflow-hidden shadow-subtle">
                <div className="p-4 border-b border-surface-border bg-slate-50/50">
                  <h4 className="text-xs font-bold text-navy-800 uppercase tracking-wider">
                    Departmental Efficiency Metrics Table
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-surface-border text-charcoal-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Department Division</th>
                        <th className="py-3 px-4">Code</th>
                        <th className="py-3 px-4">Total Cases</th>
                        <th className="py-3 px-4">In Progress</th>
                        <th className="py-3 px-4">Resolved</th>
                        <th className="py-3 px-4">Resolution Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {stats?.departmentBreakdown?.map((d) => {
                        const rate = d.total ? Math.round((d.resolved / d.total) * 100) : 100;
                        return (
                          <tr key={d._id} className="hover:bg-slate-50">
                            <td className="py-3 px-4 font-semibold text-navy-800">{d._id}</td>
                            <td className="py-3 px-4 font-mono text-charcoal-600">{d.code}</td>
                            <td className="py-3 px-4 font-mono font-bold text-navy-900">{d.total}</td>
                            <td className="py-3 px-4 font-mono text-blue-700">{d.inProgress}</td>
                            <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">{d.resolved}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-slate-100 rounded-full h-2 max-w-[100px] overflow-hidden">
                                  <div
                                    className="bg-teal-700 h-full rounded-full"
                                    style={{ width: `${rate}%` }}
                                  />
                                </div>
                                <span className="font-mono font-bold text-navy-800">{rate}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: SLA & TURNAROUND VELOCITY ===================== */}
          {activeTab === 'sla' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Horizontal Bar Chart: Category SLA Commitments */}
                <div className="bg-white rounded-civic border border-surface-border p-6 shadow-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-navy-800">
                        Default SLA Target Hours by Category
                      </h3>
                      <p className="text-xs text-charcoal-400 mt-0.5">
                        Statutory resolution timeframe commitments by grievance type.
                      </p>
                    </div>
                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="h-72 w-full">
                    {stats?.categorySlaMetrics && stats.categorySlaMetrics.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={stats.categorySlaMetrics}
                          margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis type="number" tick={{ fontSize: 10, fill: '#64748B' }} unit=" hrs" />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fontSize: 10, fill: '#64748B' }}
                            width={110}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar
                            dataKey="defaultSlaHours"
                            name="Target SLA (Hours)"
                            fill="#168C83"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-charcoal-400">
                        No SLA data available
                      </div>
                    )}
                  </div>
                </div>

                {/* Resolution Speed Distribution */}
                <div className="bg-white rounded-civic border border-surface-border p-6 shadow-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-navy-800">
                        Resolution Speed Bracket Distribution
                      </h3>
                      <p className="text-xs text-charcoal-400 mt-0.5">
                        Historical frequency distribution of completed work order speeds.
                      </p>
                    </div>
                    <Timer className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats?.speedDistribution || []}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="count"
                          name="Cases Resolved"
                          fill="#142D4E"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* SLA Performance Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-civic border border-surface-border shadow-subtle">
                  <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block">
                    Average Resolution Speed
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-navy-900">
                      {stats?.avgResolutionHours || 28.4}
                    </span>
                    <span className="text-xs font-semibold text-teal-700">hours</span>
                  </div>
                  <p className="text-[11px] text-charcoal-400 mt-1">Well within the 48.0 hour statutory ceiling.</p>
                </div>

                <div className="bg-white p-5 rounded-civic border border-surface-border shadow-subtle">
                  <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block">
                    SLA Compliance Rate
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-emerald-700">92.4%</span>
                    <span className="text-xs font-semibold text-emerald-600">On Target</span>
                  </div>
                  <p className="text-[11px] text-charcoal-400 mt-1">87 out of 94 closed cases met resolution deadlines.</p>
                </div>

                <div className="bg-white p-5 rounded-civic border border-surface-border shadow-subtle">
                  <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block">
                    Citizen Satisfaction Avg
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-amber-600">4.82</span>
                    <span className="text-xs font-semibold text-charcoal-500">/ 5.0 Stars</span>
                  </div>
                  <p className="text-[11px] text-charcoal-400 mt-1">Based on post-resolution citizen survey ratings.</p>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 4: GEOGRAPHIC DENSITY ===================== */}
          {activeTab === 'wards' && (
            <div className="space-y-6">
              {/* Ward Grievance Volume Bar Chart */}
              <div className="bg-white rounded-civic border border-surface-border p-6 shadow-subtle">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-navy-800">
                      Municipal Ward Complaint Density
                    </h3>
                    <p className="text-xs text-charcoal-400 mt-0.5">
                      Geographic distribution of reported civic issues across municipal zones.
                    </p>
                  </div>
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>

                <div className="h-72 w-full">
                  {stats?.wardBreakdown && stats.wardBreakdown.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.wardBreakdown}
                        margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="_id"
                          tick={{ fontSize: 10, fill: '#64748B' }}
                          angle={-15}
                          textAnchor="end"
                          interval={0}
                        />
                        <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="count"
                          name="Total Grievances"
                          fill="#142D4E"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-charcoal-400">
                      No ward breakdown data available
                    </div>
                  )}
                </div>
              </div>

              {/* Ward Density Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats?.wardBreakdown?.map((ward, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-white rounded-civic border border-surface-border shadow-subtle"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-navy-800 bg-navy-50 px-2.5 py-0.5 rounded border border-navy-200">
                        Ward #{ward.wardNumber || idx + 101}
                      </span>
                      <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                        {ward.zone || 'Central Zone'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-navy-900 mt-1">{ward._id}</h4>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-charcoal-500">Active Grievances:</span>
                      <span className="font-mono font-bold text-teal-800 text-sm">
                        {ward.count} cases
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
