import React from 'react';
import { Shield, Target, Eye, Compass, CheckCircle2, Award, Users, Scale } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Government of Kerala Initiative
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          About the Chief Minister's Public Grievance Portal
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Established under the direct oversight of the Chief Minister's Office (CMO) to institutionalize transparent, responsive, and accountable governance across the State of Kerala.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Our Vision</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            To build a barrier-free digital bridge between every citizen of Kerala and the highest administrative office of the State, ensuring that no legitimate public grievance goes unheard, unattended, or unredressed.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            To deploy state-of-the-art AI-assisted screening, time-bound departmental assignments, real-time tracking, and verified Action-Taken Reports (ATRs) to resolve public service bottlenecks with zero tolerance for administrative delay.
          </p>
        </div>
      </div>

      {/* Core Objectives */}
      <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-[#0B3B24]">Key Strategic Objectives</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-gray-900">Direct Citizen Empowerment</h3>
              <p className="text-xs text-gray-600 mt-1">
                Enable any resident across 14 Kerala districts to petition the CMO without intermediaries, touts, or bureaucratic friction.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-gray-900">Inter-Departmental SLA Accountability</h3>
              <p className="text-xs text-gray-600 mt-1">
                Impose strict Service Level Agreement (SLA) timelines on line departments (PWD, Health, KSEB, KWA, etc.) backed by automatic CMO escalation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-gray-900">AI-Powered Rapid Triaging</h3>
              <p className="text-xs text-gray-600 mt-1">
                Utilize intelligent Natural Language Processing to categorize complaints, recommend priority, generate executive summaries, and flag duplicates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-gray-900">Transparent Lifecycle Auditing</h3>
              <p className="text-xs text-gray-600 mt-1">
                Maintain an immutable audit history with timestamps, responsible officer designations, and citizen satisfaction ratings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Structure */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Institutional Governance Framework</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-600 space-y-3 leading-relaxed">
          <p>
            The Grievance Redressal Cell operates directly within the <strong>Chief Minister's Office, Government Secretariat, Thiruvananthapuram</strong>, under the supervision of the Principal Secretary to the Chief Minister.
          </p>
          <p>
            Petitions submitted via this portal are screened by CMO grievance officers, synchronized with District Collectorates, and routed directly to executive engineers, medical officers, and department secretaries for on-ground resolution.
          </p>
        </div>
      </div>
    </div>
  );
}
