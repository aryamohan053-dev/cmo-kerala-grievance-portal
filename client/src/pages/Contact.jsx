import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Building } from 'lucide-react';
import { api } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.submitContact(formData);
      if (res.success) {
        setSuccessMsg(res.message);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMsg(res.error || 'Failed to submit enquiry');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong while submitting enquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Official Helpdesk
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Contact Chief Minister's Grievance Cell
        </h1>
        <p className="text-sm text-gray-600 max-w-xl mx-auto">
          For technical enquiries, mass petitions, or administrative support, send an official message directly to our helpdesk team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Contact Info & Collectorates */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0B3B24] text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
            <h2 className="text-lg font-bold text-[#F59E0B]">Central Redressal Office</h2>
            <div className="space-y-4 text-xs text-emerald-100">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Chief Minister's Office (CMO)</strong>
                  Government Secretariat, Statue, Thiruvananthapuram - 695001, Kerala, India.
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <div>
                  <strong className="text-white block">Direct CMO Grievance Helpline</strong>
                  0471-2333812 / 0471-2518382 (Toll-Free: 1076)
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <div>
                  <strong className="text-white block">Official Redressal Email</strong>
                  cmo.grievance@kerala.gov.in
                </div>
              </div>
            </div>
          </div>

          {/* District Collectorates Quick Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-700" />
              District Collectorate Grievance Counters
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every District Collectorate across all 14 districts houses a physical Janasandarsanam counter to assist citizens without internet access.
            </p>
            <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
              Working Hours: Monday to Saturday, 10:00 AM – 05:00 PM (Excluding second Saturdays & public holidays).
            </div>
          </div>
        </div>

        {/* Right Col: Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Send an Enquiry or Petition Clarification</h2>
            <p className="text-xs text-gray-500 mt-1">Your message is securely stored in our central enquiry database and answered by desk officers.</p>
          </div>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-start gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Message Delivered</div>
                <div className="text-xs mt-0.5">{successMsg}</div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Error</div>
                <div className="text-xs mt-0.5">{errorMsg}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Adv. K. Rajesh"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Subject of Enquiry *</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of your query"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Detailed Message / Question *</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Provide full details regarding your query..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0D5C3A] hover:bg-emerald-800 text-white py-3 rounded-lg font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting to Database...' : 'Submit Contact Enquiry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
