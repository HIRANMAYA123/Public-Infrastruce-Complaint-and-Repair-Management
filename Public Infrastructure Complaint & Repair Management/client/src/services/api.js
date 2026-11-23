const API_BASE = '/api';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('civicfix_token');
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Auth
  login: (credentials) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    }).then(handleResponse),

  register: (userData) =>
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    }).then(handleResponse),

  getMe: () =>
    fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    }).then(handleResponse),

  updateProfile: (profileData) =>
    fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    }).then(handleResponse),

  // Meta
  getCategories: () =>
    fetch(`${API_BASE}/meta/categories`, {
      headers: getHeaders(),
    }).then(handleResponse),

  getWards: () =>
    fetch(`${API_BASE}/meta/wards`, {
      headers: getHeaders(),
    }).then(handleResponse),

  getDepartments: () =>
    fetch(`${API_BASE}/meta/departments`, {
      headers: getHeaders(),
    }).then(handleResponse),

  getPublicStats: () =>
    fetch(`${API_BASE}/meta/public-stats`).then(handleResponse),

  // Complaints (Citizen)
  submitComplaint: (formData) =>
    fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    }).then(handleResponse),

  getMyComplaints: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/complaints/my?${query}`, {
      headers: getHeaders(),
    }).then(handleResponse);
  },

  getComplaintById: (id) =>
    fetch(`${API_BASE}/complaints/${id}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  updateComplaint: (id, formData) =>
    fetch(`${API_BASE}/complaints/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: formData,
    }).then(handleResponse),

  withdrawComplaint: (id) =>
    fetch(`${API_BASE}/complaints/${id}/withdraw`, {
      method: 'POST',
      headers: getHeaders(),
    }).then(handleResponse),

  reopenComplaint: (id, reason) =>
    fetch(`${API_BASE}/complaints/${id}/reopen`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason }),
    }).then(handleResponse),

  submitFeedback: (feedbackData) =>
    fetch(`${API_BASE}/complaints/feedback`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(feedbackData),
    }).then(handleResponse),

  // Admin
  getAdminStats: () =>
    fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders(),
    }).then(handleResponse),

  getAllComplaints: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/admin/complaints?${query}`, {
      headers: getHeaders(),
    }).then(handleResponse);
  },

  assignComplaint: (assignmentData) =>
    fetch(`${API_BASE}/admin/assign`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(assignmentData),
    }).then(handleResponse),

  updateStatus: (statusData) =>
    fetch(`${API_BASE}/admin/status`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(statusData),
    }).then(handleResponse),

  getAdminCitizens: () =>
    fetch(`${API_BASE}/admin/citizens`, {
      headers: getHeaders(),
    }).then(handleResponse),

  getAdminWorkers: () =>
    fetch(`${API_BASE}/admin/workers`, {
      headers: getHeaders(),
    }).then(handleResponse),

  createWorker: (workerData) =>
    fetch(`${API_BASE}/admin/workers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(workerData),
    }).then(handleResponse),

  getAdminDepartments: () =>
    fetch(`${API_BASE}/admin/departments`, {
      headers: getHeaders(),
    }).then(handleResponse),

  createDepartment: (deptData) =>
    fetch(`${API_BASE}/admin/departments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(deptData),
    }).then(handleResponse),

  getAdminWards: () =>
    fetch(`${API_BASE}/admin/wards`, {
      headers: getHeaders(),
    }).then(handleResponse),

  createWard: (wardData) =>
    fetch(`${API_BASE}/admin/wards`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(wardData),
    }).then(handleResponse),

  // Worker
  getWorkerTasks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/worker/tasks?${query}`, {
      headers: getHeaders(),
    }).then(handleResponse);
  },

  getWorkerTaskDetails: (id) =>
    fetch(`${API_BASE}/worker/tasks/${id}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  updateWorkerTaskStatus: (id, status, remarks) =>
    fetch(`${API_BASE}/worker/tasks/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, remarks }),
    }).then(handleResponse),

  submitWorkerRepairUpdate: (id, formData) =>
    fetch(`${API_BASE}/worker/tasks/${id}/updates`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    }).then(handleResponse),
};
