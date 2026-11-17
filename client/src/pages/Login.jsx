import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      if (user.role === 'cmo_admin') {
        navigate('/cmo/dashboard');
      } else if (user.role === 'department_officer') {
        navigate('/officer/dashboard');
      } else {
        navigate(from === '/' ? '/citizen/dashboard' : from);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Kerala@2026');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#0B3B24] text-[#F59E0B] font-bold text-xl mx-auto flex items-center justify-center border-2 border-amber-400 shadow-sm">
          KL
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Sign In to Portal
        </h1>
        <p className="text-xs text-gray-500">
          Chief Minister's Public Grievance Redressal Portal
        </p>
      </div>

      {/* Demo Credentials Quick-Fill Bar */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
          <UserCheck className="w-4 h-4 text-emerald-700" />
          <span>Quick Fill Demo Test Accounts (Password: Kerala@2026):</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={() => fillCredentials('cmo.admin@kerala.gov.in')}
            className="p-1.5 rounded bg-white hover:bg-emerald-100/60 border border-emerald-200 text-left font-medium text-emerald-900 transition"
          >
            🛡️ <strong>CMO Admin</strong>
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('pwd.officer@kerala.gov.in')}
            className="p-1.5 rounded bg-white hover:bg-emerald-100/60 border border-emerald-200 text-left font-medium text-emerald-900 transition"
          >
            🏗️ <strong>PWD Officer</strong>
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('health.officer@kerala.gov.in')}
            className="p-1.5 rounded bg-white hover:bg-emerald-100/60 border border-emerald-200 text-left font-medium text-emerald-900 transition"
          >
            🏥 <strong>Health Officer</strong>
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('citizen.narayanan@gmail.com')}
            className="p-1.5 rounded bg-white hover:bg-emerald-100/60 border border-emerald-200 text-left font-medium text-emerald-900 transition"
          >
            👤 <strong>Citizen Petitioner</strong>
          </button>
        </div>
      </div>

      {/* Login Box */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@kerala.gov.in or citizen@gmail.com"
                className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0D5C3A] hover:bg-emerald-800 text-white py-2.5 rounded-lg font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-3 border-t border-gray-100 text-center text-xs text-gray-600">
          New citizen petitioner?{' '}
          <Link to="/register" className="text-emerald-800 font-bold hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
}
