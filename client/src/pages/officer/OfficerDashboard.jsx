import React, { useState, useEffect } from 'react';
import { 
  Building2, HardHat, Clock, CheckCircle2, AlertCircle, 
  Search, Filter, Paperclip, Send, ArrowRight, User, X, FileText
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function OfficerDashboard() {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState({ totalAssigned: 0, inProgress: 0, resolved: 0, urgent: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected Grievance Modal
  const [activeGrievance, setActiveGrievance] = useState(null);
  const [modalDetails, setModalDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form states
  const [investigationRemarks, setInvestigationRemarks] = useState('');
  const [actionTakenText, setActionTakenText] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [markResolved, setMarkResolved] = useState(true);
  const [reportFile, setReportFile] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getOfficerGrievances();
      if (res.success) {
        setGrievances(res.grievances);
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Officer load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = async (g) => {
    setActiveGrievance(g);
    setModalLoading(true);
    setActionSuccess('');
    setInvestigationRemarks('');
    setActionTakenText('');
    setResolutionSummary('');
    setReportFile(null);

    try {
      const res = await api.getGrievanceById(g.id);
      if (res.success) {
        setModalDetails(res);
      }
    } catch (err) {
      console.error('Failed to load modal details:', err);
    } finally {
      setModalLoading(false);
    }
  };

  // Submit Investigation update
  const handleInvestigationUpdate = async (e) => {
    e.preventDefault();
    if (!activeGrievance || !investigationRemarks.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.updateOfficerInvestigation(activeGrievance.id, {
        remarks: investigationRemarks,
        status: 'In Progress'
      });
      setActionSuccess(res.message);
      setInvestigationRemarks('');
      await loadData();
      const updated = await api.getGrievanceById(activeGrievance.id);
      if (updated.success) setModalDetails(updated);
    } catch (err) {
      alert(err.message || 'Failed to update investigation');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Action Taken Report (ATR)
  const handleATRSubmit = async (e) => {
    e.preventDefault();
    if (!activeGrievance || !actionTakenText.trim()) return;
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('action_taken', actionTakenText);
      data.append('resolution_summary', resolutionSummary);
      data.append('mark_resolved', markResolved ? 'true' : 'false');
      if (reportFile) {
        data.append('report_attachment', reportFile);
      }

      const res = await api.submitOfficerATR(activeGrievance.id, data);
      setActionSuccess(res.message);
      await loadData();
      const updated = await api.getGrievanceById(activeGrievance.id);
      if (updated.success) setModalDetails(updated);
    } catch (err) {
      alert(err.message || 'Failed to submit ATR');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = grievances.filter(g => {
    const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;
    const matchesSearch = 
      g.reference_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.citizen_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Submitted':
        return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[11px] font-bold">Submitted</span>;
      case 'Under Review':
        return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[11px] font-bold">Under Review</span>;
      case 'In Progress':
        return <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[11px] font-bold">In Progress</span>;
      case 'Resolved':
        return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-bold">Resolved</span>;
      case 'Reopened':
        return <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[11px] font-bold">Reopened</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[11px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Officer Header */}
      <div className="bg-[#0B2E1D] text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#F59E0B]" />
            <span className="text-xs text-[#F59E0B] font-bold uppercase tracking-wider">
              Department Executive Officer Console
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1">
            {user?.department_name || 'Government Line Department'}
          </h1>
          <p className="text-xs text-emerald-200 mt-0.5">
            Officer: <strong>{user?.name}</strong> • Designation: {user?.designation || 'Executive Engineer'}
          </p>
        </div>

        <div className="text-right text-xs bg-emerald-950/80 px-4 py-2 rounded-xl border border-emerald-800">
          <div className="text-gray-300">Department Code: <strong className="text-[#F59E0B]">{user?.department_code || 'DEPT'}</strong></div>
          <div className="text-[10px] text-gray-400">Jurisdiction: {user?.district || 'State-wide'}</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs font-semibold text-gray-500 uppercase">Assigned Petitions</div>
          <div className="text-2xl font-extrabold text-[#0B3B24] mt-1">{stats.totalAssigned}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Forwarded by CMO</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs font-semibold text-gray-500 uppercase">Active / In Progress</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{stats.inProgress}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Under Field Investigation</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs font-semibold text-gray-500 uppercase">Resolved with ATR</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.resolved}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Action Completed</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs font-semibold text-gray-500 uppercase">Urgent Priority</div>
          <div className="text-2xl font-extrabold text-red-600 mt-1">{stats.urgent}</div>
          <div className="text-[10px] text-red-600 font-semibold mt-0.5">Immediate Action Required</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Reference ID, citizen, subject..."
            className="w-full pl-9 pr-3.5 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400 font-medium">Status:</span>
          {['ALL', 'In Progress', 'Under Review', 'Resolved', 'Reopened'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                statusFilter === st ? 'bg-emerald-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Assigned Grievance Cards List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-xs">
          Loading department grievances...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 text-xs">
          No grievances currently assigned matching your filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((g) => (
            <div
              key={g.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:border-emerald-300 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-[#0B3B24]">{g.reference_no}</span>
                  {getStatusBadge(g.status)}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    g.priority === 'Urgent' ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {g.priority}
                  </span>
                </div>

                <div className="text-[11px] text-gray-500">
                  Target SLA: <strong>{g.target_resolution_date || 'Standard SLA'}</strong>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-sm leading-snug">{g.subject}</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{g.description}</p>
              </div>

              {/* CMO Forwarding Instructions */}
              {g.cmo_instructions && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs space-y-1">
                  <strong className="text-amber-900 block">CMO Direct Instructions:</strong>
                  <p className="text-amber-950">{g.cmo_instructions}</p>
                </div>
              )}

              {/* Action Taken Report if already recorded */}
              {g.officer_action_report && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs space-y-1">
                  <strong className="text-emerald-900 block">Your Action Taken Report (ATR):</strong>
                  <p className="text-emerald-950">{g.officer_action_report}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-1 border-t border-gray-100 text-xs">
                <div className="text-gray-500">
                  Petitioner: <strong>{g.citizen_name}</strong> ({g.district})
                </div>

                <button
                  onClick={() => openModal(g)}
                  className="bg-[#0D5C3A] hover:bg-emerald-800 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition"
                >
                  Investigate & Submit ATR
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Investigation & Action Taken Report Modal */}
      {activeGrievance && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <div>
                <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
                  Field Investigation & Action-Taken Dossier
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-xl font-mono font-bold text-[#0B3B24]">
                    {activeGrievance.reference_no}
                  </h2>
                  {getStatusBadge(activeGrievance.status)}
                </div>
              </div>

              <button
                onClick={() => setActiveGrievance(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold">
                ✓ {actionSuccess}
              </div>
            )}

            {modalLoading ? (
              <div className="text-center py-8 text-gray-400 text-xs">Loading case dossier...</div>
            ) : modalDetails && (
              <div className="space-y-6">
                {/* Complaint Summary */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
                  <div className="font-bold text-gray-900 text-sm">{modalDetails.grievance.subject}</div>
                  <div className="text-gray-600">
                    District: <strong>{modalDetails.grievance.district}</strong> • Citizen: <strong>{modalDetails.grievance.citizen_name}</strong> ({modalDetails.grievance.citizen_phone || 'N/A'})
                  </div>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed pt-1">
                    {modalDetails.grievance.description}
                  </p>
                </div>

                {/* Attachments */}
                {modalDetails.attachments && modalDetails.attachments.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-gray-700 uppercase">Citizen Photographic Evidence:</div>
                    <div className="flex flex-wrap gap-2">
                      {modalDetails.attachments.map(att => (
                        <a
                          key={att.id}
                          href={att.file_path}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-xs px-3 py-1.5 rounded-lg border border-gray-200"
                        >
                          <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{att.file_name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form 1: Add Interim Investigation Remarks */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-xs">
                  <h4 className="font-bold text-gray-900 text-sm">Add Field Investigation Progress Note</h4>
                  <form onSubmit={handleInvestigationUpdate} className="space-y-3">
                    <textarea
                      rows={2}
                      value={investigationRemarks}
                      onChange={(e) => setInvestigationRemarks(e.target.value)}
                      placeholder="e.g. Engineering inspection conducted today. Sample testing ordered..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    ></textarea>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        Update Progress Log
                      </button>
                    </div>
                  </form>
                </div>

                {/* Form 2: Submit Action Taken Report (ATR) */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 space-y-4">
                  <div>
                    <h4 className="font-bold text-[#0B3B24] text-sm">Submit Official Action-Taken Report (ATR)</h4>
                    <p className="text-xs text-gray-500">
                      Enter full details of physical repairs, administrative sanctions, or field corrective measures.
                    </p>
                  </div>

                  <form onSubmit={handleATRSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Physical Action Taken *</label>
                      <textarea
                        required
                        rows={3}
                        value={actionTakenText}
                        onChange={(e) => setActionTakenText(e.target.value)}
                        placeholder="e.g. 40mm wet-mix macadam base laid followed by bituminous concrete resurfacing of 2km stretch. Culvert guard rails restored."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Resolution Summary Note</label>
                      <input
                        type="text"
                        value={resolutionSummary}
                        onChange={(e) => setResolutionSummary(e.target.value)}
                        placeholder="e.g. Stretch is fully motorable and traffic opened."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Upload Completion Report / Inspection Photo
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setReportFile(e.target.files[0] || null)}
                        accept="image/*,.pdf,.doc,.docx"
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="markResolvedCheck"
                        checked={markResolved}
                        onChange={(e) => setMarkResolved(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <label htmlFor="markResolvedCheck" className="text-xs font-semibold text-gray-800">
                        Mark Grievance as Resolved upon submitting this report
                      </label>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#0D5C3A] hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-sm transition"
                      >
                        {submitting ? 'Submitting Report...' : 'Submit Action Taken Report to CMO'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
