import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './studentDashboard.css';
import logo from '../assets/logo.png';
import SubmitPlacementForm from "./submitPlacementForm";
import SubmitLogbookForm from "./SubmitLogbookForm";
import client from "../api/client";

export default function StudentDashboard() {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // User profile state fetched from API
    const [user, setUser] = useState({
        full_name: "Jane Njeri",
        program: "BSc Computer Science"
    });

    // Placement status and details state
    const [placementStatus, setPlacementStatus] = useState("none"); // "none", "pending", "active"
    const [placementDetails, setPlacementDetails] = useState({
        id: null,
        company_name: "",
        role: "",
        supervisor_name: "",
        department: "",
        start_date: "",
        end_date: ""
    });

    // Logbooks state & selected logbook modal state
    const [logbooks, setLogbooks] = useState([]);
    const [selectedLogbook, setSelectedLogbook] = useState(null);

    const navigate = useNavigate();

    // Fetch live user data, placement details, and logbooks on mount
    const fetchDashboardData = async () => {
        // 1. Fetch User Profile Details
        try {
            const userResponse = await client.get('/auth/me/');
            setUser(prev => ({
                ...prev,
                ...userResponse.data
            }));
        } catch (error) {
            console.error("Error fetching user data:", error);
        }

        // 2. Fetch Student Placement Status & Info
        try {
            const placementResponse = await client.get('/internships/placements/mine/');
            const data = placementResponse.data;

            // Check if data is empty, null, or indicates no placement
            if (!data || data.status === 'none' || !data.placement || (Array.isArray(data) && data.length === 0)) {
                setPlacementStatus('none');
                setPlacementDetails({
                    id: null,
                    company_name: "",
                    role: "",
                    supervisor_name: "",
                    department: "",
                    start_date: "",
                    end_date: ""
                });
            } else {
                const rawDetails = data.placement || data;
                
                // Map backend role_description to role so frontend state has it instantly
                const details = {
                    ...rawDetails,
                    role: rawDetails.role || rawDetails.role_description || ""
                };

                setPlacementDetails(details);
                
                const status = (details?.status || data.status || "").toUpperCase();
                if (status === 'ACTIVE' || status === 'APPROVED') {
                    setPlacementStatus('active');
                    fetchLogbooks(); // Fetch real logbooks once active
                } else if (status === 'PENDING' || status === 'PENDING_COORDINATOR_REVIEW') {
                    setPlacementStatus('pending');
                } else {
                    setPlacementStatus('none');
                }
            }
        } catch (error) {
            setPlacementStatus('none');
            setPlacementDetails({
                id: null,
                company_name: "",
                role: "",
                supervisor_name: "",
                department: "",
                start_date: "",
                end_date: ""
            });
        }
    };

    const fetchLogbooks = async () => {
        try {
            const res = await client.get('/logbooks/mine/');
            // Handle both DRF paginated responses ({ results: [...] }) and flat arrays ([...])
            const data = res.data;
            const logbookArray = Array.isArray(data) ? data : (data.results || []);
            setLogbooks(logbookArray);
        } catch (error) {
            console.error("Error fetching logbooks:", error);
        }
    };

    // Handle clicking a logbook row to hit the specific entry endpoint (/api/logbooks/{id}/)
    const handleLogbookClick = async (log) => {
        try {
            const res = await client.get(`/logbooks/${log.id}/`);
            setSelectedLogbook(res.data);
        } catch (error) {
            console.error("Error fetching logbook details:", error);
            // Fallback to row data if endpoint fails
            setSelectedLogbook(log);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        toast.info("Logged out successfully");
        navigate("/");
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <div className="dashboard-container">
            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

            {/* Sidebar Navigation */}
            <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="sidebar-brand">
                    <img src={logo} alt="UIMS Logo" className="brand-logo" />
                    <h2>University Internship Management System</h2>
                </div>
                <nav className="sidebar-nav">
                    <a href="#dashboard" className={activeTab === "Dashboard" ? "active" : ""} onClick={() => { setActiveTab("Dashboard"); setSidebarOpen(false); }}>
                        Dashboard
                    </a>
                    <a href="#placement" className={activeTab === "Placement" ? "active" : ""} onClick={() => { setActiveTab("Placement"); setSidebarOpen(false); }}>
                        Placement
                    </a>
                    <a href="#logbook" className={activeTab === "Logbook" || activeTab === "LogbookForm" ? "active" : ""} onClick={() => { setActiveTab("Logbook"); setSidebarOpen(false); }}>
                        Logbook
                    </a>
                    <a href="#evaluations" className={activeTab === "Evaluations" ? "active" : ""} onClick={() => { setActiveTab("Evaluations"); setSidebarOpen(false); }}>
                        Evaluations
                    </a>
                    <a href="#profile" className={activeTab === "Profile" ? "active" : ""} onClick={() => { setActiveTab("Profile"); setSidebarOpen(false); }}>
                        Profile
                    </a>

                    <a 
                        href="#logout" 
                        className="logout-nav-link" 
                        onClick={(e) => { 
                            e.preventDefault(); 
                            handleLogout(); 
                        }}
                    >
                        Logout
                    </a>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="dashboard-main-area">
                <div className="dashboard-inner-card">
                    
                    {/* Header */}
                    <div className="dash-top-header">
                        <div className="header-left-group">
                            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                            </button>
                            <div>
                                <span className="welcome-sub">Welcome back</span>
                                <h1 className="user-fullname">{user.full_name}</h1>
                                <p className="user-program">{user.program}</p>
                            </div>
                        </div>
                        <div className="user-avatar-badge">{getInitials(user.full_name)}</div>
                    </div>

                    {/* MAIN TAB & STATUS ROUTING */}
                    {activeTab === "Placement" ? (
                        /* PLACEMENT TAB VIEWS */
                        placementStatus === "none" ? (
                            <SubmitPlacementForm 
                                onSuccess={() => {
                                    setPlacementStatus("pending");
                                    setActiveTab("Dashboard");
                                    fetchDashboardData();
                                }} 
                                onCancel={() => setActiveTab("Dashboard")} 
                            />
                        ) : (
                            <div className="placement-details-page">
                                <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h2>Internship Placement Details</h2>
                                    <span className={placementStatus === "active" ? "active-pill" : "status-badge pending"}>
                                        {placementStatus === "active" ? "Active" : "Pending Review"}
                                    </span>
                                </div>
                                
                                <div className="placement-info-card full-width">
                                    <h3>{placementDetails?.company_name || "Company Name"}</h3>
                                    <p className="role-text" style={{ marginTop: '10px' }}><strong>Role:</strong> {placementDetails?.role || placementDetails?.role_description || "Internship Role"}</p>
                                    <p className="supervisor-text" style={{ marginTop: '8px' }}><strong>Supervisor:</strong> {placementDetails?.supervisor_name || "Assigned by Coordinator"}</p>
                                    <p className="supervisor-text" style={{ marginTop: '8px' }}><strong>Department:</strong> {placementDetails?.department || "N/A"}</p>
                                    <p className="date-text" style={{ marginTop: '8px' }}>
                                        <strong>Duration:</strong> {placementDetails?.internship_start && placementDetails?.internship_end ? `${placementDetails.internship_start} to ${placementDetails.internship_end}` : (placementDetails?.start_date && placementDetails?.end_date ? `${placementDetails.start_date} to ${placementDetails.end_date}` : "10 Weeks")}
                                    </p>
                                    
                                    {placementStatus === "pending" && (
                                        <p className="pending-note" style={{ marginTop: '15px' }}>
                                            Your details are currently being reviewed by your coordinator. Logbook tracking and weekly statistics will unlock once approved.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    ) : activeTab === "LogbookForm" ? (
                        /* SUBMIT LOGBOOK FORM VIEW */
                        <SubmitLogbookForm 
                            placementId={placementDetails?.id}
                            onSuccess={() => {
                                fetchLogbooks();
                                setActiveTab("Logbook");
                            }}
                            onCancel={() => setActiveTab("Logbook")}
                        />
                    ) : activeTab === "Logbook" ? (
                        /* FULL LOGBOOK LIST VIEW */
                        <div className="logbook-section-card">
                            <div className="logbook-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3>All Logbook Entries</h3>
                                <button className="submit-logbook-btn" onClick={() => setActiveTab("LogbookForm")}>Submit new logbook</button>
                            </div>
                            <div className="logbook-table-container">
                                {logbooks.length === 0 ? (
                                    <p style={{ color: '#777', padding: '20px 0' }}>No logbook entries found. Click above to submit your first entry!</p>
                                ) : (
                                    logbooks.map((log) => (
                                        <div 
                                            className="logbook-row clickable-row" 
                                            key={log.id} 
                                            onClick={() => handleLogbookClick(log)}
                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee', cursor: 'pointer' }}
                                        >
                                            <span className="log-date">Week {log.week_number}</span>
                                            <span className="log-desc" style={{ flex: 2, margin: '0 20px' }}>{log.content}</span>
                                            <span className={`log-status ${log.status?.toLowerCase()}`}>{log.status || "Pending"}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        /* DASHBOARD TAB VIEWS */
                        <>
                            {/* STATE 1: NO PLACEMENT */}
                            {placementStatus === "none" && (
                                <div className="empty-placement-state">
                                    <div className="empty-icon-box">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                        </svg>
                                    </div>
                                    <h3>You haven't added an internship yet</h3>
                                    <p>Once you submit your placement details, your coordinator will review them and your dashboard will fill in from here.</p>
                                    <button className="submit-placement-btn" onClick={() => setActiveTab("Placement")}>
                                        Submit placement
                                    </button>
                                </div>
                            )}

                            {/* STATE 2: PENDING REVIEW */}
                            {placementStatus === "pending" && (
                                <div className="dash-grid-top">
                                    <div className="placement-info-card full-width">
                                        <div className="placement-header-row">
                                            <h3>{placementDetails?.company_name || "Company Name"}</h3>
                                            <span className="status-badge pending">Pending Review</span>
                                        </div>
                                        <p className="role-text">{placementDetails?.role || placementDetails?.role_description || "Internship Role"}</p>
                                        <p className="supervisor-text">Supervisor: {placementDetails?.supervisor_name || "Assigned by Coordinator"}</p>
                                        <p className="pending-note">Stats and logbook tracking will unlock once your placement details are approved by your coordinator.</p>
                                    </div>
                                </div>
                            )}

                            {/* STATE 3: ACTIVE / APPROVED */}
                            {placementStatus === "active" && (
                                <>
                                    <div className="dash-grid-top">
                                        <div className="placement-info-card">
                                            <div className="placement-header-row">
                                                <h3>{placementDetails?.company_name || "Company Name"}</h3>
                                                <span className="active-pill">Active</span>
                                            </div>
                                            <p className="role-text">Role: {placementDetails?.role || placementDetails?.role_description || "Internship Role"}</p>
                                            <p className="supervisor-text">Supervisor: {placementDetails?.supervisor_name || "Assigned by Coordinator"}</p>
                                        </div>

                                        <div className="progress-info-card">
                                            <div className="progress-title-row">
                                                <span className="progress-label">Logbooks Submitted</span>
                                                <span className="progress-percentage">{logbooks.length} Entries</span>
                                            </div>
                                            <div className="progress-track">
                                                <div className="progress-fill" style={{ width: `${Math.min(logbooks.length * 10, 100)}%` }}></div>
                                            </div>
                                            <span className="week-counter">Active Tracking</span>
                                        </div>
                                    </div>

                                    <div className="dash-stats-row">
                                        <div className="stat-box">
                                            <span className="stat-label">Total Logbooks</span>
                                            <span className="stat-value">{logbooks.length}</span>
                                        </div>
                                        <div className="stat-box">
                                            <span className="stat-label">Pending Review</span>
                                            <span className="stat-value">{logbooks.filter(l => l.status?.toUpperCase() === 'PENDING' || l.status?.toUpperCase() === 'SUBMITTED' || !l.status).length}</span>
                                        </div>
                                        <div className="stat-box">
                                            <span className="stat-label">Reviewed</span>
                                            <span className="stat-value">{logbooks.filter(l => l.status?.toUpperCase() === 'REVIEWED' || l.status?.toUpperCase() === 'APPROVED').length}</span>
                                        </div>
                                        <div className="stat-box">
                                            <span className="stat-label">Supervisor visits</span>
                                            <span className="stat-value">1</span>
                                        </div>
                                    </div>

                                    <div className="logbook-section-card">
                                        <div className="logbook-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h3>Recent logbook entries</h3>
                                            <button className="submit-logbook-btn" onClick={() => setActiveTab("LogbookForm")}>Submit logbook</button>
                                        </div>
                                        <div className="logbook-table-container" style={{ marginTop: '15px' }}>
                                            {logbooks.slice(0, 3).map((log) => (
                                                <div 
                                                    className="logbook-row clickable-row" 
                                                    key={log.id} 
                                                    onClick={() => handleLogbookClick(log)}
                                                    style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee', cursor: 'pointer' }}
                                                >
                                                    <span className="log-date">Week {log.week_number}</span>
                                                    <span className="log-desc" style={{ flex: 2, margin: '0 15px' }}>{log.content}</span>
                                                    <span className={`log-status ${log.status?.toLowerCase()}`}>{log.status || "Pending"}</span>
                                                </div>
                                            ))}
                                            {logbooks.length === 0 && (
                                                <p style={{ color: '#777', padding: '10px 0' }}>No logbook entries submitted yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* FEEDBACK DETAILS MODAL */}
                    {/* FEEDBACK DETAILS MODAL */}
{/* FEEDBACK DETAILS MODAL */}
{selectedLogbook && (
    <div className="modal-overlay" onClick={() => setSelectedLogbook(null)}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
                <h3 className="modal-title">Week {selectedLogbook.week_number} Details & Feedback</h3>
                <span className={`log-status ${selectedLogbook.status?.toLowerCase()}`}>{selectedLogbook.status || "Pending"}</span>
            </div>
            
            <p className="modal-section-label"><strong>Your Submission:</strong></p>
            <div className="modal-submission-box">
                {selectedLogbook.content}
            </div>

            <p className="modal-section-label"><strong>Supervisor Feedback:</strong></p>
            <div className="modal-feedback-box">
                {typeof selectedLogbook.feedback === 'object' && selectedLogbook.feedback !== null ? (
                    <div>
                        <p className="modal-feedback-comment"><strong>Comment:</strong> {selectedLogbook.feedback.comment}</p>
                        <p className="modal-feedback-supervisor"><strong>Supervisor:</strong> {selectedLogbook.feedback.supervisor}</p>
                    </div>
                ) : (
                    selectedLogbook.feedback || selectedLogbook.supervisor_feedback || "No feedback has been provided by your supervisor for this entry yet."
                )}
            </div>

            <button 
                className="modal-close-btn"
                onClick={() => setSelectedLogbook(null)}
            >
                Close
            </button>
        </div>
    </div>
)}

                    {/* Footer */}
                    <footer className="dashboard-page-footer">
                        <p>© {new Date().getFullYear()} University Information Management System (UIMS). All rights reserved.</p>
                        <div className="footer-links">
                            <a href="#support">Support</a>
                            <a href="#privacy">Privacy Policy</a>
                        </div>
                    </footer>

                </div>
            </main>
        </div>
    );
}