import { useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  GraduationCap,
  Award,
  BookOpen,
} from "lucide-react";

const emptyForm = {
  studentName: "",
  registrationNumber: "",
  course: "",
  marks: "",
};

function calculateGrade(marks) {
  const score = Number(marks);

  if (marks === "" || !Number.isFinite(score) || score < 0 || score > 100) {
    return "—";
  }

  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 40) return "D";
  return "E";
}

function Grades() {
  const [grades, setGrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredGrades = grades.filter((record) => {
    const search = searchTerm.toLowerCase();

    return (
      record.studentName.toLowerCase().includes(search) ||
      record.registrationNumber.toLowerCase().includes(search) ||
      record.course.toLowerCase().includes(search)
    );
  });

  const averageMarks = grades.length
    ? (
        grades.reduce((total, record) => total + Number(record.marks), 0) /
        grades.length
      ).toFixed(1)
    : "—";

  const passedCount = grades.filter(
    (record) => Number(record.marks) >= 40
  ).length;

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (record) => {
    setEditingId(record.id);
    setForm({
      studentName: record.studentName,
      registrationNumber: record.registrationNumber,
      course: record.course,
      marks: String(record.marks),
    });
    setShowModal(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const marks = Number(form.marks);

    if (form.marks === "" || marks < 0 || marks > 100) {
      window.alert("Please enter marks between 0 and 100.");
      return;
    }

    const record = {
      ...form,
      marks,
      id: editingId ?? Date.now(),
    };

    if (editingId !== null) {
      setGrades((previous) =>
        previous.map((item) => (item.id === editingId ? record : item))
      );
    } else {
      setGrades((previous) => [...previous, record]);
    }

    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this grade record?")) {
      setGrades((previous) => previous.filter((record) => record.id !== id));
    }
  };

  return (
    <div className="grades-page">
      <div className="grades-heading">
        <div>
          <h2>Grades Management</h2>
          <p>Record, review and manage student academic results.</p>
        </div>

        <button className="add-grade-button" onClick={openAddModal}>
          <Plus size={18} />
          Add Grade
        </button>
      </div>

      <div className="grades-summary">
        <div className="grade-summary-card">
          <div className="grade-summary-icon total">
            <GraduationCap size={23} />
          </div>
          <div>
            <p>Total Records</p>
            <h3>{grades.length}</h3>
          </div>
        </div>

        <div className="grade-summary-card">
          <div className="grade-summary-icon average">
            <BookOpen size={23} />
          </div>
          <div>
            <p>Average Marks</p>
            <h3>{averageMarks}{averageMarks !== "—" ? "%" : ""}</h3>
          </div>
        </div>

        <div className="grade-summary-card">
          <div className="grade-summary-icon passed">
            <Award size={23} />
          </div>
          <div>
            <p>Passing Records</p>
            <h3>{passedCount}</h3>
          </div>
        </div>
      </div>

      <div className="grades-table-container">
        <div className="grades-toolbar">
          <div className="grades-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search student, registration number or course..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        <div className="grades-table-scroll">
          <table className="grades-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Registration No.</th>
                <th>Course / Unit</th>
                <th>Marks (%)</th>
                <th>Grade</th>
                <th>Result</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredGrades.length > 0 ? (
                filteredGrades.map((record) => (
                  <tr key={record.id}>
                    <td>{record.studentName}</td>
                    <td>{record.registrationNumber}</td>
                    <td>{record.course}</td>
                    <td>{record.marks}%</td>
                    <td>
                      <span className="grade-letter">
                        {calculateGrade(record.marks)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`grade-result ${
                          Number(record.marks) >= 40 ? "pass" : "fail"
                        }`}
                      >
                        {Number(record.marks) >= 40 ? "Pass" : "Fail"}
                      </span>
                    </td>
                    <td>
                      <div className="grade-actions">
                        <button
                          className="grade-edit-button"
                          onClick={() => openEditModal(record)}
                          title="Edit grade"
                          aria-label="Edit grade"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="grade-delete-button"
                          onClick={() => handleDelete(record.id)}
                          title="Delete grade"
                          aria-label="Delete grade"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="grades-empty-state">
                      <GraduationCap size={38} />
                      <h3>No grade records found</h3>
                      <p>
                        {searchTerm
                          ? "Try another search term."
                          : "Add a grade record to get started."}
                      </p>
                      {!searchTerm && (
                        <button
                          className="add-grade-button"
                          onClick={openAddModal}
                        >
                          <Plus size={18} />
                          Add Grade
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="grades-table-footer">
          Showing {filteredGrades.length} of {grades.length} records
        </div>
      </div>

      {showModal && (
        <div
          className="grade-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="grade-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grade-modal-header">
              <div>
                <h2>{editingId !== null ? "Edit Grade" : "Add Grade"}</h2>
                <p>Enter the student's academic results.</p>
              </div>

              <button
                type="button"
                className="grade-close-button"
                onClick={() => setShowModal(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grade-form">
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
                  Course / Unit
                  <input
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    placeholder="Enter course or unit name"
                    required
                  />
                </label>

                <label>
                  Marks (0–100)
                  <input
                    type="number"
                    name="marks"
                    min="0"
                    max="100"
                    step="0.1"
                    value={form.marks}
                    onChange={handleChange}
                    placeholder="Enter marks"
                    required
                  />
                </label>

                <div className="grade-preview">
                  <span>Calculated Grade</span>
                  <strong>{calculateGrade(form.marks)}</strong>
                  <span>
                    {form.marks !== "" &&
                    Number(form.marks) >= 0 &&
                    Number(form.marks) <= 100
                      ? Number(form.marks) >= 40
                        ? "Pass"
                        : "Fail"
                      : "Enter valid marks"}
                  </span>
                </div>
              </div>

              <div className="grade-form-actions">
                <button
                  type="button"
                  className="grade-cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="add-grade-button">
                  {editingId !== null ? "Save Changes" : "Add Grade"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Grades;