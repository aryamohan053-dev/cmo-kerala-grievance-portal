import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, Search, ArrowRight, ShieldCheck, CheckCircle2, Clock, 
  Users, Building2, Sparkles, AlertCircle, PhoneCall, ChevronRight, Award
} from 'lucide-react';
import { api } from '../services/api';

const KERALA_DISTRICTS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur',
  'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad',
  'Kannur', 'Kasaragod'
];

export default function Home() {
  const navigate = useNavigate();
  const [quickRef, setQuickRef] = useState('');
  const [stats, setStats] = useState({
    total: 24870,
    resolved: 22890,
    resolutionRate: 92,
    avgDays: 8.4,
    satisfaction: 94
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const deptRes = await api.getDepartments();
        if (deptRes.success) {
          setDepartments(deptRes.departments.slice(0, 6));
        }
        // Load live stats if available
        const statsRes = await api.getCMOStats().catch(() => null);
        if (statsRes?.success && statsRes.stats) {
          setStats({
            total: statsRes.stats.total || 24870,
            resolved: statsRes.stats.resolved || 22890,
            resolutionRate: statsRes.stats.resolutionRate || 92,
            avgDays: statsRes.stats.averageDays || 8.4,
            satisfaction: statsRes.stats.satisfactionRate || 94
          });
        }
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleQuickTrack = (e) => {
    e.preventDefault();
    if (quickRef.trim()) {
      navigate(`/track?ref=${encodeURIComponent(quickRef.trim())}`);
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0B3B24] via-[#0D5C3A] to-[#082919] text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative background patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Main Banner & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-600/50 text-[#F59E0B] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Assisted Direct Citizen Redressal System</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Direct Citizen Access to the <span className="text-[#F59E0B]">Chief Minister's Office</span>
              </h1>

              <p className="text-emerald-100 text-base sm:text-lg leading-relaxed max-w-2xl">
                A transparent, responsive governance initiative by the Government of Kerala. Citizens across all 14 districts can submit grievances directly to the CMO, track investigation milestones in real-time, and receive verified departmental action reports.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/citizen/submit"
                  className="bg-[#F59E0B] hover:bg-amber-500 text-slate-900 px-6 py-3.5 rounded-lg font-bold text-sm shadow-lg hover:shadow-xl transition flex items-center gap-2 group"
                >
                  <FileText className="w-4 h-4 text-slate-900 group-hover:scale-110 transition" />
                  Submit Grievance
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/track"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-lg font-semibold text-sm backdrop-blur transition flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-[#F59E0B]" />
                  Track Existing Petition
                </Link>
              </div>

              {/* Quick Inline Search Bar */}
              <div className="pt-4 max-w-xl">
                <form onSubmit={handleQuickTrack} className="flex items-center bg-white rounded-lg p-1.5 shadow-md">
                  <Search className="w-5 h-5 text-gray-400 ml-3" />
                  <input
                    type="text"
                    value={quickRef}
                    onChange={(e) => setQuickRef(e.target.value)}
                    placeholder="Enter Reference Number (e.g. KL-CMO-2026-00101)"
                    className="w-full px-3 py-2 text-sm text-gray-800 focus:outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    className="bg-[#0D5C3A] hover:bg-emerald-800 text-white px-5 py-2 rounded-md font-semibold text-xs transition shrink-0"
                  >
                    Track Now
                  </button>
                </form>
                <div className="text-[11px] text-emerald-200 mt-2 flex items-center gap-2">
                  <span>Try sample references:</span>
                  <button
                    type="button"
                    onClick={() => setQuickRef('KL-CMO-2026-00101')}
                    className="underline hover:text-white"
                  >
                    KL-CMO-2026-00101 (PWD)
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setQuickRef('KL-CMO-2026-00102')}
                    className="underline hover:text-white"
                  >
                    KL-CMO-2026-00102 (KWA)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Col: Leadership & Governance Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-900 font-extrabold flex items-center justify-center text-2xl shadow-inner border-2 border-white">
                    KL
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Office of the Chief Minister</h3>
                    <p className="text-xs text-emerald-200 font-medium">Government Secretariat, Thiruvananthapuram</p>
                    <span className="inline-block mt-1 text-[11px] bg-emerald-800/90 text-amber-300 px-2 py-0.5 rounded font-semibold border border-emerald-700">
                      Zero-Tolerance Redressal Policy
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/15 pt-4 text-xs italic text-emerald-100 leading-relaxed">
                  "No citizen's grievance should remain unaddressed in modern Kerala. Every petition received by the CMO is catalogued, routed with strict departmental time limits, and continuously monitored until real corrective action is completed on the ground."
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-emerald-950/60 p-3 rounded-lg border border-emerald-800/60">
                    <div className="text-[#F59E0B] font-bold text-xl sm:text-2xl">{stats.resolutionRate}%</div>
                    <div className="text-[11px] text-gray-300 font-medium">Resolution Success Rate</div>
                  </div>
                  <div className="bg-emerald-950/60 p-3 rounded-lg border border-emerald-800/60">
                    <div className="text-[#F59E0B] font-bold text-xl sm:text-2xl">{stats.avgDays} Days</div>
                    <div className="text-[11px] text-gray-300 font-medium">Average Redressal Time</div>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-200 flex items-center gap-2 pt-1">
                  <ShieldCheck className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span>Secure 256-bit encrypted petition lifecycle management.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="text-center p-3 border-r border-gray-100 last:border-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B3B24]">{stats.total.toLocaleString()}</div>
            <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Total Grievances Received</div>
          </div>
          <div className="text-center p-3 border-r border-gray-100 last:border-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{stats.resolved.toLocaleString()}</div>
            <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Grievances Resolved</div>
          </div>
          <div className="text-center p-3 border-r border-gray-100 last:border-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#D97706]">{stats.resolutionRate}%</div>
            <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Redressal Rate</div>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">{stats.satisfaction}%</div>
            <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Citizen Satisfaction</div>
          </div>
        </div>
      </section>

      {/* How It Works - 4 Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Transparent Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">
            How Your Grievance is Resolved
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            From direct submission to verified departmental completion, your petition passes through a traceable 5-stage official lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition relative">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm mb-4">
              1
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">Citizen Submission</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Submit your petition with district, photos, and details. The built-in AI Grievance Assistant assists with categorization and summary.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition relative">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm mb-4">
              2
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">CMO Screening</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Chief Minister's Office administrators review the petition, verify urgency, add instructions, and route it to the responsible department.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition relative">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm mb-4">
              3
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">Field Investigation</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Designated departmental executive officers inspect the site, mobilize corrective resources, and upload an official Action-Taken Report.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition relative">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-sm mb-4">
              4
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">Resolution & Feedback</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Petitioner receives full resolution details. Citizens can provide satisfaction star ratings or reopen the case if unsatisfied.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline"
          >
            Explore Complete Workflow & Citizens' SLA Charter <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Featured Government Departments */}
      <section className="bg-emerald-50/50 py-12 border-y border-emerald-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Integrated Public Departments</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">Featured Kerala Departments</h2>
            </div>
            <Link
              to="/departments"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
            >
              View All 9 Departments <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-emerald-300 transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                    {dept.code}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    SLA: <strong>{dept.sla_days} Days</strong>
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{dept.name}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{dept.description}</p>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold">{dept.total_grievances || 0} petitions tracked</span>
                  <Link
                    to="/citizen/submit"
                    className="text-emerald-800 hover:underline font-semibold"
                  >
                    File Petition →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14 Districts of Kerala Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Coverage Across All 14 Districts</h2>
          <p className="text-xs text-gray-600 mt-1">
            Redressal cells are established in every district collectorate across the state of Kerala.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 text-center">
          {KERALA_DISTRICTS.map((dist) => (
            <div
              key={dist}
              className="bg-white p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition cursor-default shadow-xs"
            >
              <div className="text-xs font-semibold text-gray-800">{dist}</div>
              <div className="text-[10px] text-emerald-700 font-medium mt-0.5">District Cell Active</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Redressed Case Study Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 to-[#0B3B24] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-wider uppercase">
              <Award className="w-4 h-4" />
              <span>Verified Redressal Spotlight</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              Aluva-Perumbavoor Road Hazardous Potholes Repaired
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl">
              Following citizen submission KL-CMO-2026-00101, CMO issued emergency orders to PWD Roads Division. Bituminous concrete resurfacing and culvert protection were completed in 9 days.
            </p>
          </div>
          <Link
            to="/track?ref=KL-CMO-2026-00101"
            className="bg-[#F59E0B] hover:bg-amber-500 text-slate-900 px-5 py-3 rounded-lg font-bold text-xs shrink-0 transition"
          >
            Inspect Case Audit Trail
          </Link>
        </div>
      </section>
    </div>
  );
}
