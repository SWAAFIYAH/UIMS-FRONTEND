
import { useState } from "react";
import {
  Download,
  Users,
  Building2,
  FileText,
  BriefcaseBusiness,
} from "lucide-react";

const reportTypes = [
  { label: "Students", icon: Users },
  { label: "Organisations", icon: Building2 },
  { label: "Applications", icon: FileText },
  { label: "Placements", icon: BriefcaseBusiness },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("Students");

  function exportReport() {
    const csv = [
      ["Report", "Status", "Details"],
      [
        selectedReport,
        "Awaiting backend connection",
        "Live records will appear when the database is connected",
      ],
    ]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${selectedReport.toLowerCase()}-report.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="reports-page">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Reports & Analytics</h3>
            <p>Review university records and export reports.</p>
          </div>
        </div>

        <div className="reports-notice">
          <strong>Database connection pending</strong>
          <p>
            Live totals and records will appear when the backend is connected.
            The export currently provides a report template, not live data.
          </p>
        </div>

        <div className="reports-grid">
          {reportTypes.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              className={`report-type ${
                selectedReport === label ? "selected" : ""
              }`}
              onClick={() => setSelectedReport(label)}
            >
              <Icon size={22} />
              <span>{label} Report</span>
              <small>Select report</small>
            </button>
          ))}
        </div>

        <div className="report-preview">
          <div>
            <h3>{selectedReport} Report</h3>
            <p>
              Your {selectedReport.toLowerCase()} report is ready for
              configuration.
            </p>
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={exportReport}
          >
            <Download size={17} />
            Export CSV
          </button>
        </div>

        <div className="report-table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Data status</th>
                <th>Available records</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedReport}</td>
                <td>Awaiting backend</td>
                <td>Not available yet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
