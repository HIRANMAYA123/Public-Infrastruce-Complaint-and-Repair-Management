import React from 'react';
import { CheckCircle2, Clock, Wrench, RefreshCw, AlertCircle } from 'lucide-react';

export const Timeline = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-charcoal-500">
        No lifecycle events recorded yet.
      </div>
    );
  }

  const getEventIcon = (status) => {
    switch (status) {
      case 'Resolved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'In Progress':
      case 'Work Completed':
        return <Wrench className="w-4 h-4 text-indigo-600" />;
      case 'Reopened':
        return <RefreshCw className="w-4 h-4 text-orange-600" />;
      case 'Rejected':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {events.map((event, idx) => (
        <div key={event._id || idx} className="relative flex items-start gap-3">
          <div className="absolute -left-6 mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-white border border-slate-300 shadow-sm">
            {getEventIcon(event.newStatus)}
          </div>
          <div className="flex-1 bg-surface-bg p-3.5 rounded-civic border border-slate-200 text-sm">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-semibold text-navy-800">
                {event.newStatus}
              </span>
              <span className="text-xs text-charcoal-500 font-mono">
                {new Date(event.changedAt).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {event.remarks && (
              <p className="mt-1 text-xs text-charcoal-700 leading-relaxed">
                {event.remarks}
              </p>
            )}
            {event.changedByUserId && (
              <p className="mt-1 text-[11px] text-slate-400">
                By: <span className="font-medium text-slate-600">{event.changedByUserId.fullName || 'System'}</span>
                {event.changedByUserId.role && ` (${event.changedByUserId.role.replace('_', ' ')})`}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
