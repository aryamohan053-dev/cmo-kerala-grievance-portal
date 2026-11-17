import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, PhoneCall, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B2E1D] text-gray-300 text-sm border-t border-emerald-900 mt-16">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-[#0B3B24] font-extrabold flex items-center justify-center text-base">
                KL
              </div>
              <div>
                <div className="font-bold text-white text-base leading-snug">CM KERALA</div>
                <div className="text-xs text-emerald-300">Public Grievance Redressal</div>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Official Grievance Redressal Portal of the Chief Minister's Office, Government of Kerala. Dedicated to responsive, transparent, and citizen-first governance.
            </p>
            <div className="text-[11px] text-amber-300 bg-emerald-950/80 p-2.5 rounded border border-emerald-800">
              <strong>Mandatory Assessment Prototype:</strong> Built for WhiteMatrix Software Solutions Machine Test Assignment.
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 border-b border-emerald-800/80 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-amber-400 transition">Portal Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition">About the Initiative</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-amber-400 transition">Workflow & Citizens' Charter</Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-amber-400 transition">Government Departments</Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-amber-400 transition">Track Existing Grievance</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-400 transition">Frequently Asked Questions</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Departments */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 border-b border-emerald-800/80 pb-2">
              Integrated Departments
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>• Public Works Department (PWD Roads)</li>
              <li>• Health & Family Welfare</li>
              <li>• Local Self Government (LSGD)</li>
              <li>• Kerala Water Authority (KWA)</li>
              <li>• Kerala State Electricity Board (KSEB)</li>
              <li>• Revenue & Land Records</li>
              <li>• Food & Civil Supplies</li>
            </ul>
          </div>

          {/* Col 4: Helpdesk & Secretarial Address */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 border-b border-emerald-800/80 pb-2">
              CMO Grievance Cell
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Government Secretariat, Statue, Thiruvananthapuram, Kerala - 695001</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Helpline: <strong>0471-2333812 / 1076</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>cmo.grievance@kerala.gov.in</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#071f14] py-4 text-xs text-gray-400 border-t border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            © 2026 Government of Kerala. All rights reserved.
          </div>
          <div className="text-[11px] text-gray-400">
            WhiteMatrix Recruitment Assessment • AI Full Stack Prototype
          </div>
        </div>
      </div>
    </footer>
  );
}
