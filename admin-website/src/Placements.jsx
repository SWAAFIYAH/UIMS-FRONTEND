import { useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  BriefcaseBusiness,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react";

const emptyForm = {
  studentName: "",
  registrationNumber: "",
  organisation: "",
  role: "",
  startDate: "",
  endDate: "",
  status: "Pending",
};

function Placements() {
  const [placements, setPlacements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredPlacements = placements.filter((placement) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      placement.studentName.toLowerCase().includes(search) ||
      placement.registrationNumber.toLowerCase().includes(search) ||
      placement.organisation.toLowerCase().includes(search) ||
      placement.role.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || placement.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = placements.filter(
    (placement) => placement.status === "Pending"
  ).length;

  const activeCount = placements.filter(
    (placement) => placement.status === "Active"
  ).length;

  const completedCount = placements.filter(
    (placement) => placement.status === "Completed"
  ).length;

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (placement) => {
    setEditingId(placement.id);
    setForm({
      studentName: placement.studentName,
      registrationNumber: placement.registrationNumber,
      organisation: placement.organisation,
      role: placement.role,
      startDate: placement.startDate,
      endDate: placement.endDate,
      status: placement.status,
    });
    setShowModal(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingId !== null) {
      setPlacements((previous) =>
        previous.map((placement) =>
          placement.id === editingId ? { ...placement, ...form } : placement
        )
      );
    } else {
      setPlacements((previous) => [
        ...previous,
        { id: Date.now(), ...form },
      ]);
    }

    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this placement?")) {
      setPlacements((previous) =>
        previous.filter((placement) => placement.id !== id)
      );
    }
  };

  return (
    <div className="placements-page">
      <div className="placements-heading">
        <div>
          <h2>Placements Management</h2>
          <p>Assign students to organisations and monitor their placements.</p>
        </div>

        <button className="add-placement-button" onClick={openAddModal}>
          <Plus size={18} />
          Add Placement
        </button>
      </div>

      <div className="placements-summary">
        <div className="placement-summary-card">
          <div className="placement-summary-icon total">
            <BriefcaseBusiness size={22} />
          </div>
          <div>
            <p>Total Placements</p>
            <h3>{placements.length}</h3>
          </div>
        </div>

        <div className="placement-summary-card">
          <div className="placement-summary-icon pending">
            <Clock size={22} />
          </div>
          <div>
            <p>Pending</p>
            <h3>{pendingCount}</h3>
          </div>
        </div>

        <div className="placement-summary-card">
          <div className="placement-summary-icon active">
            <Users size={22} />
          </div>
          <div>
            <p>Active</p>
            <h3>{activeCount}</h3>
          </div>
        </div>

        <div className="placement-summary-card">
          <div className="placement-summary-icon completed">
            <CheckCircle size={22} />
          </div>
          <div>
            <p>Completed</p>
            <h3>{completedCount}</h3>
          </div>
        </div>
      </div>

      <div className="placements-table-container">
        <div className="placements-toolbar">
          <div className="placements-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search student, organisation or role..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <select
            className="placement-status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter placements by status"
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="placements-table-scroll">
          <table className="placements-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Registration No.</th>
                <th>Organisation</th>
                <th>Role</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPlacements.length > 0 ? (
                filteredPlacements.map((placement) => (
                  <tr key={placement.id}>
                    <td>{placement.studentName}</td>
                    <td>{placement.registrationNumber}</td>
                    <td>{placement.organisation}</td>
                    <td>{placement.role}</td>
                    <td>{placement.startDate || "—"}</td>
                    <td>{placement.endDate || "—"}</td>
                    <td>
                      <span
                        className={`placement-status ${placement.status.toLowerCase()}`}
                      >
                        {placement.status}
                      </span>
                    </td>
                    <td>
                      <div className="placement-actions">
                        <button
                          className="placement-edit-button"
                          onClick={() => openEditModal(placement)}
                          title="Edit placement"
                          aria-label="Edit placement"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="placement-delete-button"
                          onClick={() => handleDelete(placement.id)}
                          title="Delete placement"
                          aria-label="Delete placement"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="placements-empty-state">
                      <BriefcaseBusiness size={36} />
                      <h3>No placements found</h3>
                      <p>
                        {searchTerm || statusFilter !== "All"
                          ? "Try a different search term or status."
                          : "Add a placement to get started."}
                      </p>
                      {!searchTerm && statusFilter === "All" && (
                        <button
                          className="add-placement-button"
                          onClick={openAddModal}
                        >
                          <Plus size={18} />
                          Add Placement
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="placements-table-footer">
          Showing {filteredPlacements.length} of {placements.length} placements
        </div>
      </div>

      {showModal && (
        <div
          className="placement-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="placement-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="placement-modal-header">
              <div>
                <h2>{editingId !== null ? "Edit Placement" : "Add Placement"}</h2>
                <p>Enter the student's placement details.</p>
              </div>

              <button
                className="placement-close-button"
                onClick={() => setShowModal(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="placement-form">
                <label>
                  Student Name
                  <input
                    name="studentName"
                    value={form.studentName}
                    onChange={handleChange}
                    placeholder="Enter student's full name"
                    required
                  />
                </label>

                <label>
                  Registration Number
                  <input
                    name="registrationNumber"
                    value={form.registrationNumber}
                    onChange={handleChange}
                    placeholder="e.g. UIMS/2026/001"
                    required
                  />
                </label>

                <label>
                  Organisation
                  <input
                    name="organisation"
                    value={form.organisation}
                    onChange={handleChange}
                    placeholder="Enter organisation name"
                    required
                  />
                </label>

                <label>
                  Placement Role
                  <input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="e.g. Software Developer Intern"
                    required
                  />
                </label>

                <label>
                  Start Date
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  End Date
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Placement Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </label>
              </div>

              <div className="placement-form-actions">
                <button
                  type="button"
                  className="placement-cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="add-placement-button">
                  {editingId !== null ? "Save Changes" : "Add Placement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Placements;