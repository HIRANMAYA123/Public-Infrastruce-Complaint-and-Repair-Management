import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Users,
  HardHat,
  Building2,
  MapPin,
  BarChart3,
  User,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const citizenLinks = [
    { to: '/citizen', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/citizen/report', label: 'Report an Issue', icon: PlusCircle },
    { to: '/citizen/complaints', label: 'My Complaints', icon: FileText },
    { to: '/profile', label: 'Citizen Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Overview', icon: LayoutDashboard },
    { to: '/admin/complaints', label: 'Complaint Triage', icon: FileText },
    { to: '/admin/workers', label: 'Field Technicians', icon: HardHat },
    { to: '/admin/departments', label: 'Departments', icon: Building2 },
    { to: '/admin/wards', label: 'Wards & Zones', icon: MapPin },
    { to: '/admin/analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { to: '/profile', label: 'Admin Profile', icon: User },
  ];

  const workerLinks = [
    { to: '/worker', label: 'Assigned Work Orders', icon: Wrench },
    { to: '/profile', label: 'Technician Profile', icon: User },
  ];

  const links =
    user.role === 'admin'
      ? adminLinks
      : user.role === 'field_worker'
      ? workerLinks
      : citizenLinks;

  const getRoleBadge = () => {
    if (user.role === 'admin') {
      return { label: 'MUNICIPAL ADMIN', bg: 'bg-navy-900 text-teal-400 border-navy-700' };
    }
    if (user.role === 'field_worker') {
      return { label: 'FIELD SPECIALIST', bg: 'bg-amber-900/30 text-amber-700 border-amber-300' };
    }
    return { label: 'CITIZEN ACCOUNT', bg: 'bg-teal-50 text-teal-800 border-teal-200' };
  };

  const badge = getRoleBadge();

  return (
    <aside className="w-64 bg-white border-r border-surface-border min-h-[calc(100vh-4rem)] flex flex-col justify-between shrink-0">
      <div className="p-4 space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-civic bg-surface-bg border border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-navy-800 text-white font-bold text-sm flex items-center justify-center shrink-0">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-navy-900 truncate">{user.fullName}</h4>
              <p className="text-[11px] text-charcoal-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="mt-2.5">
            <span
              className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border ${badge.bg}`}
            >
              {badge.label}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-charcoal-400 mb-2">
            Workspace
          </p>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/citizen' || link.to === '/admin' || link.to === '/worker'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-civic text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-navy-800 text-white shadow-sm'
                        : 'text-charcoal-700 hover:bg-slate-100 hover:text-navy-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Municipal Security Badge */}
      <div className="p-4 m-4 rounded-civic bg-navy-50 border border-navy-100">
        <div className="flex items-center gap-2 text-navy-800 font-bold text-xs">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>CivicFix Certified</span>
        </div>
        <p className="text-[10px] text-charcoal-500 mt-1 leading-tight">
          Municipal Public Grievance Redressal Standards compliance.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
