import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle2, Clock, Filter, 
  Search, Building2, User, FileText, ChevronRight, X, 
  Send, AlertCircle, ArrowUpRight, BarChart3, PieChart as PieIcon, RefreshCw, Paperclip
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const KERALA_DISTRICTS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur',
  'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad',
  'Kannur', 'Kasaragod'
];

const COLORS = ['#0D5C3A', '#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'];

export default function CMODashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Grievance for Detail/Action Modal
  const [activeModalGrievance, setActiveModalGrievance] = useState(null);
  const [modalDetails, setModalDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form states inside modal
  const [assignDeptId, setAssignDeptId] = useState('');
  const [assignInstructions, setAssignInstructions] = useState('');
  const [assignPriority, setAssignPriority] = useState('Medium');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [escalateReason, setEscalateReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, analyticsRes, deptsRes] = await Promise.all([
        api.getCMOStats(),
        api.getCMOAnalytics(),
        api.getDepartments()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
      if (deptsRes.success) setDepartments(deptsRes.departments);

      await fetchGrievances();
    } catch (err) {
      console.error('CMO Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrievances = async () => {
    try {
      const params = {};
      if (filterDistrict) params.district = filterDistrict;
      if (filterDept) params.department_id = filterDept;
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;
      if (filterOverdue) params.is_overdue = 'true';
      if (searchTerm) params.search = searchTerm;

      const res = await api.listCMOGrievances(params);
      if (res.success) {
        setGrievances(res.grievances);
      }
    } catch (err) {
      console.error('List grievances error:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    fetchGrievances();
  }, [filterDistrict, filterDept, filterStatus, filterPriority, filterOverdue]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchGrievances();
  };

  // Open detail / action modal
  const openActionModal = async (g) => {
    setActiveModalGrievance(g);
    setModalLoading(true);
    setActionSuccess('');
    setAssignDeptId(g.department_id || '');
    setAssignInstructions('');
    setAssignPriority(g.priority || 'Medium');
    setStatusUpdate(g.status);
    setAdminRemarks('');
    setEscalateReason('');

    try {
      const res = await api.getGrievanceById(g.id);
      if (res.success) {
        setModalDetails(res);
      }
    } catch (err) {
      console.error('Fetch modal details error:', err);
    } finally {
      setModalLoading(false);
    }
  };

  // Action: Forward to Department
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!activeModalGrievance || !assignDeptId) return;
    try {
      const res = await api.forwardGrievance(activeModalGrievance.id, {
        department_id: assignDeptId,
        instructions: assignInstructions,
        priority: assignPriority
      });
      setActionSuccess(res.message);
      await loadData();
      const updated = await api.getGrievanceById(activeModalGrievance.id);
      if (updated.success) setModalDetails(updated);
    } catch (err) {
      alert(err.message || 'Failed to forward grievance');
    }
  };

  // Action: Status Update
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!activeModalGrievance || !statusUpdate) return;
    try {
      const res = await api.updateCMOStatus(activeModalGrievance.id, {
        status: statusUpdate,
        remarks: adminRemarks
      });
      setActionSuccess(res.message);
      await loadData();
      const updated = await api.getGrievanceById(activeModalGrievance.id);
      if (updated.success) setModalDetails(updated);
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Action: Escalate delayed grievance
  const handleEscalateSubmit = async () => {
    if (!activeModalGrievance) return;
    try {
      const res = await api.escalateGrievance(activeModalGrievance.id, escalateReason || 'Overdue beyond statutory SLA.');
      setActionSuccess(res.message);
      await loadData();
      const updated = await api.getGrievanceById(activeModalGrievance.id);
      if (updated.success) setModalDetails(updated);
    } catch (err) {
      alert(err.message || 'Failed to escalate grievance');
    }
  };

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

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">URGENT</span>;
      case 'High':
        return <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">HIGH</span>;
      case 'Medium':
        return <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-[10px] font-medium">MEDIUM</span>;
      default:
        return <span className="bg-gray-500 text-white px-2 py-0.5 rounded text-[10px] font-medium">LOW</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0B3B24] text-white p-6 rounded-2xl shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#F59E0B]" />
            <span className="text-xs text-[#F59E0B] font-bold uppercase tracking-wider">
              Chief Minister's Office (CMO) Administration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Central Administrative Command Console
          </h1>
          <p className="text-xs text-emerald-200 mt-1">
            Administrator: <strong>{user?.name}</strong> • State Secretariat, Thiruvananthapuram
          </p>
        </div>

        <button
          onClick={loadData}
          className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 border border-white/20 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Live Data
        </button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Total Petitions</div>
            <div className="text-2xl font-extrabold text-[#0B3B24] mt-1">{stats.total}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Logged across Kerala</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Pending Review</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{stats.pending}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Submitted / Under Review</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">In Progress</div>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">{stats.inProgress}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Under Field Action</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Resolved</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.resolved}</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">{stats.resolutionRate}% Success Rate</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Overdue (&gt;14d)</div>
            <div className="text-2xl font-extrabold text-red-600 mt-1">{stats.overdue}</div>
            <div className="text-[10px] text-red-600 font-semibold mt-0.5">Requires Escalation</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Avg Redressal</div>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">{stats.averageDays}d</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Satisfaction: {stats.satisfactionRate}%</div>
          </div>
        </div>
      )}

      {/* Analytics Charts (District-wise & Department-wise) */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* District Breakdown Chart */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">District-Wise Grievance Distribution</h3>
                <p className="text-xs text-gray-500">Live caseload across all 14 Kerala districts</p>
              </div>
              <span className="text-[11px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                14 Districts
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.districtStats} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <XAxis dataKey="district" angle={-45} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="total" name="Total Petitions" fill="#0D5C3A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Breakdown Donut */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Department Caseload</h3>
              <p className="text-xs text-gray-500">Petitions routed to line departments</p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.departmentStats.filter(d => d.total > 0)}
                    dataKey="total"
                    nameKey="code"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {analytics.departmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-800" />
            <h3 className="font-bold text-sm text-gray-900">Filter Grievances Master Table</h3>
          </div>

          <button
            onClick={() => {
              setFilterDistrict('');
              setFilterDept('');
              setFilterStatus('');
              setFilterPriority('');
              setFilterOverdue(false);
              setSearchTerm('');
            }}
            className="text-xs text-gray-500 hover:text-emerald-800 underline font-medium"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Reference, citizen, subject..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </form>
          </div>

          {/* District */}
          <div>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="">All 14 Districts</option>
              {KERALA_DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Reopened">Reopened</option>
            </select>
          </div>

          {/* Overdue Button Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setFilterOverdue(!filterOverdue)}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                filterOverdue ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              {filterOverdue ? 'Overdue Only Active' : 'Filter Overdue (>14d)'}
            </button>
          </div>
        </div>
      </div>

      {/* Grievances Master Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center text-xs text-gray-500">
          <div>
            Showing <strong className="text-gray-900">{grievances.length}</strong> matching petitions
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-800 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Reference ID</th>
                <th className="px-4 py-3">Citizen & District</th>
                <th className="px-4 py-3">Subject / Issue</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {grievances.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50/80 transition">
                  <td className="px-4 py-3 font-mono font-bold text-[#0B3B24]">
                    {g.reference_no}
                    {g.is_overdue === 1 && (
                      <span className="block text-[9px] text-red-600 font-bold uppercase tracking-wider mt-0.5">
                        ⚠️ Overdue
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{g.citizen_name}</div>
                    <div className="text-[10px] text-gray-500">{g.district}</div>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="font-medium text-gray-900 truncate" title={g.subject}>
                      {g.subject}
                    </div>
                    {g.ai_duplicate_flag === 1 && (
                      <span className="inline-block text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold mt-0.5">
                        Duplicate Flag
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {g.department_code || <span className="text-amber-700 italic">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3">
                    {getPriorityBadge(g.priority)}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(g.status)}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-gray-500">
                    {new Date(g.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openActionModal(g)}
                      className="bg-[#0D5C3A] hover:bg-emerald-800 text-white px-3 py-1.5 rounded-md font-semibold text-xs shadow-xs transition"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grievance Action Modal */}
      {activeModalGrievance && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <div>
                <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">CMO Grievance Action Dossier</span>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-xl font-mono font-bold text-[#0B3B24]">
                    {activeModalGrievance.reference_no}
                  </h2>
                  {getStatusBadge(activeModalGrievance.status)}
                  {getPriorityBadge(activeModalGrievance.priority)}
                </div>
              </div>
              <button
                onClick={() => setActiveModalGrievance(null)}
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
              <div className="text-center py-10 text-gray-400 text-xs">Loading complete petition history...</div>
            ) : modalDetails && (
              <div className="space-y-6">
                {/* Citizen & Petition Overview */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
                  <div className="font-bold text-gray-900 text-sm">{modalDetails.grievance.subject}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-gray-600 pt-1">
                    <div><strong>Citizen:</strong> {modalDetails.grievance.citizen_name}</div>
                    <div><strong>District:</strong> {modalDetails.grievance.district}</div>
                    <div><strong>Phone:</strong> {modalDetails.grievance.citizen_phone || 'N/A'}</div>
                    <div><strong>Email:</strong> {modalDetails.grievance.citizen_email}</div>
                  </div>
                  <div className="pt-2 text-gray-700 whitespace-pre-line leading-relaxed">
                    {modalDetails.grievance.description}
                  </div>
                </div>

                {/* AI Grievance Assistant Summary Card */}
                {modalDetails.grievance.ai_summary && (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-1.5 text-xs">
                    <div className="font-bold text-emerald-900">AI Assistant Summary & Classification:</div>
                    <p className="text-emerald-950 italic">{modalDetails.grievance.ai_summary}</p>
                    <div className="flex gap-4 text-[11px] text-emerald-800 pt-1">
                      <span>Suggested Dept: <strong>{modalDetails.grievance.ai_suggested_dept}</strong></span>
                      <span>Suggested Priority: <strong>{modalDetails.grievance.ai_suggested_priority}</strong></span>
                    </div>
                    {modalDetails.grievance.ai_duplicate_flag === 1 && (
                      <div className="bg-amber-100 text-amber-900 p-2 rounded text-[11px] font-semibold mt-1">
                        ⚠️ Flagged as potential duplicate of petition: {modalDetails.grievance.ai_duplicate_ref}
                      </div>
                    )}
                  </div>
                )}

                {/* Attachments */}
                {modalDetails.attachments && modalDetails.attachments.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-gray-700 uppercase">Petition Attachments:</div>
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

                {/* Officer ATR if available */}
                {modalDetails.grievance.officer_action_report && (
                  <div className="bg-emerald-950 text-white p-4 rounded-xl space-y-2 text-xs">
                    <div className="font-bold text-[#F59E0B] uppercase">Department Officer Action Taken Report (ATR):</div>
                    <p className="text-emerald-100 leading-relaxed whitespace-pre-line">
                      {modalDetails.grievance.officer_action_report}
                    </p>
                  </div>
                )}

                {/* Action Section 1: Forward / Reassign to Department */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-xs">
                  <h4 className="font-bold text-gray-900 text-sm">Forward to Government Department</h4>
                  <form onSubmit={handleAssignSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Target Department *</label>
                        <select
                          required
                          value={assignDeptId}
                          onChange={(e) => setAssignDeptId(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white"
                        >
                          <option value="">Select Department...</option>
                          {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Set Priority</label>
                        <select
                          value={assignPriority}
                          onChange={(e) => setAssignPriority(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">CMO Administrative Instructions</label>
                      <input
                        type="text"
                        value={assignInstructions}
                        onChange={(e) => setAssignInstructions(e.target.value)}
                        placeholder="e.g. Inspect site within 48 hours and submit compliance report..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-[#0D5C3A] hover:bg-emerald-800 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition"
                      >
                        Forward & Assign Department
                      </button>
                    </div>
                  </form>
                </div>

                {/* Action Section 2: Update Status / Add Administrative Remarks */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-xs">
                  <h4 className="font-bold text-gray-900 text-sm">Update Grievance Status & Remarks</h4>
                  <form onSubmit={handleStatusSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Transition Status</label>
                        <select
                          value={statusUpdate}
                          onChange={(e) => setStatusUpdate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved (Final Approval)</option>
                          <option value="Reopened">Reopened</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Administrative Remarks</label>
                        <input
                          type="text"
                          value={adminRemarks}
                          onChange={(e) => setAdminRemarks(e.target.value)}
                          placeholder="Internal administrative note..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={handleEscalateSubmit}
                        className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 px-3 py-1.5 rounded-lg font-bold text-xs transition"
                      >
                        🚨 Escalate to Highest Priority
                      </button>

                      <button
                        type="submit"
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition"
                      >
                        Save Status & Remarks
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
