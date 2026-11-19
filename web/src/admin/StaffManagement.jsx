import { useState } from "react";
import { Plus, Search, X, Mail } from "lucide-react";
import { createStaff, resendStaffInvite } from "../api/staff";

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  role: "coordinator",
};

function extractErrorMessage(err, fallback) {
  const data = err.response?.data;
  if (!data) return err.message || fallback;
  if (typeof data === "string") return data;
  if (data.detail && typeof data.detail === "string") return data.detail;
  if (data.message && typeof data.message === "string") return data.message;

  try {
    const messages = Object.values(data)
      .flat(Infinity)
      .map((val) => (typeof val === "object" ? JSON.stringify(val) : String(val)))
      .filter(Boolean);
    return messages.length > 0 ? messages.join(" ") : err.message || fallback;
  } catch {
    return err.message || fallback;
  }
}

export default function StaffManagement({ role = "All" }) {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendingId, setResendingId] = useState(null);

  const normalizedRole = (role || "").trim().toLowerCase();
  const isCombined = normalizedRole === "all" || !normalizedRole;
  const fixedRole = normalizedRole.startsWith("coord") ? "coordinator" : "supervisor";

  const pageTitle = isCombined
    ? "Staff Management"
    : `${fixedRole === "coordinator" ? "Coordinator" : "Supervisor"} Management`;

  const roleStaff = staff.filter(
    (person) => isCombined || person.role?.toLowerCase() === fixedRole
  );

  const visibleStaff = roleStaff.filter((person) => {
    const searchTarget = [person.first_name, person.last_name, person.email]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchTarget.includes(search.toLowerCase());
  });

  function openAddForm() {
    setError("");
    setSuccess("");
    setForm({
      ...emptyForm,
      role: isCombined ? "coordinator" : fixedRole,
    });
    setShowForm(true);
  }

  function closeAddForm() {
    setShowForm(false);
    setForm({
      ...emptyForm,
      role: isCombined ? "coordinator" : fixedRole,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const newStaff = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      role: isCombined ? form.role : fixedRole,
    };

    try {
      const response = await createStaff(newStaff);

      setStaff((currentStaff) => [
        ...currentStaff,
        {
          ...newStaff,
          id: response?.data?.id || response?.id || `temporary-${Date.now()}`,
        },
      ]);

      closeAddForm();
      setSuccess(
        "Staff member created successfully. An invitation email has been sent to their email address."
      );
    } catch (requestError) {
      console.error("Unable to create staff:", requestError);
      setError(
        extractErrorMessage(
          requestError,
          "Unable to create staff. Please try again."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleResendInvite(person) {
    if (!person.email) return;

    setError("");
    setSuccess("");
    setResendingId(person.id);

    try {
      await resendStaffInvite(person.email);
      setSuccess(`Invitation request submitted for ${person.email}.`);
    } catch (requestError) {
      console.error("Unable to resend invitation:", requestError);
      setError(
        extractErrorMessage(
          requestError,
          "Unable to resend invitation. Please try again."
        )
      );
    } finally {
      setResendingId(null);
    }
  }

  return (
    <div className="staff-page">
      <div className="staff-toolbar">
        <div>
          <h2>{pageTitle}</h2>
          <p>
            {isCombined
              ? "Manage coordinators and supervisors in one place."
              : `View and manage ${fixedRole}s.`}
          </p>
        </div>

        <button type="button" className="primary-button" onClick={openAddForm}>
          <Plus size={18} />
          Add{" "}
          {isCombined
            ? "Staff"
            : fixedRole === "coordinator"
              ? "Coordinator"
              : "Supervisor"}
        </button>
      </div>

      <div className="staff-summary">
        <div>
          <span>
            Total {isCombined ? "Staff" : `${fixedRole === "coordinator" ? "Coordinators" : "Supervisors"}`}
          </span>
          <strong>{roleStaff.length}</strong>
        </div>

        <div>
          <span>Showing</span>
          <strong>{visibleStaff.length}</strong>
        </div>
      </div>

      <section className="panel staff-panel">
        {error && (
          <p role="alert" className="staff-note">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="staff-note">
            {success}
          </p>
        )}

        <div className="staff-search">
          <Search size={18} />
          <input
            type="search"
            aria-label="Search staff by name or email"
            placeholder="Search staff by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {showForm && (
          <form className="staff-form" onSubmit={handleSubmit}>
            <div className="staff-form-heading">
              <h3>Add Staff</h3>
              <button
                type="button"
                className="staff-close"
                onClick={closeAddForm}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="staff-form-grid">
              <label>
                First name
                <input
                  required
                  name="first_name"
                  value={form.first_name}
                  onChange={(event) =>
                    setForm({ ...form, first_name: event.target.value })
                  }
                  placeholder="Enter first name"
                />
              </label>

              <label>
                Last name
                <input
                  required
                  name="last_name"
                  value={form.last_name}
                  onChange={(event) =>
                    setForm({ ...form, last_name: event.target.value })
                  }
                  placeholder="Enter last name"
                />
              </label>

              <label>
                Email address
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="Enter email address"
                />
              </label>

              <label>
                Role
                <select
                  name="role"
                  value={isCombined ? form.role : fixedRole}
                  disabled={!isCombined}
                  onChange={(event) =>
                    setForm({ ...form, role: event.target.value })
                  }
                >
                  <option value="coordinator">Coordinator</option>
                  <option value="supervisor">Supervisor</option>
                </select>
              </label>
            </div>

            <div className="staff-form-actions">
              <button
                type="button"
                className="staff-cancel"
                onClick={closeAddForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Submit"}
              </button>
            </div>
          </form>
        )}

        <div className="staff-table-wrap">
          <table className="staff-table">
            <thead>
              <tr>
                <th>First name</th>
                <th>Last name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleStaff.map((person) => (
                <tr key={person.id}>
                  <td>{person.first_name}</td>
                  <td>{person.last_name}</td>
                  <td>{person.email}</td>
                  <td>
                    {person.role
                      ? person.role.charAt(0).toUpperCase() + person.role.slice(1).toLowerCase()
                      : "—"}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="staff-cancel"
                      onClick={() => handleResendInvite(person)}
                      disabled={resendingId === person.id || !person.email}
                    >
                      <Mail size={15} />
                      {resendingId === person.id
                        ? "Sending..."
                        : "Resend Invitation"}
                    </button>
                  </td>
                </tr>
              ))}

              {visibleStaff.length === 0 && (
                <tr>
                  <td colSpan="5" className="staff-empty">
                    {search
                      ? "No matching staff found. Try another search."
                      : "No staff records loaded. Add a staff member or connect the backend list endpoint."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="staff-note">
          Existing staff records are not loaded from the backend yet. Newly
          created records shown here are temporary.
        </p>
      </section>
    </div>
  );
}