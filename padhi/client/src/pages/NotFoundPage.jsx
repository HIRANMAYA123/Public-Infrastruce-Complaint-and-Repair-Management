import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-bg p-4 text-center">
      <div className="w-14 h-14 rounded-civic bg-navy-800 text-teal-400 flex items-center justify-center mb-6 shadow-card">
        <Shield className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 mb-3">
        ERROR 404 – RESOURCE NOT FOUND
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-800 tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-2 text-sm text-charcoal-500 max-w-md mx-auto">
        The requested civic portal link, complaint ticket, or municipal record does not exist or has been relocated.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-800 hover:bg-navy-900 text-white rounded-civic text-xs font-semibold shadow-subtle transition-colors"
        >
          <Home className="w-4 h-4 text-teal-400" />
          Return to CivicFix Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
