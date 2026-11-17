import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, FileText, Search, User, LogOut, Menu, X, 
  ChevronDown, PhoneCall, Building2, CheckCircle2, UserCheck
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleDemoSwitch = async (email) => {
    try {
      await login(email, 'Kerala@2026');
      setDemoMenuOpen(false);
      setMobileMenuOpen(false);
      if (email.includes('admin')) {
        navigate('/cmo/dashboard');
      } else if (email.includes('officer')) {
        navigate('/officer/dashboard');
      } else {
        navigate('/citizen/dashboard');
      }
    } catch (err) {
      console.error('Demo login switch error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Government Strip */}
      <div className="bg-[#0B3B24] text-white text-xs px-4 py-1.5 font-medium flex justify-between items-center tracking-wide">
        <div className="flex items-center gap-3">
          <span className="bg-[#F59E0B] text-slate-900 px-1.5 py-0.5 rounded font-bold text-[10px]">GOVT OF KERALA</span>
          <span className="hidden sm:inline">Chief Minister's Public Grievance Redressal Portal | മുഖ്യമന്ത്രിയുടെ പരാതി പരിഹാര സെൽ</span>
        </div>
        <div className="flex items-center gap-4 text-emerald-100">
          <span className="hidden md:flex items-center gap-1">
            <PhoneCall className="w-3.5 h-3.5 text-[#F59E0B]" />
            Toll-Free Helpline: <strong>1076 / 1912</strong>
          </span>
          {/* Quick Demo Role Switcher Button */}
          <div className="relative">
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="bg-emerald-800 hover:bg-emerald-700 text-yellow-300 px-2.5 py-1 rounded border border-emerald-600 flex items-center gap-1 text-[11px] font-semibold transition"
              title="Quick switch demo test accounts for evaluation"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Demo Accounts
              <ChevronDown className="w-3 h-3" />
            </button>

            {demoMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 text-xs">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider border-b border-gray-100">
                  Switch Demo Account (Password: Kerala@2026)
                </div>
                <button
                  onClick={() => handleDemoSwitch('cmo.admin@kerala.gov.in')}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center gap-2 text-emerald-900"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <div>
                    <div className="font-semibold">CMO Administrator</div>
                    <div className="text-[10px] text-gray-500">cmo.admin@kerala.gov.in</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDemoSwitch('pwd.officer@kerala.gov.in')}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center gap-2 text-emerald-900"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <div>
                    <div className="font-semibold">PWD Officer (Ernakulam)</div>
                    <div className="text-[10px] text-gray-500">pwd.officer@kerala.gov.in</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDemoSwitch('health.officer@kerala.gov.in')}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center gap-2 text-emerald-900"
                >
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <div>
                    <div className="font-semibold">Health Officer (Kozhikode)</div>
                    <div className="text-[10px] text-gray-500">health.officer@kerala.gov.in</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDemoSwitch('citizen.narayanan@gmail.com')}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center gap-2 text-emerald-900"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <div>
                    <div className="font-semibold">Citizen Petitioner</div>
                    <div className="text-[10px] text-gray-500">citizen.narayanan@gmail.com</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo & Emblem */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-700 to-[#0B3B24] border-2 border-[#F59E0B] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <span className="text-[#F59E0B] font-extrabold tracking-tight">KL</span>
            </div>
            <div>
              <div className="text-lg font-bold text-[#0B3B24] leading-tight group-hover:text-emerald-700 transition">
                CM KERALA
              </div>
              <div className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">
                Chief Minister's Public Grievance Portal
              </div>
              <div className="text-[10px] text-emerald-800 font-medium hidden sm:block">
                സത്യമേവ ജയതേ • Government of Kerala
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-gray-700 hover:text-emerald-700 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/about') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-gray-700 hover:text-emerald-700 hover:bg-gray-50'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/how-it-works"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/how-it-works') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-gray-700 hover:text-emerald-700 hover:bg-gray-50'
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/departments"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/departments') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-gray-700 hover:text-emerald-700 hover:bg-gray-50'
              }`}
            >
              Departments
            </Link>
            <Link
              to="/track"
              className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center gap-1.5 ${
                isActive('/track') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-gray-700 hover:text-emerald-700 hover:bg-gray-50'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-600" />
              Track Grievance
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/contact') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-gray-700 hover:text-emerald-700 hover:bg-gray-50'
              }`}
            >
              Contact Us
            </Link>
            <Link
              to="/faq"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/faq') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-gray-700 hover:text-emerald-700 hover:bg-gray-50'
              }`}
            >
              FAQ
            </Link>
          </nav>

          {/* Action CTAs & Auth Controls */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'citizen' && (
                  <>
                    <Link
                      to="/citizen/submit"
                      className="bg-[#0D5C3A] hover:bg-emerald-800 text-white px-3.5 py-2 rounded-md text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Submit Grievance
                    </Link>
                    <Link
                      to="/citizen/dashboard"
                      className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-2 rounded-md text-xs font-semibold transition"
                    >
                      My Dashboard
                    </Link>
                  </>
                )}

                {user.role === 'cmo_admin' && (
                  <Link
                    to="/cmo/dashboard"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-md text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    CMO Admin Console
                  </Link>
                )}

                {user.role === 'department_officer' && (
                  <Link
                    to="/officer/dashboard"
                    className="bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-md text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    Officer Console ({user.department_code || 'Dept'})
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-gray-800 leading-tight">{user.name}</div>
                    <div className="text-[10px] text-gray-500 capitalize">{user.role.replace('_', ' ')}</div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="p-1.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-red-50 transition"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/track"
                  className="px-3 py-2 text-sm text-gray-700 font-medium hover:text-emerald-700"
                >
                  Track
                </Link>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm text-emerald-800 font-semibold border border-emerald-700 rounded-md hover:bg-emerald-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm bg-[#0D5C3A] text-white font-semibold rounded-md hover:bg-emerald-800 shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-md"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50"
          >
            About Us
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50"
          >
            How It Works
          </Link>
          <Link
            to="/departments"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50"
          >
            Departments
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50"
          >
            Track Grievance
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50"
          >
            Contact Us
          </Link>
          <Link
            to="/faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50"
          >
            FAQ
          </Link>

          <div className="pt-4 border-t border-gray-200 space-y-2">
            {user ? (
              <>
                <div className="px-3 py-1 font-semibold text-gray-800 text-sm">
                  Logged in as {user.name} ({user.role})
                </div>
                {user.role === 'citizen' && (
                  <>
                    <Link
                      to="/citizen/submit"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center bg-[#0D5C3A] text-white py-2 rounded-md font-semibold text-sm"
                    >
                      Submit Grievance
                    </Link>
                    <Link
                      to="/citizen/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center bg-gray-100 text-gray-800 py-2 rounded-md font-semibold text-sm"
                    >
                      Citizen Dashboard
                    </Link>
                  </>
                )}
                {user.role === 'cmo_admin' && (
                  <Link
                    to="/cmo/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center bg-amber-600 text-white py-2 rounded-md font-semibold text-sm"
                  >
                    CMO Admin Dashboard
                  </Link>
                )}
                {user.role === 'department_officer' && (
                  <Link
                    to="/officer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center bg-blue-700 text-white py-2 rounded-md font-semibold text-sm"
                  >
                    Officer Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="block w-full text-center text-red-600 py-2 font-medium text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 border border-emerald-700 text-emerald-800 rounded-md font-semibold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 bg-[#0D5C3A] text-white rounded-md font-semibold text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
