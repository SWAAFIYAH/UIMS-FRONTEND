
import { useState } from "react";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
  status: "Active",
};

export default function StaffManagement({ role = "Coordinators" }) {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });

  const singular =
    role === "Coordinators" ? "Coordinator" : "Supervisor";

  const filteredStaff = staff.filter((person) =>
    `${person.name} ${person.email} ${person.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openAddForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  }

  function openEditForm(person) {
    setEditingId(person.id);
    setForm({
      name: person.name,
      email: person.email,
      phone: person.phone,
      department: person.department,
      status: person.status,
    });
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (editingId !== null) {
      setStaff((current) =>
        current.map((person) =>
          person.id === editingId ? { ...person, ...form } : person
        )
      );
    } else {
      setStaff((current) => [
        ...current,
        { ...form, id: Date.now() },
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  function deleteStaff(id) {
    if (window.confirm(`Delete this ${singular.toLowerCase()}?`)) {
      setStaff((current) =>
        current.filter((person) => person.id !== id)
      );
    }
  }

  return (
    <div className="staff-page">
      <div className="staff-toolbar">
        <div>
          <h2>{singular} Management</h2>
          <p>
            View and manage {role.toLowerCase()} records.
          </p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          <Plus size={18} />
          Add {singular}
        </button>
      </div>

      <div className="staff-summary">
        <div>
          <span>Total {role}</span>
          <strong>{staff.length}</strong>
        </div>

        <div>
          <span>Active {role}</span>
          <strong>
            {staff.filter((person) => person.status === "Active").length}
          </strong>
        </div>
      </div>

      <section className="panel staff-panel">
        <div className="staff-search">
          <Search size={18} />
          <input
            type="search"
            placeholder={`Search ${role.toLowerCase()}...`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {showForm && (
          <form className="staff-form" onSubmit={handleSubmit}>
            <div className="staff-form-heading">
              <h3>
                {editingId !== null
                  ? `Edit ${singular}`
                  : `Add ${singular}`}
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
                Full name
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Enter full name"
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
                Phone number
                <input
                  required
                  value={form.phone}
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </label>

              <label>
                Department / Specialisation
                <input
                  required
                  value={form.department}
                  onChange={(event) =>
                    setForm({ ...form, department: event.target.value })
                  }
                  placeholder="Enter department"
                />
              </label>

              <label>
                Status
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value })
                  }
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
            </div>

            <div className="staff-form-actions">
              <button
                type="button"
                className="staff-cancel"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button type="submit" className="primary-button">
                {editingId !== null ? "Save Changes" : `Add ${singular}`}
              </button>
            </div>
          </form>
        )}

        <div className="staff-table-wrap">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStaff.map((person) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.email}</td>
                  <td>{person.phone}</td>
                  <td>{person.department}</td>
                  <td>
                    <span
                      className={`staff-status ${person.status.toLowerCase()}`}
                    >
                      {person.status}
                    </span>
                  </td>
                  <td>
                    <div className="staff-actions">
                      <button
                        type="button"
                        title="Edit"
                        aria-label={`Edit ${person.name}`}
                        onClick={() => openEditForm(person)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        title="Delete"
                        aria-label={`Delete ${person.name}`}
                        onClick={() => deleteStaff(person.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan="6" className="staff-empty">
                    {search
                      ? `No matching ${role.toLowerCase()} found.`
                      : `No ${role.toLowerCase()} registered yet.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="staff-note">
          Staff records are not connected to the backend yet.
          Entries added here are temporary and will be lost on refresh.
        </p>
      </section>
    </div>
  );
}
