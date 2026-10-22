import { useState, useEffect, useRef, Children } from "react";

const css = `
:root{--p:#0b3d91;--nav:#0b2454;--bg:#f5f7fb;--card:#fff;--text:#172033;--muted:#6b7280;--border:#e5e7eb;--green:#16a34a;--red:#dc2626;--orange:#d97706}
.ouk.dark{--bg:#0f172a;--card:#1e293b;--text:#e5e7eb;--muted:#94a3b8;--border:#334155}
.ouk *{box-sizing:border-box}.ouk{font-family:Segoe UI,Arial,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.ouk button,.ouk input{font:inherit;color:inherit}.ouk button{cursor:pointer}
.content{padding:28px}.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px}.header h1{margin:0 0 5px;font-size:25px}
.muted{color:var(--muted);font-size:13px}
.icon{border:1px solid var(--border);background:var(--card);border-radius:8px;padding:9px}
.btn{border:0;border-radius:8px;padding:10px 15px;background:var(--p);color:#fff!important}.btn.secondary{background:var(--card);color:var(--text)!important;border:1px solid var(--border)}
.card{background:var(--card);border:1px solid var(--border);border-radius:13px;box-shadow:0 7px 22px #0f172a0b;margin-bottom:22px}
.tablewrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:800px}
th{background:var(--bg);color:var(--muted);font-size:11px;text-align:left;padding:12px;text-transform:uppercase}td{padding:13px;border-top:1px solid var(--border);font-size:13px}
.status{padding:5px 9px;border-radius:20px;font-size:11px;font-weight:bold;text-transform:capitalize}
.s-pending{background:#fff4db;color:#a16207}.s-completed{background:#e8f1ff;color:#1d4ed8}
.action{border:1px solid var(--border);background:var(--card);padding:7px 10px;border-radius:6px}
.modalbg{position:fixed;inset:0;background:#0f172a99;display:flex;align-items:center;justify-content:center;padding:20px;z-index:20}
.modal{background:var(--card);width:100%;max-width:650px;border-radius:14px;max-height:90vh;overflow:auto}
.modalhead{padding:18px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between}.modalhead h3{margin:0}
.modalbody{padding:20px}.modalfoot{padding:16px 20px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px}
.close{border:0;background:none;font-size:22px}
.formgroup{margin:15px 0}.formgroup label{display:block;font-weight:bold;font-size:13px;margin-bottom:6px}
.formgroup input{width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;background:var(--card)}
.toast{position:fixed;right:22px;bottom:22px;background:#172033;color:#fff;padding:13px 17px;border-radius:8px;opacity:0;transform:translateY(80px);transition:.25s;z-index:30}.toast.show{opacity:1;transform:none}
@media(max-width:600px){.header{flex-direction:column;align-items:flex-start;gap:12px}}
`;

const MAX = { logbook: 30, evaluation: 40, report: 30 };
const GRADE_FIELDS = [["logbook", "Logbook"], ["evaluation", "Supervisor Evaluation"], ["report", "Final Report"]];
const gradeInfo = (g) => {
  const complete = GRADE_FIELDS.every(([k]) => g[k] !== null);
  const total = GRADE_FIELDS.reduce((sum, [k]) => sum + (g[k] ?? 0), 0);
  const letter = !complete ? "—" : total >= 70 ? "A" : total >= 60 ? "B" : total >= 50 ? "C" : total >= 40 ? "D" : "E";
  return { complete, total, letter };
};

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

export default function Grades({ initialGrades = [], query = "" }) {
  const [grades, setGrades] = useState(initialGrades);
  const [dark, setDark] = useState(false);
  const [modal, setModal] = useState(null);
  const [gradeTarget, setGradeTarget] = useState(null);
  const [gradeForm, setGradeForm] = useState({ logbook: "", evaluation: "", report: "" });
  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);
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
  const match = (...vals) => vals.filter((v) => v != null).join(" ").toLowerCase().includes(query.toLowerCase());

  const openGrade = (g) => {
    setGradeTarget(g);
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
    setGrades((gs) => gs.map((g) => (g.id === gradeTarget.id ? { ...g, ...next } : g)));
    setModal(null);
    toast(`Grades saved for ${gradeTarget.student}.`);
  };

  return (
    <div className={`ouk ${dark ? "dark" : ""}`}>
      <style>{css}</style>
      <div className="content">
        <section>
          <div className="header">
            <div><h1>Intern Grades</h1><div className="muted">Record and review final internship grades. Total is out of 100.</div></div>
            <button className="icon" type="button" aria-label="Toggle dark mode" onClick={() => setDark((d) => !d)}>◐</button>
          </div>
          <div className="card">
            <Table heads={["Student", "Company", "Supervisor", "Logbook /30", "Evaluation /40", "Report /30", "Total", "Grade", "Action"]}>
              {grades.filter((g) => match(g.student, g.company, g.supervisor)).map((g) => {
                const { complete, total, letter } = gradeInfo(g);
                return (
                  <tr key={g.id}>
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
      </div>

      {modal === "grade" && (
        <Modal
          title={`Grade ${gradeTarget.student}`}
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