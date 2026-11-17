import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, ShieldAlert, CheckCircle2, Clock, Building2, 
  User, FileText, ArrowLeft, Star, AlertCircle, Paperclip, MessageSquare
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TrackGrievance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';
  const { user } = useAuth();

  const [refInput, setRefInput] = useState(initialRef);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const fetchTracking = async (refNo) => {
    if (!refNo.trim()) return;
    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await api.trackGrievance(refNo.trim());
      if (res.success) {
        setData(res);
      } else {
        setError(res.error || 'Grievance not found');
      }
    } catch (err) {
      setError(err.message || 'Unable to find grievance with this reference number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      fetchTracking(initialRef);
    }
  }, [initialRef]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (refInput.trim()) {
      setSearchParams({ ref: refInput.trim() });
      fetchTracking(refInput.trim());
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Submitted':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">Submitted</span>;
      case 'Under Review':
        return <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">Under Review</span>;
      case 'In Progress':
        return <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold">In Progress</span>;
      case 'Resolved':
        return <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">Resolved</span>;
      case 'Reopened':
        return <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold">Reopened</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return <span className="bg-red-600 text-white px-2.5 py-0.5 rounded text-[11px] font-bold">URGENT</span>;
      case 'High':
        return <span className="bg-orange-500 text-white px-2.5 py-0.5 rounded text-[11px] font-bold">HIGH</span>;
      case 'Medium':
        return <span className="bg-blue-500 text-white px-2.5 py-0.5 rounded text-[11px] font-semibold">MEDIUM</span>;
      default:
        return <span className="bg-gray-500 text-white px-2.5 py-0.5 rounded text-[11px] font-medium">LOW</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Public Petition Tracking
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Track Grievance Status
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
          Enter your unique reference number generated at the time of submission to view real-time investigation updates.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              placeholder="e.g. KL-CMO-2026-00101"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none uppercase font-mono tracking-wider"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0D5C3A] hover:bg-emerald-800 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-sm transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track Petition'}
          </button>
        </form>

        {/* Quick Sample Links */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
          <span className="font-semibold">Quick Demos:</span>
          <button
            type="button"
            onClick={() => {
              setRefInput('KL-CMO-2026-00101');
              setSearchParams({ ref: 'KL-CMO-2026-00101' });
            }}
            className="text-emerald-700 hover:underline"
          >
            KL-CMO-2026-00101 (Resolved PWD)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setRefInput('KL-CMO-2026-00102');
              setSearchParams({ ref: 'KL-CMO-2026-00102' });
            }}
            className="text-emerald-700 hover:underline"
          >
            KL-CMO-2026-00102 (In Progress KWA)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setRefInput('KL-CMO-2026-00103');
              setSearchParams({ ref: 'KL-CMO-2026-00103' });
            }}
            className="text-emerald-700 hover:underline"
          >
            KL-CMO-2026-00103 (Under Review Health)
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">No petition found</div>
            <div className="text-xs mt-0.5">{error}</div>
          </div>
        </div>
      )}

      {/* Tracking Results */}
      {data && data.grievance && (
        <div className="space-y-6 animate-in fade-in">
          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Top Bar */}
            <div className="bg-[#0B3B24] text-white px-6 py-4 flex flex-wrap justify-between items-center gap-3">
              <div>
                <span className="text-xs text-[#F59E0B] font-bold uppercase tracking-wider">Official Grievance Dossier</span>
                <div className="text-xl font-mono font-bold">{data.grievance.reference_no}</div>
              </div>
              <div className="flex items-center gap-3">
                {getPriorityBadge(data.grievance.priority)}
                {getStatusBadge(data.grievance.status)}
              </div>
            </div>

            {/* Grievance Details Body */}
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-snug">
                  {data.grievance.subject}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                  <span>District: <strong>{data.grievance.district}</strong></span>
                  <span>Category: <strong>{data.grievance.category}</strong></span>
                  <span>Submitted: <strong>{new Date(data.grievance.created_at).toLocaleString()}</strong></span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Detailed Complaint Description:</div>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {data.grievance.description}
                </p>
              </div>

              {/* AI Classification & Summary */}
              {data.grievance.ai_summary && (
                <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-xl space-y-1.5">
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <span>AI Assistant Executive Summary:</span>
                  </div>
                  <p className="text-xs text-emerald-950 leading-relaxed">
                    {data.grievance.ai_summary}
                  </p>
                </div>
              )}

              {/* Assigned Department Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
                  <div className="text-xs text-gray-500 font-semibold uppercase">Assigned Department</div>
                  <div className="text-sm font-bold text-gray-900">
                    {data.grievance.department_name || data.grievance.ai_suggested_dept || 'Pending CMO Allocation'}
                  </div>
                  {data.grievance.sla_days && (
                    <div className="text-[11px] text-emerald-700 font-medium">Standard SLA: {data.grievance.sla_days} Days</div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
                  <div className="text-xs text-gray-500 font-semibold uppercase">Designated Officer</div>
                  <div className="text-sm font-bold text-gray-900">
                    {data.grievance.officer_name || 'Assigned to Nodal Division'}
                  </div>
                  {data.grievance.officer_designation && (
                    <div className="text-[10px] text-gray-500">{data.grievance.officer_designation}</div>
                  )}
                </div>
              </div>

              {/* CMO Remarks if any */}
              {data.grievance.cmo_remarks && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-1 text-xs">
                  <div className="font-bold text-amber-900">Chief Minister's Office (CMO) Instructions:</div>
                  <p className="text-amber-950 leading-relaxed">{data.grievance.cmo_remarks}</p>
                </div>
              )}

              {/* Action Taken Report (ATR) if resolved or reported */}
              {data.grievance.officer_action_report && (
                <div className="bg-emerald-950 text-white p-5 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Official Action-Taken Report (ATR)</span>
                  </div>
                  <p className="text-xs text-emerald-100 whitespace-pre-line leading-relaxed">
                    {data.grievance.officer_action_report}
                  </p>
                  {data.grievance.resolved_at && (
                    <div className="text-[10px] text-emerald-300 pt-1">
                      Verified & Resolved on: {new Date(data.grievance.resolved_at).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              {/* Attachments */}
              {data.attachments && data.attachments.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Uploaded Documents & Photos:</div>
                  <div className="flex flex-wrap gap-2">
                    {data.attachments.map((att) => (
                      <a
                        key={att.id}
                        href={att.file_path}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1.5 rounded-lg border border-gray-200 transition"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="max-w-[200px] truncate">{att.file_name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chronological Status Audit Trail Stepper */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-base">
              Chronological Audit Trail & Status History
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {data.history && data.history.map((hist, i) => (
                <div key={hist.id} className="relative space-y-1">
                  <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white"></span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs text-gray-900">{hist.action}</span>
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-medium text-gray-600">
                      {hist.to_status}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(hist.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    By: {hist.performed_by_name} ({hist.performed_by_role})
                  </div>
                  {hist.remarks && (
                    <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mt-1">
                      {hist.remarks}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Feedback View */}
          {data.feedback && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-2">
              <h3 className="font-bold text-gray-900 text-sm">Petitioner Satisfaction Feedback</h3>
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= data.feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-xs font-bold text-gray-700 ml-2">
                  {data.feedback.rating} / 5 Stars
                </span>
              </div>
              {data.feedback.feedback_text && (
                <p className="text-xs text-gray-600 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                  "{data.feedback.feedback_text}"
                </p>
              )}
            </div>
          )}

          {/* Action Callout if logged in user owns this */}
          {user && user.role === 'citizen' && (
            <div className="text-center pt-2">
              <Link
                to="/citizen/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Citizen Dashboard
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
