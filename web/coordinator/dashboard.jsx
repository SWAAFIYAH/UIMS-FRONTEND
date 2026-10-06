import { useState, useEffect, useRef } from "react";

const css = `
:root{--p:#0b3d91;--nav:#0b2454;--bg:#f5f7fb;--card:#fff;--text:#172033;--muted:#6b7280;--border:#e5e7eb;--green:#16a34a;--red:#dc2626;--orange:#d97706}
.ouk.dark{--bg:#0f172a;--card:#1e293b;--text:#e5e7eb;--muted:#94a3b8;--border:#334155}
.ouk *{box-sizing:border-box}.ouk{font-family:Segoe UI,Arial,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.ouk button,.ouk input,.ouk select,.ouk textarea{font:inherit;color:inherit}.ouk button{cursor:pointer}
.sidebar{position:fixed;inset:0 auto 0 0;width:250px;background:var(--nav);color:#fff;padding:20px 14px;z-index:10}
.logo{display:flex;gap:10px;align-items:center;padding:8px 8px 22px;border-bottom:1px solid #ffffff22}
.logoicon{width:42px;height:42px;background:#fff;color:var(--p);border-radius:10px;display:grid;place-items:center;font-weight:bold}
.logo h3{margin:0;font-size:16px}.logo small{color:#b9c8e8}
.mt{color:#91a4c9;font-size:11px;text-transform:uppercase;margin:24px 10px 8px}
.nav{width:100%;border:0;background:transparent;color:#dce7fa!important;text-align:left;padding:12px;border-radius:8px;margin:3px 0}
.nav:hover,.nav.active{background:#ffffff1c}.badge{float:right;background:var(--red);padding:2px 7px;border-radius:20px;font-size:11px}
.main{margin-left:250px}
.top{height:70px;background:var(--card);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 28px;position:sticky;top:0;z-index:5}
.search{background:var(--bg);border:1px solid var(--border);padding:10px 13px;border-radius:9px;width:320px}.search input{border:0;background:none;outline:0;width:90%}
.actions{display:flex;align-items:center;gap:12px}.icon{border:1px solid var(--border);background:var(--card);border-radius:8px;padding:9px}
.avatar{width:38px;height:38px;border-radius:50%;background:var(--p);color:#fff;display:grid;place-items:center;font-weight:bold}.profile{display:flex;gap:8px;align-items:center}
.content{padding:28px}.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px}.header h1{margin:0 0 5px;font-size:25px}
.muted{color:var(--muted);font-size:13px}
.btn{border:0;border-radius:8px;padding:10px 15px;background:var(--p);color:#fff!important}.btn.secondary{background:var(--card);color:var(--text)!important;border:1px solid var(--border)}.btn.success{background:var(--green)}.btn.danger{background:var(--red)}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:17px;margin-bottom:22px}
.stat,.card{background:var(--card);border:1px solid var(--border);border-radius:13px;box-shadow:0 7px 22px #0f172a0b}
.stat{padding:18px;display:flex;justify-content:space-between}.stat span{color:var(--muted);font-size:13px}.stat h2{margin:6px 0;font-size:28px}
.staticon{width:48px;height:48px;border-radius:11px;background:#fff4df;color:var(--orange);display:grid;place-items:center}
.card{margin-bottom:22px}.cardhead{padding:18px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;gap:15px}.cardhead h3{margin:0 0 4px;font-size:17px}
.tablewrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:800px}
th{background:var(--bg);color:var(--muted);font-size:11px;text-align:left;padding:12px;text-transform:uppercase}td{padding:13px;border-top:1px solid var(--border);font-size:13px}
.student{display:flex;gap:9px;align-items:center}.sa{width:35px;height:35px;border-radius:50%;background:#e8eefb;color:var(--p);display:grid;place-items:center;font-weight:bold}
.status{padding:5px 9px;border-radius:20px;font-size:11px;font-weight:bold;text-transform:capitalize}
.s-pending{background:#fff4db;color:#a16207}.s-active{background:#e7f8ed;color:#15803d}.s-rejected{background:#feecec;color:#b91c1c}.s-completed{background:#e8f1ff;color:#1d4ed8}
.action{border:1px solid var(--border);background:var(--card);padding:7px 10px;border-radius:6px}
.lower{display:grid;grid-template-columns:1.3fr 1fr;gap:22px}.row{display:flex;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)}.row:last-child{border:0}
.tabs{display:flex;gap:7px;overflow:auto}.tab{padding:8px 13px;border:1px solid var(--border);background:var(--card);border-radius:7px;white-space:nowrap}.tab.active{background:var(--p);color:#fff}
.modalbg{position:fixed;inset:0;background:#0f172a99;display:flex;align-items:center;justify-content:center;padding:20px;z-index:20}
.modal{background:var(--card);width:100%;max-width:650px;border-radius:14px;max-height:90vh;overflow:auto}
.modalhead{padding:18px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between}.modalhead h3{margin:0}
.modalbody{padding:20px}.modalfoot{padding:16px 20px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px}
.close{border:0;background:none;font-size:22px}.details{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.detail{background:var(--bg);padding:12px;border-radius:8px}.detail-label{display:block;color:var(--muted);font-size:11px;margin-bottom:4px}
.formgroup{margin:15px 0}.formgroup label{display:block;font-weight:bold;font-size:13px;margin-bottom:6px}
.formgroup input,.formgroup select,.formgroup textarea{width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;background:var(--card)}.formgroup textarea{min-height:100px}
.toast{position:fixed;right:22px;bottom:22px;background:#172033;color:#fff;padding:13px 17px;border-radius:8px;opacity:0;transform:translateY(80px);transition:.25s;z-index:30}.toast.show{opacity:1;transform:none}
.sr-only{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
.menu{display:none}
@media(max-width:1050px){.stats{grid-template-columns:repeat(2,1fr)}.lower{grid-template-columns:1fr}}
@media(max-width:800px){.sidebar{transform:translateX(-100%);transition:.2s}.sidebar.open{transform:none}.main{margin-left:0}.menu{display:block;border:0;background:none;font-size:23px}.top{padding:0 14px}.search{width:220px}}
@media(max-width:600px){.stats{grid-template-columns:1fr}.search{display:none}.header{flex-direction:column;align-items:flex-start;gap:12px}.details{grid-template-columns:1fr}.profile span{display:none}}
`;

const initialPlacements = [
  { id: 1, student: "John Otieno", reg: "OUK/CS/2025/014", company: "Safaricom PLC", role: "Software Developer", dates: "May - Aug 2026", submitted: "2 hrs ago", status: "pending", supervisor: "" },
  { id: 2, student: "Mary Matano", reg: "OUK/IT/2025/032", company: "Kenya Power", role: "IT Support", dates: "Jun - Sep 2026", submitted: "5 hrs ago", status: "pending", supervisor: "" },
  { id: 3, student: "Alvin Wekesa", reg: "OUK/FIN/2025/071", company: "KCB Bank", role: "Finance Intern", dates: "Jun - Sep 2026", submitted: "Yesterday", status: "pending", supervisor: "" },
  { id: 4, student: "Faith Akinyi", reg: "OUK/BIO/2025/021", company: "Afya Hospital", role: "Laboratory Intern", dates: "Jul - Oct 2026", submitted: "Yesterday", status: "pending", supervisor: "" },
  { id: 5, student: "Kevin Ouma", reg: "OUK/IT/2025/011", company: "Equity Bank", role: "IT Support", dates: "May - Aug", submitted: "May 1", status: "active", supervisor: "Jane Smith" },
  { id: 6, student: "Lucy Wanjiku", reg: "OUK/FIN/2025/044", company: "KRA", role: "Accounting", dates: "Jan - Apr", submitted: "Jan 2", status: "completed", supervisor: "David Otieno" },
  { id: 7, student: "Peter Signh", reg: "OUK/CS/2025/055", company: "ABC Technologies", role: "Developer", dates: "Jun - Sep", submitted: "Jun 1", status: "rejected", supervisor: "" },
];
const initialSupervisors = [
  { name: "Jane Smith", dept: "Computer Science", email: "jane789@gmail.com", students: 18, active: 16 },
  { name: "David Otieno", dept: "Business", email: "david@gmail.com", students: 15, active: 13 },
  { name: "Sophia Matano", dept: "Science", email: "matano564@gmail.com", students: 12, active: 11 },
];
const logs = [
  ["John Otieno", "Week 8", "—", "Jane Smith", "Overdue"],
  ["Mary Wanjiku", "Week 7", "Yesterday", "David Otieno", "Pending Review"],
  ["Brian Kiptoo", "Week 6", "2 days ago", "Ann Mwangi", "Approved"],
];
const evals = [
  ["John Otieno", "Safaricom PLC", "Jane Smith", "Pending", "—"],
  ["Kevin Ouma", "Equity Bank", "David Otieno", "Completed", "Aug 20"],
];
const initialGrades = [
  { student: "Kevin Ouma", company: "Equity Bank", supervisor: "Jane Smith", logbook: 26, evaluation: 34, report: 25 },
  { student: "Lucy Wanjiku", company: "KRA", supervisor: "David Otieno", logbook: 28, evaluation: 36, report: 27 },
  { student: "Mary Wanjiku", company: "Kenya Power", supervisor: "David Otieno", logbook: 20, evaluation: null, report: null },
  { student: "John Otieno", company: "Safaricom PLC", supervisor: "Jane Smith", logbook: null, evaluation: null, report: null },
];
const MAX = { logbook: 30, evaluation: 40, report: 30 };
const GRADE_FIELDS = [["logbook", "Logbook"], ["evaluation", "Supervisor Evaluation"], ["report", "Final Report"]];
const gradeInfo = (g) => {
  const complete = GRADE_FIELDS.every(([k]) => g[k] !== null);
  const total = GRADE_FIELDS.reduce((sum, [k]) => sum + (g[k] ?? 0), 0);
  const letter = !complete ? "—" : total >= 70 ? "A" : total >= 60 ? "B" : total >= 50 ? "C" : total >= 40 ? "D" : "E";
  return { complete, total, letter };
};
const departments = ["Computer Science", "Information Technology", "Business", "Science", "Education"];
const initials = (n) => n.split(" ").map((p) => p[0]).join("").slice(0, 2);

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
  return (
    <div className="tablewrap">
      <table>
        <thead><tr>{heads.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

const Status = ({ cls, children }) => <span className={`status s-${cls}`}>{children}</span>;

export default function OukDashboard() {
  const [page, setPage] = useState("dashboard");
  const [placements, setPlacements] = useState(initialPlacements);
  const [supervisors, setSupervisors] = useState(initialSupervisors);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const [modal, setModal] = useState(null); // "placement" | "reject" | "supervisor" | "grade"
  const [currentId, setCurrentId] = useState(null);
  const [assignSup, setAssignSup] = useState("");
  const [reason, setReason] = useState("");
  const [form, setForm] = useState({ name: "", email: "", dept: "" });
  const [grades, setGrades] = useState(initialGrades);
  const [gradeTarget, setGradeTarget] = useState(null);
  const [gradeForm, setGradeForm] = useState({ logbook: "", evaluation: "", report: "" });
  const timer = useRef();

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
  const match = (...vals) => vals.join(" ").toLowerCase().includes(query.toLowerCase());

  const pendingList = placements.filter((x) => x.status === "pending");
  const stats = {
    pending: pendingList.length,
    active: 86 + placements.filter((x) => x.status === "active").length - 1,
    rejected: placements.filter((x) => x.status === "rejected").length,
    unassigned: placements.filter((x) => !x.supervisor && x.status !== "completed").length + 3,
  };
  const current = placements.find((x) => x.id === currentId);

  const openPlacement = (p) => { setCurrentId(p.id); setAssignSup(p.supervisor); setModal("placement"); };
  const approve = () => {
    setPlacements((ps) => ps.map((p) => (p.id === currentId ? { ...p, status: "active", supervisor: assignSup || p.supervisor } : p)));
    setModal(null);
    toast(`${current.student} approved successfully.`);
  };
  const openReject = () => { setReason(""); setModal("reject"); };
  const reject = () => {
    if (!reason.trim()) return toast("Rejection reason is required.");
    setPlacements((ps) => ps.map((p) => (p.id === currentId ? { ...p, status: "rejected", reason: reason.trim() } : p)));
    setModal(null);
    toast(`${current.student} rejected. Reason recorded.`);
  };
  const addSupervisor = () => {
    const name = form.name.trim(), email = form.email.trim();
    if (!name || !email || !form.dept) return toast("Complete all fields.");
    setSupervisors((s) => [...s, { name, email, dept: form.dept, students: 0, active: 0 }]);
    setForm({ name: "", email: "", dept: "" });
    setModal(null);
    toast("Supervisor added successfully.");
  };
  const openGrade = (g) => {
    setGradeTarget(g.student);
    setGradeForm({ logbook: g.logbook ?? "", evaluation: g.evaluation ?? "", report: g.report ?? "" });
    setModal("grade");
  };
  const saveGrade = () => {
    const next = {};
    for (const [k, label] of GRADE_FIELDS) {
      const raw = String(gradeForm[k]).trim();
      if (raw === "") { next[k] = null; continue; }
      const n = Number(raw);
      if (Number.isNaN(n) || n < 0 || n > MAX[k]) return toast(`${label} must be between 0 and ${MAX[k]}.`);
      next[k] = n;
    }
    setGrades((gs) => gs.map((g) => (g.student === gradeTarget ? { ...g, ...next } : g)));
    setModal(null);
    toast(`Grades saved for ${gradeTarget}.`);
  };
  const manageSup = (s) =>
    window.alert(`${s.name}\n${s.dept}\n\nStudents: ${s.students}\nActive placements: ${s.active}`);

  const navBtn = (id, label, extra) => (
    <button className={`nav ${page === id ? "active" : ""}`} type="button" onClick={() => go(id)}>
      {label} {extra}
    </button>
  );
  const logClass = (s) => (s === "Approved" ? "active" : s === "Overdue" ? "rejected" : "pending");

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
        {navBtn("placements", "▣ \u00a0 Placements", <span className="badge">{stats.pending}</span>)}
        {navBtn("supervisors", "♙ \u00a0 Supervisors")}
        {navBtn("logbooks", "▤ \u00a0 Logbooks")}
        {navBtn("evaluations", "✓ \u00a0 Evaluations")}
        {navBtn("grades", "★ \u00a0 Grades")}
        <button className="nav" type="button" onClick={() => toast("Reports ready for backend integration.")}>▥ &nbsp; Reports</button>
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
            <button className="icon" type="button" aria-label="Toggle dark mode" onClick={() => setDark((d) => !d)}>◐</button>
            <div className="profile">
              <div className="avatar">CO</div>
              <span><b>Coordinator</b><br /><small className="muted">Internship Office</small></span>
            </div>
          </div>
        </header>

        <div className="content">
          {page === "dashboard" && (
            <section>
              <div className="header">
                <div>
                  <h1>Good afternoon, Coordinator 👋</h1>
                  <div className="muted">Here's what's happening with student internships today.</div>
                </div>
              </div>
              <div className="stats">
                {[
                  ["Pending Approvals", stats.pending, "Requires your attention", "⏳"],
                  ["Active Placements", stats.active, "Currently on internship", "▣"],
                  ["Rejected This Month", stats.rejected, "September 2026", "!"],
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
                  {pendingList.length === 0 && (
                    <tr><td colSpan="7" style={{ textAlign: "center", padding: 25 }}>🎉 No pending approvals</td></tr>
                  )}
                </Table>
              </div>

              <div className="lower">
                <div className="card">
                  <div className="cardhead">
                    <div><h3>Supervisor Overview</h3><div className="muted">Current supervisor assignments.</div></div>
                    <button className="btn secondary" type="button" onClick={() => go("supervisors")}>Manage</button>
                  </div>
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
                  <div className="row"><b>Overdue logbooks</b><b>5</b></div>
                  <div className="row"><b>Flagged submissions</b><b>3</b></div>
                  <div className="row"><b>Pending reviews</b><b>9</b></div>
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
                    {["all", "pending", "active", "rejected", "completed"].map((t) => (
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
                <button className="btn" type="button" onClick={() => setModal("supervisor")}>+ Add Supervisor</button>
              </div>
              <div className="card">
                <Table heads={["Name", "Department", "Email", "Students", "Active", "Action"]}>
                  {supervisors.filter((s) => match(s.name, s.dept, s.email)).map((s) => (
                    <tr key={s.email}>
                      <td><b>{s.name}</b></td><td>{s.dept}</td><td>{s.email}</td><td>{s.students}</td><td>{s.active}</td>
                      <td><button className="action" type="button" onClick={() => manageSup(s)}>Manage</button></td>
                    </tr>
                  ))}
                </Table>
              </div>
            </section>
          )}

          {page === "logbooks" && (
            <section>
              <div className="header"><div><h1>Logbook Oversight</h1><div className="muted">Monitor student logbook compliance.</div></div></div>
              <div className="card">
                <Table heads={["Student", "Week", "Submitted", "Supervisor", "Status", "Action"]}>
                  {logs.filter((x) => match(...x)).map((x) => (
                    <tr key={x[0] + x[1]}>
                      <td>{x[0]}</td><td>{x[1]}</td><td>{x[2]}</td><td>{x[3]}</td>
                      <td><Status cls={logClass(x[4])}>{x[4]}</Status></td>
                      <td>
                        <button className="action" type="button" onClick={() => toast(x[4] === "Overdue" ? "Reminder sent" : "Logbook opened")}>
                          {x[4] === "Overdue" ? "Remind" : "View"}
                        </button>
                      </td>
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
                <Table heads={["Student", "Company", "Supervisor", "Status", "Submitted", "Action"]}>
                  {evals.filter((x) => match(...x)).map((x) => (
                    <tr key={x[0]}>
                      <td>{x[0]}</td><td>{x[1]}</td><td>{x[2]}</td>
                      <td><Status cls={x[3] === "Completed" ? "completed" : "pending"}>{x[3]}</Status></td>
                      <td>{x[4]}</td>
                      <td>
                        <button className="action" type="button" onClick={() => toast(x[3] === "Pending" ? "Reminder sent" : "Evaluation opened")}>
                          {x[3] === "Pending" ? "Remind" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </Table>
              </div>
            </section>
          )}

          {page === "grades" && (
            <section>
              <div className="header"><div><h1>Intern Grades</h1><div className="muted">Record and review final internship grades. Total is out of 100.</div></div></div>
              <div className="card">
                <Table heads={["Student", "Company", "Supervisor", "Logbook /30", "Evaluation /40", "Report /30", "Total", "Grade", "Action"]}>
                  {grades.filter((g) => match(g.student, g.company, g.supervisor)).map((g) => {
                    const { complete, total, letter } = gradeInfo(g);
                    return (
                      <tr key={g.student}>
                        <td><b>{g.student}</b></td><td>{g.company}</td><td>{g.supervisor}</td>
                        <td>{g.logbook ?? "—"}</td><td>{g.evaluation ?? "—"}</td><td>{g.report ?? "—"}</td>
                        <td><b>{complete ? total : "—"}</b></td>
                        <td><Status cls={complete ? "completed" : "pending"}>{complete ? letter : "Pending"}</Status></td>
                        <td><button className="action" type="button" onClick={() => openGrade(g)}>{complete ? "Edit" : "Grade"}</button></td>
                      </tr>
                    );
                  })}
                </Table>
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
              <button className="btn secondary" type="button" onClick={openReject}>Reject</button>
              <button className="btn success" type="button" onClick={approve}>✓ Approve Placement</button>
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
            <select id="msup" value={assignSup} onChange={(e) => setAssignSup(e.target.value)}>
              <option value="">Assign later</option>
              {supervisors.map((s) => <option key={s.email} value={s.name}>{s.name}</option>)}
            </select>
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
            <label htmlFor="sname">Full Name</label>
            <input id="sname" type="text" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="formgroup">
            <label htmlFor="semail">Email</label>
            <input id="semail" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="formgroup">
            <label htmlFor="sdept">Department</label>
            <select id="sdept" value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })}>
              <option value="">Select department</option>
              {departments.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </Modal>
      )}

      {modal === "grade" && (
        <Modal
          title={`Grade ${gradeTarget}`}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn secondary" type="button" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn" type="button" onClick={saveGrade}>Save Grades</button>
            </>
          }
        >
          {GRADE_FIELDS.map(([k, label]) => (
            <div className="formgroup" key={k}>
              <label htmlFor={`g-${k}`}>{label} (out of {MAX[k]})</label>
              <input id={`g-${k}`} type="number" min="0" max={MAX[k]} value={gradeForm[k]} onChange={(e) => setGradeForm({ ...gradeForm, [k]: e.target.value })} />
            </div>
          ))}
          <div className="muted">Leave a field blank if it hasn't been assessed yet. A grade is assigned once all three are filled.</div>
        </Modal>
      )}

      <div className={`toast ${toastShow ? "show" : ""}`}>{toastMsg}</div>
    </div>
  );
}