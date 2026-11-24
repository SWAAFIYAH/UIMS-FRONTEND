import client from "./client";

function getResults(data, endpoint) {
  if (!data || !Array.isArray(data.results)) {
    throw new Error(`${endpoint} returned an invalid response: expected a results array.`);
  }

  return data.results;
}

function getEvaluationResults(data, endpoint) {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.results)) {
    return data.results;
  }

  throw new Error(`${endpoint} returned an invalid response: expected an evaluation array.`);
}

export const fetchAssignedStudents = async () => {
  const { data } = await client.get("/logbooks/students/");
  return getResults(data, "Assigned students endpoint");
};

export const fetchStudentLogbookEntries = async (placementId) => {
  const { data } = await client.get(`/logbooks/students/${placementId}/entries/`);
  return getResults(data, "Student logbook entries endpoint");
};

export const fetchLogbookEntry = async (entryId) => {
  const { data } = await client.get(`/logbooks/${entryId}/`);
  return data;
};

export const submitLogbookFeedback = async (entryId, comment) => {
  const { data } = await client.post(`/logbooks/${entryId}/feedback/`, { comment });
  return data;
};

export const updateLogbookFeedback = async (entryId, comment) => {
  const { data } = await client.patch(`/logbooks/${entryId}/feedback/update/`, { comment });
  return data;
};

export const fetchFieldVisits = async () => {
  const { data } = await client.get("/logbooks/visits/");
  return getResults(data, "Field visits endpoint");
};

export const createFieldVisit = async ({ placement, visit_date, notes, outcome }) => {
  const placementId = Number(placement);
  if (!Number.isInteger(placementId) || placementId <= 0) {
    throw new Error("A valid placement ID is required to log a field visit.");
  }

  const { data } = await client.post("/logbooks/visits/", {
    placement: placementId,
    visit_date,
    notes,
    outcome,
  });
  return data;
};

export const submitSupervisorEvaluation = async (evaluationData) => {
  const { data } = await client.post("/evaluations/supervisor/", evaluationData);
  return data;
};

export const fetchCompanyEvaluations = async () => {
  const { data } = await client.get("/evaluations/company/");
  return getEvaluationResults(data, "Company evaluations endpoint");
};

export const submitCompanyEvaluation = async (evaluationData) => {
  const { data } = await client.post("/evaluations/company/", evaluationData);
  return data;
};

export const fetchSupervisorEvaluations = async () => {
  const { data } = await client.get("/evaluations/supervisor/");
  return getEvaluationResults(data, "Supervisor evaluations endpoint");
};

export const finalisePlacementEvaluation = async (placementId) => {
  const { data } = await client.post(`/evaluations/${placementId}/finalise/`);
  return data;
};

export const fetchMyWorkloadReport = async () => {
  const { data } = await client.get("/reports/my-workload/");
  if (!data || !Array.isArray(data.results) || !Number.isInteger(data.total_students)) {
    throw new Error("Supervisor workload endpoint returned an invalid response.");
  }

  return data;
};
