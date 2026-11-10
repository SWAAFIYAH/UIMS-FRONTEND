import { useState, useEffect, useRef, Children } from "react";
import client from "../api/client";

const css = `
:root{--p:#0b3d91;
--nav: #0b2454;
--bg: #f5f7fb;
--card: #fff;
--text: #172033;
--muted: #6b7280;
--border: #e5e7eb;
--green: #16a34a;
--red: #dc2626;
--orange: #d97706;
}

.ouk.dark{
--bg: #0f172a;
--card: #1e293b;
--text: #e5e7eb;
--muted: #94a3b8;
--border: #334155;
}

.ouk *{
box-sizing: border-box;
}

.ouk{
font-family:Segoe UI,Arial,sans-serif;
background:var(--bg);
color:var(--text);
min-height:100vh;
}

.ouk button,.ouk input,.ouk select,.ouk textarea{
font:inherit;
color:inherit;
}

.ouk button{
cursor:pointer;
}

.sidebar{
position:fixed;
inset:0 auto 0 0;
width:250px;
background:var(--nav);
color: #fff;
padding:20px 14px;
z-index:10;
}

.logo{
display:flex;
gap:10px;
align-items:center;
padding:8px 8px 22px;
border-bottom:1px solid #ffffff22;
}

.logoicon{
width:42px;
height:42px;
background: #fff;
color:var(--p);
border-radius:10px;
display:grid;
place-items:center;
font-weight:bold;
}

.logo h3{
margin:0;
font-size:16px;
}

.logo small {
color: #b9c8e8;
}

.mt{
color: #91a4c9;
font-size:11px;
text-transform:uppercase;
margin:24px 10px 8px;
}

.nav{
display:block;
width:100%;
border:0;
background:transparent;
color: #dce7fa!important;
text-align:left;
text-decoration:none;
padding:12px;
border-radius:8px;
margin:3px 0;
}

.nav:hover,.nav.active{
background: #ffffff1c;
}

.badge{
float:right;
background:var(--red);
padding:2px 7px;
border-radius:20px;
font-size:11px;
}

.main{margin-left:250px}

.top{
height:70px;
background:var(--card);
border-bottom:1px solid var(--border);
display:flex;
align-items:center;
justify-content:space-between;
padding:0 28px;
position:sticky;
top:0;
z-index:5;
}

.search{
background:var(--bg);
border:1px solid var(--border);
padding:10px 13px;
border-radius:9px;
width:320px;
}

.search input{
border:0;
background:none;
outline:0;
width:90%;
}

.actions{
display:flex;
align-items:center;
gap:12px;
}

.icon{
border:1px solid var(--border);
background:var(--card);
border-radius:8px;
padding:9px;
}

.avatar{
width:38px;
height:38px;
border-radius:50%;
background:var(--p);
color: #fff;
display:grid;
place-items:center;
font-weight:bold;
}

.profile{
display:flex;
gap:8px;
align-items:center;
}

.content{
padding:28px;
}

.header{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:22px;
}

.ouk .header h1{
margin:0 0 5px;
color:var(--text)!important;
font-size:28px;
font-weight:700;
line-height:1.25;
}

.muted{
color: var(--muted);
font-size:13px;
}

.btn{
border:0;
border-radius:8px;
padding:10px 15px;
background:var(--p);
color: #fff!important;
}

.btn.secondary{
background:var(--card);
color:var(--text)!important;
border:1px solid var(--border);
}

.btn.success{
background:var(--green);
}

.btn.danger{
background:var(--red);
}

.stats{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:17px;
margin-bottom:22px;
}

.stat,.card{
background:var(--card);
border:1px solid var(--border);
border-radius:13px;
box-shadow:0 7px 22px #0f172a0b'
}

.stat{
padding:18px;
display:flex;
justify-content:space-between;
align-items:center;
gap:12px;
}

.stat span{
color:var(--muted);
font-size:13px;
}

.stat h2{
margin:6px 0;
color:var(--text);
font-size:32px;
font-weight:700;
line-height:1.2;
}

.staticon{
width:48px;
height:48px;
border-radius:11px;
background: #fff4df;
color:var(--orange);
display:grid;
place-items:center;
}

.card{
margin-bottom:22px;
}

.cardhead{
padding:18px 20px;
border-bottom:1px solid var(--border);
display:flex;
justify-content:space-between;
gap:15px;
}

.cardhead h3{
margin:0 0 4px;
font-size:17px;
}

.tablewrap{
overflow:auto;
}

table{
width:100%;
border-collapse:collapse;
min-width:800px;
}

th{
background:var(--bg);
color:var(--muted);
font-size:11px;t
ext-align:left;
padding:12px;
text-transform:uppercase;
}

td{
padding:13px;
border-top:1px solid var(--border);
font-size:13px;
}

.student{
display:flex;
gap:9px;
align-items:center;
}

.sa{
width:35px;
height:35px;
border-radius:50%;
background: #e8eefb;
color:var(--p);
display:grid;
place-items:center;
font-weight:bold;
}

.status{
padding:5px 9px;
border-radius:20px;
font-size:11px;
font-weight:bold;
text-transform:capitalize;
}

.s-pending{
background: #fff4db;
color: #a16207;
}

.s-active{
background: #e7f8ed;
color: #15803d;
}

.s-rejected{
background: #feecec;
color: #b91c1c;
}

.s-completed{
background: #e8f1ff;
color: #1d4ed8;
}

.action{
border:1px solid var(--border);
background:var(--card);
padding:7px 10px;
border-radius:6px;
}

.lower{
display:grid;
grid-template-columns:1.3fr 1fr;
gap:22px;
}

.row{
display:flex;
justify-content:space-between;
padding:14px 20px;
border-bottom:1px solid var(--border);
}

.row:last-child{
border:0;
}

.tabs{
display:flex;
gap:7px;
overflow:auto;
}

.tab{
padding:8px 13px;
border:1px solid var(--border);
background:var(--card);
border-radius:7px;
white-space:nowrap;
}

.tab.active{
background:var(--p);
color: #fff;
}

.modalbg{
position:fixed;
inset:0;
background: #0f172a99;
display:flex;
align-items:center;
justify-content:center;
padding:20px;
z-index:20;
}

.modal{
background:var(--card);
width:100%;
max-width:650px;
border-radius:14px;
max-height:90vh;
overflow:auto;
}

.modalhead{
padding:18px 20px;
border-bottom:1px solid var(--border);
display:flex;
justify-content:space-between;
}

.modalhead h3{
margin:0;
}

.modalbody{
padding:20px;
}

.modalfoot{
padding:16px 20px;
border-top:1px solid var(--border);
display:flex;
justify-content:flex-end;
gap:8px;
}

.close{
border:0;
background:none;
font-size:22px;
}

.details{
display:grid;
grid-template-columns:1fr 1fr;
gap:12px;
}

.detail{
background:var(--bg);
padding:12px;
border-radius:8px;
}

.detail-label{
display:block;
color:var(--muted);
font-size:11px;
margin-bottom:4px;
}


.formgroup{
margin:15px 0;
width:100%;
display:flex;
flex-direction:column;
align-items:stretch;
gap:6px;
}

.formgroup label{
display:block;
font-weight:bold;
font-size:13px;
}


.formgroup input,.formgroup select,.formgroup textarea{
display:block;
align-self:stretch;
width:100%;
min-width:0;
min-height:42px;
padding:10px;
border:1px solid var(--border);
border-radius:8px;
background:var(--card);
}

.formgroup small{
display:block;
line-height:1.4;
}

.formgroup textarea{
min-height:100px;
}


.toast{
position:fixed;
right:22px;
bottom:22px;
background: #172033;
color: #fff;
padding:13px 17px;
border-radius:8px;
opacity:0;
transform:translateY(80px);
transition:.25s;
z-index:30;
}

.toast.show{
opacity:1;
transform:none;
}


.sr-only{
position:absolute;
width:1px;
height:1px;
margin:-1px;
overflow:hidden;
clip:rect(0,0,0,0);
white-space:nowrap;
}

.menu{
display:none;
}

@media(max-width:1050px){.stats{grid-template-columns:repeat(2,1fr)}.lower{grid-template-columns:1fr}}
@media(max-width:800px){.sidebar{transform:translateX(-100%);transition:.2s}.sidebar.open{transform:none}.main{margin-left:0}.menu{display:block;border:0;background:none;font-size:23px}.top{padding:0 14px}.search{width:220px}}
@media(max-width:600px){.stats{grid-template-columns:1fr}.search{display:none}.header{flex-direction:column;align-items:flex-start;gap:12px}.details{grid-template-columns:1fr}.profile span{display:none}}
`;

const getResults = (data, resource) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  throw new Error(`Unexpected ${resource} response: expected a results array.`);
};
const mapPlacement = (placement) => ({
  id: placement.id,
  studentId: placement.student_id,
  status: placement.status,
  student: placement.student_name || placement.student_email || placement.student_id || "Student",
  reg: placement.student_id || placement.student_email || "",
  company: placement.company_name || "",
  role: placement.role_description || "",
  supervisor: placement.supervisor_name || "",
  supervisorId: placement.supervisor ?? null,
  dates: [placement.internship_start, placement.internship_end].filter(Boolean).join(" - "),
  submitted: placement.created_at ? new Date(placement.created_at).toLocaleDateString() : "",
});
const mapLogbook = (entry) => ({
  id: entry.id ?? `${entry.placement ?? "placement"}-${entry.week_number ?? entry.week ?? "week"}`,
  student: entry.student_name || entry.student || "—",
  week: entry.week_number ?? entry.week ?? entry.weeks_submitted ?? "—",
  submitted: entry.submission_date || entry.submitted_at || entry.submitted || "—",
  supervisor: entry.supervisor_name || entry.supervisor || "—",
  status: entry.status || entry.logbook_status || "—",
});
const mapEvaluation = (evaluation) => ({
  id: evaluation.id ?? evaluation.placement_id ?? `${evaluation.student_id ?? evaluation.student_name ?? "evaluation"}-${evaluation.company ?? evaluation.company_name ?? ""}`,
  student: evaluation.student_name || evaluation.student || "—",
  company: evaluation.company_name || evaluation.company || "—",
  supervisor: evaluation.supervisor_name || evaluation.supervisor || "—",
  status: evaluation.status || evaluation.evaluation_status || evaluation.overall_status || "Unknown",
  submitted: evaluation.submitted_at || evaluation.submission_date || evaluation.created_at || "—",
});
const getSupervisorId = (supervisor) => {
  const rawId = supervisor.id ?? supervisor.supervisor_id ?? supervisor.user_id ?? supervisor.pk;
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
};
const mapAssignmentSupervisor = (supervisor) => ({
  id: getSupervisorId(supervisor),
  name: supervisor.name
    || supervisor.full_name
    || supervisor.supervisor_name
    || [supervisor.first_name, supervisor.last_name].filter(Boolean).join(" ")
    || supervisor.email
    || supervisor.supervisor_email
    || "Supervisor",
  email: supervisor.email || supervisor.supervisor_email || "",
});
const getApiErrorMessage = (error, action = "complete this request") => {
  const status = error.response?.status;

  if (error.message?.startsWith("Unexpected ")) {
    return "The server returned information we couldn't display. Please try again later.";
  }
  if (status === 401) return "Your session may have expired. Please sign in again.";
  if (status === 403) return "You don't have permission to do this.";
  if (action === "assign the supervisor" && (status === 400 || status === 404)) {
    return "We couldn't assign that supervisor. Check the supervisor ID and make sure the account is active.";
  }
  if (status === 400) return "Some information is missing or invalid. Please check the details and try again.";
  if (status === 404) return "We couldn't find the requested record. Refresh the dashboard and try again.";
  if (status >= 500) return "The service is temporarily unavailable. Please try again in a moment.";
  if (!status && error.isAxiosError) return "We couldn't connect to the service. Check your connection and try again.";
  return `We couldn't ${action}. Please try again.`;
};
const statusClass = (status) =>
  ["completed", "complete", "finalised", "finalized", "reviewed"].includes(String(status).toLowerCase())
    ? "completed"
    : String(status).toLowerCase() === "rejected" || String(status).toLowerCase() === "overdue"
      ? "rejected"
      : "pending";
const initials = (name) => String(name ?? "").trim().split(/\s+/).map((part) => part[0] || "").join("").slice(0, 2);

function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modalbg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modalhead">
          <h3>{title}</h3>
          <button className="close" type="button" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="modalbody">{children}</div>
        <div className="modalfoot">{footer}</div>
      </div>
    </div>
  );
}

function Table({ heads, children }) {
  const empty = Children.toArray(children).length === 0;
  return (
    <div className="tablewrap">
      <table>
        <thead><tr>{heads.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {empty ? (
            <tr><td colSpan={heads.length} className="muted" style={{ textAlign: "center", padding: 32 }}>No records yet.</td></tr>
          ) : children}
        </tbody>
      </table>
    </div>
  );
}

const Status = ({ cls, children }) => <span className={`status s-${cls}`}>{children}</span>;

export default function OukDashboard({
  initialPage = "dashboard",
  initialPlacements = [],
  initialSupervisors = [],
  initialLogbooks = [],
  initialEvaluations = [],
  initialGrades = [],
}) {
  const initialSupervisorsRef = useRef(initialSupervisors);
  const refreshDataRef = useRef(null);
  const [page, setPage] = useState(initialPage);
  const [placements, setPlacements] = useState(initialPlacements);
  const [reportAnalytics, setReportAnalytics] = useState(null);
  const [departmentalReport, setDepartmentalReport] = useState(null);
  const [placementReport, setPlacementReport] = useState(null);
  const [performanceReport, setPerformanceReport] = useState(null);
  const [reportView, setReportView] = useState("overview");
  const [apiErrors, setApiErrors] = useState({});
  const [sessionExpired, setSessionExpired] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [user, setUser] = useState({});
  const [supervisors, setSupervisors] = useState(initialSupervisors);
  const [assignmentSupervisors, setAssignmentSupervisors] = useState([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const [modal, setModal] = useState(null); // "placement" | "reject" | "supervisor"
  const [currentId, setCurrentId] = useState(null);
  const [assignSup, setAssignSup] = useState("");
  const [reason, setReason] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [grades, setGrades] = useState(initialGrades);
  const [logs, setLogs] = useState(initialLogbooks);
  const [evals, setEvals] = useState(initialEvaluations);
  const timer = useRef();
  const sessionExpiredRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let requestInFlight = false;
    const controller = new AbortController();
    const requestConfig = { signal: controller.signal, timeout: 30000 };
    const shouldStopForExpiredSession = (error) => {
      if (error.response?.status === 401) {
        if (!sessionExpiredRef.current) {
          sessionExpiredRef.current = true;
          if (!cancelled) setSessionExpired(true);
          controller.abort();
        }
        return true;
      }
      return sessionExpiredRef.current || controller.signal.aborted;
    };

    const loadResource = async (key, endpoint, update, map = (value) => value) => {
      try {
        const { data } = await client.get(endpoint, requestConfig);
        const results = getResults(data, key);
        if (!cancelled) {
          update(results.map(map));
          setApiErrors((errors) => ({ ...errors, [key]: "" }));
        }
        return true;
      } catch (error) {
        if (shouldStopForExpiredSession(error)) return false;
        console.error(`Could not load ${key}:`, error);
        if (!cancelled) {
          setApiErrors((errors) => ({ ...errors, [key]: getApiErrorMessage(error, `load ${key}`) }));
        }
        return false;
      }
    };

    const loadUser = async () => {
      try {
        const { data } = await client.get("/auth/me/", requestConfig);
        if (!cancelled) {
          setUser(data);
          setApiErrors((errors) => ({ ...errors, profile: "" }));
        }
        return true;
      } catch (error) {
        if (shouldStopForExpiredSession(error)) return false;
        console.error("Could not load coordinator profile:", error);
        if (!cancelled) {
          setApiErrors((errors) => ({ ...errors, profile: getApiErrorMessage(error, "load your profile") }));
        }
        return false;
      }
    };

    const loadReport = async (key, endpoint, update) => {
      try {
        const { data } = await client.get(endpoint, requestConfig);
        if (!data || typeof data !== "object" || Array.isArray(data)) {
          throw new Error(`Unexpected ${key} response: expected an object.`);
        }
        if (key !== "analytics" && !Array.isArray(data.results)) {
          throw new Error(`Unexpected ${key} response: expected a results array.`);
        }
        if (!cancelled) {
          update(data);
          if (key === "performance report") setGrades(data.results);
          setApiErrors((errors) => ({ ...errors, [key]: "" }));
        }
      } catch (error) {
        if (shouldStopForExpiredSession(error)) return;
        console.error(`Could not load ${key}:`, error);
        if (!cancelled) {
          setApiErrors((errors) => ({ ...errors, [key]: getApiErrorMessage(error, `load ${key}`) }));
        }
      }
    };

    const refreshData = async () => {
      if (requestInFlight || cancelled || sessionExpiredRef.current) return;
      requestInFlight = true;
      setIsRefreshing(true);

      try {
        const requests = [
          loadUser(),
          loadReport("analytics", "/reports/analytics/", setReportAnalytics),
          loadReport("departmental report", "/reports/departmental/", setDepartmentalReport),
          loadReport("placement report", "/reports/placements/", setPlacementReport),
          loadReport("performance report", "/reports/performance/", setPerformanceReport),
          loadResource("supervisors", "/reports/supervisor-workload/", setSupervisors, (supervisor) => {
            const existing = initialSupervisorsRef.current.find((item) => item.email === supervisor.supervisor_email);
            return {
              id: getSupervisorId(supervisor) ?? getSupervisorId(existing || {}),
              name: supervisor.supervisor_name || supervisor.supervisor_email || "Supervisor",
              email: supervisor.supervisor_email || "",
              dept: existing?.dept || "—",
              students: supervisor.total_students ?? 0,
              active: supervisor.active_students ?? 0,
              pendingReviews: supervisor.pending_logbook_reviews ?? 0,
              visits: supervisor.visits_conducted ?? 0,
            };
          }),
          loadResource("assignment supervisors", "/internships/supervisors/", setAssignmentSupervisors, mapAssignmentSupervisor),
        ];
        if (initialPage !== "reports") {
          requests.push(
            loadResource("placements", "/internships/placements/all/", setPlacements, mapPlacement),
            loadResource("logbooks", "/logbooks/overview/", setLogs, mapLogbook),
            loadResource("evaluations", "/evaluations/review/", setEvals, mapEvaluation),
          );
        }
        await Promise.all(requests);
      } finally {
        requestInFlight = false;
        if (!cancelled) {
          setLastChecked(new Date());
          setApiLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    refreshDataRef.current = refreshData;
    refreshData();
    const intervalId = window.setInterval(refreshData, 30000);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearInterval(intervalId);
      refreshDataRef.current = null;
    };
  }, [initialPage]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setModal(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const toast = (msg) => {
    setToastMsg(msg);
    setToastShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastShow(false), 2800);
  };
  const go = (p) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0); };
  const match = (...vals) => vals.filter((v) => v != null).join(" ").toLowerCase().includes(query.toLowerCase());

  const pendingList = placements.filter((x) => x.status === "pending");
  const stats = {
    pending: pendingList.length,
    active: placements.filter((x) => x.status === "active").length,
    rejected: placements.filter((x) => x.status === "rejected").length,
    unassigned: placements.filter((x) => !x.supervisorId && !x.supervisor && ["pending", "active"].includes(x.status)).length,
  };
  const logStats = {
    submitted: logs.filter((l) => String(l.status).toLowerCase() === "submitted").length,
    reviewed: logs.filter((l) => String(l.status).toLowerCase() === "reviewed").length,
    draft: logs.filter((l) => String(l.status).toLowerCase() === "draft").length,
  };
  const current = placements.find((x) => x.id === currentId);

  const openPlacement = (p) => { setCurrentId(p.id); setAssignSup(p.supervisorId ? String(p.supervisorId) : ""); setModal("placement"); };
  const approve = async () => {
    if (!current) return;
    const supervisorId = assignSup.trim() ? Number(assignSup) : null;
    if (supervisorId !== null && (!Number.isInteger(supervisorId) || supervisorId < 1)) {
      return toast("Supervisor ID must be a positive whole number.");
    }
    const payload = { action: "approve" };
    if (supervisorId !== null) payload.supervisor_id = supervisorId;

    try {
      await client.patch(`/internships/placements/${currentId}/decision/`, payload);
      const selectedSupervisor = assignmentSupervisors.find((s) => Number(s.id) === supervisorId);
      setPlacements((ps) => ps.map((p) => (
        p.id === currentId
          ? {
              ...p,
              status: "active",
              supervisorId: supervisorId ?? p.supervisorId,
              supervisor: selectedSupervisor?.name || (supervisorId ? `Supervisor #${supervisorId}` : p.supervisor),
            }
          : p
      )));
      setModal(null);
      toast(`${current.student} approved successfully.`);
      refreshDataRef.current?.();
    } catch (error) {
      console.error("Could not approve placement:", error);
      toast(getApiErrorMessage(error, "approve this placement"));
    }
  };
  const openReject = () => { setReason(""); setModal("reject"); };
  const reject = async () => {
    if (!reason.trim()) return toast("Rejection reason is required.");
    if (!current) return;

    try {
      await client.patch(`/internships/placements/${currentId}/decision/`, {
        action: "reject",
        reason: reason.trim(),
      });
      setPlacements((ps) => ps.map((p) => (p.id === currentId ? { ...p, status: "rejected" } : p)));
      setModal(null);
      toast(`${current.student} rejected. Reason recorded.`);
      refreshDataRef.current?.();
    } catch (error) {
      console.error("Could not reject placement:", error);
      toast(getApiErrorMessage(error, "reject this placement"));
    }
  };
  const assignSupervisor = async () => {
    if (!current) return;

    const supervisorId = Number(assignSup);
    if (!assignSup.trim() || !Number.isInteger(supervisorId) || supervisorId < 1) {
      return toast("Enter a valid supervisor ID (positive whole number).");
    }
    try {
      await client.patch(`/internships/placements/${currentId}/assign-supervisor/`, {
        supervisor_id: supervisorId,
      });
      const selectedSupervisor = assignmentSupervisors.find((s) => Number(s.id) === supervisorId);
      setPlacements((ps) => ps.map((p) => (
        p.id === currentId
          ? { ...p, supervisorId, supervisor: selectedSupervisor?.name || `Supervisor #${supervisorId}` }
          : p
      )));
      setModal(null);
      toast(`Supervisor assigned to ${current.student}.`);
      refreshDataRef.current?.();
    } catch (error) {
      console.error("Could not assign supervisor:", error);
      toast(getApiErrorMessage(error, "assign the supervisor"));
    }
  };
  const addSupervisor = async () => {
    const firstName = form.firstName.trim(), lastName = form.lastName.trim(), email = form.email.trim();
    if (!firstName || !lastName || !email) return toast("Complete all fields.");

    try {
      await client.post("/auth/staff/create/", {
        email,
        first_name: firstName,
        last_name: lastName,
        role: "supervisor",
      });
      setSupervisors((items) => [
        ...items,
        { id: null, name: `${firstName} ${lastName}`, email, dept: "—", students: 0, active: 0 },
      ]);
      setForm({ firstName: "", lastName: "", email: "" });
      setModal(null);
      toast("Supervisor created successfully.");
      refreshDataRef.current?.();
    } catch (error) {
      console.error("Could not create supervisor:", error);
      toast(getApiErrorMessage(error, "create the supervisor account"));
    }
  };
  const finaliseGrade = async (grade) => {
    const matches = placements.filter((placement) =>
      placement.studentId === grade.student_id &&
      placement.company.toLowerCase() === String(grade.company).toLowerCase()
    );
    if (matches.length !== 1) {
      return toast("Could not identify one matching placement for this grade.");
    }

    try {
      await client.post(`/evaluations/${matches[0].id}/finalise/`);
      toast(`Grade finalised for ${grade.student_name}.`);
      refreshDataRef.current?.();
    } catch (error) {
      console.error("Could not finalise grade:", error);
      toast(getApiErrorMessage(error, "finalise this grade"));
    }
  };
  const manageSup = (s) =>
    window.alert(`${s.name}\n${s.email}\n\nStudents: ${s.students}\nActive placements: ${s.active}`);
  const signInAgain = () => {
    ["accessToken", "refreshToken", "user", "userName"].forEach((key) => localStorage.removeItem(key));
    window.location.assign("/login");
  };

  const navBtn = (id, label, extra) => (
    <button className={`nav ${page === id ? "active" : ""}`} type="button" onClick={() => go(id)}>
      {label} {extra}
    </button>
  );
  const logClass = (status) => statusClass(status);

  return (
    <div className={`ouk ${dark ? "dark" : ""}`}>
      <style>{css}</style>

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="logo">
          <div className="logoicon">OUK</div>
          <div><h3>OUK Internship</h3><small>Management System</small></div>
        </div>
        <div className="mt">Main Menu</div>
        {navBtn("dashboard", "⌂ \u00a0 Dashboard")}
        {navBtn("placements", "▣ \u00a0 Placements", stats.pending > 0 && <span className="badge">{stats.pending}</span>)}
        {navBtn("supervisors", "♙ \u00a0 Supervisors")}
        {navBtn("logbooks", "▤ \u00a0 Logbooks")}
        {navBtn("evaluations", "✓ \u00a0 Evaluations")}
        {navBtn("grades", "★ \u00a0 Grades")}
        {navBtn("reports", "▥ \u00a0 Reports")}
        <button className="nav" type="button" onClick={() => toast("Settings opened.")}>⚙ &nbsp; Settings</button>
      </aside>

      <main className="main">
        <header className="top">
          <button className="menu" type="button" aria-label="Open navigation menu" onClick={() => setMenuOpen((o) => !o)}>☰</button>
          <div className="search">
            <span aria-hidden="true">🔎</span>
            <label className="sr-only" htmlFor="search">Search student or company</label>
            <input id="search" type="search" placeholder="Search student, company..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="actions">
            <button className="icon" type="button" aria-label="View notifications" onClick={() => toast("You have pending approvals and logbook reviews.")}>🔔</button>
            <button
              className="icon"
              type="button"
              aria-label="Refresh dashboard data"
              title={isRefreshing ? "Refreshing dashboard data..." : "Refresh dashboard data"}
              disabled={isRefreshing}
              onClick={() => refreshDataRef.current?.()}
            >
              {isRefreshing ? "…" : "⟳"}
            </button>
            <button className="icon" type="button" aria-label="Toggle dark mode" onClick={() => setDark((d) => !d)}>◐</button>
            <div className="profile">
              <div className="avatar">{initials(user.full_name || user.name || "Coordinator")}</div>
              <span><b>{user.full_name || user.name || "Coordinator"}</b><br /><small className="muted">{user.email || "Internship Office"}</small></span>
            </div>
          </div>
        </header>

        <div className="content">
          {apiLoading && <div role="status" className="muted">Loading coordinator data...</div>}
          {sessionExpired ? (
            <div role="alert" className="card" style={{ padding: 16, marginBottom: 16 }}>
              <b>Your session has expired.</b>
              <p style={{ margin: "8px 0 14px" }}>Sign in again to continue. Your dashboard data will reload after you sign in.</p>
              <button className="btn" type="button" onClick={signInAgain}>Sign in again</button>
            </div>
          ) : Object.entries(apiErrors).filter(([, error]) => error).map(([resource, error]) => (
            <div key={resource} role="alert" className="card" style={{ padding: 16, marginBottom: 16 }}>
              Could not load {resource}: {error}
            </div>
          ))}
          {page === "dashboard" && (
            <section>
              <div className="header">
                <div>
                  <h1>Hello coordinator👋</h1>
                  <div className="muted">
                    Here's what's happening with student internships today.
                    {lastChecked && <> Last checked {lastChecked.toLocaleTimeString()}.</>}
                  </div>
                </div>
              </div>
              <div className="stats">
                {[
                  ["Pending Approvals", stats.pending, "Requires your attention", "⏳"],
                  ["Active Placements", stats.active, "Currently on internship", "▣"],
                  ["Rejected Placements", stats.rejected, "All reported rejections", "!"],
                  ["No Supervisor", stats.unassigned, "Students need assignment", "♙"],
                ].map(([label, val, sub, ic]) => (
                  <div className="stat" key={label}>
                    <div><span>{label}</span><h2>{val}</h2><small className="muted">{sub}</small></div>
                    <div className="staticon">{ic}</div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="cardhead">
                  <div><h3>Placement Approval Queue</h3><div className="muted">Review and approve pending student placements.</div></div>
                  <button className="btn secondary" type="button" onClick={() => go("placements")}>View all</button>
                </div>
                <Table heads={["Student", "Company", "Role", "Dates", "Submitted", "Status", "Action"]}>
                  {pendingList.filter((x) => match(x.student, x.reg, x.company, x.role)).map((x) => (
                    <tr key={x.id}>
                      <td><div className="student"><div className="sa">{initials(x.student)}</div><div><b>{x.student}</b><br /><small className="muted">{x.reg}</small></div></div></td>
                      <td>{x.company}</td><td>{x.role}</td><td>{x.dates}</td><td>{x.submitted}</td>
                      <td><Status cls="pending">Pending</Status></td>
                      <td><button className="action" type="button" onClick={() => openPlacement(x)}>Review</button></td>
                    </tr>
                  ))}
                </Table>
              </div>

              <div className="lower">
                <div className="card">
                  <div className="cardhead">
                    <div><h3>Supervisor Overview</h3><div className="muted">Current supervisor assignments.</div></div>
                    <button className="btn secondary" type="button" onClick={() => go("supervisors")}>Manage</button>
                  </div>
                  {supervisors.length === 0 && <div className="row muted">No supervisors yet</div>}
                  {supervisors.slice(0, 3).map((s) => (
                    <div className="row" key={s.email}>
                      <div><b>{s.name}</b><br /><small className="muted">{s.dept}</small></div>
                      <b>{s.students} students</b>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <div className="cardhead">
                    <div><h3>Logbook Compliance</h3><div className="muted">Students requiring attention.</div></div>
                    <button className="btn secondary" type="button" onClick={() => go("logbooks")}>View</button>
                  </div>
                  <div className="row"><b>Submitted entries</b><b>{logStats.submitted}</b></div>
                  <div className="row"><b>Reviewed entries</b><b>{logStats.reviewed}</b></div>
                  <div className="row"><b>Draft entries</b><b>{logStats.draft}</b></div>
                </div>
              </div>
            </section>
          )}

          {page === "placements" && (
            <section>
              <div className="header"><div><h1>All Placements</h1><div className="muted">Manage and monitor all internship placements.</div></div></div>
              <div className="card">
                <div className="cardhead">
                  <div className="tabs">
                    {["all", "pending", "active", "rejected", "completed", "terminated"].map((t) => (
                      <button key={t} type="button" className={`tab ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>
                        {t[0].toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <Table heads={["Student", "Company", "Role", "Supervisor", "Dates", "Status", "Action"]}>
                  {placements
                    .filter((x) => (filter === "all" || x.status === filter) && match(x.student, x.company, x.role, x.supervisor))
                    .map((x) => (
                      <tr key={x.id}>
                        <td>{x.student}</td><td>{x.company}</td><td>{x.role}</td>
                        <td>{x.supervisor || "Not Assigned"}</td><td>{x.dates}</td>
                        <td><Status cls={x.status}>{x.status}</Status></td>
                        <td><button className="action" type="button" onClick={() => openPlacement(x)}>View</button></td>
                      </tr>
                    ))}
                </Table>
              </div>
            </section>
          )}

          {page === "supervisors" && (
            <section>
              <div className="header">
                <div><h1>Supervisor Management</h1><div className="muted">Manage supervisor assignments and workloads.</div></div>
              </div>
              <div className="card">
                <Table heads={["Name", "Department", "Email", "Students", "Active", "Pending Reviews", "Visits", "Action"]}>
                  {supervisors.filter((s) => match(s.name, s.dept, s.email)).map((s) => (
                    <tr key={s.id ?? s.email}>
                      <td><b>{s.name}</b></td><td>{s.dept}</td><td>{s.email}</td><td>{s.students}</td><td>{s.active}</td>
                      <td>{s.pendingReviews ?? 0}</td><td>{s.visits ?? 0}</td>
                      <td><button className="action" type="button" onClick={() => manageSup(s)}>Manage</button></td>
                    </tr>
                  ))}
                </Table>
              </div>
            </section>
          )}

          {page === "logbooks" && (
            <section>
              <div className="header"><div><h1>Logbook Oversight</h1><div className="muted">Monitor student logbook compliance.</div></div>              </div>
              <div className="card">
                <Table heads={["Student", "Week", "Submitted", "Supervisor", "Status"]}>
                  {logs.filter((x) => match(x.student, x.week, x.supervisor, x.status)).map((x) => (
                    <tr key={x.id}>
                      <td>{x.student}</td><td>{x.week}</td><td>{x.submitted || "—"}</td><td>{x.supervisor || "—"}</td>
                      <td><Status cls={logClass(x.status)}>{x.status}</Status></td>
                    </tr>
                  ))}
                </Table>
              </div>
            </section>
          )}

          {page === "evaluations" && (
            <section>
              <div className="header"><div><h1>Evaluation Oversight</h1><div className="muted">Track internship evaluation progress.</div></div></div>
              <div className="card">
                <Table heads={["Student", "Company", "Supervisor", "Status", "Submitted"]}>
                  {evals.filter((x) => match(x.student, x.company, x.supervisor, x.status)).map((x) => (
                    <tr key={x.id}>
                      <td>{x.student}</td><td>{x.company}</td><td>{x.supervisor || "—"}</td>
                      <td><Status cls={statusClass(x.status)}>{x.status}</Status></td>
                      <td>{x.submitted || "—"}</td>
                    </tr>
                  ))}
                </Table>
              </div>
            </section>
          )}

          {page === "grades" && (
            <section>
              <div className="header"><div><h1>Intern Grades</h1><div className="muted">Review performance scores and finalise grades.</div></div></div>
              <div className="card">
                <Table heads={["Student", "Company", "Supervisor", "Company Score", "Supervisor Score", "Final Score", "Grade", "Action"]}>
                  {grades.filter((g) => match(g.student_name, g.company, g.supervisor, g.student_id)).map((g) => {
                    const matchingPlacements = placements.filter((placement) =>
                      placement.studentId === g.student_id &&
                      placement.company.toLowerCase() === String(g.company).toLowerCase()
                    );
                    const canFinalise = !g.finalised_at && matchingPlacements.length === 1;
                    return (
                      <tr key={`${g.student_id}-${g.company}`}>
                        <td><b>{g.student_name}</b></td><td>{g.company}</td><td>{g.supervisor || "—"}</td>
                        <td>{g.company_score ?? "—"}</td><td>{g.supervisor_score ?? "—"}</td><td><b>{g.final_score ?? "—"}</b></td>
                        <td><Status cls={g.finalised_at ? "completed" : "pending"}>{g.letter_grade || "Pending"}</Status></td>
                        <td>
                          {g.finalised_at
                            ? <span className="muted">Finalised</span>
                            : <button className="action" type="button" disabled={!canFinalise} onClick={() => finaliseGrade(g)}>
                                {canFinalise ? "Finalise" : "Placement unavailable"}
                              </button>}
                        </td>
                      </tr>
                    );
                  })}
                </Table>
              </div>
            </section>
          )}

          {page === "reports" && (
            <section>
              <div className="header">
                <div>
                  <h1>Institution Reports</h1>
                  <div className="muted">Live summaries and records from the reporting API.</div>
                </div>
              </div>
              <div className="card">
                <div className="cardhead">
                  <div className="tabs" role="tablist" aria-label="Report views">
                    {["overview", "placements", "departments", "performance", "supervisors"].map((view) => (
                      <button
                        key={view}
                        type="button"
                        role="tab"
                        aria-selected={reportView === view}
                        className={`tab ${reportView === view ? "active" : ""}`}
                        onClick={() => setReportView(view)}
                      >
                        {view[0].toUpperCase() + view.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {reportView === "overview" && (
                  <>
                    {reportAnalytics ? (
                      <div className="stats" style={{ padding: 18, marginBottom: 0 }}>
                        {[
                          ["Students", reportAnalytics.users?.students],
                          ["Supervisors", reportAnalytics.users?.supervisors],
                          ["Coordinators", reportAnalytics.users?.coordinators],
                          ["Placements", reportAnalytics.placements?.total],
                          ["Pending Placements", reportAnalytics.placements?.pending],
                          ["Active Placements", reportAnalytics.placements?.active],
                          ["Completed Placements", reportAnalytics.placements?.completed],
                          ["Rejected Placements", reportAnalytics.placements?.rejected],
                          ["Logbooks", reportAnalytics.logbooks?.total],
                          ["Pending Reviews", reportAnalytics.logbooks?.pending_review],
                          ["Reviewed Logbooks", reportAnalytics.logbooks?.reviewed],
                          ["Graded Placements", reportAnalytics.grades?.total_graded],
                        ].map(([label, value]) => (
                          <div className="stat" key={label}>
                            <div><span>{label}</span><h2>{value ?? "—"}</h2></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="row muted">Analytics are not available yet.</div>
                    )}
                    {performanceReport?.summary && (
                      <div className="stats" style={{ padding: 18, marginBottom: 0 }}>
                        {[
                          ["Average Score", performanceReport.summary.average_score],
                          ["Highest Score", performanceReport.summary.highest_score],
                          ["Lowest Score", performanceReport.summary.lowest_score],
                        ].map(([label, value]) => (
                          <div className="stat" key={label}>
                            <div><span>{label}</span><h2>{value ?? "—"}</h2></div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Table heads={["Top Company", "Placements"]}>
                      {(reportAnalytics?.top_companies || []).map((company) => (
                        <tr key={company.company}><td>{company.company}</td><td>{company.placements}</td></tr>
                      ))}
                    </Table>
                  </>
                )}

                {reportView === "placements" && (
                  <Table heads={["Student", "Student ID", "Company", "Status", "Supervisor", "Dates", "Final Grade"]}>
                    {(placementReport?.results || []).filter((item) => match(item.student_name, item.student_id, item.company, item.status, item.supervisor)).map((item) => (
                      <tr key={item.placement_id}>
                        <td>{item.student_name}</td><td>{item.student_id}</td><td>{item.company}</td><td><Status cls={statusClass(item.status)}>{item.status}</Status></td>
                        <td>{item.supervisor || "—"}</td><td>{[item.internship_start, item.internship_end].filter(Boolean).join(" - ") || "—"}</td>
                        <td>{item.final_grade || "—"}{item.final_score != null ? ` (${item.final_score})` : ""}</td>
                      </tr>
                    ))}
                  </Table>
                )}

                {reportView === "departments" && (
                  <Table heads={["Department", "Placements", "Active", "Completed", "Programs", "Companies"]}>
                    {(departmentalReport?.results || []).filter((item) => match(item.department, ...Object.keys(item.programs || {}), ...(item.companies || []))).map((item) => (
                      <tr key={item.department}>
                        <td>{item.department}</td><td>{item.total}</td><td>{item.active}</td><td>{item.completed}</td>
                        <td>{Object.entries(item.programs || {}).map(([program, count]) => `${program}: ${count}`).join(", ") || "—"}</td>
                        <td>{(item.companies || []).join(", ") || "—"}</td>
                      </tr>
                    ))}
                  </Table>
                )}

                {reportView === "performance" && (
                  <Table heads={["Student", "Student ID", "Program", "Company", "Supervisor", "Company Score", "Supervisor Score", "Final Score", "Grade"]}>
                    {(performanceReport?.results || grades).filter((item) => match(item.student_name, item.student_id, item.program, item.company, item.supervisor, item.letter_grade)).map((item) => (
                      <tr key={`${item.student_id}-${item.company}`}>
                        <td>{item.student_name}</td><td>{item.student_id}</td><td>{item.program}</td><td>{item.company}</td>
                        <td>{item.supervisor}</td><td>{item.company_score}</td><td>{item.supervisor_score}</td><td>{item.final_score}</td><td>{item.letter_grade}</td>
                      </tr>
                    ))}
                  </Table>
                )}

                {reportView === "supervisors" && (
                  <Table heads={["Supervisor", "Email", "Active Students", "Completed Students", "Total Students", "Pending Reviews", "Visits"]}>
                    {supervisors.filter((item) => match(item.name, item.email)).map((item) => (
                      <tr key={item.email}>
                        <td>{item.name}</td><td>{item.email}</td><td>{item.active}</td><td>{item.completed ?? 0}</td>
                        <td>{item.students}</td><td>{item.pendingReviews}</td><td>{item.visits}</td>
                      </tr>
                    ))}
                  </Table>
                )}
              </div>
            </section>
          )}
        </div>
      </main>

      {modal === "placement" && current && (
        <Modal
          title="Placement Details"
          onClose={() => setModal(null)}
          footer={
            <>
              {current.status === "pending" ? (
                <>
                  <button className="btn secondary" type="button" onClick={openReject}>Reject</button>
                  <button className="btn success" type="button" onClick={approve}>✓ Approve Placement</button>
                </>
              ) : current.status === "active" ? (
                <button className="btn success" type="button" onClick={assignSupervisor}>Save Supervisor</button>
              ) : (
                <button className="btn secondary" type="button" onClick={() => setModal(null)}>Close</button>
              )}
            </>
          }
        >
          <div className="details">
            {[["Student", current.student], ["Company", current.company], ["Role", current.role], ["Dates", current.dates]].map(([l, v]) => (
              <div className="detail" key={l}><span className="detail-label">{l}</span><b>{v}</b></div>
            ))}
          </div>
          <div className="formgroup">
            <label htmlFor="msup">Assign Supervisor</label>
            <select
              id="msup"
              value={assignSup}
              onChange={(e) => setAssignSup(e.target.value)}
              disabled={!assignmentSupervisors.some((supervisor) => supervisor.id != null)}
            >
              <option value="">{current.status === "pending" ? "Assign later" : "Select a supervisor"}</option>
              {assignmentSupervisors
                .filter((supervisor) => supervisor.id != null)
                .map((supervisor) => (
                  <option key={supervisor.id} value={supervisor.id}>
                    {supervisor.name}{supervisor.email ? ` (${supervisor.email})` : ""}
                  </option>
                ))}
            </select>
            {apiErrors["assignment supervisors"] ? (
              <small className="muted">{apiErrors["assignment supervisors"]}</small>
            ) : !assignmentSupervisors.some((supervisor) => supervisor.id != null) ? (
              <small className="muted">No active supervisors are available for assignment.</small>
            ) : (
              null
            )}
          </div>
        </Modal>
      )}

      {modal === "reject" && (
        <Modal
          title="Reject Placement"
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn secondary" type="button" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn danger" type="button" onClick={reject}>Reject Placement</button>
            </>
          }
        >
          <div className="formgroup">
            <label htmlFor="reason">Reason *</label>
            <textarea id="reason" placeholder="Enter the reason for rejection..." value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
        </Modal>
      )}

      {modal === "supervisor" && (
        <Modal
          title="Add Supervisor"
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn secondary" type="button" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn" type="button" onClick={addSupervisor}>Save Supervisor</button>
            </>
          }
        >
          <div className="formgroup">
            <label htmlFor="sfirst">First Name</label>
            <input id="sfirst" type="text" autoComplete="given-name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div className="formgroup">
            <label htmlFor="slast">Last Name</label>
            <input id="slast" type="text" autoComplete="family-name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <div className="formgroup">
            <label htmlFor="semail">Email</label>
            <input id="semail" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </Modal>
      )}

      <div className={`toast ${toastShow ? "show" : ""}`}>{toastMsg}</div>
    </div>
  );
}