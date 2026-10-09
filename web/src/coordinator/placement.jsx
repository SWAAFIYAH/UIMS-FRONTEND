import { useState, useEffect, useRef, Children } from "react";

const css = `
.pd{--p:#0b3d91;--bg:#f5f7fb;--card:#fff;--text:#172033;--muted:#6b7280;--border:#e5e7eb;--green:#16a34a;--red:#dc2626;--orange:#d97706}
.pd.dark{--bg:#0f172a;--card:#1e293b;--text:#e5e7eb;--muted:#94a3b8;--border:#334155}
.pd *{box-sizing:border-box}.pd{font-family:Segoe UI,Arial,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.pd button,.pd input,.pd select,.pd textarea{font:inherit;color:inherit}.pd button{cursor:pointer}
.pd .top{height:70px;background:var(--card);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:16px;padding:0 28px;position:sticky;top:0;z-index:5}
.pd .brand{display:flex;gap:10px;align-items:center}.pd .logoicon{width:42px;height:42px;background:var(--p);color:#fff;border-radius:10px;display:grid;place-items:center;font-weight:bold}
.pd .brand h3{margin:0;font-size:16px}
.pd .search{background:var(--bg);border:1px solid var(--border);padding:10px 13px;border-radius:9px;width:320px;max-width:100%}.pd .search input{border:0;background:none;outline:0;width:88%}
.pd .actions{display:flex;align-items:center;gap:12px}.pd .icon{border:1px solid var(--border);background:var(--card);border-radius:8px;padding:9px}
.pd .avatar{width:38px;height:38px;border-radius:50%;background:var(--p);color:#fff;display:grid;place-items:center;font-weight:bold}
.pd .content{padding:28px;max-width:1280px;margin:0 auto}.pd .header{margin-bottom:22px}.pd .header h1{margin:0 0 5px;font-size:25px}
.pd .muted{color:var(--muted);font-size:13px}
.pd .btn{border:0;border-radius:8px;padding:10px 15px;background:var(--p);color:#fff!important}.pd .btn.secondary{background:var(--card);color:var(--text)!important;border:1px solid var(--border)}.pd .btn.success{background:var(--green)}.pd .btn.danger{background:var(--red)}
.pd .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:17px;margin-bottom:22px}
.pd .stat,.pd .card{background:var(--card);border:1px solid var(--border);border-radius:13px;box-shadow:0 7px 22px #0f172a0b}
.pd .stat{padding:18px;display:flex;justify-content:space-between}.pd .stat span{color:var(--muted);font-size:13px}.pd .stat h2{margin:6px 0;font-size:28px}
.pd .staticon{width:48px;height:48px;border-radius:11px;background:#fff4df;color:var(--orange);display:grid;place-items:center}
.pd .card{margin-bottom:22px}.pd .cardhead{padding:18px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;gap:15px;flex-wrap:wrap}.pd .cardhead h3{margin:0 0 4px;font-size:17px}
.pd .tablewrap{overflow:auto}.pd table{width:100%;border-collapse:collapse;min-width:800px}
.pd th{background:var(--bg);color:var(--muted);font-size:11px;text-align:left;padding:12px;text-transform:uppercase}.pd td{padding:13px;border-top:1px solid var(--border);font-size:13px}
.pd .student{display:flex;gap:9px;align-items:center}.pd .sa{width:35px;height:35px;border-radius:50%;background:#e8eefb;color:var(--p);display:grid;place-items:center;font-weight:bold}
.pd .status{padding:5px 9px;border-radius:20px;font-size:11px;font-weight:bold;text-transform:capitalize}
.pd .s-pending{background:#fff4db;color:#a16207}.pd .s-active{background:#e7f8ed;color:#15803d}.pd .s-rejected{background:#feecec;color:#b91c1c}.pd .s-completed{background:#e8f1ff;color:#1d4ed8}
.pd .action{border:1px solid var(--border);background:var(--card);padding:7px 10px;border-radius:6px}
.pd .tabs{display:flex;gap:7px;overflow:auto}.pd .tab{padding:8px 13px;border:1px solid var(--border);background:var(--card);border-radius:7px;white-space:nowrap}.pd .tab.active{background:var(--p);color:#fff}
.pd .modalbg{position:fixed;inset:0;background:#0f172a99;display:flex;align-items:center;justify-content:center;padding:20px;z-index:20}
.pd .modal{background:var(--card);width:100%;max-width:650px;border-radius:14px;max-height:90vh;overflow:auto}
.pd .modalhead{padding:18px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between}.pd .modalhead h3{margin:0}
.pd .modalbody{padding:20px}.pd .modalfoot{padding:16px 20px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px}
.pd .close{border:0;background:none;font-size:22px}.pd .details{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.pd .detail{background:var(--bg);padding:12px;border-radius:8px}.pd .detail-label{display:block;color:var(--muted);font-size:11px;margin-bottom:4px}
.pd .formgroup{margin:15px 0}.pd .formgroup label{display:block;font-weight:bold;font-size:13px;margin-bottom:6px}
.pd .formgroup select,.pd .formgroup textarea{width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;background:var(--card)}.pd .formgroup textarea{min-height:100px}
.pd .btn:disabled{opacity:.6;cursor:not-allowed}
.pd .toast{position:fixed;right:22px;bottom:22px;background:#172033;color:#fff;padding:13px 17px;border-radius:8px;opacity:0;transform:translateY(80px);transition:.25s;z-index:30}.pd .toast.show{opacity:1;transform:none}
.pd .sr-only{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
@media(max-width:1050px){.pd .stats{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.pd .stats{grid-template-columns:1fr}.pd .top{padding:0 14px}.pd .brand h3{display:none}.pd .content{padding:18px 14px}.pd .details{grid-template-columns:1fr}}
`;

const NONE = [];
const TABS = ["all", "pending", "active", "rejected", "completed"];
const initials = (n = "") => n.split(" ").map((p) => p[0]).join("").slice(0, 2);

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

export default function PlacementDashboard({ initialPlacements = NONE, supervisors = NONE, onApprove, onReject }) {
  const [placements, setPlacements] = useState(initialPlacements);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);
  const [modal, setModal] = useState(null); // "placement" | "reject"
  const [currentId, setCurrentId] = useState(null);
  const [assignSup, setAssignSup] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const timer = useRef();

  useEffect(() => { setPlacements(initialPlacements); }, [initialPlacements]);

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

  const pendingList = placements.filter((x) => x.status === "pending");
  const stats = [
    ["Pending Approvals", pendingList.length, "Requires your attention", "⏳"],
    ["Active Placements", placements.filter((x) => x.status === "active").length, "Currently on internship", "▣"],
    ["Rejected This Month", placements.filter((x) => x.status === "rejected").length, "This month", "!"],
    ["No Supervisor", placements.filter((x) => !x.supervisor && ["pending", "active"].includes(x.status)).length, "Students need assignment", "♙"],
  ];
  const current = placements.find((x) => x.id === currentId);

  const openPlacement = (p) => { setCurrentId(p.id); setAssignSup(p.supervisor || ""); setModal("placement"); };
  const approve = async () => {
    const supervisor = assignSup || current.supervisor || "";
    setSaving(true);
    try {
      const saved = await onApprove?.(current, supervisor);
      setPlacements((ps) => ps.map((p) => (p.id === currentId ? { ...p, status: "active", supervisor, ...(saved || {}) } : p)));
      setModal(null);
      toast(`${current.student} approved successfully.`);
    } catch {
      toast("Could not approve placement. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  const openReject = () => { setReason(""); setModal("reject"); };
  const reject = async () => {
    if (!reason.trim()) return toast("Rejection reason is required.");
    setSaving(true);
    try {
      const saved = await onReject?.(current, reason.trim());
      setPlacements((ps) => ps.map((p) => (p.id === currentId ? { ...p, status: "rejected", reason: reason.trim(), ...(saved || {}) } : p)));
      setModal(null);
      toast(`${current.student} rejected. Reason recorded.`);
    } catch {
      toast("Could not reject placement. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`pd ${dark ? "dark" : ""}`}>
      <style>{css}</style>

      <header className="top">
        <div className="brand">
          <div className="logoicon">OUK</div>
          <h3>OUK Internship</h3>
        </div>
        <div className="search">
          <span aria-hidden="true">🔎</span>
          <label className="sr-only" htmlFor="pd-search">Search student or company</label>
          <input id="pd-search" type="search" placeholder="Search student, company..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="actions">
          <button className="icon" type="button" aria-label="View notifications" onClick={() => toast(pendingList.length ? `You have ${pendingList.length} pending approval(s).` : "No new notifications.")}>🔔</button>
          <button className="icon" type="button" aria-label="Toggle dark mode" onClick={() => setDark((d) => !d)}>◐</button>
          <div className="avatar">CO</div>
        </div>
      </header>

      <main className="content">
        <div className="header">
          <h1>Placement Dashboard</h1>
          <div className="muted">Review, approve and monitor student internship placements.</div>
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
          <div className="cardhead">
            <div><h3>Placement Approval Queue</h3><div className="muted">Review and approve pending student placements.</div></div>
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

        <div className="card">
          <div className="cardhead">
            <div><h3>All Placements</h3><div className="muted">Manage and monitor all internship placements.</div></div>
            <div className="tabs">
              {TABS.map((t) => (
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
      </main>

      {modal === "placement" && current && (
        <Modal
          title="Placement Details"
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn secondary" type="button" disabled={saving} onClick={openReject}>Reject</button>
              <button className="btn success" type="button" disabled={saving} onClick={approve}>{saving ? "Saving…" : "✓ Approve Placement"}</button>
            </>
          }
        >
          <div className="details">
            {[["Student", current.student], ["Company", current.company], ["Role", current.role], ["Dates", current.dates]].map(([l, v]) => (
              <div className="detail" key={l}><span className="detail-label">{l}</span><b>{v}</b></div>
            ))}
          </div>
          <div className="formgroup">
            <label htmlFor="pd-sup">Assign Supervisor</label>
            <select id="pd-sup" value={assignSup} onChange={(e) => setAssignSup(e.target.value)}>
              <option value="">Assign later</option>
              {supervisors.map((s) => <option key={s.id ?? s.email ?? s.name} value={s.name}>{s.name}</option>)}
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
              <button className="btn danger" type="button" disabled={saving} onClick={reject}>{saving ? "Saving…" : "Reject Placement"}</button>
            </>
          }
        >
          <div className="formgroup">
            <label htmlFor="pd-reason">Reason *</label>
            <textarea id="pd-reason" placeholder="Enter the reason for rejection..." value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
        </Modal>
      )}

      <div className={`toast ${toastShow ? "show" : ""}`}>{toastMsg}</div>
    </div>
  );
}