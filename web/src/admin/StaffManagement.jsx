
import { useState } from "react";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  role: "coordinator",
};

export default function StaffManagement({ role = "All" }) {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });

  const isCombined = role === "All";
  const fixedRole =
    role === "Coordinators" ? "coordinator" : "supervisor";

  const pageTitle = isCombined
    ? "Staff Management"
    : `${fixedRole === "coordinator" ? "Coordinator" : "Supervisor"} Management`;

  const visibleStaff = staff.filter((person) => {
    const matchesRole =
      isCombined || person.role === fixedRole;

    const fullName =
      `${person.first_name} ${person.last_name} ${person.email}`;

    return (
      matchesRole &&
      fullName.toLowerCase().includes(search.toLowerCase())
    );
  });

  function openAddForm() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      role: isCombined ? "coordinator" : fixedRole,
    });
    setShowForm(true);
  }

  function openEditForm(person) {
    setEditingId(person.id);
    setForm({
      first_name: person.first_name,
      last_name: person.last_name,
      email: person.email,
      role: person.role,
    });
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newStaff = {
      ...form,
      role: isCombined ? form.role : fixedRole,
    };

    if (editingId !== null) {
      setStaff((current) =>
        current.map((person) =>
          person.id === editingId
            ? { ...person, ...newStaff }
            : person
        )
      );
    } else {
      setStaff((current) => [
        ...current,
        { ...newStaff, id: Date.now() },
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  function deleteStaff(id) {
    if (window.confirm("Delete this staff member?")) {
      setStaff((current) =>
        current.filter((person) => person.id !== id)
      );
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

        <button
          type="button"
          className="primary-button"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add {isCombined ? "Staff" : fixedRole === "coordinator" ? "Coordinator" : "Supervisor"}
        </button>
      </div>

      <div className="staff-summary">
        <div>
          <span>Total {isCombined ? "Staff" : pageTitle.replace(" Management", "s")}</span>
          <strong>{visibleStaff.length}</strong>
        </div>
        <div>
          <span>Showing</span>
          <strong>{visibleStaff.length}</strong>
        </div>
      </div>

      <section className="panel staff-panel">
        <div className="staff-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search staff by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {showForm && (
          <form className="staff-form" onSubmit={handleSubmit}>
            <div className="staff-form-heading">
              <h3>
                {editingId !== null ? "Edit Staff" : "Add Staff"}
              </h3>
              <button
                type="button"
                className="staff-close"
                onClick={() => setShowForm(false)}
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
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm({ ...emptyForm });
                }}
              >
                Cancel
              </button>

              <button type="submit" className="primary-button">
                {editingId !== null ? "Save Changes" : "Submit"}
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
                    {person.role === "coordinator"
                      ? "Coordinator"
                      : "Supervisor"}
                  </td>
                  <td>
                    <div className="staff-actions">
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => openEditForm(person)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => deleteStaff(person.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visibleStaff.length === 0 && (
                <tr>
                  <td colSpan="5" className="staff-empty">
                    {search
                      ? "No matching staff found. Try another search."
                      : "No staff records yet. Click Add Staff to begin."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="staff-note">
          Preview mode: records are temporary and disappear when
          you refresh. Backend integration is not connected yet.
        </p>
      </section>
    </div>
  );
}
