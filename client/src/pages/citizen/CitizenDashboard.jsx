import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Plus, Search, Filter, Clock, CheckCircle2, AlertCircle, 
  RotateCcw, Star, Paperclip, ChevronRight, MessageSquare, ShieldAlert
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState({ total: 0, submitted: 0, inProgress: 0, resolved: 0, reopened: 0 });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Feedback Modal State
  const [feedbackModal, setFeedbackModal] = useState({ open: false, grievance: null, rating: 5, comments: '' });
  // Reopen Modal State
  const [reopenModal, setReopenModal] = useState({ open: false, grievance: null, remarks: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const loadData = async () => {
    try {
      const res = await api.getMyGrievances();
      if (res.success) {
        setGrievances(res.grievances);
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load citizen grievances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackModal.grievance) return;
    setActionLoading(true);
    try {
      await api.submitFeedback(feedbackModal.grievance.id, {
        rating: feedbackModal.rating,
        feedback_text: feedbackModal.comments
      });
      setMsg('Thank you! Your feedback has been recorded.');
      setFeedbackModal({ open: false, grievance: null, rating: 5, comments: '' });
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to submit feedback');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReopenSubmit = async (e) => {
    e.preventDefault();
    if (!reopenModal.grievance) return;
    setActionLoading(true);
    try {
      await api.reopenGrievance(reopenModal.grievance.id, reopenModal.remarks);
      setMsg('Grievance reopened successfully and queued back to CMO scrutiny.');
      setReopenModal({ open: false, grievance: null, remarks: '' });
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to reopen grievance');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredGrievances = grievances.filter(g => {
    const matchesStatus = filterStatus === 'ALL' || g.status === filterStatus;
    const matchesSearch = 
      g.reference_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.department_name && g.department_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Submitted':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded text-[11px] font-bold">Submitted</span>;
      case 'Under Review':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded text-[11px] font-bold">Under Review</span>;
      case 'In Progress':
        return <span className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded text-[11px] font-bold">In Progress</span>;
      case 'Resolved':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded text-[11px] font-bold">Resolved</span>;
      case 'Reopened':
        return <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded text-[11px] font-bold">Reopened</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded text-[11px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Citizen Grievance Cell
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-gray-500">
            Registered District: <strong>{user?.district || 'Kerala'}</strong> • Track your submitted petitions below.
          </p>
        </div>

        <Link
          to="/citizen/submit"
          className="bg-[#0D5C3A] hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-sm transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Submit New Grievance
        </Link>
      </div>

      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs flex justify-between items-center">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="text-emerald-950 font-bold">×</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div 
          onClick={() => setFilterStatus('ALL')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            filterStatus === 'ALL' ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-gray-200 hover:border-emerald-300'
          }`}
        >
          <div className="text-xl sm:text-2xl font-extrabold text-gray-900">{stats.total}</div>
          <div className="text-[11px] font-semibold text-gray-500 uppercase mt-0.5">Total Petitions</div>
        </div>

        <div 
          onClick={() => setFilterStatus('Submitted')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            filterStatus === 'Submitted' ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="text-xl sm:text-2xl font-extrabold text-blue-600">{stats.submitted}</div>
          <div className="text-[11px] font-semibold text-gray-500 uppercase mt-0.5">Submitted</div>
        </div>

        <div 
          onClick={() => setFilterStatus('In Progress')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            filterStatus === 'In Progress' ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-gray-200 hover:border-indigo-300'
          }`}
        >
          <div className="text-xl sm:text-2xl font-extrabold text-indigo-600">{stats.inProgress}</div>
          <div className="text-[11px] font-semibold text-gray-500 uppercase mt-0.5">In Progress</div>
        </div>

        <div 
          onClick={() => setFilterStatus('Resolved')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            filterStatus === 'Resolved' ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-gray-200 hover:border-emerald-300'
          }`}
        >
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">{stats.resolved}</div>
          <div className="text-[11px] font-semibold text-gray-500 uppercase mt-0.5">Resolved</div>
        </div>

        <div 
          onClick={() => setFilterStatus('Reopened')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            filterStatus === 'Reopened' ? 'bg-rose-50 border-rose-500' : 'bg-white border-gray-200 hover:border-rose-300'
          }`}
        >
          <div className="text-xl sm:text-2xl font-extrabold text-rose-600">{stats.reopened}</div>
          <div className="text-[11px] font-semibold text-gray-500 uppercase mt-0.5">Reopened</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Reference ID, subject..."
            className="w-full pl-9 pr-3.5 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs overflow-x-auto w-full sm:w-auto">
          <span className="text-gray-400 font-medium">Filter:</span>
          {['ALL', 'Submitted', 'In Progress', 'Resolved', 'Reopened'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-md font-semibold transition shrink-0 ${
                filterStatus === st ? 'bg-emerald-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grievances List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-xs">
          Loading your submitted petitions...
        </div>
      ) : filteredGrievances.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-800 text-sm">No Grievances Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchTerm || filterStatus !== 'ALL'
              ? 'No petitions match your current search or filter criteria.'
              : 'You have not submitted any grievances yet. Click below to file your first petition.'}
          </p>
          <Link
            to="/citizen/submit"
            className="inline-block bg-[#0D5C3A] text-white px-4 py-2 rounded-lg text-xs font-semibold mt-2"
          >
            Submit a Grievance
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGrievances.map((g) => (
            <div
              key={g.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:border-emerald-300 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-[#0B3B24]">
                    {g.reference_no}
                  </span>
                  {getStatusBadge(g.status)}
                  <span className="text-[11px] text-gray-400 font-medium">
                    District: <strong>{g.district}</strong>
                  </span>
                </div>
                <div className="text-[11px] text-gray-400">
                  Logged on: {new Date(g.created_at).toLocaleDateString()}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-sm leading-snug">{g.subject}</h3>
                <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">
                  {g.description}
                </p>
              </div>

              {/* Department & Remarks Strip */}
              <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1.5 border border-gray-100">
                <div className="flex justify-between items-center text-gray-700">
                  <span>Department: <strong>{g.department_name || g.ai_suggested_dept || 'Pending CMO Review'}</strong></span>
                  <span className="text-amber-700 font-semibold">Priority: {g.priority}</span>
                </div>

                {g.cmo_remarks && (
                  <div className="text-[11px] text-amber-900 bg-amber-50/80 p-2 rounded border border-amber-200/60">
                    <strong>CMO Remarks:</strong> {g.cmo_remarks}
                  </div>
                )}

                {g.officer_action_report && (
                  <div className="text-[11px] text-emerald-950 bg-emerald-50 p-2 rounded border border-emerald-200/80">
                    <strong>Action Taken Report (ATR):</strong> {g.officer_action_report}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/track?ref=${encodeURIComponent(g.reference_no)}`}
                    className="font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
                  >
                    View Complete Audit Trail <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Rating or Reopen actions */}
                <div className="flex items-center gap-2">
                  {g.status === 'Resolved' && (
                    <>
                      {g.feedback_rating ? (
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>Rated: {g.feedback_rating} / 5</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setFeedbackModal({ open: true, grievance: g, rating: 5, comments: '' })}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1 transition"
                        >
                          <Star className="w-3.5 h-3.5" />
                          Rate Resolution
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setReopenModal({ open: true, grievance: g, remarks: '' })}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reopen Petition
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-gray-900 text-base">Rate Resolution Satisfaction</h3>
            <p className="text-xs text-gray-600">
              Petition: <strong>{feedbackModal.grievance?.reference_no}</strong>
            </p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Rating (1 to 5 Stars):</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFeedbackModal(prev => ({ ...prev, rating: num }))}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star className={`w-7 h-7 ${num <= feedbackModal.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-2">{feedbackModal.rating} of 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Feedback Comments (Optional):</label>
                <textarea
                  rows={3}
                  value={feedbackModal.comments}
                  onChange={(e) => setFeedbackModal(prev => ({ ...prev, comments: e.target.value }))}
                  placeholder="Share details regarding the quality and timeliness of the repair or departmental action..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModal({ open: false, grievance: null, rating: 5, comments: '' })}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-[#0D5C3A] hover:bg-emerald-800 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-sm transition"
                >
                  {actionLoading ? 'Saving...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reopen Modal */}
      {reopenModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-gray-900 text-base">Reopen Grievance Petition</h3>
            <p className="text-xs text-gray-600">
              Petition: <strong>{reopenModal.grievance?.reference_no}</strong>
            </p>
            <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              Please explain why the departmental resolution was inadequate or incomplete. The case will be escalated back to CMO administrators.
            </p>

            <form onSubmit={handleReopenSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Reason for Reopening *</label>
                <textarea
                  required
                  rows={4}
                  value={reopenModal.remarks}
                  onChange={(e) => setReopenModal(prev => ({ ...prev, remarks: e.target.value }))}
                  placeholder="e.g. Contractor only filled minor potholes and left the broken culvert untouched, leading to continued flooding..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReopenModal({ open: false, grievance: null, remarks: '' })}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-sm transition"
                >
                  {actionLoading ? 'Reopening...' : 'Confirm Reopen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
