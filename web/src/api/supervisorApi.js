import axios from 'axios';

// Live Production Backend URL hosted on Railway
const API_BASE_URL = 'https://uimsystem-production.up.railway.app'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach JWT Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ==========================================================================
   1. AUTHENTICATION
   ========================================================================== */
export const loginUser = async (credentials) => {
  const response = await api.post('/api/auth/login/', credentials);
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get('/api/auth/me/');
  return response.data;
};

/* ==========================================================================
   2. INTERNSHIPS & PLACEMENTS (SUPERVISOR DECISIONS)
   ========================================================================== */

// GET /api/internships/placements/all/ -> Fetch placements list
export const fetchPlacements = async () => {
  const response = await api.get('/api/internships/placements/all/');
  return response.data;
};

// PATCH /api/internships/placements/{placement_id}/decision/ -> Approve/Reject placement
export const updatePlacementDecision = async (placementId, decisionData) => {
  // decisionData should be: { status: 'APPROVED' | 'REJECTED', comments: '...' }
  const response = await api.patch(`/api/internships/placements/${placementId}/decision/`, decisionData);
  return response.data;
};

export const approvePlacement = async (placementId, { remarks }) => {
  return updatePlacementDecision(placementId, { status: 'APPROVED', comments: remarks });
};

export const rejectPlacement = async (placementId, { remarks }) => {
  return updatePlacementDecision(placementId, { status: 'REJECTED', comments: remarks });
};

/* ==========================================================================
   3. LOGBOOKS & ASSIGNED STUDENTS
   ========================================================================== */

// GET /api/logbooks/students/ -> Fetch supervisor's assigned students
export const fetchAssignedStudents = async () => {
  const response = await api.get('/api/logbooks/students/');
  return response.data;
};

// GET /api/logbooks/overview/ -> Global logbook overview
export const fetchLogbooksOverview = async () => {
  const response = await api.get('/api/logbooks/overview/');
  return response.data;
};

// GET /api/logbooks/students/{placement_id}/entries/ -> Logbooks for specific student
export const fetchStudentLogbookEntries = async (placementId) => {
  const response = await api.get(`/api/logbooks/students/${placementId}/entries/`);
  return response.data;
};

// POST /api/logbooks/{entry_id}/feedback/ -> Submit logbook feedback
export const submitLogbookFeedback = async (entryId, feedbackData) => {
  const response = await api.post(`/api/logbooks/${entryId}/feedback/`, feedbackData);
  return response.data;
};

// PATCH /api/logbooks/{entry_id}/feedback/update/ -> Update logbook feedback
export const updateLogbookFeedback = async (entryId, feedbackData) => {
  const response = await api.patch(`/api/logbooks/${entryId}/feedback/update/`, feedbackData);
  return response.data;
};

/* ==========================================================================
   4. FIELD VISITS
   ========================================================================== */

// GET /api/logbooks/visits/ -> Fetch field visits
export const fetchFieldVisits = async () => {
  const response = await api.get('/api/logbooks/visits/');
  return response.data;
};

// POST /api/logbooks/visits/ -> Create new field visit record
export const createFieldVisit = async (visitData) => {
  const response = await api.post('/api/logbooks/visits/', visitData);
  return response.data;
};

/* ==========================================================================
   5. ACADEMIC EVALUATIONS
   ========================================================================== */

// GET /api/evaluations/supervisor/ -> Fetch supervisor evaluations
export const fetchSupervisorEvaluations = async () => {
  const response = await api.get('/api/evaluations/supervisor/');
  return response.data;
};

// POST /api/evaluations/supervisor/ -> Submit evaluation scores
export const submitSupervisorEvaluation = async (evaluationData) => {
  const response = await api.post('/api/evaluations/supervisor/', evaluationData);
  return response.data;
};

// POST /api/evaluations/{placement_id}/finalise/ -> Finalise student assessment
export const finaliseStudentEvaluation = async (placementId) => {
  const response = await api.post(`/api/evaluations/${placementId}/finalise/`);
  return response.data;
};

/* ==========================================================================
   6. REPORTS & WORKLOAD ANALYTICS
   ========================================================================== */

export const fetchMyWorkloadReport = async () => {
  const response = await api.get('/api/reports/my-workload/');
  return response.data;
};

export const fetchSupervisorWorkloadReport = async () => {
  const response = await api.get('/api/reports/supervisor-workload/');
  return response.data;
};

export const fetchPerformanceReport = async () => {
  const response = await api.get('/api/reports/performance/');
  return response.data;
};

export default api;