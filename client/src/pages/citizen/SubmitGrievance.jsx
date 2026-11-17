import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, FileText, Upload, CheckCircle2, AlertTriangle, 
  ArrowLeft, Paperclip, AlertCircle, Info, RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const KERALA_DISTRICTS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur',
  'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad',
  'Kannur', 'Kasaragod'
];

const CATEGORIES = [
  'Road Infrastructure & Potholes',
  'Drinking Water Supply & Pipelines',
  'Electricity, Poles & Power Outages',
  'Public Healthcare & Medicines',
  'Sanitation, Waste & Drainage',
  'Land Revenue & Pokkuvaravu',
  'Ration Cards & Civil Supplies',
  'School & Education Facilities',
  'Police, Vigilance & Public Safety',
  'Other Civic Matter'
];

export default function SubmitGrievance() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    district: user?.district || 'Ernakulam',
    category: 'Road Infrastructure & Potholes',
    subject: '',
    description: '',
    priority: 'Medium'
  });

  const [attachment, setAttachment] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successDossier, setSuccessDossier] = useState(null);

  // Run AI Grievance Assistant
  const handleAIAnalyze = async () => {
    if (!formData.description.trim() && !formData.subject.trim()) {
      setError('Please provide at least a brief subject or complaint description to analyze.');
      return;
    }
    setError('');
    setAnalyzing(true);

    try {
      const res = await api.analyzeGrievance({
        subject: formData.subject,
        description: formData.description,
        district: formData.district
      });

      if (res.success && res.analysis) {
        setAiResult(res.analysis);
      }
    } catch (err) {
      console.warn('AI analysis error:', err);
      setError('AI assistant is temporarily busy, but you can continue filling the form manually.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Apply AI recommendations to form fields
  const applyAI = () => {
    if (!aiResult) return;
    setFormData(prev => ({
      ...prev,
      category: aiResult.suggestedCategory || prev.category,
      priority: aiResult.suggestedPriority || prev.priority
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('district', formData.district);
      data.append('category', formData.category);
      data.append('subject', formData.subject);
      data.append('description', formData.description);
      data.append('priority', formData.priority);

      if (aiResult) {
        data.append('ai_summary', aiResult.summary || '');
        data.append('ai_suggested_dept', aiResult.suggestedDepartment || '');
        data.append('ai_suggested_priority', aiResult.suggestedPriority || '');
        if (aiResult.duplicateCheck?.isDuplicate) {
          data.append('ai_duplicate_flag', '1');
          data.append('ai_duplicate_ref', aiResult.duplicateCheck.matchedRef || '');
        }
      }

      if (attachment) {
        data.append('attachment', attachment);
      }

      const res = await api.submitGrievance(data);
      if (res.success) {
        setSuccessDossier(res);
      } else {
        setError(res.error || 'Failed to submit grievance');
      }
    } catch (err) {
      setError(err.message || 'Error occurred while submitting grievance.');
    } finally {
      setSubmitting(false);
    }
  };

  if (successDossier) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-6 animate-in fade-in">
        <div className="bg-white rounded-2xl border border-emerald-300 p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-700" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Grievance Registered Successfully</h1>
            <p className="text-xs text-gray-500">Chief Minister's Public Grievance Redressal Cell</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-2">
            <div className="text-xs text-emerald-800 uppercase font-bold tracking-wider">Your Official Reference Number</div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#0B3B24] tracking-wider">
              {successDossier.reference_no}
            </div>
            <p className="text-[11px] text-gray-600">
              Please save this reference number. You can use it to track real-time departmental progress anytime.
            </p>
          </div>

          <div className="text-left bg-gray-50 p-4 rounded-xl text-xs space-y-2 text-gray-700">
            <div><strong>Petitioner:</strong> {user?.name}</div>
            <div><strong>Subject:</strong> {formData.subject}</div>
            <div><strong>District:</strong> {formData.district}</div>
            <div><strong>Current Status:</strong> <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Submitted</span></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to={`/track?ref=${encodeURIComponent(successDossier.reference_no)}`}
              className="bg-[#0D5C3A] hover:bg-emerald-800 text-white px-6 py-2.5 rounded-lg font-bold text-xs shadow-sm transition"
            >
              Track This Grievance Now
            </Link>
            <Link
              to="/citizen/dashboard"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-semibold text-xs transition"
            >
              Go to Citizen Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="space-y-2">
        <Link to="/citizen/dashboard" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-800">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Submit Grievance to Chief Minister's Office
        </h1>
        <p className="text-xs text-gray-500">
          Provide complete details of your public grievance. Our AI assistant will analyze your text to ensure proper departmental routing.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-start gap-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* District and Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">District of Incident *</label>
            <select
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              {KERALA_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Grievance Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Subject / Summary Title *</label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="e.g. Hazardous 1.5-foot deep potholes on Aluva-Perumbavoor road"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Detailed Description */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-gray-700">Detailed Complaint Description *</label>
            <button
              type="button"
              onClick={handleAIAnalyze}
              disabled={analyzing}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 transition"
              title="Click to have AI classify department, priority, and summary"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {analyzing ? 'Analyzing with AI...' : 'Analyze with AI Assistant'}
            </button>
          </div>
          <textarea
            required
            rows={6}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the problem, exact location (ward, landmark), duration of issue, and danger to public life..."
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
          ></textarea>
        </div>

        {/* AI Assistant Output Card (Human-in-the-loop reviewable) */}
        {aiResult && (
          <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-4 sm:p-5 space-y-3.5 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Grievance Assistant Recommendations</span>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-medium">
                {aiResult.engine}
              </span>
            </div>

            {/* Duplicate Alert if detected */}
            {aiResult.duplicateCheck?.isDuplicate && (
              <div className="bg-amber-100/90 border border-amber-300 text-amber-900 p-3 rounded-lg flex items-start gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Potential Duplicate Alert Detected</div>
                  <div className="text-[11px] mt-0.5">{aiResult.duplicateCheck.warning}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Suggested Department</span>
                <span className="font-bold text-emerald-900">{aiResult.suggestedDepartment}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Suggested Category</span>
                <span className="font-bold text-emerald-900">{aiResult.suggestedCategory}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Recommended Priority</span>
                <span className="font-bold text-amber-700">{aiResult.suggestedPriority}</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-emerald-100 text-xs">
              <span className="text-gray-500 block text-[10px] uppercase font-semibold mb-1">Generated Executive Summary for CMO</span>
              <p className="text-gray-800 italic">{aiResult.summary}</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-gray-500 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-emerald-700" />
                <span>You can review and accept AI recommendations before filing.</span>
              </div>
              <button
                type="button"
                onClick={applyAI}
                className="bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-1.5 rounded-md font-semibold text-xs transition"
              >
                Apply AI Suggestions
              </button>
            </div>
          </div>
        )}

        {/* Priority & Supporting Attachment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Priority Level</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="Low">Low - Routine administrative query</option>
              <option value="Medium">Medium - Standard civic repair / service</option>
              <option value="High">High - Severe disruption / health hazard</option>
              <option value="Urgent">Urgent - Life-threatening / critical risk</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Supporting Evidence / Attachment</label>
            <input
              type="file"
              onChange={(e) => setAttachment(e.target.files[0] || null)}
              accept="image/*,.pdf,.doc,.docx"
              className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
            />
            <span className="text-[10px] text-gray-400 mt-0.5 block">JPG, PNG, PDF up to 10MB</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-[11px] text-gray-500">
            A unique reference ID will be generated upon submission.
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#0D5C3A] hover:bg-emerald-800 text-white px-6 py-3 rounded-lg font-bold text-xs shadow-sm transition disabled:opacity-50"
          >
            {submitting ? 'Submitting to CMO...' : 'Submit Grievance to CMO'}
          </button>
        </div>
      </form>
    </div>
  );
}
