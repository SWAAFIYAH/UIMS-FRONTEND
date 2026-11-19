
import { useEffect, useState } from "react";
import { Search, GraduationCap } from "lucide-react";
import { getSupervisors } from "../api/staff";

export default function Supervisors() {
  const [supervisors, setSupervisors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSupervisors() {
      try {
        setLoading(true);
        setError("");

        const data = await getSupervisors();
        setSupervisors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Unable to load supervisors:", err);
        setError(
          err.response?.data?.detail ||
          "Unable to load supervisors. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSupervisors();
  }, []);

  const filteredSupervisors = supervisors.filter((person) => {
    const searchTarget = [
      person.full_name,
      person.email,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchTarget.includes(search.toLowerCase());
  });

  return (
    <div className="staff-page">
      <div className="staff-toolbar">
        <div>
          <h2>Supervisors</h2>
          <p>View registered supervisors and their assigned students.</p>
        </div>
      </div>

      <div className="staff-summary">
        <div>
          <span>Total Supervisors</span>
          <strong>{supervisors.length}</strong>
        </div>

        <div>
          <span>Showing</span>
          <strong>{filteredSupervisors.length}</strong>
        </div>
      </div>

      <section className="panel staff-panel">
        {error && (
          <p role="alert" className="staff-note">
            {error}
          </p>
        )}

        <div className="staff-search">
          <Search size={18} />
          <input
            type="search"
            aria-label="Search supervisors"
            placeholder="Search by supervisor name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="staff-table-wrap">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Supervisor</th>
                <th>Email Address</th>
                <th>Students Assigned</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="staff-empty">
                    Loading supervisors...
                  </td>
                </tr>
              ) : filteredSupervisors.length > 0 ? (
                filteredSupervisors.map((person) => (
                  <tr key={person.id}>
                    <td>
                      <GraduationCap size={16} />
                      {" "}
                      {person.full_name || "—"}
                    </td>

                    <td>{person.email || "—"}</td>

                    <td>{person.student_count ?? 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="staff-empty">
                    {search
                      ? "No matching supervisors found."
                      : "No supervisors found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
