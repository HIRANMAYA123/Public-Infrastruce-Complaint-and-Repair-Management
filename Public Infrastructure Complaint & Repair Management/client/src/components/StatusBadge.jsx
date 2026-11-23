import React from 'react';
import { Clock, UserCheck, Wrench, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const configs = {
    Pending: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Clock,
      label: 'Pending Triage',
    },
    Assigned: {
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: UserCheck,
      label: 'Assigned',
    },
    'In Progress': {
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      icon: Wrench,
      label: 'In Progress',
    },
    'Work Completed': {
      bg: 'bg-teal-50 text-teal-800 border-teal-200',
      icon: CheckCircle,
      label: 'Work Completed',
    },
    Resolved: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle,
      label: 'Resolved',
    },
    Rejected: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: XCircle,
      label: 'Rejected',
    },
    Reopened: {
      bg: 'bg-orange-50 text-orange-800 border-orange-200',
      icon: RefreshCw,
      label: 'Reopened',
    },
  };

  const config = configs[status] || {
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
    icon: Clock,
    label: status || 'Unknown',
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
