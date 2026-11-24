import { useState, useEffect } from 'react';
import './SupervisorDashboard.css';
import { 
  fetchAssignedStudents, 
  fetchStudentLogbookEntries, 
  fetchLogbookEntry,
  submitLogbookFeedback, 
  updateLogbookFeedback,
  fetchFieldVisits, 
  createFieldVisit,
  fetchCompanyEvaluations,
  submitCompanyEvaluation,
  fetchSupervisorEvaluations,
  submitSupervisorEvaluation,
  finalisePlacementEvaluation,
  fetchMyWorkloadReport,
} from '../src/api/supervisorApi';

const createRubricScores = () => [
  { id: 1, title: "Technical & Domain Competency", description: "Application of computing concepts and execution of assigned tasks.", score: null },
  { id: 2, title: "Professionalism & Work Ethic", description: "Punctuality, communication skills, and professional integrity.", score: null },
  { id: 3, title: "Problem Solving & Initiative", description: "Ability to analyze technical challenges and propose solutions.", score: null },
  { id: 4, title: "Adaptability & Team Collaboration", description: "Integration into technical teams and response to feedback.", score: null },
];

const getPlacementId = (evaluation) => {
  const placement = evaluation?.placement;
  return Number(evaluation?.placement_id ?? (typeof placement === 'object' ? placement?.id : placement));
};

function SupervisorDashboard() {
  // Navigation tab state: 'dashboard' | 'placements' | 'logbooks' | 'visits' | 'students' | 'assessment' | 'reports'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Data States connected to Backend
  const [studentsList, setStudentsList] = useState([]);
  const [placementsList, setPlacementsList] = useState([]);
  const [logbooksList, setLogbooksList] = useState([]);
  const [visitsList, setVisitsList] = useState([]);
  const [workloadReport, setWorkloadReport] = useState(null);
  const [companyEvaluations, setCompanyEvaluations] = useState([]);
  const [supervisorEvaluations, setSupervisorEvaluations] = useState([]);
  const [finalisedPlacements, setFinalisedPlacements] = useState(() => new Set());

  // Accessibility States
  const [showA11yPanel, setShowA11yPanel] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);

  // Modals state
  const [showLogbookModal, setShowLogbookModal] = useState(false);
  const [selectedLogbook, setSelectedLogbook] = useState(null);
  const [loadingLogbook, setLoadingLogbook] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitPlacementId, setVisitPlacementId] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitOutcome, setVisitOutcome] = useState('satisfactory');
  const [visitNotes, setVisitNotes] = useState('');

  // Assessment State
  const [currentStudent, setCurrentStudent] = useState(null);
  const [rubricScores, setRubricScores] = useState(createRubricScores);
  const [remarks, setRemarks] = useState('');
  const [companyEvaluationForm, setCompanyEvaluationForm] = useState({ company_score: '', remarks: '' });
  const [savingCompanyEvaluation, setSavingCompanyEvaluation] = useState(false);
  const [savingSupervisorEvaluation, setSavingSupervisorEvaluation] = useState(false);
  const [finalisingEvaluation, setFinalisingEvaluation] = useState(false);
  const [evaluationError, setEvaluationError] = useState('');

  // Apply accessibility classes directly to document body
  useEffect(() => {
    document.body.classList.toggle('high-contrast', isHighContrast);
  }, [isHighContrast]);

  useEffect(() => {
    document.body.classList.toggle('large-text', isLargeText);
  }, [isLargeText]);

  useEffect(() => {
    document.body.classList.toggle('dyslexic-font', isDyslexicFont);
  }, [isDyslexicFont]);

  // Initial Load from Backend API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setLoadError('');
        const [
          assignedStudentRows,
          reportData,
          visitsData,
          companyEvaluationRows,
          supervisorEvaluationRows,
        ] = await Promise.all([
          fetchAssignedStudents(),
          fetchMyWorkloadReport(),
          fetchFieldVisits(),
          fetchCompanyEvaluations(),
          fetchSupervisorEvaluations(),
        ]);
        const assignedStudentsByPlacement = new Map(
          assignedStudentRows.map((student) => [Number(student.placement_id), student])
        );
        const placementRows = reportData.results.map((placement) => ({
          ...(assignedStudentsByPlacement.get(placement.placement_id) || {}),
          ...placement,
          id: placement.placement_id,
          name: placement.student_name,
          placement_id: placement.placement_id,
          status: placement.placement_status,
        }));
        const logbookResponses = await Promise.all(
          placementRows.map((placement) => fetchStudentLogbookEntries(placement.placement_id))
        );

        setStudentsList(placementRows);
        setPlacementsList(placementRows);
        setCurrentStudent(placementRows[0] || null);
        setWorkloadReport(reportData);
        setVisitsList(visitsData);
        setLogbooksList(logbookResponses.flat());
        setCompanyEvaluations(companyEvaluationRows);
        setSupervisorEvaluations(supervisorEvaluationRows);
        setFinalisedPlacements(new Set(
          [...companyEvaluationRows, ...supervisorEvaluationRows]
            .filter((evaluation) => evaluation.finalised_at || evaluation.is_finalised || evaluation.finalised)
            .map(getPlacementId)
            .filter((placementId) => Number.isInteger(placementId) && placementId > 0)
        ));
      } catch (err) {
        console.error("Failed to load initial data from backend API:", err);
        setLoadError(
          err.response?.data?.detail
            || err.message
            || "Could not load supervisor dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Dynamic Calculations from Backend State
  const atRiskStudents = studentsList.filter(
    (student) => student.risk_status?.toLowerCase() === 'at_risk' || student.is_at_risk === true
  );
  const pendingLogbooks = logbooksList.filter(l => l.status === 'submitted');
  const pendingPlacements = placementsList.filter(p => p.status === 'pending');

  // Scorecard Calculations
  let totalRawScore = rubricScores.reduce((sum, item) => sum + (item.score ?? 0), 0);
  let calculatedPercent = ((totalRawScore / 40) * 100).toFixed(1);
  const completedRubricItems = rubricScores.filter((item) => item.score !== null).length;
  const selectedPlacementId = Number(currentStudent?.placement_id || currentStudent?.id);
  const companyEvaluation = companyEvaluations.find(
    (evaluation) => getPlacementId(evaluation) === selectedPlacementId
  );
  const supervisorEvaluation = supervisorEvaluations.find(
    (evaluation) => getPlacementId(evaluation) === selectedPlacementId
  );
  const companyAssessmentSubmitted = Boolean(companyEvaluation);
  const schoolAssessmentSubmitted = Boolean(supervisorEvaluation);
  const selectedPlacementFinalised = finalisedPlacements.has(selectedPlacementId);
  const submittedSchoolScore = Number(
    supervisorEvaluation?.supervisor_score ?? supervisorEvaluation?.raw_score
  );
  const displayedSchoolScore = schoolAssessmentSubmitted && Number.isFinite(submittedSchoolScore)
    ? submittedSchoolScore
    : totalRawScore;
  const displayedSchoolPercent = ((displayedSchoolScore / 40) * 100).toFixed(1);
  let finalGrade = supervisorEvaluation?.grade || "F (Fail)";
  const gradePercent = schoolAssessmentSubmitted ? displayedSchoolPercent : calculatedPercent;
  if (!supervisorEvaluation?.grade) {
    if (gradePercent >= 70) finalGrade = "A (First Class)";
    else if (gradePercent >= 60) finalGrade = "B (Upper Second)";
    else if (gradePercent >= 50) finalGrade = "C (Lower Second)";
    else if (gradePercent >= 40) finalGrade = "D (Pass)";
  }

  // Handlers
  function handleTabChange(tabName) {
    setActiveTab(tabName);
  }

  function updateScore(id, newScore) {
    setRubricScores((scores) => scores.map(item => item.id === id ? { ...item, score: newScore } : item));
  }

  async function openLogbookModal(logbook) {
    setSelectedLogbook(logbook);
    setFeedbackText('');
    setShowLogbookModal(true);
    setLoadingLogbook(true);

    try {
      const logbookDetails = await fetchLogbookEntry(logbook.id);
      setSelectedLogbook(logbookDetails);
    } catch (err) {
      console.error("Error fetching logbook details:", err);
      setShowLogbookModal(false);
      alert(err.response?.data?.detail || err.message || "Failed to load the full logbook entry.");
    } finally {
      setLoadingLogbook(false);
    }
  }

  async function saveLogbookFeedback() {
    if (!feedbackText.trim()) {
      alert("Please write your feedback before submitting.");
      return;
    }

    try {
      const saveFeedback = selectedLogbook.feedback?.trim()
        ? updateLogbookFeedback
        : submitLogbookFeedback;
      await saveFeedback(selectedLogbook.id, feedbackText.trim());
      setShowLogbookModal(false);
    } catch (err) {
      console.error("Error submitting logbook feedback:", err);
      alert(err.response?.data?.detail || err.message || "Failed to save feedback.");
      return;
    }

    try {
      const placementId = selectedLogbook.placement;
      const updated = await fetchStudentLogbookEntries(placementId);
      setLogbooksList((entries) => [
        ...entries.filter((entry) => Number(entry.placement) !== Number(placementId)),
        ...updated,
      ]);
      setLoadError('');
      alert("Logbook feedback saved successfully!");
    } catch (err) {
      console.error("Feedback was saved, but logbooks could not be refreshed:", err);
      setLoadError(`Feedback was saved, but the logbook list could not refresh: ${err.message}`);
    }
  }

  async function handleVisitSubmit(e) {
    e.preventDefault();
    try {
      await createFieldVisit({
        placement: visitPlacementId,
        visit_date: visitDate,
        outcome: visitOutcome,
        notes: visitNotes
      });
    } catch (err) {
      console.error("Error creating field visit:", err);
      alert(err.response?.data?.detail || err.message || "Failed to save field visit.");
      return;
    }

    setShowVisitModal(false);
    alert("Field visit saved to database!");
    try {
      const updatedVisits = await fetchFieldVisits();
      setVisitsList(updatedVisits);
      setLoadError('');
    } catch (err) {
      console.error("Field visit was saved, but visits could not be refreshed:", err);
      setLoadError(`Field visit was saved, but the visits list could not refresh: ${err.message}`);
    }
  }

  async function handleCompanyEvaluationSubmit(event) {
    event.preventDefault();
    const placementId = Number(currentStudent?.placement_id || currentStudent?.id);
    const companyScore = Number(companyEvaluationForm.company_score);

    if (!Number.isInteger(placementId) || placementId <= 0) {
      alert("Select a valid assigned placement before entering the company assessment.");
      return;
    }
    if (!Number.isFinite(companyScore) || companyScore < 0 || companyScore > 60) {
      alert("Enter a company assessment score from 0 to 60.");
      return;
    }
    if (companyEvaluations.some((evaluation) => getPlacementId(evaluation) === placementId)) {
      alert("A company assessment has already been submitted for this placement.");
      return;
    }

    setSavingCompanyEvaluation(true);
    setEvaluationError('');
    try {
      const evaluation = await submitCompanyEvaluation({
        placement_id: placementId,
        company_score: companyScore,
        remarks: companyEvaluationForm.remarks.trim(),
      });
      setCompanyEvaluations((evaluations) => [
        ...evaluations,
        { ...(evaluation || {}), placement_id: placementId, company_score: companyScore, remarks: companyEvaluationForm.remarks.trim() },
      ]);
      setCompanyEvaluationForm({ company_score: '', remarks: '' });
      alert("Company supervisor assessment recorded successfully.");
    } catch (err) {
      console.error("Error submitting company assessment:", err);
      setEvaluationError(err.response?.data?.detail || err.message || "Failed to save the company assessment.");
    } finally {
      setSavingCompanyEvaluation(false);
    }
  }

  async function handleFinaliseEvaluation(placementId, supervisorEvaluationSubmitted = false) {
    if (!companyEvaluations.some((evaluation) => getPlacementId(evaluation) === placementId)
      || (!supervisorEvaluationSubmitted
        && !supervisorEvaluations.some((evaluation) => getPlacementId(evaluation) === placementId))) {
      setEvaluationError("Both company and school-supervisor assessments are required before finalising.");
      return false;
    }

    setFinalisingEvaluation(true);
    setEvaluationError('');
    try {
      await finalisePlacementEvaluation(placementId);
      setFinalisedPlacements((placements) => new Set(placements).add(placementId));
      alert("Both assessments were combined and the final result was finalised.");
      return true;
    } catch (err) {
      console.error("Error finalising evaluation:", err);
      setEvaluationError(
        err.response?.data?.detail
          || err.message
          || "The assessments were saved, but the final result could not be finalised."
      );
      return false;
    } finally {
      setFinalisingEvaluation(false);
    }
  }

  async function handleEvaluationSubmit() {
    const placementId = Number(currentStudent?.placement_id || currentStudent?.id);
    const hasCompanyEvaluation = companyEvaluations.some((evaluation) => getPlacementId(evaluation) === placementId);
    if (!hasCompanyEvaluation) {
      alert("Record the company supervisor's assessment before submitting the school-supervisor assessment.");
      return;
    }
    if (completedRubricItems !== rubricScores.length) {
      alert("Please score every school-supervisor rubric item before submitting.");
      return;
    }
    if (!remarks.trim()) {
      alert("Please enter supervisor remarks.");
      return;
    }

    if (!Number.isInteger(placementId) || placementId <= 0) {
      alert("Select a valid assigned placement before submitting the assessment.");
      return;
    }
    if (supervisorEvaluations.some((evaluation) => getPlacementId(evaluation) === placementId)) {
      alert("A school-supervisor assessment has already been submitted for this placement.");
      return;
    }

    setSavingSupervisorEvaluation(true);
    setEvaluationError('');
    try {
      const evaluation = await submitSupervisorEvaluation({
        placement: placementId,
        raw_score: totalRawScore,
        percentage: calculatedPercent,
        grade: finalGrade,
        remarks: remarks.trim()
      });

      setSupervisorEvaluations((evaluations) => [
        ...evaluations,
        {
          ...(evaluation || {}),
          placement_id: placementId,
          raw_score: totalRawScore,
          supervisor_score: totalRawScore,
          remarks: remarks.trim(),
        },
      ]);
      const finalised = await handleFinaliseEvaluation(placementId, true);
      if (!finalised) {
        alert("School-supervisor assessment submitted, but the final result still needs to be finalised.");
      }
    } catch (err) {
      console.error("Error submitting evaluation:", err);
      setEvaluationError(err.response?.data?.detail || err.message || "Failed to submit the school-supervisor assessment.");
    } finally {
      setSavingSupervisorEvaluation(false);
    }
  }

  async function goToAssessment(student) {
    setCurrentStudent(student);
    setActiveTab('assessment');
    setRubricScores(createRubricScores());
    setRemarks('');
    setCompanyEvaluationForm({ company_score: '', remarks: '' });
    setEvaluationError('');
    try {
      const entries = await fetchStudentLogbookEntries(student.placement_id);
      setLogbooksList(entries);
    } catch (err) {
      console.error("Error fetching logbooks for student:", err);
      alert(err.response?.data?.detail || err.message || "Could not load this student's logbooks.");
    }
  }

  function handleSearchKeyDown(e) {
    if (e.key === 'Enter') {
      let query = searchQuery.toLowerCase().trim();
      let found = studentsList.find(s => 
        (s.name && s.name.toLowerCase().includes(query)) || 
        (s.student_id && s.student_id.toLowerCase().includes(query))
      );

      if (found) {
        goToAssessment(found);
      } else {
        alert("No student matching query found.");
      }
    }
  }

  function handleLogout() {
    localStorage.clear();
    alert("Logged out successfully.");
    window.location.href = "/";
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">
            <img 
              src="/logo.png" 
              alt="UIMS Logo" 
              className="brand-logo-img" 
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/42x42/0f25a2/ffffff?text=UIMS"; 
              }} 
            />
          </div>
          <div className="brand-text">
            <h1>UIMS Portal</h1>
            <span>Supervisor Dashboard</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={activeTab === 'dashboard' ? 'nav-item active' : 'nav-item'} onClick={() => handleTabChange('dashboard')}>
            <span>Dashboard</span>
          </button>
          <button className={activeTab === 'placements' ? 'nav-item active' : 'nav-item'} onClick={() => handleTabChange('placements')}>
            <span>Placements</span>
            <span className="badge">{pendingPlacements.length} Pending</span>
          </button>
          <button className={activeTab === 'logbooks' ? 'nav-item active' : 'nav-item'} onClick={() => handleTabChange('logbooks')}>
            <span>Logbooks</span>
            <span className="badge">{pendingLogbooks.length} Pending</span>
          </button>
          <button className={activeTab === 'visits' ? 'nav-item active' : 'nav-item'} onClick={() => handleTabChange('visits')}>
            <span>Visits</span>
            <span className="badge">{visitsList.length} Scheduled</span>
          </button>
          <button className={activeTab === 'students' ? 'nav-item active' : 'nav-item'} onClick={() => handleTabChange('students')}>
            <span>Assigned Students</span>
            <span className={atRiskStudents.length > 0 ? "badge badge-warning" : "badge"}>{atRiskStudents.length} At Risk</span>
          </button>
          <button className={activeTab === 'assessment' ? 'nav-item active' : 'nav-item'} onClick={() => handleTabChange('assessment')}>
            <span>Assessment</span>
          </button>
          <button className={activeTab === 'reports' ? 'nav-item active' : 'nav-item'} onClick={() => handleTabChange('reports')}>
            <span>Reports & Analytics</span>
          </button>
        </nav>
      </aside>

      {/* Main Workspace */}
      <main className="main-content">
        <header className="top-header">
          <div className="breadcrumb-container">
            <span className="academic-year">Academic Year 2025/2026</span>
            <span className="divider">/</span>
            <span className="current-page">Supervisor Dashboard</span>
          </div>
          <div className="header-controls">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search students, press Enter..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            </div>
            <span className="pill-status">Active Term</span>
            <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Logout</button>
          </div>
        </header>

        <div className="content-body">
          {loading && <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>Loading backend data...</p>}
          {loadError && <p role="alert" style={{ padding: '1rem', color: '#b91c1c' }}>{loadError}</p>}

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <section className="tab-view">
              <div className="action-header">
                <h1 className="page-title">Supervisor Dashboard Overview</h1>
              </div>

              {/* Dynamic Compliance Warning Banner */}
              {atRiskStudents.length > 0 ? (
                <div className="risk-alert-banner" role="alert" aria-live="polite">
                  <div className="risk-alert-icon" aria-hidden="true">⚠</div>
                  <div className="risk-alert-text">
                    <strong>Compliance Warning: {atRiskStudents.length} Student(s) At Risk</strong>
                    <p><strong>{atRiskStudents[0].name || atRiskStudents[0].student_name}</strong> is flagged for delayed logbooks or missed field visits.</p>
                  </div>
                  <button 
                    className="btn btn-secondary" 
                    style={{ marginLeft: 'auto', fontSize: '0.75rem' }} 
                    onClick={() => handleTabChange('students')}
                  >
                    View Students
                  </button>
                </div>
              ) : null}

              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Assigned Students</span>
                  <span className="stat-value">{studentsList.length}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Pending Placements</span>
                  <span className="stat-value text-orange">{pendingPlacements.length}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Pending Logbook Reviews</span>
                  <span className="stat-value text-orange">{pendingLogbooks.length}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Scheduled Visits</span>
                  <span className="stat-value text-blue">{visitsList.length}</span>
                </div>
              </div>

              {/* Dynamic Recent Activity Feed */}
              <div className="card-box" style={{ marginTop: '1.5rem' }}>
                <h3 className="box-title">Recent Activity & Updates</h3>
                <ul className="activity-list">
                  {logbooksList.length === 0 && visitsList.length === 0 && placementsList.length === 0 ? (
                    <li style={{ color: 'var(--text-muted)' }}>No recent activity recorded yet. Entries will appear as students submit logbooks and visits are logged.</li>
                  ) : (
                    <>
                      {placementsList.slice(0, 2).map((p, idx) => (
                        <li key={`act-plc-${idx}`}>
                          Placement recorded for <strong>{p.student_name}</strong> at <strong>{p.company}</strong>
                        </li>
                      ))}
                      {logbooksList.slice(0, 3).map((item, idx) => (
                        <li key={`act-log-${idx}`}>
                          <strong>{item.student_name || 'Student'}</strong> submitted Weekly Logbook Entry (Week {item.week_number || 1})
                        </li>
                      ))}
                      {visitsList.slice(0, 2).map((visit, idx) => (
                        <li key={`act-vis-${idx}`}>
                          Field Visit logged for <strong>{visit.student_name || visit.company_name || 'Intern'}</strong> ({visit.visit_date})
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </div>
            </section>
          )}

          {/* TAB 2: PLACEMENTS */}
          {activeTab === 'placements' && (
            <section className="tab-view">
              <div className="action-header">
                <h1 className="page-title">Assigned Student Placements</h1>
              </div>
              <div className="card-box">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Company / Organization</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {placementsList.length === 0 ? (
                      <tr><td colSpan="3" style={{ textAlign: 'center', padding: '1.5rem' }}>No assigned placements found.</td></tr>
                    ) : (
                      placementsList.map((item) => (
                        <tr key={item.id}>
                          <td><strong>{item.student_name}</strong></td>
                          <td>{item.company}</td>
                          <td>
                            <span className="pill-status" style={{
                              background: item.status === 'active' ? '#ecfdf5' : item.status === 'rejected' ? '#fef2f2' : '#fef3c7',
                              color: item.status === 'active' ? '#10b981' : item.status === 'rejected' ? '#ef4444' : '#d97706'
                            }}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 3: LOGBOOKS */}
          {activeTab === 'logbooks' && (
            <section className="tab-view">
              <div className="action-header">
                <h1 className="page-title">Weekly Logbook Review</h1>
              </div>
              <div className="card-box">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Placement / Company</th>
                      <th>Week #</th>
                      <th>Submitted Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logbooksList.length === 0 ? (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem' }}>No logbook entries found in database.</td></tr>
                    ) : (
                      logbooksList.map((item) => (
                        <tr key={item.id}>
                          <td><strong>{item.student_name || item.student || 'Student'}</strong></td>
                          <td>{item.company_name || 'Host Company'}</td>
                          <td>Week {item.week_number || item.week || 1}</td>
                          <td>{item.submission_date ? item.submission_date.split('T')[0] : 'N/A'}</td>
                          <td>
                            <span className="pill-status" style={{
                              background: item.status === 'reviewed' ? '#ecfdf5' : '#fef3c7',
                              color: item.status === 'reviewed' ? '#10b981' : '#d97706'
                            }}>
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => openLogbookModal(item)}>
                              Review & Feedback
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 4: VISITS */}
          {activeTab === 'visits' && (
            <section className="tab-view">
              <div className="action-header">
                <h1 className="page-title">Field Visits & Monitoring</h1>
                <button className="btn btn-primary" onClick={() => setShowVisitModal(true)}>+ Log New Field Visit</button>
              </div>
              <div className="card-box">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Company / Location</th>
                      <th>Visit Date</th>
                      <th>Outcome Rating</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitsList.length === 0 ? (
                      <tr><td colSpan="5" style={{ textAlign: 'center', padding: '1.5rem' }}>No field visits logged yet.</td></tr>
                    ) : (
                      visitsList.map((item, idx) => (
                        <tr key={idx}>
                          <td><strong>{item.student_name || item.student || 'Assigned Intern'}</strong></td>
                          <td>{item.company_name || 'Host Org'}</td>
                          <td>{item.visit_date || item.date}</td>
                          <td><span className="grade-badge">{(item.outcome || 'satisfactory').replace('_', ' ').toUpperCase()}</span></td>
                          <td>{item.notes || 'N/A'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 5: ASSIGNED STUDENTS */}
          {activeTab === 'students' && (
            <section className="tab-view">
              <div className="action-header">
                <h1 className="page-title">Assigned Interns</h1>
              </div>
              <div className="card-box">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Program</th>
                      <th>Logged Placement</th>
                      <th>Progress</th>
                      <th>Risk Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsList.length === 0 ? (
                      <tr><td colSpan="7" style={{ textAlign: 'center', padding: '1.5rem' }}>No assigned students found in database.</td></tr>
                    ) : (
                      studentsList.map((item) => (
                        <tr key={item.id}>
                          <td><code>{item.student_id || item.id}</code></td>
                          <td><strong>{item.name || item.student_name}</strong></td>
                          <td>{item.program || 'Computer Science'}</td>
                          <td>{item.company || item.placement_company || 'Host Org'}</td>
                          <td>{item.progress || `${item.logbooks_reviewed}/${item.logbooks_total} logbooks reviewed`}</td>
                          <td>
                            <span className={item.risk_status === 'AT_RISK' ? 'risk-tag-high' : 'risk-tag-normal'}>
                              {item.risk_status === 'AT_RISK' ? 'At Risk' : 'On Track'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => goToAssessment(item)}>
                              Evaluate
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 6: ASSESSMENT */}
          {activeTab === 'assessment' && (
            <section className="tab-view">
              <div className="sub-breadcrumb">SUPERVISOR PORTAL / ACADEMIC EVALUATION</div>
              
              <div className="action-header">
                <h1 className="page-title">Placement Assessment</h1>
                <div className="action-buttons">
                  <button className="btn btn-secondary" onClick={() => window.print()}>📄 Export Form-40 PDF</button>
                  <button
                    className="btn btn-primary"
                    onClick={handleEvaluationSubmit}
                    disabled={
                      !currentStudent
                      || !companyAssessmentSubmitted
                      || schoolAssessmentSubmitted
                      || completedRubricItems !== rubricScores.length
                      || !remarks.trim()
                      || savingSupervisorEvaluation
                    }
                  >
                    {schoolAssessmentSubmitted
                      ? "School Assessment Submitted"
                      : savingSupervisorEvaluation
                        ? "Submitting..."
                        : "Submit School Assessment"}
                  </button>
                </div>
              </div>
              {evaluationError && <p role="alert" style={{ marginBottom: '1rem', color: '#b91c1c' }}>{evaluationError}</p>}

              {!currentStudent ? (
                <div className="card-box" style={{ padding: '2rem', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No student selected. Please choose a student from the Assigned Students tab to conduct an assessment.</p>
                </div>
              ) : (
                <>
                  {/* Banner Details */}
                  <div className="banner-card">
                    <div className="student-info-section">
                      <div className="avatar-placeholder">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <div className="student-details">
                        <div className="name-row">
                          <h3>{currentStudent.name || currentStudent.student_name}</h3>
                          <span className="id-tag">{currentStudent.student_id || currentStudent.id}</span>
                        </div>
                        <p className="dept-text">{currentStudent.dept || 'School of Computing & IT'}</p>
                        <p className="meta-text">{currentStudent.program || 'BSc. Computer Science'}</p>
                      </div>
                    </div>

                    <div className="placement-info-section">
                      <span className="section-label">STUDENT RECORDED PLACEMENT</span>
                      <h4 className="company-name">{currentStudent.company || 'Host Organization'}</h4>
                      <p className="role-title">{currentStudent.role || 'Software Engineering Intern'}</p>
                      <p className="meta-text">Location: {currentStudent.location || 'Nairobi'}</p>
                    </div>

                    <div className="co-eval-section">
                      <span className="section-label">SCHOOL-SUPERVISOR SCORE</span>
                      <div className="score-badge-row">
                        <span className="score-large">{displayedSchoolScore} / 40</span>
                        <span className="grade-badge">{finalGrade.split(' ')[0]}</span>
                      </div>
                      <div className="verified-status">
                        {schoolAssessmentSubmitted ? "Assessment submitted" : "Assessment pending"}
                      </div>
                    </div>
                  </div>

                  <div className="card-box" style={{ marginBottom: '1.5rem' }}>
                    <div className="rubric-header">
                      <div>
                        <h2>Step 1: Company Supervisor Assessment</h2>
                        <p>Record the company supervisor's assessment from the evaluation sheet (60 points).</p>
                      </div>
                      <span className="progress-pill">
                        {companyAssessmentSubmitted ? "Submitted" : "Awaiting company assessment"}
                      </span>
                    </div>
                    {companyAssessmentSubmitted ? (
                      <div>
                        <p><strong>Company score:</strong> {companyEvaluation.company_score} / 60</p>
                        {companyEvaluation.remarks && (
                          <p style={{ marginTop: '0.5rem' }}>
                            <strong>Company feedback:</strong> {companyEvaluation.remarks}
                          </p>
                        )}
                      </div>
                    ) : (
                      <form onSubmit={handleCompanyEvaluationSubmit}>
                        <div className="remarks-box">
                          <label htmlFor="company-assessment-score">Company assessment score (0-60)</label>
                          <input
                            id="company-assessment-score"
                            className="form-input"
                            type="number"
                            min="0"
                            max="60"
                            step="0.01"
                            required
                            value={companyEvaluationForm.company_score}
                            onChange={(event) => setCompanyEvaluationForm((form) => ({
                              ...form,
                              company_score: event.target.value,
                            }))}
                          />
                        </div>
                        <div className="remarks-box">
                          <label htmlFor="company-assessment-remarks">Company supervisor feedback</label>
                          <textarea
                            id="company-assessment-remarks"
                            rows="3"
                            value={companyEvaluationForm.remarks}
                            onChange={(event) => setCompanyEvaluationForm((form) => ({
                              ...form,
                              remarks: event.target.value,
                            }))}
                            placeholder="Enter the company supervisor's remarks from the assessment."
                          />
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={savingCompanyEvaluation}>
                          {savingCompanyEvaluation ? "Saving..." : "Save Company Assessment"}
                        </button>
                      </form>
                    )}
                    {companyAssessmentSubmitted && schoolAssessmentSubmitted && !selectedPlacementFinalised && (
                      <div style={{ marginTop: '1rem' }}>
                        <p className="meta-text">
                          Both score components are available. Finalise the combined result using the evaluation service.
                        </p>
                        <button
                          className="btn btn-primary"
                          type="button"
                          disabled={finalisingEvaluation}
                          onClick={() => handleFinaliseEvaluation(selectedPlacementId)}
                        >
                          {finalisingEvaluation ? "Finalising..." : "Retry Finalisation"}
                        </button>
                      </div>
                    )}
                    {selectedPlacementFinalised && (
                      <p className="verified-status" style={{ marginTop: '1rem' }}>
                        Final result finalised by the system.
                      </p>
                    )}
                    {companyAssessmentSubmitted && schoolAssessmentSubmitted && (
                      <div className="score-breakdown" style={{ marginTop: '1rem' }}>
                        <div className="breakdown-row">
                          <span>Company (out of 60)</span>
                          <strong>{companyEvaluation.company_score}</strong>
                        </div>
                        <div className="breakdown-row">
                          <span>School supervisor (out of 40)</span>
                          <strong>{displayedSchoolScore}</strong>
                        </div>
                        {selectedPlacementFinalised && (
                          <div className="breakdown-row">
                            <span>Combined score (out of 100)</span>
                            <strong>
                              {Number(companyEvaluation.company_score) + displayedSchoolScore}
                            </strong>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Rubric Grid */}
                  <div className="grid-layout">
                    <div className="rubric-container">
                      <div className="rubric-header">
                        <div>
                          <h2>Step 2: School Supervisor Assessment</h2>
                          <p>Score each criterion from 0 to 10, for a total of 40 points, and provide feedback.</p>
                        </div>
                        <span className="progress-pill">
                          Progress: <strong>{schoolAssessmentSubmitted ? rubricScores.length : completedRubricItems} / {rubricScores.length}</strong> Completed
                        </span>
                      </div>

                      {schoolAssessmentSubmitted ? (
                        <div className="card-box">
                          <h3>School-supervisor assessment submitted</h3>
                          <p style={{ marginTop: '0.5rem' }}>
                            Score: <strong>{displayedSchoolScore} / 40</strong>
                          </p>
                          <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
                            Feedback: {supervisorEvaluation.remarks || "No feedback recorded."}
                          </p>
                        </div>
                      ) : rubricScores.map((item) => (
                        <div className="rubric-card" key={item.id}>
                          <div className="rubric-card-top">
                            <div className="criterion-title-box">
                              <span className="criterion-num">0{item.id}</span>
                              <span className="criterion-title">{item.title}</span>
                            </div>
                            <span className="score-tag">{item.score} / 10</span>
                          </div>
                          <p className="criterion-desc">{item.description}</p>
                          <div className="rating-scale">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                              <button 
                                key={s} 
                                type="button" 
                                className={item.score === s ? 'score-btn selected' : 'score-btn'} 
                                onClick={() => updateScore(item.id, s)}
                                disabled={schoolAssessmentSubmitted}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="scorecard-column">
                      <div className="scorecard-card">
                        <span className="section-label">LIVE AGGREGATION</span>
                        <h2 className="scorecard-title">Academic Scorecard</h2>

                        <div className="score-display">
                          <span className="raw-label">School supervisor raw score:</span>
                          <div className="raw-value">{displayedSchoolScore} <span className="max-value">/ 40</span></div>
                        </div>

                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${schoolAssessmentSubmitted ? (displayedSchoolScore / 40) * 100 : calculatedPercent}%` }}></div>
                        </div>

                        <div className="score-breakdown">
                          <div className="breakdown-row">
                            <span>School assessment:</span>
                            <strong>{displayedSchoolScore} / 40</strong>
                          </div>
                          <div className="breakdown-row">
                            <span>Company assessment:</span>
                            <strong>{companyAssessmentSubmitted ? `${companyEvaluation.company_score} / 60` : "Pending"}</strong>
                          </div>
                          {companyAssessmentSubmitted && (
                            <div className="breakdown-row">
                              <span>Combined points:</span>
                              <strong>{Number(companyEvaluation.company_score) + displayedSchoolScore} / 100</strong>
                            </div>
                          )}
                        </div>

                        {!schoolAssessmentSubmitted && (
                          <div className="remarks-box">
                            <label htmlFor="school-assessment-remarks">School supervisor feedback</label>
                            <textarea
                              id="school-assessment-remarks"
                              rows="4"
                              placeholder="Enter constructive feedback..."
                              value={remarks}
                              onChange={(e) => setRemarks(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>
          )}

          {/* TAB 7: REPORTS & ANALYTICS */}
          {activeTab === 'reports' && (
            <section className="tab-view">
              <div className="action-header">
                <h1 className="page-title">Supervisor Workload & Performance Reports</h1>
                <button className="btn btn-primary" onClick={() => window.print()}>
                  📊 Export Summary Report
                </button>
              </div>

              <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="stat-card">
                  <span className="stat-label">Assigned Workload</span>
                  <span className="stat-value">{workloadReport?.total_students ?? studentsList.length} Students</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Reviewed Logbooks</span>
                  <span className="stat-value text-blue">
                    {logbooksList.filter(l => l.status === 'reviewed').length} / {logbooksList.length}
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Completed Field Visits</span>
                  <span className="stat-value text-blue">{visitsList.length}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Compliance Rate</span>
                  <span className="stat-value text-orange">
                    {studentsList.length > 0 ? (((studentsList.length - atRiskStudents.length) / studentsList.length) * 100).toFixed(0) + '%' : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="card-box">
                <h3 className="box-title">Student Performance Summary</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Value</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total Active Internships</td>
                      <td><strong>{studentsList.length}</strong></td>
                      <td>
                        <span className={studentsList.length > 0 ? "risk-tag-normal" : "risk-tag-na"}>
                          {studentsList.length > 0 ? "Active" : "N/A"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Students On Track</td>
                      <td><strong>{studentsList.length > 0 ? (studentsList.length - atRiskStudents.length) : 0}</strong></td>
                      <td>
                        <span className={studentsList.length > 0 ? "risk-tag-normal" : "risk-tag-na"}>
                          {studentsList.length > 0 ? "Good" : "N/A"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Students At Risk</td>
                      <td><strong>{atRiskStudents.length}</strong></td>
                      <td>
                        <span className={atRiskStudents.length > 0 ? "risk-tag-high" : "risk-tag-na"}>
                          {atRiskStudents.length > 0 ? "Requires Attention" : "N/A"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Total Field Visits Logged</td>
                      <td><strong>{visitsList.length}</strong></td>
                      <td>
                        <span className={visitsList.length > 0 ? "risk-tag-normal" : "risk-tag-na"}>
                          {visitsList.length > 0 ? "Recorded" : "N/A"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* LOGBOOK MODAL */}
      {showLogbookModal && selectedLogbook && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Review Weekly Logbook</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {selectedLogbook.student_name || 'Student'} - Week {selectedLogbook.week_number || 1}
            </p>
            <div style={{ background: 'var(--light-bg)', padding: '1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <strong>Student Entry:</strong>
              {loadingLogbook ? (
                <p style={{ marginTop: '0.4rem' }}>Loading full logbook entry...</p>
              ) : (
                <p style={{ marginTop: '0.4rem', whiteSpace: 'pre-wrap' }}>{selectedLogbook.content || 'No entry content provided.'}</p>
              )}
            </div>

            <div className="remarks-box" style={{ marginTop: '1rem' }}>
              <label>Supervisor Written Feedback:</label>
              <textarea 
                rows="3" 
                placeholder="Type feedback or required revisions..." 
                value={feedbackText} 
                onChange={(e) => setFeedbackText(e.target.value)} 
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowLogbookModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveLogbookFeedback} disabled={loadingLogbook}>Submit Feedback</button>
            </div>
          </div>
        </div>
      )}

      {/* FIELD VISIT MODAL */}
      {showVisitModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Log New Field Visit</h3>
            <form onSubmit={handleVisitSubmit}>
              <div className="remarks-box" style={{ marginTop: '0.5rem' }}>
                <label>Select Student Placement:</label>
                <select className="form-input" value={visitPlacementId} onChange={(e) => setVisitPlacementId(e.target.value)} required>
                  <option value="">-- Choose Student --</option>
                  {studentsList.map(s => <option key={s.id} value={s.placement_id || s.id}>{s.name || s.student_name} ({s.company || 'Host Company'})</option>)}
                </select>
              </div>
              <div className="remarks-box" style={{ marginTop: '1rem' }}>
                <label>Visit Date:</label>
                <input type="date" className="form-input" required value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
              </div>
              <div className="remarks-box" style={{ marginTop: '1rem' }}>
                <label>Outcome Rating:</label>
                <select className="form-input" value={visitOutcome} onChange={(e) => setVisitOutcome(e.target.value)}>
                  <option value="satisfactory">SATISFACTORY</option>
                  <option value="needs_improvement">NEEDS IMPROVEMENT</option>
                  <option value="excellent">EXCELLENT</option>
                </select>
              </div>
              <div className="remarks-box" style={{ marginTop: '1rem' }}>
                <label>Visit Notes & Observations:</label>
                <textarea rows="3" required placeholder="Enter observations..." value={visitNotes} onChange={(e) => setVisitNotes(e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowVisitModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Field Visit Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING ACCESSIBILITY WIDGET */}
      <div className="accessibility-widget-wrapper">
        <button 
          className="accessibility-trigger-btn"
          onClick={() => setShowA11yPanel(!showA11yPanel)}
          aria-label="Open Accessibility Menu"
          title="Accessibility Options"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 4z"/>
            <path d="M12 10v6"/>
            <path d="M9 13l3-1 3 1"/>
            <path d="M10 18l2-2 2 2"/>
          </svg>
        </button>

        {showA11yPanel && (
          <div className="accessibility-panel" role="dialog" aria-label="Accessibility Preferences">
            <h4>
              <span>Accessibility Menu</span>
              <button 
                onClick={() => setShowA11yPanel(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
                aria-label="Close menu"
              >
                ✕
              </button>
            </h4>

            <button 
              className={`a11y-toggle-btn ${isHighContrast ? 'active' : ''}`}
              onClick={() => setIsHighContrast(!isHighContrast)}
              aria-pressed={isHighContrast}
            >
              <span>High Contrast</span>
              <span>{isHighContrast ? 'ON' : 'OFF'}</span>
            </button>

            <button 
              className={`a11y-toggle-btn ${isLargeText ? 'active' : ''}`}
              onClick={() => setIsLargeText(!isLargeText)}
              aria-pressed={isLargeText}
            >
              <span>Larger Text</span>
              <span>{isLargeText ? 'ON' : 'OFF'}</span>
            </button>

            <button 
              className={`a11y-toggle-btn ${isDyslexicFont ? 'active' : ''}`}
              onClick={() => setIsDyslexicFont(!isDyslexicFont)}
              aria-pressed={isDyslexicFont}
            >
              <span>Dyslexia-Friendly Font</span>
              <span>{isDyslexicFont ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupervisorDashboard;