import axios from 'axios';

// Live Production Backend Base URL hosted on Railway
const API_BASE_URL = 'https://uimsystem-production.up.railway.app'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach JWT Bearer token from localStorage to every request
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
   1. SUPERVISOR LOGBOOKS & ASSIGNED STUDENTS ENDPOINTS
   ========================================================================== */

// GET /api/logbooks/students/ -> Fetch assigned students roster
export const fetchAssignedStudents = async () => {
  const response = await api.get('/api/logbooks/students/');
  return response.data;
};

// GET /api/logbooks/overview/ -> Fetch global logbooks overview
export const fetchLogbooksOverview = async () => {
  const response = await api.get('/api/logbooks/overview/');
  return response.data;
};

// GET /api/logbooks/students/{placement_id}/entries/ -> Fetch logbook entries for a specific placement
export const fetchStudentLogbookEntries = async (placementId) => {
  const response = await api.get(`/api/logbooks/students/${placementId}/entries/`);
  return response.data;
};

// POST /api/logbooks/{entry_id}/feedback/ -> Submit new logbook feedback/approval
export const submitLogbookFeedback = async (entryId, feedbackData) => {
  const response = await api.post(`/api/logbooks/${entryId}/feedback/`, feedbackData);
  return response.data;
};

// PATCH /api/logbooks/{entry_id}/feedback/update/ -> Update existing feedback
export const updateLogbookFeedback = async (entryId, feedbackData) => {
  const response = await api.patch(`/api/logbooks/${entryId}/feedback/update/`, feedbackData);
  return response.data;
};

/* ==========================================================================
   2. FIELD VISITS MONITORING ENDPOINTS
   ========================================================================== */

// GET /api/logbooks/visits/ -> Fetch field visits logged by the supervisor
export const fetchFieldVisits = async () => {
  const response = await api.get('/api/logbooks/visits/');
  return response.data;
};

// POST /api/logbooks/visits/ -> Log a new field visit record
export const createFieldVisit = async (visitData) => {
  const response = await api.post('/api/logbooks/visits/', visitData);
  return response.data;
};

/* ==========================================================================
   3. ACADEMIC EVALUATIONS ENDPOINTS
   ========================================================================== */

// GET /api/evaluations/supervisor/ -> Fetch supervisor evaluations
export const fetchSupervisorEvaluations = async () => {
  const response = await api.get('/api/evaluations/supervisor/');
  return response.data;
};

// POST /api/evaluations/supervisor/ -> Submit academic evaluation rubric scores
export const submitSupervisorEvaluation = async (evaluationData) => {
  const response = await api.post('/api/evaluations/supervisor/', evaluationData);
  return response.data;
};

// POST /api/evaluations/{placement_id}/finalise/ -> Finalise student's overall evaluation
export const finaliseStudentEvaluation = async (placementId) => {
  const response = await api.post(`/api/evaluations/${placementId}/finalise/`);
  return response.data;
};

/* ==========================================================================
   4. WORKLOAD & ANALYTICS REPORTS ENDPOINTS
   ========================================================================== */

// GET /api/reports/my-workload/ -> Fetch supervisor workload metrics
export const fetchMyWorkloadReport = async () => {
  const response = await api.get('/api/reports/my-workload/');
  return response.data;
};

// GET /api/reports/performance/ -> Fetch student performance analytics
export const fetchPerformanceReport = async () => {
  const response = await api.get('/api/reports/performance/');
  return response.data;
};

export default api;