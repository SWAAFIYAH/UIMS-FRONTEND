import { useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const initialApplications = [];

const emptyForm = {
  studentName: "",
  registrationNumber: "",
  programme: "",
  applicationDate: "",
  status: "Pending",
};

function Applications() {
  const [applications, setApplications] = useState(initialApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredApplications = applications.filter((application) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      application.studentName.toLowerCase().includes(search) ||
      application.registrationNumber.toLowerCase().includes(search) ||
      application.programme.toLowerCase().includes(search);

    const matchesStatus =
      selectedStatus === "All" || application.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (application) => {
    setEditingId(application.id);
    setForm({
      studentName: application.studentName,
      registrationNumber: application.registrationNumber,
      programme: application.programme,
      applicationDate: application.applicationDate,
      status: application.status,
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
      setApplications((previous) =>
        previous.map((application) =>
          application.id === editingId
            ? { ...application, ...form }
            : application
        )
      );
    } else {
      setApplications((previous) => [
        ...previous,
        { id: Date.now(), ...form },
      ]);
    }

    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (confirmed) {
      setApplications((previous) =>
        previous.filter((application) => application.id !== id)
      );
    }
  };

  const pendingCount = applications.filter(
    (application) => application.status === "Pending"
  ).length;

  const approvedCount = applications.filter(
    (application) => application.status === "Approved"
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "Rejected"
  ).length;

  return (
    <div className="applications-page">
      <div className="applications-heading">
        <div>
          <h2>Applications Management</h2>
          <p>Review and manage student applications.</p>
        </div>

        <button className="add-application-button" onClick={openAddModal}>
          <Plus size={18} />
          Add Application
        </button>
      </div>

      <div className="application-summary">
        <div className="application-summary-card">
          <div className="application-summary-icon total">
            <FileText size={22} />
          </div>
          <div>
            <p>Total Applications</p>
            <h3>{applications.length}</h3>
          </div>
        </div>

        <div className="application-summary-card">
          <div className="application-summary-icon pending">
            <Clock size={22} />
          </div>
          <div>
            <p>Pending</p>
            <h3>{pendingCount}</h3>
          </div>
        </div>

        <div className="application-summary-card">
          <div className="application-summary-icon approved">
            <CheckCircle size={22} />
          </div>
          <div>
            <p>Approved</p>
            <h3>{approvedCount}</h3>
          </div>
        </div>

        <div className="application-summary-card">
          <div className="application-summary-icon rejected">
            <XCircle size={22} />
          </div>
          <div>
            <p>Rejected</p>
            <h3>{rejectedCount}</h3>
          </div>
        </div>
      </div>

      <div className="applications-table-container">
        <div className="applications-toolbar">
          <div className="applications-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search student, registration number or programme..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <select
            className="application-status-filter"
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            aria-label="Filter applications by status"
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="applications-table-scroll">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Registration No.</th>
                <th>Programme</th>
                <th>Application Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.studentName}</td>
                    <td>{application.registrationNumber}</td>
                    <td>{application.programme}</td>
                    <td>{application.applicationDate || "—"}</td>
                    <td>
                      <span
                        className={`application-status ${application.status.toLowerCase()}`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td>
                      <div className="application-actions">
                        <button
                          className="application-edit-button"
                          onClick={() => openEditModal(application)}
                          aria-label="Edit application"
                          title="Edit application"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="application-delete-button"
                          onClick={() => handleDelete(application.id)}
                          aria-label="Delete application"
                          title="Delete application"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="applications-empty-state">
                      <FileText size={36} />
                      <h3>No applications found</h3>
                      <p>
                        {searchTerm || selectedStatus !== "All"
                          ? "Try changing your search or status filter."
                          : "Add an application to get started."}
                      </p>
                      {!searchTerm && selectedStatus === "All" && (
                        <button
                          className="add-application-button"
                          onClick={openAddModal}
                        >
                          <Plus size={18} />
                          Add Application
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="applications-table-footer">
          Showing {filteredApplications.length} of {applications.length}{" "}
          applications
        </div>
      </div>

      {showModal && (
        <div
          className="application-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="application-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="application-modal-header">
              <div>
                <h2>
                  {editingId !== null ? "Edit Application" : "Add Application"}
                </h2>
                <p>Enter the student's application details below.</p>
              </div>

              <button
                className="application-close-button"
                onClick={() => setShowModal(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="application-form">
                <label>
                  Student Name
                  <input
                    name="studentName"
                    type="text"
                    placeholder="Enter student's full name"
                    value={form.studentName}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Registration Number
                  <input
                    name="registrationNumber"
                    type="text"
                    placeholder="e.g. UIMS/2026/001"
                    value={form.registrationNumber}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Programme
                  <input
                    name="programme"
                    type="text"
                    placeholder="Enter programme name"
                    value={form.programme}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Application Date
                  <input
                    name="applicationDate"
                    type="date"
                    value={form.applicationDate}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Application Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </label>
              </div>

              <div className="application-form-actions">
                <button
                  type="button"
                  className="application-cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="add-application-button">
                  {editingId !== null ? "Save Changes" : "Add Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applications;