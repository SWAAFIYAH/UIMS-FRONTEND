import { useState, useRef, Children } from "react";

const css = `
:root{--p:#0b3d91;--nav:#0b2454;--bg:#f5f7fb;--card:#fff;--text:#172033;--muted:#6b7280;--border:#e5e7eb;--green:#16a34a;--red:#dc2626;--orange:#d97706}
.ouk.dark{--bg:#0f172a;--card:#1e293b;--text:#e5e7eb;--muted:#94a3b8;--border:#334155}
.ouk *{box-sizing:border-box}.ouk{font-family:Segoe UI,Arial,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.ouk button{font:inherit;color:inherit;cursor:pointer}
.content{padding:28px}.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px}.header h1{margin:0 0 5px;font-size:25px}
.muted{color:var(--muted);font-size:13px}
.icon{border:1px solid var(--border);background:var(--card);border-radius:8px;padding:9px}
.card{background:var(--card);border:1px solid var(--border);border-radius:13px;box-shadow:0 7px 22px #0f172a0b;margin-bottom:22px}
.tablewrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:800px}
th{background:var(--bg);color:var(--muted);font-size:11px;text-align:left;padding:12px;text-transform:uppercase}td{padding:13px;border-top:1px solid var(--border);font-size:13px}
.status{padding:5px 9px;border-radius:20px;font-size:11px;font-weight:bold;text-transform:capitalize}
.s-pending{background:#fff4db;color:#a16207}.s-active{background:#e7f8ed;color:#15803d}.s-rejected{background:#feecec;color:#b91c1c}
.action{border:1px solid var(--border);background:var(--card);padding:7px 10px;border-radius:6px}
.toast{position:fixed;right:22px;bottom:22px;background:#172033;color:#fff;padding:13px 17px;border-radius:8px;opacity:0;transform:translateY(80px);transition:.25s;z-index:30}.toast.show{opacity:1;transform:none}
@media(max-width:600px){.header{flex-direction:column;align-items:flex-start;gap:12px}}
`;

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

export default function Logbooks({ initialLogbooks = [], query = "" }) {
  const [logs] = useState(initialLogbooks);
  const [dark, setDark] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const timer = useRef();

  const toast = (msg) => {
    setToastMsg(msg);
    setToastShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastShow(false), 2800);
  };
  const match = (...vals) => vals.filter((v) => v != null).join(" ").toLowerCase().includes(query.toLowerCase());
  const logClass = (s) => (s === "Approved" ? "active" : s === "Overdue" ? "rejected" : "pending");

  return (
    <div className={`ouk ${dark ? "dark" : ""}`}>
      <style>{css}</style>
      <div className="content">
        <section>
          <div className="header">
            <div><h1>Logbook Oversight</h1><div className="muted">Monitor student logbook compliance.</div></div>
            <button className="icon" type="button" aria-label="Toggle dark mode" onClick={() => setDark((d) => !d)}>◐</button>
          </div>
          <div className="card">
            <Table heads={["Student", "Week", "Submitted", "Supervisor", "Status", "Action"]}>
              {logs.filter((x) => match(x.student, x.week, x.supervisor, x.status)).map((x) => (
                <tr key={x.id}>
                  <td>{x.student}</td><td>{x.week}</td><td>{x.submitted || "—"}</td><td>{x.supervisor || "—"}</td>
                  <td><Status cls={logClass(x.status)}>{x.status}</Status></td>
                  <td>
                    {x.status === "Overdue"
                      ? <button className="action" type="button" onClick={() => toast("Reminder sent")}>Remind</button>
                      : <button className="action" type="button" onClick={() => toast("Logbook opened")}>View</button>}
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        </section>
      </div>
      <div className={`toast ${toastShow ? "show" : ""}`}>{toastMsg}</div>
    </div>
  );
}