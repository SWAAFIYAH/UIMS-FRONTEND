import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './studentDashboard.css';
import logo from '../assets/logo.png';
import SubmitPlacementForm from "./submitPlacementForm";
import client from "../api/client";

export default function StudentDashboard() {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // User profile state fetched from API
    const [user, setUser] = useState({
        full_name: "Jane Njeri",
        program: "BSc Computer Science"
    });

    // Simulate placement status: can be "none", "pending", or "active"
    /*const [placementStatus, setPlacementStatus] = useState(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        return storedUser?.placement_status || storedUser?.placementStatus || "none";
    }); */
    const [placementStatus, setPlacementStatus] = useState("active");

    const navigate = useNavigate();

    // Fetch live user data on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await client.get('/auth/me/');
                setUser(prev => ({
                ...prev,
                ...response.data
            }));
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
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
                    <a href="#logbook" className={activeTab === "Logbook" ? "active" : ""} onClick={() => { setActiveTab("Logbook"); setSidebarOpen(false); }}>
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
                                    <h3>Nexora Technology</h3>
                                    <p className="role-text" style={{ marginTop: '10px' }}><strong>Role:</strong> Software Development Intern</p>
                                    <p className="supervisor-text" style={{ marginTop: '8px' }}><strong>Supervisor:</strong> Mr Juma</p>
                                    <p className="supervisor-text" style={{ marginTop: '8px' }}><strong>Department:</strong> Engineering & IT</p>
                                    <p className="date-text" style={{ marginTop: '8px' }}><strong>Duration:</strong> 10 Weeks (Sep 2026 - Nov 2026)</p>
                                    
                                    {placementStatus === "pending" && (
                                        <p className="pending-note" style={{ marginTop: '15px' }}>
                                            Your details are currently being reviewed by your coordinator. Logbook tracking and weekly statistics will unlock once approved.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
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
                                            <h3>Nexora Technology</h3>
                                            <span className="status-badge pending">Pending Review</span>
                                        </div>
                                        <p className="role-text">Software development intern</p>
                                        <p className="supervisor-text">Supervisor: Mr Juma</p>
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
                                                <h3>Nexora Technology</h3>
                                                <span className="active-pill">Active</span>
                                            </div>
                                            <p className="role-text">Software development intern</p>
                                            <p className="supervisor-text">Supervisor: Mr Juma</p>
                                        </div>

                                        <div className="progress-info-card">
                                            <div className="progress-title-row">
                                                <span className="progress-label">Progress</span>
                                                <span className="progress-percentage">40%</span>
                                            </div>
                                            <div className="progress-track">
                                                <div className="progress-fill" style={{ width: '40%' }}></div>
                                            </div>
                                            <span className="week-counter">Week 4 of 10</span>
                                        </div>
                                    </div>

                                    <div className="dash-stats-row">
                                        <div className="stat-box">
                                            <span className="stat-label">Logbooks</span>
                                            <span className="stat-value">4</span>
                                        </div>
                                        <div className="stat-box">
                                            <span className="stat-label">Awaiting feedback</span>
                                            <span className="stat-value">1</span>
                                        </div>
                                        <div className="stat-box">
                                            <span className="stat-label">Weeks left</span>
                                            <span className="stat-value">6</span>
                                        </div>
                                        <div className="stat-box">
                                            <span className="stat-label">Supervisor visits</span>
                                            <span className="stat-value">1</span>
                                        </div>
                                    </div>

                                    <div className="logbook-section-card">
                                        <div className="logbook-section-header">
                                            <h3>Recent logbook entries</h3>
                                            <button className="submit-logbook-btn">Submit logbook</button>
                                        </div>
                                        <div className="logbook-table-container">
                                            <div className="logbook-row">
                                                <span className="log-date">15 Sep 2026</span>
                                                <span className="log-desc">API integration testing</span>
                                                <span className="log-status reviewed">Reviewed</span>
                                            </div>
                                            <div className="logbook-row">
                                                <span className="log-date">08 Sep 2026</span>
                                                <span className="log-desc">Frontend bug fixes</span>
                                                <span className="log-status pending-text">Pending</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* Footer */}
                    <footer className="dashboard-page-footer">
                        <p>&copy; {new Date().getFullYear()} University Information Management System (UIMS). All rights reserved.</p>
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