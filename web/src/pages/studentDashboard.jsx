import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./studentDashboard.css";
import logo from "../assets/logo.png";
import SubmitPlacementForm from "./submitPlacementForm";
import SubmitLogbookForm from "./submitLogbookForm";
import client from "../api/client";

const asList = (data, resource) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    throw new Error(`Unexpected ${resource} response: expected a results array.`);
};

const messageForError = (error) => {
    if (error.response?.status === 401) return "Your session has expired. Please sign in again.";
    if (error.response?.status === 403) return "You do not have permission to view this information.";
    if (error.response) return error.response.data?.detail || "The server could not load this information.";
    if (error.isAxiosError) return "Could not connect to the backend. Check your connection and try again.";
    return error.message || "Could not load this information.";
};

const displayDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

export default function StudentDashboard() {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [placement, setPlacement] = useState(null);
    const [logs, setLogs] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [showLogbookForm, setShowLogbookForm] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const refreshRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        let inFlight = false;
        const controller = new AbortController();
        const requestConfig = { signal: controller.signal, timeout: 30000 };

        const loadOne = async (key, endpoint, update, map = (value) => value) => {
            try {
                const { data } = await client.get(endpoint, requestConfig);
                const result = map(data);
                if (!cancelled) {
                    update(result);
                    setErrors((current) => ({ ...current, [key]: "" }));
                }
            } catch (error) {
                if (controller.signal.aborted) return;
                console.error(`Could not load student ${key}:`, error);
                if (!cancelled) {
                    setErrors((current) => ({ ...current, [key]: messageForError(error) }));
                }
            }
        };

        const refresh = async () => {
            if (inFlight || cancelled) return;
            inFlight = true;
            setRefreshing(true);
            await Promise.all([
                loadOne("profile", "/auth/me/", setUser),
                loadOne("placement", "/internships/placements/mine/", setPlacement, (data) =>
                    data?.status === "none" ? null : data
                ),
                loadOne("logbooks", "/logbooks/mine/", setLogs, (data) => asList(data, "logbooks")),
                loadOne("evaluations", "/evaluations/my-results/", setEvaluations, (data) => {
                    if (Array.isArray(data)) return data;
                    if (Array.isArray(data?.results)) return data.results;
                    return data && typeof data === "object" ? [data] : [];
                }),
            ]);
            inFlight = false;
            if (!cancelled) {
                setLoading(false);
                setRefreshing(false);
            }
        };

        refreshRef.current = refresh;
        refresh();

        return () => {
            cancelled = true;
            controller.abort();
            refreshRef.current = null;
        };
    }, []);

    const refreshData = useCallback(() => refreshRef.current?.(), []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userName");
        toast.info("Logged out successfully");
        navigate("/");
    };

    const changeTab = (tab) => {
        setActiveTab(tab);
        setSidebarOpen(false);
        setShowLogbookForm(false);
    };

    const fullName = user?.full_name || [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.email || "Student";
    const placementStatus = placement?.status || "none";
    const pendingReviews = logs.filter((entry) => String(entry.status).toLowerCase() !== "reviewed").length;
    const availableDays = placement?.internship_end ? Math.max(0, Math.ceil((new Date(placement.internship_end) - new Date()) / 86400000)) : null;

    return (
        <div className="dashboard-container">
            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
            <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="sidebar-brand">
                    <img src={logo} alt="UIMS Logo" className="brand-logo" />
                    <h2>University Internship Management System</h2>
                </div>
                <nav className="sidebar-nav" aria-label="Student navigation">
                    {["Dashboard", "Placement", "Logbook", "Evaluations", "Profile"].map((tab) => (
                        <a key={tab} href={`#${tab.toLowerCase()}`} className={activeTab === tab ? "active" : ""} onClick={() => changeTab(tab)}>
                            {tab}
                        </a>
                    ))}
                    <a href="#logout" className="logout-nav-link" onClick={(event) => { event.preventDefault(); handleLogout(); }}>
                        Logout
                    </a>
                </nav>
            </aside>

            <main className="dashboard-main-area">
                <div className="dashboard-inner-card">
                    <div className="dash-top-header">
                        <div className="header-left-group">
                            <button className="menu-toggle" type="button" aria-label="Open navigation menu" onClick={() => setSidebarOpen((open) => !open)}>
                                ☰
                            </button>
                            <div>
                                <span className="welcome-sub">Welcome back</span>
                                <h1 className="user-fullname">{fullName}</h1>
                                <p className="user-program">{user?.program || user?.student_id || user?.email || "Student account"}</p>
                            </div>
                        </div>
                        <div className="header-left-group">
                            <button className="submit-placement-btn" type="button" disabled={refreshing} onClick={refreshData}>
                                {refreshing ? "Refreshing…" : "Refresh"}
                            </button>
                            <div className="user-avatar-badge">{fullName.split(/\s+/).map((part) => part[0] || "").join("").slice(0, 2).toUpperCase()}</div>
                        </div>
                    </div>

                    {Object.entries(errors).filter(([, error]) => error).map(([key, error]) => (
                        <div key={key} role="alert" className="error-banner" style={{ marginBottom: 12 }}>
                            Could not load {key}: {error}
                        </div>
                    ))}

                    {loading && <p role="status">Loading your information from the backend…</p>}

                    {!loading && activeTab === "Dashboard" && (
                        placement ? (
                            <>
                                <div className="dash-grid-top">
                                    <div className="placement-info-card">
                                        <div className="placement-header-row">
                                            <h3>{placement.company_name || "Internship placement"}</h3>
                                            <span className={placementStatus === "active" ? "active-pill" : "status-badge pending"}>{placementStatus}</span>
                                        </div>
                                        <p className="role-text">{placement.role_description || "—"}</p>
                                        <p className="supervisor-text">Supervisor: {placement.supervisor_name || "Not assigned yet"}</p>
                                        <p className="supervisor-text">Location: {placement.company_location || "—"}</p>
                                        <p className="supervisor-text">Duration: {displayDate(placement.internship_start)} - {displayDate(placement.internship_end)}</p>
                                    </div>
                                    <div className="progress-info-card">
                                        <div className="progress-title-row">
                                            <span className="progress-label">Logbook progress</span>
                                            <span className="progress-percentage">{logs.length}</span>
                                        </div>
                                        <p className="week-counter">Submitted entries</p>
                                        <div className="progress-track"><div className="progress-fill" style={{ width: `${Math.min(logs.length * 10, 100)}%` }} /></div>
                                        <span className="week-counter">{availableDays == null ? "End date unavailable" : `${availableDays} days until internship end`}</span>
                                    </div>
                                </div>
                                <div className="dash-stats-row">
                                    <div className="stat-box"><span className="stat-label">Logbooks submitted</span><span className="stat-value">{logs.length}</span></div>
                                    <div className="stat-box"><span className="stat-label">Awaiting feedback</span><span className="stat-value">{pendingReviews}</span></div>
                                    <div className="stat-box"><span className="stat-label">Supervisor</span><span className="stat-value">{placement.supervisor_name ? "Assigned" : "Pending"}</span></div>
                                    <div className="stat-box"><span className="stat-label">Placement status</span><span className="stat-value">{placementStatus}</span></div>
                                </div>
                                <div className="logbook-section-card">
                                    <div className="logbook-section-header">
                                        <h3>Recent logbook entries</h3>
                                        <button className="submit-logbook-btn" type="button" disabled={placementStatus !== "active"} onClick={() => { setActiveTab("Logbook"); setShowLogbookForm(true); }}>
                                            Submit logbook
                                        </button>
                                    </div>
                                    {logs.slice(0, 3).map((entry) => (
                                        <div className="logbook-row" key={entry.id}>
                                            <span className="log-date">Week {entry.week_number}</span>
                                            <span className="log-desc">{entry.content}</span>
                                            <span className={entry.status === "reviewed" ? "log-status reviewed" : "log-status pending-text"}>{entry.status}</span>
                                        </div>
                                    ))}
                                    {!logs.length && <p className="user-program">No logbook entries submitted yet.</p>}
                                </div>
                            </>
                        ) : errors.placement ? (
                            <div className="empty-placement-state">
                                <h3>Your placement could not be loaded</h3>
                                <p>Retry the backend request before submitting or changing your placement details.</p>
                                <button className="submit-placement-btn" type="button" disabled={refreshing} onClick={refreshData}>
                                    {refreshing ? "Refreshing…" : "Try again"}
                                </button>
                            </div>
                        ) : (
                            <div className="empty-placement-state">
                                <div className="empty-icon-box">▣</div>
                                <h3>You haven’t added an internship yet</h3>
                                <p>Submit your placement details for coordinator review.</p>
                                <button className="submit-placement-btn" type="button" onClick={() => changeTab("Placement")}>Submit placement</button>
                            </div>
                        )
                    )}

                    {!loading && activeTab === "Placement" && (
                        placement ? (
                            <section className="placement-details-page">
                                <div className="section-header-row">
                                    <h2>Internship Placement</h2>
                                    <span className={placementStatus === "active" ? "active-pill" : "status-badge pending"}>{placementStatus}</span>
                                </div>
                                <div className="placement-info-card full-width">
                                    <h3>{placement.company_name}</h3>
                                    <p className="role-text"><strong>Role:</strong> {placement.role_description || "—"}</p>
                                    <p className="supervisor-text"><strong>Supervisor:</strong> {placement.supervisor_name || "Not assigned yet"}</p>
                                    <p className="supervisor-text"><strong>Location:</strong> {placement.company_location || "—"}</p>
                                    <p className="supervisor-text"><strong>Company contact:</strong> {placement.company_supervisor_contact || "—"}</p>
                                    <p className="supervisor-text"><strong>Dates:</strong> {displayDate(placement.internship_start)} - {displayDate(placement.internship_end)}</p>
                                    {placement.rejection_reason && <p className="pending-note">Reason: {placement.rejection_reason}</p>}
                                </div>
                            </section>
                        ) : errors.placement ? <p>Placement details could not be loaded.</p> : (
                            <SubmitPlacementForm onSuccess={refreshData} onCancel={() => changeTab("Dashboard")} />
                        )
                    )}

                    {!loading && activeTab === "Logbook" && (
                        <section>
                            <div className="logbook-section-header">
                                <h2>My Logbooks</h2>
                                <button className="submit-logbook-btn" type="button" disabled={!placement?.id || placementStatus !== "active"} onClick={() => setShowLogbookForm(true)}>
                                    Submit logbook
                                </button>
                            </div>
                            {showLogbookForm && placement?.id && (
                                <SubmitLogbookForm
                                    placementId={placement.id}
                                    onSuccess={() => { setShowLogbookForm(false); refreshData(); }}
                                    onCancel={() => setShowLogbookForm(false)}
                                />
                            )}
                            <div className="logbook-section-card">
                                {logs.map((entry) => (
                                    <div className="logbook-row" key={entry.id}>
                                        <span className="log-date">Week {entry.week_number} · {displayDate(entry.submission_date)}</span>
                                        <span className="log-desc">{entry.content}</span>
                                        <span className={entry.status === "reviewed" ? "log-status reviewed" : "log-status pending-text"}>{entry.status}</span>
                                    </div>
                                ))}
                                {!logs.length && <p className="user-program">{errors.logbooks ? "Logbooks could not be loaded." : "No logbook entries submitted yet."}</p>}
                            </div>
                        </section>
                    )}

                    {!loading && activeTab === "Evaluations" && (
                        <section>
                            <h2>My Evaluation Results</h2>
                            <div className="logbook-section-card">
                                {evaluations.map((evaluation, index) => (
                                    <div className="logbook-row" key={evaluation.id ?? index}>
                                        <span className="log-date">{evaluation.company || evaluation.company_name || placement?.company_name || "Evaluation"}</span>
                                        <span className="log-desc">
                                            Final score: {evaluation.final_score ?? "—"} · Grade: {evaluation.letter_grade || "Pending"}
                                            {evaluation.coordinator_remarks ? ` · ${evaluation.coordinator_remarks}` : ""}
                                        </span>
                                        <span className="log-status">{evaluation.finalised_at ? "Finalised" : "In progress"}</span>
                                    </div>
                                ))}
                                {!evaluations.length && <p className="user-program">{errors.evaluations ? "Evaluation results could not be loaded." : "No evaluation results are available yet."}</p>}
                            </div>
                        </section>
                    )}

                    {!loading && activeTab === "Profile" && (
                        <section>
                            <h2>My Profile</h2>
                            <div className="placement-info-card full-width">
                                <p className="supervisor-text"><strong>Name:</strong> {fullName}</p>
                                <p className="supervisor-text"><strong>Email:</strong> {user?.email || "—"}</p>
                                <p className="supervisor-text"><strong>Student ID:</strong> {user?.student_id || "—"}</p>
                                <p className="supervisor-text"><strong>Role:</strong> {user?.role || "student"}</p>
                            </div>
                        </section>
                    )}

                    <footer className="dashboard-page-footer">
                        <p>&copy; {new Date().getFullYear()} University Information Management System (UIMS). All rights reserved.</p>
                    </footer>
                </div>
            </main>
        </div>
    );
}
