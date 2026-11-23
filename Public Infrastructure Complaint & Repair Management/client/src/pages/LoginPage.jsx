import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Shield, Lock, Mail, ArrowRight, UserCheck, Wrench, ShieldAlert } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (userRole) => {
    if (location.state?.from?.pathname) {
      return location.state.from.pathname;
    }
    if (userRole === 'admin') return '/admin';
    if (userRole === 'field_worker') return '/worker';
    return '/citizen';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      success(`Welcome back, ${user.fullName}!`);
      navigate(redirectPath(user.role), { replace: true });
    } catch (err) {
      error(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    try {
      const user = await demoLogin(role);
      success(`Logged in as Demo ${role.replace('_', ' ').toUpperCase()} (${user.fullName})`);
      navigate(redirectPath(user.role), { replace: true });
    } catch (err) {
      error(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-surface-bg py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-10 h-10 rounded-civic bg-navy-800 flex items-center justify-center text-white shadow-subtle group-hover:bg-navy-700 transition-colors">
            <Shield className="w-6 h-6 text-teal-400" />
          </div>
          <span className="font-extrabold text-2xl text-navy-800 tracking-tight">CivicFix</span>
        </Link>
        <h2 className="text-2xl font-bold text-navy-800 tracking-tight">
          Sign In to Municipal Portal
        </h2>
        <p className="mt-1.5 text-xs text-charcoal-500">
          Access civic complaint registries, field assignments, and tracking tools.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-civic shadow-card border border-surface-border">
          {/* Demo Quick-Login Switcher */}
          <div className="mb-6 p-3.5 bg-slate-50 rounded-civic border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-700">
                1-Click Role Switcher (Evaluation)
              </span>
              <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-mono font-bold">DEMO</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('citizen')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2 rounded bg-white hover:bg-teal-50 hover:border-teal-300 border border-slate-200 text-xs font-semibold text-navy-800 transition-colors"
              >
                <UserCheck className="w-4 h-4 text-teal-700 mb-1" />
                <span>Citizen</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2 rounded bg-white hover:bg-navy-50 hover:border-navy-300 border border-slate-200 text-xs font-semibold text-navy-800 transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-navy-800 mb-1" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('field_worker')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2 rounded bg-white hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-xs font-semibold text-navy-800 transition-colors"
              >
                <Wrench className="w-4 h-4 text-amber-700 mb-1" />
                <span>Worker</span>
              </button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Official Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-civic text-charcoal-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-charcoal-700">
                  Security Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-civic text-charcoal-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs rounded-civic shadow-subtle transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Account'}
              <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-charcoal-500">
              New citizen contributor?{' '}
              <Link to="/register" className="font-semibold text-teal-700 hover:text-teal-800">
                Register a Citizen Profile
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
