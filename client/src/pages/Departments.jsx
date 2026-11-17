import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, Clock, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDepts() {
      try {
        const res = await api.getDepartments();
        if (res.success) {
          setDepartments(res.departments);
        }
      } catch (err) {
        console.error('Failed to load departments:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDepts();
  }, []);

  const filtered = departments.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase()) ||
    d.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Government Directory
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
            Integrated Government Departments
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Browse official state departments integrated with the Chief Minister's Public Grievance Portal.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search departments..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          Loading official government department directory...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded bg-[#0B3B24] text-[#F59E0B] font-bold text-xs tracking-wider">
                    {dept.code}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium bg-gray-100 px-2.5 py-0.5 rounded">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    SLA: <strong>{dept.sla_days} Days</strong>
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-base leading-snug">{dept.name}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{dept.description}</p>

                {/* Officer & Contact Details */}
                <div className="bg-gray-50 p-3 rounded-lg space-y-1.5 text-xs border border-gray-100">
                  <div className="font-semibold text-gray-800 text-[11px]">
                    Nodal Authority: {dept.officer_name || 'Designated Chief Engineer / DMO'}
                  </div>
                  {dept.officer_designation && (
                    <div className="text-[10px] text-gray-500">{dept.officer_designation}</div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600 text-[11px] pt-1 border-t border-gray-200/60">
                    <Mail className="w-3 h-3 text-emerald-700" />
                    <span>{dept.nodal_email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-[11px]">
                    <Phone className="w-3 h-3 text-emerald-700" />
                    <span>Helpline: {dept.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="text-gray-500">
                  <strong className="text-emerald-700">{dept.total_grievances || 0}</strong> petitions logged
                </div>
                <Link
                  to="/citizen/submit"
                  className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 transition"
                >
                  File Grievance <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
