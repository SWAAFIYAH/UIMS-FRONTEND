import { useState, useMemo, useRef, useEffect } from "react";

const CSS = `
:root{--p:#0b3d91;--nav:#0b2454;--bg:#f5f7fb;--card:#fff;--text:#172033;--muted:#6b7280;--border:#e5e7eb;--green:#16a34a;--red:#dc2626;--orange:#d97706;--soft:#f8fafc}
.ouk.dark{--bg:#0f172a;--card:#1e293b;--text:#e2e8f0;--muted:#94a3b8;--border:#334155;--soft:#0f172a}
.ouk *{box-sizing:border-box}.ouk{font-family:Segoe UI,Arial,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.ouk button,.ouk input,.ouk select,.ouk textarea{font:inherit}.ouk button{cursor:pointer;color:inherit}
.sidebar{position:fixed;inset:0 auto 0 0;width:250px;background:var(--nav);color:#fff;padding:20px 14px;z-index:10}
.logo{display:flex;gap:10px;align-items:center;padding:8px 8px 22px;border-bottom:1px solid #ffffff22}
.logoicon{width:42px;height:42px;background:#fff;color:var(--p);border-radius:10px;display:grid;place-items:center;font-weight:bold}
.logo h3{margin:0;font-size:16px}.logo small{color:#b9c8e8}
.mt{color:#91a4c9;font-size:11px;text-transform:uppercase;margin:24px 10px 8px}
.nav{width:100%;border:0;background:transparent;color:#dce7fa!important;text-align:left;padding:12px;border-radius:8px;margin:3px 0}
.nav:hover,.nav.active{background:#ffffff1c}
.badge{float:right;background:var(--red);padding:2px 7px;border-radius:20px;font-size:11px;color:#fff}
.main{margin-left:250px}
.top{height:70px;background:var(--card);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 28px;position:sticky;top:0;z-index:5}
.search{background:var(--soft);border:1px solid var(--border);padding:10px 13px;border-radius:9px;width:320px}
.search input{border:0;background:none;outline:0;width:90%;color:var(--text)}
.actions{display:flex;align-items:center;gap:12px}
.icon{border:1px solid var(--border);background:var(--card);border-radius:8px;padding:9px}
.avatar{width:38px;height:38px;border-radius:50%;background:var(--p);color:#fff;display:grid;place-items:center;font-weight:bold}
.profile{display:flex;gap:8px;align-items:center}
.content{padding:28px}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px}
.header h1{margin:0 0 5px;font-size:25px}.muted{color:var(--muted);font-size:13px}
.btn{border:0;border-radius:8px;padding:10px 15px;background:var(--p);color:#fff!important}
.btn.secondary{background:var(--card);color:var(--text)!important;border:1px solid var(--border)}
.btn.success{background:var(--green)}.btn.danger{background:var(--red)}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:17px;margin-bottom:22px}
.stat,.card{background:var(--card);border:1px solid var(--border);border-radius:13px;box-shadow:0 7px 22px #0f172a0b}
.stat{padding:18px;display:flex;justify-content:space-between}
.stat span{color:var(--muted);font-size:13px}.stat h2{margin:6px 0;font-size:28px}
.staticon{width:48px;height:48px;border-radius:11px;background:#fff4df;color:var(--orange);display:grid;place-items:center}
.card{margin-bottom:22px}
.cardhead{padding:18px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;gap:15px}
.cardhead h3{margin:0 0 4px;font-size:17px}
.tablewrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:800px}
th{background:var(--soft);color:var(--muted);font-size:11px;text-align:left;padding:12px;text-transform:uppercase}
td{padding:13px;border-top:1px solid var(--border);font-size:13px}
.student{display:flex;gap:9px;align-items:center}
.sa{width:35px;height:35px;border-radius:50%;background:#e8eefb;color:var(--p);display:grid;place-items:center;font-weight:bold}
.status{padding:5px 9px;border-radius:20px;font-size:11px;font-weight:bold;text-transform:capitalize}
.status.pending{background:#fff4db;color:#a16207}.status.active{background:#e7f8ed;color:#15803d}
.status.rejected{background:#feecec;color:#b91c1c}.status.completed{background:#e8f1ff;color:#1d4ed8}
.action{border:1px solid var(--border);background:var(--card);padding:7px 10px;border-radius:6px}
.lower{display:grid;grid-template-columns:1.3fr 1fr;gap:22px}
.row{display:flex;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)}
.row:last-child{border:0}
.tabs{display:flex;gap:7px;overflow:auto}
.tab{padding:8px 13px;border:1px solid var(--border);background:var(--card);border-radius:7px;white-space:nowrap}
.tab.active{background:var(--p);color:#fff!important}
.modalbg{position:fixed;inset:0;background:#0f172a99;display:flex;align-items:center;justify-content:center;padding:20px;z-index:20}
.modal{background:var(--card);width:100%;max-width:650px;border-radius:14px;max-height:90vh;overflow:auto}
.modalhead{padding:18px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between}
.modalhead h3{margin:0}.modalbody{padding:20px}
.modalfoot{padding:16px 20px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px}
.close{border:0;background:none;font-size:22px}
.details{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.detail{background:var(--soft);padding:12px;border-radius:8px}
.detail-label{display:block;color:var(--muted);font-size:11px;margin-bottom:4px}
.formgroup{margin:15px 0}.formgroup label{display:block;font-weight:bold;font-size:13px;margin-bottom:6px}
.formgroup input,.formgroup select,.formgroup textarea{width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text)}
.formgroup textarea{min-height:100px}
.toast{position:fixed;right:22px;bottom:22px;background:#172033;color:#fff;padding:13px 17px;border-radius:8px;opacity:0;transform:translateY(80px);transition:.25s;z-index:30}
.toast.show{opacity:1;transform:translateY(0)}
.sr-only{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.menu{display:none}
@media(max-width:1050px){.stats{grid-template-columns:repeat(2,1fr)}.lower{grid-template-columns:1fr}}
@media(max-width:800px){.sidebar{transform:translateX(-100%);transition:.2s}.sidebar.open{transform:none}.main{margin-left:0}.menu{display:block;border:0;background:none;font-size:23px}.top{padding:0 14px}.search{width:220px}}
@media(max-width:600px){.stats{grid-template-columns:1fr}.search{display:none}.header{flex-direction:column;align-items:flex-start;gap:12px}.details{grid-template-columns:1fr}.profile span{display:none}}
`;

const INITIAL_PLACEMENTS = [
  { id: 1, student: "John Otieno", reg: "OUK/CS/2025/014", company: "Safaricom PLC", role: "Software Developer", dates: "May - Aug 2026", submitted: "2 hrs ago", status: "pending", supervisor: "" },
  { id: 2, student: "Mary Matano", reg: "OUK/IT/2025/032", company: "Kenya Power", role: "IT Support", dates: "Jun - Sep 2026", submitted: "5 hrs ago", status: "pending", supervisor: "" },
  { id: 3, student: "Alvin Wekesa", reg: "OUK/FIN/2025/071", company: "KCB Bank", role: "Finance Intern", dates: "Jun - Sep 2026", submitted: "Yesterday", status: "pending", supervisor: "" },
  { id: 4, student: "Faith Akinyi", reg: "OUK/BIO/2025/021", company: "Afya Hospital", role: "Laboratory Intern", dates: "Jul - Oct 2026", submitted: "Yesterday", status: "pending", supervisor: "" },
  { id: 5, student: "Kevin Ouma", reg: "OUK/IT/2025/011", company: "Equity Bank", role: "IT Support", dates: "May - Aug", submitted: "May 1", status: "active", supervisor: "Jane Smith" },
  { id: 6, student: "Lucy Wanjiku", reg: "OUK/FIN/2025/044", company: "KRA", role: "Accounting", dates: "Jan - Apr", submitted: "Jan 2", status: "completed", supervisor: "David Otieno" },
  { id: 7, student: "Peter Signh", reg: "OUK/CS/2025/055", company: "ABC Technologies", role: "Developer", dates: "Jun - Sep", submitted: "Jun 1", status: "rejected", supervisor: "" },
];

const INITIAL_SUPERVISORS = [
  { name: "Jane Smith", dept: "Computer Science", email: "jane789@gmail.com", students: 18, active: 16 },
  { name: "David Otieno", dept: "Business", email: "david@gmail.com", students: 15, active: 13 },
  { name: "Sophia Matano", dept: "Science", email: "matano564@gmail.com", students: 12, active: 11 },
];

const LOGS = [
  { student: "John Otieno", week: "Week 8", submitted: "—", supervisor: "Jane Smith", status: "Overdue" },
  { student: "Mary Wanjiku", week: "Week 7", submitted: "Yesterday", supervisor: "David Otieno", status: "Pending Review" },
  { student: "Brian Kiptoo", week: "Week 6", submitted: "2 days ago", supervisor: "Ann Mwangi", status: "Approved" },
];

const EVALS = [
  { student: "John Otieno", company: "Safaricom PLC", supervisor: "Jane Smith", status: "Pending", submitted: "—" },
  { student: "Kevin Ouma", company: "Equity Bank", supervisor: "David Otieno", status: "Completed", submitted: "Aug 20" },
];

const DEPARTMENTS = ["Computer Science", "Information Technology", "Business", "Science", "Education"];

const initials = (name) => name.split(" ").map((p) => p[0]).join("").slice(0, 2);
const logClass = (s) => (s === "Approved" ? "active" : s === "Overdue" ? "rejected" : "pending");
const matches = (obj, q) => !q || Object.values(obj).join(" ").toLowerCase().includes(q);

function Modal({ title, subtitle, onClose, children, footer }) {
  return (
    <div className="modalbg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modalhead">
          <div>
            <h3>{title}</h3>
            {subtitle && <small className="muted">{subtitle}</small>}
          </div>
          <button className="close" type="button" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="modalbody">{children}</div>
        <div className="modalfoot">{footer}</div>
      </div>
    </div>
  );
}

function Table({ headers, children }) {
  return (
    <div className="tablewrap">
      <table>
        <thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function PageHeader({ title, subtitle, action }) {
  return (
    <div className="header">
      <div><h1>{title}</h1><div className="muted">{subtitle}</div></div>
      {action}
    </div>
  );
}

export default function CoordinatorDashboard() {
  const [view, setView] = useState("dashboard");
  const [placements, setPlacements] = useState(INITIAL_PLACEMENTS);
  const [supervisors, setSupervisors] = useState(INITIAL_SUPERVISORS);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [modal, setModal] = useState(null); // "placement" | "reject" | "supervisor" | null
  const [currentId, setCurrentId] = useState(null);
  const [assignee, setAssignee] = useState("");
  const [reason, setReason] = useState("");
  const [form, setForm] = useState({ name: "", email: "", dept: "" });
  const [toastMsg, setToastMsg] = useState("");
  const timer = useRef();

  const toast = (msg) => {
    setToastMsg(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastMsg(""), 2800);
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setModal(null);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); clearTimeout(timer.current); };
  }, []);

  const q = query.trim().toLowerCase();
  const current = placements.find((p) => p.id === currentId);
  const pending = placements.filter((p) => p.status === "pending");
  const stats = {
    pending: pending.length,
    active: 86 + placements.filter((p) => p.status === "active").length - 1,
    rejected: placements.filter((p) => p.status === "rejected").length,
    unassigned: placements.filter((p) => !p.supervisor && p.status !== "completed").length + 3,
  };

  const goTo = (id) => { setView(id); setMenuOpen(false); window.scrollTo(0, 0); };

  const openPlacement = (id) => {
    const p = placements.find((x) => x.id === id);
    if (!p) return;
    setCurrentId(id);
    setAssignee(p.supervisor || "");
    setModal("placement");
  };

  const approve = () => {
    setPlacements((list) => list.map((p) => (p.id === currentId ? { ...p, status: "active", supervisor: assignee || p.supervisor } : p)));
    setModal(null);
    toast(`${current.student} approved successfully.`);
  };

  const openReject = () => { setReason(""); setModal("reject"); };

  const reject = () => {
    if (!reason.trim()) return toast("Rejection reason is required.");
    setPlacements((list) => list.map((p) => (p.id === currentId ? { ...p, status: "rejected", reason: reason.trim() } : p)));
    setModal(null);
    toast(`${current.student} rejected. Reason recorded.`);
  };

  const addSupervisor = () => {
    const name = form.name.trim(), email = form.email.trim();
    if (!name || !email || !form.dept) return toast("Complete all fields.");
    setSupervisors((list) => [...list, { name, email, dept: form.dept, students: 0, active: 0 }]);
    setForm({ name: "", email: "", dept: "" });
    setModal(null);
    toast("Supervisor added successfully.");
  };

  const manageSupervisor = (s) =>
    window.alert(`${s.name}\n${s.dept}\n\nStudents: ${s.students}\nActive placements: ${s.active}`);

  const visiblePlacements = useMemo(
    () => placements.filter((p) => (tab === "all" || p.status === tab) && matches(p, q)),
    [placements, tab, q]
  );

  const nav = (id, label, badge) => (
    <button key={id} type="button" className={`nav ${view === id ? "active" : ""}`} onClick={() => goTo(id)}>
      {label} {badge != null && <span className="badge">{badge}</span>}
    </button>
  );

  const addSupervisorBtn = (
    <button className="btn" type="button" onClick={() => setModal("supervisor")}>+ Add Supervisor</button>
  );

  return (
    <div className={`ouk ${dark ? "dark" : ""}`}>
      <style>{CSS}</style>

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="logo">
          <div className="logoicon">OUK</div>
          <div><h3>OUK Internship</h3><small>Management System</small></div>
        </div>
        <div className="mt">Main Menu</div>
        {nav("dashboard", "⌂   Dashboard")}
        {nav("placements", "▣   Placements", stats.pending)}
        {nav("supervisors", "♙   Supervisors")}
        {nav("logbooks", "▤   Logbooks")}
        {nav("evaluations", "✓   Evaluations")}
        <button className="nav" type="button" onClick={() => toast("Reports ready for backend integration.")}>▥   Reports</button>
        <button className="nav" type="button" onClick={() => toast("Settings opened.")}>⚙   Settings</button>
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
          {view === "dashboard" && (
            <section>
              <PageHeader title="Good afternoon, Coordinator 👋" subtitle="Here's what's happening with student internships today." action={addSupervisorBtn} />
              <div className="stats">
                {[
                  ["Pending Approvals", stats.pending, "Requires your attention", "⏳"],
                  ["Active Placements", stats.active, "Currently on internship", "▣"],
                  ["Rejected This Month", stats.rejected, "September 2026", "!"],
                  ["No Supervisor", stats.unassigned, "Students need assignment", "♙"],
                ].map(([label, value, note, icon]) => (
                  <div className="stat" key={label}>
                    <div><span>{label}</span><h2>{value}</h2><small className="muted">{note}</small></div>
                    <div className="staticon">{icon}</div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="cardhead">
                  <div><h3>Placement Approval Queue</h3><div className="muted">Review and approve pending student placements.</div></div>
                  <button className="btn secondary" type="button" onClick={() => goTo("placements")}>View all</button>
                </div>
                <Table headers={["Student", "Company", "Role", "Dates", "Submitted", "Status", "Action"]}>
                  {pending.filter((p) => matches(p, q)).map((p) => (
                    <tr key={p.id}>
                      <td><div className="student"><div className="sa">{initials(p.student)}</div><div><b>{p.student}</b><br /><small className="muted">{p.reg}</small></div></div></td>
                      <td>{p.company}</td><td>{p.role}</td><td>{p.dates}</td><td>{p.submitted}</td>
                      <td><span className="status pending">Pending</span></td>
                      <td><button className="action" type="button" onClick={() => openPlacement(p.id)}>Review</button></td>
                    </tr>
                  ))}
                  {pending.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", padding: 25 }}>🎉 No pending approvals</td></tr>}
                </Table>
              </div>

              <div className="lower">
                <div className="card">
                  <div className="cardhead">
                    <div><h3>Supervisor Overview</h3><div className="muted">Current supervisor assignments.</div></div>
                    <button className="btn secondary" type="button" onClick={() => goTo("supervisors")}>Manage</button>
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
                    <button className="btn secondary" type="button" onClick={() => goTo("logbooks")}>View</button>
                  </div>
                  <div className="row"><b>Overdue logbooks</b><b>5</b></div>
                  <div className="row"><b>Flagged submissions</b><b>3</b></div>
                  <div className="row"><b>Pending reviews</b><b>9</b></div>
                </div>
              </div>
            </section>
          )}

          {view === "placements" && (
            <section>
              <PageHeader title="All Placements" subtitle="Manage and monitor all internship placements." />
              <div className="card">
                <div className="cardhead">
                  <div className="tabs">
                    {["all", "pending", "active", "rejected", "completed"].map((t) => (
                      <button key={t} type="button" className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                        {t[0].toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <Table headers={["Student", "Company", "Role", "Supervisor", "Dates", "Status", "Action"]}>
                  {visiblePlacements.map((p) => (
                    <tr key={p.id}>
                      <td>{p.student}</td><td>{p.company}</td><td>{p.role}</td>
                      <td>{p.supervisor || "Not Assigned"}</td><td>{p.dates}</td>
                      <td><span className={`status ${p.status}`}>{p.status}</span></td>
                      <td><button className="action" type="button" onClick={() => openPlacement(p.id)}>View</button></td>
                    </tr>
                  ))}
                </Table>
              </div>
            </section>
          )}

          {view === "supervisors" && (
            <section>
              <PageHeader title="Supervisor Management" subtitle="Manage supervisor assignments and workloads." action={addSupervisorBtn} />
              <div className="card">
                <Table headers={["Name", "Department", "Email", "Students", "Active", "Action"]}>
                  {supervisors.filter((s) => matches(s, q)).map((s) => (
                    <tr key={s.email}>
                      <td><b>{s.name}</b></td><td>{s.dept}</td><td>{s.email}</td><td>{s.students}</td><td>{s.active}</td>
                      <td><button className="action" type="button" onClick={() => manageSupervisor(s)}>Manage</button></td>
                    </tr>
                  ))}
                </Table>
              </div>
            </section>
          )}

          {view === "logbooks" && (
            <section>
              <PageHeader title="Logbook Oversight" subtitle="Monitor student logbook compliance." />
              <div className="card">
                <Table headers={["Student", "Week", "Submitted", "Supervisor", "Status", "Action"]}>
                  {LOGS.filter((l) => matches(l, q)).map((l) => (
                    <tr key={l.student}>
                      <td>{l.student}</td><td>{l.week}</td><td>{l.submitted}</td><td>{l.supervisor}</td>
                      <td><span className={`status ${logClass(l.status)}`}>{l.status}</span></td>
                      <td>
                        <button className="action" type="button" onClick={() => toast(l.status === "Overdue" ? "Reminder sent" : "Logbook opened")}>
                          {l.status === "Overdue" ? "Remind" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </Table>
              </div>
            </section>
          )}

          {view === "evaluations" && (
            <section>
              <PageHeader title="Evaluation Oversight" subtitle="Track internship evaluation progress." />
              <div className="card">
                <Table headers={["Student", "Company", "Supervisor", "Status", "Submitted", "Action"]}>
                  {EVALS.filter((e) => matches(e, q)).map((e) => (
                    <tr key={e.student}>
                      <td>{e.student}</td><td>{e.company}</td><td>{e.supervisor}</td>
                      <td><span className={`status ${e.status === "Completed" ? "completed" : "pending"}`}>{e.status}</span></td>
                      <td>{e.submitted}</td>
                      <td>
                        <button className="action" type="button" onClick={() => toast(e.status === "Pending" ? "Reminder sent" : "Evaluation opened")}>
                          {e.status === "Pending" ? "Remind" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </Table>
              </div>
            </section>
          )}
        </div>
      </main>

      {modal === "placement" && current && (
        <Modal
          title="Placement Details" subtitle="Review placement" onClose={() => setModal(null)}
          footer={<>
            <button className="btn secondary" type="button" onClick={openReject}>Reject</button>
            <button className="btn success" type="button" onClick={approve}>✓ Approve Placement</button>
          </>}
        >
          <div className="details">
            {[["Student", current.student], ["Company", current.company], ["Role", current.role], ["Dates", current.dates]].map(([l, v]) => (
              <div className="detail" key={l}><span className="detail-label">{l}</span><b>{v}</b></div>
            ))}
          </div>
          <div className="formgroup">
            <label htmlFor="msup">Assign Supervisor</label>
            <select id="msup" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
              <option value="">Assign later</option>
              {supervisors.map((s) => <option key={s.email} value={s.name}>{s.name}</option>)}
            </select>
          </div>
        </Modal>
      )}

      {modal === "reject" && (
        <Modal
          title="Reject Placement" onClose={() => setModal(null)}
          footer={<>
            <button className="btn secondary" type="button" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn danger" type="button" onClick={reject}>Reject Placement</button>
          </>}
        >
          <div className="formgroup">
            <label htmlFor="reason">Reason *</label>
            <textarea id="reason" placeholder="Enter the reason for rejection..." value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
        </Modal>
      )}

      {modal === "supervisor" && (
        <Modal
          title="Add Supervisor" onClose={() => setModal(null)}
          footer={<>
            <button className="btn secondary" type="button" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn" type="button" onClick={addSupervisor}>Add Supervisor</button>
          </>}
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
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </Modal>
      )}

      <div className={`toast ${toastMsg ? "show" : ""}`} role="status">{toastMsg}</div>
    </div>
  );
}