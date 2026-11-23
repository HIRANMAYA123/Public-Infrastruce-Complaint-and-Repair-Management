import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'navy', trend }) => {
  const colorMap = {
    navy: 'text-navy-800 bg-navy-50 border-navy-200',
    teal: 'text-teal-700 bg-teal-50 border-teal-200',
    amber: 'text-amber-700 bg-amber-50 border-amber-200',
    emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    rose: 'text-rose-700 bg-rose-50 border-rose-200',
    blue: 'text-blue-700 bg-blue-50 border-blue-200',
  };

  const badgeClass = colorMap[color] || colorMap.navy;

  return (
    <div className="bg-white rounded-civic border border-surface-border p-5 shadow-subtle hover:shadow-card transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">{title}</p>
        {Icon && (
          <div className={`p-2.5 rounded-civic border ${badgeClass}`}>
            <Icon className="w-5 h-5 shrink-0" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-navy-900 tracking-tight">{value}</span>
        {trend && (
          <span className="text-xs font-medium text-emerald-600">
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-charcoal-500">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
