import React, { useState, useEffect } from 'react';
import './SupervisorDashboard.css';
import { 
  fetchAssignedStudents, 
  fetchStudentLogbookEntries, 
  fetchLogbooksOverview,
  submitLogbookFeedback, 
  fetchFieldVisits, 
  createFieldVisit,
  submitSupervisorEvaluation,
  finaliseStudentEvaluation,
  fetchMyWorkloadReport
} from '../src/api/supervisorApi';

function SupervisorDashboard() {
  // Navigation tab state: 'dashboard' | 'logbooks' | 'visits' | 'students' | 'assessment' | 'reports'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Data States connected to Backend
  const [studentsList, setStudentsList] = useState([]);
  const [logbooksList, setLogbooksList] = useState([]);
  const [visitsList, setVisitsList] = useState([]);
  const [workloadReport, setWorkloadReport] = useState(null);

  // Accessibility States
  const [showA11yPanel, setShowA11yPanel] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);

  // Modals state
  const [showLogbookModal, setShowLogbookModal] = useState(false);
  const [selectedLogbook, setSelectedLogbook] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [reviewDecision, setReviewDecision] = useState('APPROVED');

  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitPlacementId, setVisitPlacementId] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitOutcome, setVisitOutcome] = useState('SATISFACTORY');
  const [visitNotes, setVisitNotes] = useState('');

  // Assessment State
  const [currentStudent, setCurrentStudent] = useState(null);
  const [rubricScores, setRubricScores] = useState([
    { id: 1, title: "Weekly Logbook Quality & Reflective Rigor", description: "Documentation of engineering tasks and problem-solving analysis.", score: 9 },
    { id: 2, title: "Technical & Domain Competency", description: "Application of computing concepts and execution of tasks.", score: 9 },
    { id: 3, title: "Professionalism & Work Ethic", description: "Punctuality, communication skills, and professional integrity.", score: 10 },
    { id: 4, title: "Problem Solving & Initiative", description: "Ability to analyze technical hurdles and propose solutions.", score: 9 },
    { id: 5, title: "Adaptability & Team Collaboration", description: "Integration into technical teams and reception to feedback.", score: 9 },
    { id: 6, title: "Final Technical Report & Defense", description: "Overall technical synthesis and clarity of final deliverables.", score: 9 }
  ]);
  const [remarks, setRemarks] = useState('');

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
        const studentsData = await fetchAssignedStudents();
        setStudentsList(studentsData || []);

        if (studentsData && studentsData.length > 0) {
          setCurrentStudent(studentsData[0]);
          const initialLogbooks = await fetchStudentLogbookEntries(studentsData[0].placement_id || studentsData[0].id);
          setLogbooksList(initialLogbooks || []);
        } else {
          try {
            const overview = await fetchLogbooksOverview();
            setLogbooksList(overview || []);
          } catch (oErr) {
            console.warn("Logbook overview fallback returned error:", oErr);
          }
        }

        const visitsData = await fetchFieldVisits();
        setVisitsList(visitsData || []);

        try {
          const reportData = await fetchMyWorkloadReport();
          setWorkloadReport(reportData);
        } catch (rErr) {
          console.warn("Workload report endpoint returned error or unpopulated:", rErr);
        }

      } catch (err) {
        console.error("Failed to load initial data from backend API:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Dynamic Calculations from Backend State
  const atRiskStudents = studentsList.filter(s => s.risk_status === 'AT_RISK' || s.is_at_risk === true);
  const pendingLogbooks = logbooksList.filter(l => l.status === 'PENDING');

  // Scorecard Calculations
  let totalRawScore = rubricScores.reduce((sum, item) => sum + item.score, 0);
  let calculatedPercent = ((totalRawScore / 60) * 100).toFixed(1);
  let finalGrade = "F (Fail)";
  if (calculatedPercent >= 70) finalGrade = "A (First Class)";
  else if (calculatedPercent >= 60) finalGrade = "B (Upper Second)";
  else if (calculatedPercent >= 50) finalGrade = "C (Lower Second)";
  else if (calculatedPercent >= 40) finalGrade = "D (Pass)";

  // Handlers
  function handleTabChange(tabName) {
    setActiveTab(tabName);
  }

  function updateScore(id, newScore) {
    setRubricScores(rubricScores.map(item => item.id === id ? { ...item, score: newScore } : item));
  }

  function openLogbookModal(logbook) {
    setSelectedLogbook(logbook);
    setFeedbackText('');
    setReviewDecision('APPROVED');
    setShowLogbookModal(true);
  }

  async function saveLogbookFeedback() {
    if (!feedbackText.trim()) {
      alert("Please write your feedback before submitting.");
      return;
    }

    try {
      await submitLogbookFeedback(selectedLogbook.id, {
        comment: feedbackText,
        action: reviewDecision
      });

      alert("Logbook feedback saved successfully!");
      setShowLogbookModal(false);

      if (currentStudent) {
        const updated = await fetchStudentLogbookEntries(currentStudent.placement_id || currentStudent.id);
        setLogbooksList(updated || []);
      }
    } catch (err) {
      console.error("Error submitting logbook feedback:", err);
      alert("Failed to save feedback to server.");
    }
  }

  async function handleVisitSubmit(e) {
    e.preventDefault();
    try {
      await createFieldVisit({
        placement_id: visitPlacementId,
        visit_date: visitDate,
        outcome: visitOutcome,
        notes: visitNotes
      });

      alert("Field visit saved to database!");
      setShowVisitModal(false);

      const updatedVisits = await fetchFieldVisits();
      setVisitsList(updatedVisits || []);
    } catch (err) {
      console.error("Error creating field visit:", err);
      alert("Failed to save field visit.");
    }
  }

  async function handleEvaluationSubmit() {
    if (!remarks.trim()) {
      alert("Please enter supervisor remarks.");
      return;
    }

    const placementId = currentStudent?.placement_id || currentStudent?.id;

    try {
      await submitSupervisorEvaluation({
        placement_id: placementId,
        raw_score: totalRawScore,
        percentage: calculatedPercent,
        grade: finalGrade,
        remarks: remarks
      });

      if (placementId) {
        await finaliseStudentEvaluation(placementId);
      }

      alert("Academic evaluation submitted and finalized successfully!");
    } catch (err) {
      console.error("Error submitting evaluation:", err);
      alert("Failed to submit evaluation.");
    }
  }

  async function goToAssessment(student) {
    setCurrentStudent(student);
    setActiveTab('assessment');
    try {
      const entries = await fetchStudentLogbookEntries(student.placement_id || student.id);
      setLogbooksList(entries || []);
    } catch (err) {
      console.error("Error fetching logbooks for student:", err);
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
            {/* Enlarged UIMS Logo Image Badge */}
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
                  <span className="stat-label">Pending Logbook Reviews</span>
                  <span className="stat-value text-orange">{pendingLogbooks.length}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Scheduled Visits</span>
                  <span className="stat-value text-blue">{visitsList.length}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">At Risk Students</span>
                  <span className="stat-value text-red">{atRiskStudents.length}</span>
                </div>
              </div>

              {/* Dynamic Recent Activity Feed */}
              <div className="card-box" style={{ marginTop: '1.5rem' }}>
                <h3 className="box-title">Recent Activity & Updates</h3>
                <ul className="activity-list">
                  {logbooksList.length === 0 && visitsList.length === 0 ? (
                    <li style={{ color: 'var(--text-muted)' }}>No recent activity recorded yet. Entries will appear as students submit logbooks and visits are logged.</li>
                  ) : (
                    <>
                      {logbooksList.slice(0, 3).map((item, idx) => (
                        <li key={`act-log-${idx}`}>
                          <strong>{item.student_name || 'Student'}</strong> submitted Weekly Logbook Entry (Week {item.week_number || 1})
                        </li>
                      ))}
                      {visitsList.slice(0, 2).map((visit, idx) => (
                        <li key={`act-vis-${idx}`}>
                          Field Visit logged for <strong>{visit.student_name || visit.company || 'Intern'}</strong> ({visit.visit_date})
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </div>
            </section>
          )}

          {/* TAB 2: LOGBOOKS */}
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
                          <td>{item.company || 'Host Company'}</td>
                          <td>Week {item.week_number || item.week || 1}</td>
                          <td>{item.created_at ? item.created_at.split('T')[0] : item.date || 'N/A'}</td>
                          <td>
                            <span className="pill-status" style={{
                              background: item.status === 'APPROVED' ? '#ecfdf5' : item.status === 'REJECTED' ? '#fef2f2' : '#fef3c7',
                              color: item.status === 'APPROVED' ? '#10b981' : item.status === 'REJECTED' ? '#ef4444' : '#d97706'
                            }}>
                              {item.status || 'PENDING'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => openLogbookModal(item)}>
                              Review & Decision
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

          {/* TAB 3: VISITS */}
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
                          <td>{item.company || item.location || 'Host Org'}</td>
                          <td>{item.visit_date || item.date}</td>
                          <td><span className="grade-badge">{item.outcome || 'SATISFACTORY'}</span></td>
                          <td>{item.notes || 'N/A'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 4: ASSIGNED STUDENTS */}
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
                          <td>{item.progress || 'N/A'}</td>
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

          {/* TAB 5: ASSESSMENT */}
          {activeTab === 'assessment' && (
            <section className="tab-view">
              <div className="sub-breadcrumb">SUPERVISOR PORTAL / ACADEMIC EVALUATION</div>
              
              <div className="action-header">
                <h1 className="page-title">University Academic Supervisor Assessment</h1>
                <div className="action-buttons">
                  <button className="btn btn-secondary" onClick={() => window.print()}>📄 Export Form-40 PDF</button>
                  <button className="btn btn-secondary" onClick={() => alert("Draft saved!")}>Save Draft</button>
                  <button className="btn btn-primary" onClick={handleEvaluationSubmit}>Ratify & Submit Assessment</button>
                </div>
              </div>

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
                      <span className="section-label">LOGBOOK COMPLIANCE</span>
                      <div className="score-badge-row">
                        <span className="score-large">{totalRawScore}.00 / 60.00</span>
                        <span className="grade-badge">{finalGrade.split(' ')[0]}</span>
                      </div>
                      <div className="verified-status">Logbook Verified</div>
                    </div>
                  </div>

                  {/* Rubric Grid */}
                  <div className="grid-layout">
                    <div className="rubric-container">
                      <div className="rubric-header">
                        <div>
                          <h2>Academic Rubric Evaluation</h2>
                          <p>Score 1 to 10 points per criterion based on student logbooks and progress.</p>
                        </div>
                        <span className="progress-pill">Progress: <strong>6 / 6</strong> Completed</span>
                      </div>

                      {rubricScores.map((item) => (
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
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                              <button 
                                key={s} 
                                type="button" 
                                className={item.score === s ? 'score-btn selected' : 'score-btn'} 
                                onClick={() => updateScore(item.id, s)}
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
                          <span className="raw-label">Raw Score:</span>
                          <div className="raw-value">{totalRawScore} <span className="max-value">/ 60</span></div>
                        </div>

                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: calculatedPercent + '%' }}></div>
                        </div>

                        <div className="score-breakdown">
                          <div className="breakdown-row">
                            <span>Percentage:</span>
                            <strong>{calculatedPercent}%</strong>
                          </div>
                          <div className="breakdown-row">
                            <span>Grade Category:</span>
                            <strong className="grade-text">{finalGrade}</strong>
                          </div>
                        </div>

                        <div className="remarks-box">
                          <label>Supervisor Remarks & Feedback:</label>
                          <textarea 
                            rows="4" 
                            placeholder="Enter constructive feedback..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>
          )}

          {/* TAB 6: REPORTS & ANALYTICS */}
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
                  <span className="stat-value">{workloadReport?.assigned_students ?? studentsList.length} Students</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Reviewed Logbooks</span>
                  <span className="stat-value text-blue">
                    {logbooksList.filter(l => l.status === 'APPROVED' || l.status === 'REJECTED').length} / {logbooksList.length}
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

              {/* Dynamic Status Badges in Performance Summary Table */}
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
              {selectedLogbook.student_name || 'Student'} • Week {selectedLogbook.week_number || 1}
            </p>
            <div style={{ background: 'var(--light-bg)', padding: '1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <strong>Student Entry:</strong>
              <p style={{ marginTop: '0.4rem' }}>{selectedLogbook.content || selectedLogbook.summary || 'Summary submitted.'}</p>
            </div>

            <div className="remarks-box" style={{ marginTop: '0.5rem' }}>
              <label>Review Decision:</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.3rem' }}>
                <label style={{ fontWeight: 'normal', cursor: 'pointer' }}>
                  <input type="radio" name="decision" value="APPROVED" checked={reviewDecision === 'APPROVED'} onChange={() => setReviewDecision('APPROVED')} /> Approve Entry
                </label>
                <label style={{ fontWeight: 'normal', cursor: 'pointer' }}>
                  <input type="radio" name="decision" value="REJECTED" checked={reviewDecision === 'REJECTED'} onChange={() => setReviewDecision('REJECTED')} /> Request Revisions
                </label>
              </div>
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
              <button className="btn btn-primary" onClick={saveLogbookFeedback}>Submit Decision</button>
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
                  <option value="SATISFACTORY">SATISFACTORY</option>
                  <option value="NEEDS_IMPROVEMENT">NEEDS IMPROVEMENT</option>
                  <option value="EXCELLENT">EXCELLENT</option>
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
            <path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
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