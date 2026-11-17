const BASE_URL = '/api';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('cmo_auth_token');
  const headers = { ...options.headers };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Do not set Content-Type if sending FormData (browser sets boundary automatically)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({ success: false, error: 'Failed to parse response' }));

  if (!response.ok) {
    const errorMsg = data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  register: (userData) => apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  getMe: () => apiFetch('/auth/me'),

  // Public & Grievance Tracking
  trackGrievance: (ref) => apiFetch(`/grievances/track/${encodeURIComponent(ref)}`),
  getDepartments: () => apiFetch('/departments'),
  submitContact: (contactData) => apiFetch('/contact', {
    method: 'POST',
    body: JSON.stringify(contactData)
  }),

  // AI Grievance Assistant
  analyzeGrievance: (data) => apiFetch('/ai/analyze', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Citizen
  submitGrievance: (formData) => apiFetch('/grievances/submit', {
    method: 'POST',
    body: formData
  }),
  getMyGrievances: () => apiFetch('/grievances/my'),
  getGrievanceById: (id) => apiFetch(`/grievances/${id}`),
  submitFeedback: (id, feedbackData) => apiFetch(`/grievances/${id}/feedback`, {
    method: 'POST',
    body: JSON.stringify(feedbackData)
  }),
  reopenGrievance: (id, remarks) => apiFetch(`/grievances/${id}/reopen`, {
    method: 'POST',
    body: JSON.stringify({ remarks })
  }),

  // CMO Admin
  getCMOStats: () => apiFetch('/cmo/stats'),
  getCMOAnalytics: () => apiFetch('/cmo/analytics'),
  listCMOGrievances: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/cmo/grievances${query ? `?${query}` : ''}`);
  },
  forwardGrievance: (id, data) => apiFetch(`/cmo/grievances/${id}/assign`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateCMOStatus: (id, data) => apiFetch(`/cmo/grievances/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  escalateGrievance: (id, reason) => apiFetch(`/cmo/grievances/${id}/escalate`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  }),

  // Officer
  getOfficerGrievances: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/officer/grievances${query ? `?${query}` : ''}`);
  },
  updateOfficerInvestigation: (id, data) => apiFetch(`/officer/grievances/${id}/investigate`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  submitOfficerATR: (id, formData) => apiFetch(`/officer/grievances/${id}/action-report`, {
    method: 'POST',
    body: formData
  })
};
