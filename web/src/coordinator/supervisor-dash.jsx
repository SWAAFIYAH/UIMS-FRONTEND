import { useState, useEffect, useRef, Children } from "react";

const css = `
.sd{--p:#0b3d91;--bg:#f5f7fb;--card:#fff;--text:#172033;--muted:#6b7280;--border:#e5e7eb;--green:#16a34a;--red:#dc2626;--orange:#d97706}
.sd.dark{--bg:#0f172a;--card:#1e293b;--text:#e5e7eb;--muted:#94a3b8;--border:#334155}
.sd *{box-sizing:border-box}.sd{font-family:Segoe UI,Arial,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.sd button,.sd input,.sd select{font:inherit;color:inherit}.sd button{cursor:pointer}
.sd .top{height:70px;background:var(--card);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:16px;padding:0 28px;position:sticky;top:0;z-index:5}
.sd .brand{display:flex;gap:10px;align-items:center}.sd .logoicon{width:42px;height:42px;background:var(--p);color:#fff;border-radius:10px;display:grid;place-items:center;font-weight:bold}
.sd .brand h3{margin:0;font-size:16px}
.sd .search{background:var(--bg);border:1px solid var(--border);padding:10px 13px;border-radius:9px;width:320px;max-width:100%}.sd .search input{border:0;background:none;outline:0;width:88%}
.sd .actions{display:flex;align-items:center;gap:12px}.sd .icon{border:1px solid var(--border);background:var(--card);border-radius:8px;padding:9px}
.sd .avatar{width:38px;height:38px;border-radius:50%;background:var(--p);color:#fff;display:grid;place-items:center;font-weight:bold}
.sd .content{padding:28px;max-width:1280px;margin:0 auto}
.sd .header{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:22px;flex-wrap:wrap}.sd .header h1{margin:0 0 5px;font-size:25px}
.sd .muted{color:var(--muted);font-size:13px}
.sd .btn{border:0;border-radius:8px;padding:10px 15px;background:var(--p);color:#fff!important}.sd .btn.secondary{background:var(--card);color:var(--text)!important;border:1px solid var(--border)}.sd .btn:disabled{opacity:.6;cursor:not-allowed}
.sd .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:17px;margin-bottom:22px}
.sd .stat,.sd .card{background:var(--card);border:1px solid var(--border);border-radius:13px;box-shadow:0 7px 22px #0f172a0b}
.sd .stat{padding:18px;display:flex;justify-content:space-between}.sd .stat span{color:var(--muted);font-size:13px}.sd .stat h2{margin:6px 0;font-size:28px}
.sd .staticon{width:48px;height:48px;border-radius:11px;background:#fff4df;color:var(--orange);display:grid;place-items:center}
.sd .card{margin-bottom:22px}
.sd .tablewrap{overflow:auto}.sd table{width:100%;border-collapse:collapse;min-width:760px}
.sd th{background:var(--bg);color:var(--muted);font-size:11px;text-align:left;padding:12px;text-transform:uppercase}.sd td{padding:13px;border-top:1px solid var(--border);font-size:13px}
.sd .person{display:flex;gap:9px;align-items:center}.sd .sa{width:35px;height:35px;border-radius:50%;background:#e8eefb;color:var(--p);display:grid;place-items:center;font-weight:bold}
.sd .action{border:1px solid var(--border);background:var(--card);padding:7px 10px;border-radius:6px}
.sd .modalbg{position:fixed;inset:0;background:#0f172a99;display:flex;align-items:center;justify-content:center;padding:20px;z-index:20}
.sd .modal{background:var(--card);width:100%;max-width:560px;border-radius:14px;max-height:90vh;overflow:auto}
.sd .modalhead{padding:18px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between}.sd .modalhead h3{margin:0}
.sd .modalbody{padding:20px}.sd .modalfoot{padding:16px 20px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px}
.sd .close{border:0;background:none;font-size:22px}.sd .details{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.sd .detail{background:var(--bg);padding:12px;border-radius:8px}.sd .detail-label{display:block;color:var(--muted);font-size:11px;margin-bottom:4px}
.sd .formgroup{margin:15px 0}.sd .formgroup label{display:block;font-weight:bold;font-size:13px;margin-bottom:6px}
.sd .formgroup input,.sd .formgroup select{width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;background:var(--card)}
.sd .toast{position:fixed;right:22px;bottom:22px;background:#172033;color:#fff;padding:13px 17px;border-radius:8px;opacity:0;transform:translateY(80px);transition:.25s;z-index:30}.sd .toast.show{opacity:1;transform:none}
.sd .sr-only{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
@media(max-width:800px){.sd .stats{grid-template-columns:1fr}}
@media(max-width:600px){.sd .top{padding:0 14px}.sd .brand h3{display:none}.sd .content{padding:18px 14px}.sd .details{grid-template-columns:1fr}}
`;

const NONE = [];
const DEFAULT_DEPARTMENTS = ["Computer Science", "Information Technology", "Business", "Science", "Education"];
const initials = (n = "") => n.split(" ").map((p) => p[0]).join("").slice(0, 2);
const EMPTY_FORM = { name: "", email: "", dept: "" };

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
            <tr><td colSpan={heads.length} className="muted" style={{ textAlign: "center", padding: 32 }}>No supervisors yet.</td></tr>
          ) : children}
        </tbody>
      </table>
    </div>
  );
}

export default function SupervisorDashboard({
  initialSupervisors = NONE,
  departments = DEFAULT_DEPARTMENTS,
  onAddSupervisor,
}) {
  const [supervisors, setSupervisors] = useState(initialSupervisors);
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);
  const [modal, setModal] = useState(null); // "add" | "view"
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const timer = useRef();

  useEffect(() => { setSupervisors(initialSupervisors); }, [initialSupervisors]);

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
  const match = (...vals) => vals.filter((v) => v != null).join(" ").toLowerCase().includes(query.toLowerCase());

  const totalStudents = supervisors.reduce((sum, s) => sum + (s.students || 0), 0);
  const totalActive = supervisors.reduce((sum, s) => sum + (s.active || 0), 0);
  const stats = [
    ["Supervisors", supervisors.length, "Registered supervisors", "♙"],
    ["Assigned Students", totalStudents, "Across all supervisors", "▣"],
    ["Active Placements", totalActive, "Currently supervised", "✓"],
  ];

  const openAdd = () => { setForm(EMPTY_FORM); setModal("add"); };
  const openView = (s) => { setSelected(s); setModal("view"); };

  const addSupervisor = async () => {
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !email || !form.dept) return toast("Complete all fields.");
    if (supervisors.some((s) => s.email?.toLowerCase() === email.toLowerCase())) return toast("A supervisor with that email already exists.");
    const draft = { name, email, dept: form.dept, students: 0, active: 0 };
    setSaving(true);
    try {
      const saved = await onAddSupervisor?.(draft);
      setSupervisors((list) => [...list, { id: email, ...draft, ...(saved || {}) }]);
      setModal(null);
      toast("Supervisor added successfully.");
    } catch {
      toast("Could not add supervisor. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`sd ${dark ? "dark" : ""}`}>
      <style>{css}</style>

      <header className="top">
        <div className="brand">
          <div className="logoicon">OUK</div>
          <h3>OUK Internship</h3>
        </div>
        <div className="search">
          <span aria-hidden="true">🔎</span>
          <label className="sr-only" htmlFor="sd-search">Search supervisor</label>
          <input id="sd-search" type="search" placeholder="Search name, department, email..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="actions">
          <button className="icon" type="button" aria-label="Toggle dark mode" onClick={() => setDark((d) => !d)}>◐</button>
          <div className="avatar">CO</div>
        </div>
      </header>

      <main className="content">
        <div className="header">
          <div>
            <h1>Supervisor Management</h1>
            <div className="muted">Manage supervisor assignments and workloads.</div>
          </div>
          <button className="btn" type="button" onClick={openAdd}>+ Add Supervisor</button>
        </div>

        <div className="stats">
          {stats.map(([label, val, sub, ic]) => (
            <div className="stat" key={label}>
              <div><span>{label}</span><h2>{val}</h2><small className="muted">{sub}</small></div>
              <div className="staticon">{ic}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <Table heads={["Name", "Department", "Email", "Students", "Active", "Action"]}>
            {supervisors.filter((s) => match(s.name, s.dept, s.email)).map((s) => (
              <tr key={s.id ?? s.email}>
                <td><div className="person"><div className="sa">{initials(s.name)}</div><b>{s.name}</b></div></td>
                <td>{s.dept}</td><td>{s.email}</td><td>{s.students ?? 0}</td><td>{s.active ?? 0}</td>
                <td><button className="action" type="button" onClick={() => openView(s)}>Manage</button></td>
              </tr>
            ))}
          </Table>
        </div>
      </main>

      {modal === "add" && (
        <Modal
          title="Add Supervisor"
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn secondary" type="button" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn" type="button" disabled={saving} onClick={addSupervisor}>{saving ? "Saving…" : "Save Supervisor"}</button>
            </>
          }
        >
          <div className="formgroup">
            <label htmlFor="sd-name">Full Name</label>
            <input id="sd-name" type="text" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="formgroup">
            <label htmlFor="sd-email">Email</label>
            <input id="sd-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="formgroup">
            <label htmlFor="sd-dept">Department</label>
            <select id="sd-dept" value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })}>
              <option value="">Select department</option>
              {departments.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </Modal>
      )}

      {modal === "view" && selected && (
        <Modal
          title={selected.name}
          onClose={() => setModal(null)}
          footer={<button className="btn secondary" type="button" onClick={() => setModal(null)}>Close</button>}
        >
          <div className="details">
            {[
              ["Department", selected.dept],
              ["Email", selected.email],
              ["Assigned students", selected.students ?? 0],
              ["Active placements", selected.active ?? 0],
            ].map(([l, v]) => (
              <div className="detail" key={l}><span className="detail-label">{l}</span><b>{v}</b></div>
            ))}
          </div>
        </Modal>
      )}

      <div className={`toast ${toastShow ? "show" : ""}`}>{toastMsg}</div>
    </div>
  );
}