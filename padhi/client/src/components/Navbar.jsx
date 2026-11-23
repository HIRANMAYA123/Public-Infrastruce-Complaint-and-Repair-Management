import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, LogOut, ArrowRight, LayoutDashboard, PlusCircle, Wrench } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'field_worker') return '/worker';
    return '/citizen';
  };

  const getRoleLabel = () => {
    if (!user) return '';
    if (user.role === 'admin') return 'Municipal Admin';
    if (user.role === 'field_worker') return 'Field Specialist';
    return 'Citizen Contributor';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-civic bg-navy-800 flex items-center justify-center text-white shadow-subtle group-hover:bg-navy-700 transition-colors">
            <Shield className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-navy-800 tracking-tight">CivicFix</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded">MUNICIPAL</span>
            </div>
            <p className="text-[10px] text-charcoal-400 font-medium -mt-1 hidden sm:block">Public Infrastructure Portal</p>
          </div>
        </Link>

        {/* Right Action Links */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'citizen' && (
                <Link
                  to="/citizen/report"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-civic shadow-sm transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Report Issue
                </Link>
              )}

              <Link
                to={getDashboardPath()}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-navy-800 hover:bg-slate-100 rounded-civic transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-teal-700" />
                Dashboard
              </Link>

              {/* User Pill */}
              <div className="flex items-center gap-2.5 pl-2 border-l border-surface-border">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1 rounded-civic hover:bg-slate-50 transition-colors"
                  title="View Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-navy-800 text-white font-semibold text-xs flex items-center justify-center border border-navy-700">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-navy-800 leading-tight">{user.fullName}</p>
                    <p className="text-[10px] text-charcoal-500 font-medium">{getRoleLabel()}</p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 rounded-civic transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-navy-800 hover:bg-slate-100 rounded-civic transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-800 hover:bg-navy-900 text-white text-xs font-semibold rounded-civic shadow-sm transition-colors"
              >
                Citizen Portal
                <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
