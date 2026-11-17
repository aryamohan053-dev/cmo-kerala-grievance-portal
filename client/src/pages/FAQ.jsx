import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, FileText, Sparkles, Clock, ShieldCheck } from 'lucide-react';

const FAQ_DATA = [
  {
    category: 'Grievance Submission',
    items: [
      {
        q: 'Who can submit a grievance on the CM Kerala portal?',
        a: 'Any resident of Kerala, non-resident Keralite (NRK), or registered civic association can submit a public petition. Citizens simply register with their name, mobile number, email, and district.'
      },
      {
        q: 'What types of grievances can be filed here?',
        a: 'Public infrastructure issues (PWD roads, culverts), drinking water shortages (KWA), power supply disruptions and hazardous electrical lines (KSEB), hospital amenities and medicine shortages (Health), municipal garbage/drainage (LSGD), land mutations (Revenue), and ration supplies (Civil Supplies).'
      },
      {
        q: 'Can I attach photos or documents to my grievance?',
        a: 'Yes. You can attach photographic evidence, letters, or PDF documents up to 10MB during petition submission. Supporting images greatly accelerate departmental field inspection.'
      }
    ]
  },
  {
    category: 'Tracking & Reference ID',
    items: [
      {
        q: 'How do I track the status of my submitted grievance?',
        a: 'Every petition is assigned a unique reference ID (e.g. KL-CMO-2026-XXXXX). You can visit the "Track Grievance" page anytime and enter your reference number to view the live timeline, assigned officer, and status.'
      },
      {
        q: 'Do I need to be logged in to track a petition?',
        a: 'No. The public tracking feature is open to everyone using the reference number. However, logged-in citizens get an enhanced dashboard showing all their historical petitions, remarks, and feedback ratings in one place.'
      }
    ]
  },
  {
    category: 'AI Assistant & Automation',
    items: [
      {
        q: 'What is the AI Grievance Assistant and how does it work?',
        a: 'The AI Grievance Assistant analyses your grievance description text using NLP and LLM APIs. It automatically suggests the most relevant department, recommends an urgency level (Low/Medium/High/Urgent), generates an executive summary for CMO review, and flags potential duplicates for human review.'
      },
      {
        q: 'Does the AI independently make official government decisions?',
        a: 'No. Under Kerala Government policy, all AI classifications are strictly assistive recommendations reviewable and editable by the citizen before submission and validated by CMO administrators.'
      }
    ]
  },
  {
    category: 'Timelines & Escalation',
    items: [
      {
        q: 'What are the Service Level Agreement (SLA) resolution deadlines?',
        a: 'Statutory timelines range from 5 days for KSEB electrical hazards, 7 days for drinking water and healthcare emergencies, 10 days for LSGD sanitation, and 14 days for PWD road repairs.'
      },
      {
        q: 'What happens if a department does not resolve my petition on time?',
        a: 'The portal tracks overdue deadlines. Grievances pending beyond 14 days without resolution are automatically flagged as "Overdue" and escalated directly to the Principal Secretary to the Chief Minister with highest priority.'
      },
      {
        q: 'Can I reopen a grievance if I am not satisfied with the work done?',
        a: 'Yes! Once a grievance is marked Resolved by the department, the petitioner can either rate satisfaction (1 to 5 stars) or click "Reopen Grievance" with comments if ground execution was incomplete or unsatisfactory.'
      }
    ]
  }
];

export default function FAQ() {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const filteredCategories = FAQ_DATA.map(cat => ({
    ...cat,
    items: cat.items.filter(
      item => item.q.toLowerCase().includes(search.toLowerCase()) || 
              item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Help & Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
          Find answers regarding grievance submission, tracking milestones, AI classification, and departmental SLA guidelines.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions (e.g. how to track, SLA timelines, AI assistant)..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm shadow-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-8">
        {filteredCategories.map((cat, catIdx) => (
          <div key={cat.category} className="space-y-3">
            <h2 className="text-base font-bold text-[#0B3B24] border-b border-gray-200 pb-2">
              {cat.category}
            </h2>

            <div className="space-y-2.5">
              {cat.items.map((item, itemIdx) => {
                const uniqueKey = `${catIdx}-${itemIdx}`;
                const isOpen = openIndex === uniqueKey;

                return (
                  <div
                    key={item.q}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs transition"
                  >
                    <button
                      onClick={() => toggle(uniqueKey)}
                      className="w-full text-left px-5 py-4 flex justify-between items-center gap-4 hover:bg-gray-50 transition"
                    >
                      <span className="font-semibold text-xs sm:text-sm text-gray-800 leading-snug">
                        {item.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-emerald-50/20">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-xs">
            No matching questions found for "{search}". Try searching for keywords like "track", "reference", or "SLA".
          </div>
        )}
      </div>
    </div>
  );
}
