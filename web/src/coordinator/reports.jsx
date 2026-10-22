import { useState, useMemo, useRef, useEffect } from "react";

/**
 * ReportOversight
 *
 * Props (all data comes from your database / API layer):
 *  - reports:     Array<{ id, name, type, format, generatedBy, generatedAt, status }>
 *                 type   is one of the REPORT_TYPES values below
 *                 format is "PDF" | "Excel" | "CSV"
 *                 status is "Ready" | "Processing" | "Failed"
 *  - loading:     boolean, show a loading row while data is fetched
 *  - error:       string, show an error row if the fetch failed
 *  - query:       optional external search text (e.g. from a shared top-bar search).
 *                 If omitted, the component uses its own search box.
 *  - dark:        optional boolean, initial theme (the theme button toggles it)
 *  - onThemeChange: optional (isDark: boolean) => void, so you can sync the choice with
 *                 the rest of your app or save it (e.g. localStorage)
 *  - onGenerate:  ({ type, format, from, to }) => void | Promise
 *                 Called when the coordinator submits the Generate Report form.
 *                 Throw an Error to keep the modal open and show the message.
 *  - onDownload:  (report) => void | Promise, called when "Download" is clicked
 *  - onRetry:     (report) => void | Promise, called when "Retry" is clicked on a failed report
 */

const REPORT_TYPES = [
  { value: "placements", label: "Placements Summary" },
  { value: "supervisors", label: "Supervisor Workload" },
  { value: "logbooks", label: "Logbook Compliance" },
  { value: "evaluations", label: "Evaluation Progress" },
  { value: "grades", label: "Final Grades" },
];
const FORMATS = ["PDF", "Excel", "CSV"];
const STATUSES = ["Ready", "Processing", "Failed"];

const typeLabel = (v) => REPORT_TYPES.find((t) => t.value === v)?.label ?? v;

const css = `
.rp{--p:#0b3d91;--bg:#f5f7fb;--card:#fff;--text:#172033;--muted:#6b7280;--border:#e5e7eb;--red:#dc2626;--green:#16a34a;
  font-family:Segoe UI,Arial,sans-serif;color:var(--text)}
.rp.dark{--bg:#0f172a;--card:#1e293b;--text:#e5e7eb;--muted:#94a3b8;--border:#334155}
.rp *{box-sizing:border-box}
.rp button,.rp input,.rp select{font:inherit;color:inherit}.rp button{cursor:pointer}
.rp button:disabled{opacity:.55;cursor:not-allowed}
.rp-header{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:22px;flex-wrap:wrap}
.rp-header h1{margin:0 0 5px;font-size:25px}
.rp-muted{color:var(--muted);font-size:13px}
.rp-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:17px;margin-bottom:22px}
.rp-stat,.rp-card{background:var(--card);border:1px solid var(--border);border-radius:13px;box-shadow:0 7px 22px #0f172a0b}
.rp-stat{padding:18px}.rp-stat span{color:var(--muted);font-size:13px}.rp-stat h2{margin:6px 0 0;font-size:28px}
.rp-card{margin-bottom:22px}
.rp-cardhead{padding:18px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;gap:15px;flex-wrap:wrap}
.rp-tabs{display:flex;gap:7px;overflow:auto}
.rp-tab{padding:8px 13px;border:1px solid var(--border);background:var(--card);border-radius:7px;white-space:nowrap}
.rp-tab.active{background:var(--p);color:#fff;border-color:var(--p)}
.rp-search{background:var(--bg);border:1px solid var(--border);padding:9px 13px;border-radius:9px;width:280px;max-width:100%}
.rp-search input{border:0;background:none;outline:0;width:100%}
.rp-tablewrap{overflow:auto}
.rp table{width:100%;border-collapse:collapse;min-width:800px}
.rp th{background:var(--bg);color:var(--muted);font-size:11px;text-align:left;padding:12px;text-transform:uppercase}
.rp td{padding:13px;border-top:1px solid var(--border);font-size:13px}
.rp-status{padding:5px 9px;border-radius:20px;font-size:11px;font-weight:bold;text-transform:capitalize;white-space:nowrap}
.rp-s-pending{background:#fff4db;color:#a16207}.rp-s-active{background:#e7f8ed;color:#15803d}.rp-s-rejected{background:#feecec;color:#b91c1c}
.rp-action{border:1px solid var(--border);background:var(--card);padding:7px 10px;border-radius:6px}
.rp-actions{display:flex;align-items:center;gap:10px}
.rp-icon{border:1px solid var(--border);background:var(--card);border-radius:8px;padding:9px 11px}
.rp-btn{border:0;border-radius:8px;padding:10px 15px;background:var(--p);color:#fff!important}
.rp-btn.secondary{background:var(--card);color:var(--text)!important;border:1px solid var(--border)}
.rp-state{text-align:center;padding:32px!important;color:var(--muted)}
.rp-error{color:var(--red)}
.rp-modalbg{position:fixed;inset:0;background:#0f172a99;display:flex;align-items:center;justify-content:center;padding:20px;z-index:20}
.rp-modal{background:var(--card);width:100%;max-width:650px;border-radius:14px;max-height:90vh;overflow:auto}
.rp-modalhead{padding:18px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
.rp-modalhead h3{margin:0}
.rp-modalbody{padding:20px}
.rp-modalfoot{padding:16px 20px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px}
.rp-close{border:0;background:none;font-size:22px}
.rp-row2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.rp-formgroup{margin:15px 0}.rp-formgroup label{display:block;font-weight:bold;font-size:13px;margin-bottom:6px}
.rp-formgroup input,.rp-formgroup select{width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;background:var(--card)}
.rp-toast{position:fixed;right:22px;bottom:22px;background:#172033;color:#fff;padding:13px 17px;border-radius:8px;
  opacity:0;transform:translateY(80px);transition:.25s;z-index:30;pointer-events:none}
.rp-toast.show{opacity:1;transform:none}
.rp-sr{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
@media(max-width:700px){.rp-stats{grid-template-columns:1fr}.rp-search{width:100%}.rp-row2{grid-template-columns:1fr}}
`;

const statusClass = (s) => (s === "Ready" ? "active" : s === "Failed" ? "rejected" : "pending");
const emptyForm = { type: "", format: "PDF", from: "", to: "" };

export default function ReportOversight({
  reports: suppliedReports,
  loading = false,
  error = "",
  query: externalQuery,
  dark = false,
  onThemeChange,
  onGenerate,
  onDownload,
  onRetry,
}) {
  const [localReports, setLocalReports] = useState([]);
  const [isDark, setIsDark] = useState(dark);
  const [filter, setFilter] = useState("all");
  const [ownQuery, setOwnQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const timer = useRef();

  const reports = suppliedReports ?? localReports;
  const query = (externalQuery ?? ownQuery).toLowerCase();
  const usingOwnSearch = externalQuery === undefined;

  useEffect(() => setIsDark(dark), [dark]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    onThemeChange?.(next);
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setModal(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(timer.current);
    };
  }, []);

  const toast = (msg) => {
    setToastMsg(msg);
    setToastShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastShow(false), 2800);
  };

  const counts = useMemo(() => {
    const c = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    reports.forEach((r) => { if (r.status in c) c[r.status] += 1; });
    return c;
  }, [reports]);

  const rows = useMemo(
    () =>
      reports.filter(
        (r) =>
          (filter === "all" || r.status === filter) &&
          [r.name, typeLabel(r.type), r.format, r.generatedBy, r.status]
            .filter((v) => v != null)
            .join(" ")
            .toLowerCase()
            .includes(query)
      ),
    [reports, filter, query]
  );

  const openModal = () => { setForm(emptyForm); setModal(true); };

  const generate = async () => {
    if (!form.type) return toast("Select a report type.");
    if (form.from && form.to && form.from > form.to) return toast("The start date must be before the end date.");
    setBusy(true);
    try {
      if (onGenerate) {
        await onGenerate({ ...form });
        toast("Report requested. It will appear in the list when ready.");
      } else {
        const report = {
          id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
          name: `${typeLabel(form.type)} Report`,
          type: form.type,
          format: form.format,
          generatedBy: "Local",
          generatedAt: new Date().toLocaleString(),
          status: "Ready",
          from: form.from,
          to: form.to,
        };
        setLocalReports((current) => [report, ...current]);
        toast("Report generated in this browser.");
      }
      setModal(false);
    } catch (e) {
      toast(e?.message || "Could not generate the report. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const downloadLocally = (report) => {
    const content = [
      report.name,
      `Type: ${typeLabel(report.type)}`,
      `Format selected: ${report.format}`,
      `Generated: ${report.generatedAt}`,
      `Date range: ${report.from || "All dates"} to ${report.to || "All dates"}`,
      "",
      "This report was generated locally in the browser. Connect a data source to include live internship records.",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.name.replace(/[<>:"/\\|?*]+/g, "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const retryLocally = (report) => {
    setLocalReports((current) =>
      current.map((item) => (item.id === report.id ? { ...item, status: "Ready" } : item))
    );
  };

  const run = async (handler, r, successMsg) => {
    setBusyId(r.id);
    try {
      if (handler) await handler(r);
      else if (r.status === "Ready") downloadLocally(r);
      else retryLocally(r);
      if (successMsg) toast(successMsg);
    } catch (e) {
      toast(e?.message || "Something went wrong. Try again.");
    } finally {
      setBusyId(null);
    }
  };

  const heads = ["Report", "Type", "Format", "Generated By", "Generated On", "Status", "Action"];

  let body;
  if (loading) body = <tr><td colSpan={heads.length} className="rp-state">Loading reports…</td></tr>;
  else if (error) body = <tr><td colSpan={heads.length} className="rp-state rp-error">{error}</td></tr>;
  else if (rows.length === 0)
    body = (
      <tr>
        <td colSpan={heads.length} className="rp-state">
          {reports.length === 0 ? "No reports have been generated yet." : "No reports match your search or filter."}
        </td>
      </tr>
    );
  else
    body = rows.map((r) => (
      <tr key={r.id}>
        <td><b>{r.name}</b></td>
        <td>{typeLabel(r.type)}</td>
        <td>{r.format}</td>
        <td>{r.generatedBy || "—"}</td>
        <td>{r.generatedAt || "—"}</td>
        <td><span className={`rp-status rp-s-${statusClass(r.status)}`}>{r.status}</span></td>
        <td>
          {r.status === "Ready" && (
            <button className="rp-action" type="button" disabled={busyId === r.id} onClick={() => run(onDownload, r)}>Download</button>
          )}
          {r.status === "Failed" && (
            <button className="rp-action" type="button" disabled={busyId === r.id} onClick={() => run(onRetry, r, "Retrying report generation.")}>Retry</button>
          )}
          {r.status === "Processing" && <span className="rp-muted">Please wait…</span>}
        </td>
      </tr>
    ));

  return (
    <section className={`rp ${isDark ? "dark" : ""}`}>
      <style>{css}</style>

      <div className="rp-header">
        <div>
          <h1>Reports</h1>
          <div className="rp-muted">Generate and download internship reports.</div>
        </div>
        <div className="rp-actions">
          <button
            className="rp-icon"
            type="button"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
            onClick={toggleTheme}
          >
            ◐
          </button>
          <button className="rp-btn" type="button" onClick={openModal}>+ Generate Report</button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat"><span>Total reports</span><h2>{reports.length}</h2></div>
        <div className="rp-stat"><span>Ready to download</span><h2>{counts.Ready}</h2></div>
        <div className="rp-stat"><span>Processing</span><h2>{counts.Processing}</h2></div>
      </div>

      <div className="rp-card">
        <div className="rp-cardhead">
          <div className="rp-tabs" role="tablist" aria-label="Filter by status">
            {["all", ...STATUSES].map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={filter === t}
                className={`rp-tab ${filter === t ? "active" : ""}`}
                onClick={() => setFilter(t)}
              >
                {t === "all" ? "All" : t}
              </button>
            ))}
          </div>
          {usingOwnSearch && (
            <div className="rp-search">
              <label className="rp-sr" htmlFor="rp-search">Search reports</label>
              <input id="rp-search" type="search" placeholder="Search report, type, format..." value={ownQuery} onChange={(e) => setOwnQuery(e.target.value)} />
            </div>
          )}
        </div>

        <div className="rp-tablewrap">
          <table>
            <thead><tr>{heads.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{body}</tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="rp-modalbg" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="rp-modal" role="dialog" aria-modal="true" aria-label="Generate report">
            <div className="rp-modalhead">
              <h3>Generate Report</h3>
              <button className="rp-close" type="button" aria-label="Close" onClick={() => setModal(false)}>×</button>
            </div>
            <div className="rp-modalbody">
              <div className="rp-formgroup">
                <label htmlFor="rp-type">Report Type *</label>
                <select id="rp-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="">Select report type</option>
                  {REPORT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="rp-formgroup">
                <label htmlFor="rp-format">Format</label>
                <select id="rp-format" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })}>
                  {FORMATS.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="rp-row2">
                <div className="rp-formgroup">
                  <label htmlFor="rp-from">From</label>
                  <input id="rp-from" type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
                </div>
                <div className="rp-formgroup">
                  <label htmlFor="rp-to">To</label>
                  <input id="rp-to" type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
                </div>
              </div>
              <div className="rp-muted">Leave the dates blank to include all records.</div>
            </div>
            <div className="rp-modalfoot">
              <button className="rp-btn secondary" type="button" onClick={() => setModal(false)}>Cancel</button>
              <button className="rp-btn" type="button" disabled={busy} onClick={generate}>{busy ? "Requesting…" : "Generate"}</button>
            </div>
          </div>
        </div>
      )}

      <div className={`rp-toast ${toastShow ? "show" : ""}`} role="status" aria-live="polite">{toastMsg}</div>
    </section>
  );
}