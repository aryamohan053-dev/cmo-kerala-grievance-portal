import React from 'react';
import { 
  FileCheck2, Sparkles, Building2, HardHat, CheckCircle, 
  RotateCcw, Clock, AlertTriangle, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Citizen Submits Petition',
      actor: 'Citizen Petitioner',
      desc: 'Citizen registers and submits complaint details, chooses district, adds photos or document attachments, and optionally reviews AI categorization and summary.',
      badge: 'Status: Submitted',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      num: '02',
      title: 'Unique Reference & AI Triaging',
      actor: 'Automated Portal System',
      desc: 'A tamper-proof unique tracking ID (e.g. KL-CMO-2026-XXXXX) is generated immediately. The AI assistant extracts a summary, checks duplicate petitions, and computes priority.',
      badge: 'Status: Under Review',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      num: '03',
      title: 'CMO Review & Department Routing',
      actor: 'CMO Administrator',
      desc: 'Authorized CMO administrators review the grievance, attach internal directions, set target SLA resolution dates, and assign the case to the relevant nodal department.',
      badge: 'Status: In Progress',
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      num: '04',
      title: 'Field Investigation & ATR Submission',
      actor: 'Department Executive Officer',
      desc: 'Line department engineers/officers conduct on-site inspection, execute corrective works, record progress logs, and submit an official Action-Taken Report (ATR) with photo proof.',
      badge: 'Status: Action Taken',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      num: '05',
      title: 'Resolution, Verification & Feedback',
      actor: 'CMO & Citizen',
      desc: 'CMO verifies resolution quality and marks petition as Resolved. The citizen can rate satisfaction (1-5 stars) or reopen the grievance if field work was incomplete.',
      badge: 'Status: Resolved / Reopened',
      badgeColor: 'bg-green-100 text-green-800'
    }
  ];

  const statuses = [
    { name: 'Submitted', color: 'bg-blue-500', desc: 'Newly registered by citizen; queued for CMO initial screening.' },
    { name: 'Under Review', color: 'bg-amber-500', desc: 'Active CMO scrutiny or inter-departmental verification underway.' },
    { name: 'In Progress', color: 'bg-indigo-500', desc: 'Assigned to field officers; ground inspection or repair works active.' },
    { name: 'Resolved', color: 'bg-emerald-500', desc: 'Corrective action verified by ATR and confirmed by administration.' },
    { name: 'Reopened', color: 'bg-rose-500', desc: 'Citizen flagged incomplete resolution; case returned to CMO priority queue.' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Step-by-Step Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Mandatory Grievance Lifecycle Workflow
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Every petition submitted to the Chief Minister's Office adheres to an end-to-end, traceable, and audited administrative sequence.
        </p>
      </div>

      {/* Stepper Visual Workflow */}
      <div className="space-y-6">
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div 
              key={step.num}
              className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-xs hover:border-emerald-300 transition flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="w-14 h-14 rounded-xl bg-emerald-900 text-[#F59E0B] font-extrabold text-lg flex items-center justify-center shrink-0 shadow-xs">
                {step.num}
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900">{step.title}</h3>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${step.badgeColor}`}>
                    {step.badge}
                  </span>
                </div>
                <div className="text-xs text-emerald-700 font-medium">Actor: {step.actor}</div>
                <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:flex text-gray-300">
                  <ChevronRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lifecycle Status Matrix */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900">Lifecycle Status Definitions</h2>
          <p className="text-xs text-gray-500">Every grievance transition is logged in the immutable audit history with actor timestamp.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statuses.map((s) => (
            <div key={s.name} className="p-4 rounded-lg bg-gray-50 border border-gray-100 space-y-2">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${s.color}`}></span>
                <span className="font-bold text-sm text-gray-900">{s.name}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SLA Timelines Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Statutory Department SLA Timelines</h2>
          <p className="text-xs text-gray-500 mt-1">If resolution exceeds these timeframes, CMO escalates the petition with highest priority.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-800 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Scope of Grievances</th>
                <th className="px-6 py-3.5">Resolution SLA</th>
                <th className="px-6 py-3.5">Escalation Trigger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-3.5 font-bold text-gray-900">Public Works Department (PWD)</td>
                <td className="px-6 py-3.5">Road potholes, culverts, bridge damages, public buildings</td>
                <td className="px-6 py-3.5 text-emerald-700 font-semibold">14 Days</td>
                <td className="px-6 py-3.5 text-red-600">Overdue &gt; 14 Days</td>
              </tr>
              <tr>
                <td className="px-6 py-3.5 font-bold text-gray-900">Health & Family Welfare</td>
                <td className="px-6 py-3.5">Hospital medicines, doctors, emergency supplies, sanitation</td>
                <td className="px-6 py-3.5 text-emerald-700 font-semibold">7 Days</td>
                <td className="px-6 py-3.5 text-red-600">Overdue &gt; 7 Days</td>
              </tr>
              <tr>
                <td className="px-6 py-3.5 font-bold text-gray-900">Kerala State Electricity Board (KSEB)</td>
                <td className="px-6 py-3.5">Tilted electric poles, live hanging wires, transformer faults</td>
                <td className="px-6 py-3.5 text-emerald-700 font-semibold">5 Days (Urgent: 24h)</td>
                <td className="px-6 py-3.5 text-red-600">Overdue &gt; 5 Days</td>
              </tr>
              <tr>
                <td className="px-6 py-3.5 font-bold text-gray-900">Kerala Water Authority (KWA)</td>
                <td className="px-6 py-3.5">Piped water burst, contamination, supply disruption</td>
                <td className="px-6 py-3.5 text-emerald-700 font-semibold">7 Days</td>
                <td className="px-6 py-3.5 text-red-600">Overdue &gt; 7 Days</td>
              </tr>
              <tr>
                <td className="px-6 py-3.5 font-bold text-gray-900">Local Self Government (LSGD)</td>
                <td className="px-6 py-3.5">Garbage accumulation, clogged drains, streetlights, permits</td>
                <td className="px-6 py-3.5 text-emerald-700 font-semibold">10 Days</td>
                <td className="px-6 py-3.5 text-red-600">Overdue &gt; 10 Days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center bg-emerald-50 border border-emerald-200 rounded-xl p-8 space-y-4">
        <h3 className="text-lg font-bold text-[#0B3B24]">Ready to submit a grievance?</h3>
        <p className="text-xs text-gray-600 max-w-md mx-auto">
          Sign in or register to submit your petition directly with photos and automated AI categorization.
        </p>
        <Link
          to="/citizen/submit"
          className="inline-block bg-[#0D5C3A] hover:bg-emerald-800 text-white px-6 py-3 rounded-lg font-bold text-xs shadow-sm transition"
        >
          Submit a Public Grievance Now
        </Link>
      </div>
    </div>
  );
}
