import { useState } from "react";
import { Search, Plus, Pencil, Trash2, X, Users } from "lucide-react";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    registrationNumber: "",
    email: "",
    course: "",
  });

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.registrationNumber} ${student.email} ${student.course}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openAddForm() {
    setEditingId(null);
    setForm({
      name: "",
      registrationNumber: "",
      email: "",
      course: "",
    });
    setShowForm(true);
  }

  function openEditForm(student) {
    setEditingId(student.id);
    setForm({
      name: student.name,
      registrationNumber: student.registrationNumber,
      email: student.email,
      course: student.course,
    });
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (editingId !== null) {
      setStudents((current) =>
        current.map((student) =>
          student.id === editingId
            ? { ...student, ...form }
            : student
        )
      );
    } else {
      setStudents((current) => [
        ...current,
        { id: Date.now(), ...form },
      ]);
    }

    setShowForm(false);
  }

  function deleteStudent(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (confirmed) {
      setStudents((current) =>
        current.filter((student) => student.id !== id)
      );
    }
  }

  return (
    <div className="students-page">
      <div className="students-toolbar">
        <label className="students-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search students..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <button className="add-student-button" onClick={openAddForm}>
          <Plus size={18} />
          Add Student
        </button>
      </div>

      <div className="students-summary">
        <div>
          <h3>Student Records</h3>
          <p>
            {filteredStudents.length} student
            {filteredStudents.length === 1 ? "" : "s"} found
          </p>
        </div>
        <div className="students-summary-icon">
          <Users size={23} />
        </div>
      </div>

      <div className="students-table-wrapper">
        <table className="students-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Registration Number</th>
              <th>Email Address</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="students-empty">
                    <div className="students-empty-icon">
                      <Users size={26} />
                    </div>
                    <strong>
                      {search ? "No matching students" : "No students yet"}
                    </strong>
                    <p>
                      {search
                        ? "Try a different search term."
                        : "Add a student to see a record here."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="student-name-cell">{student.name}</td>
                  <td>{student.registrationNumber}</td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>
                    <div className="student-actions">
                      <button
                        className="edit-student-button"
                        title="Edit student"
                        aria-label={`Edit ${student.name}`}
                        onClick={() => openEditForm(student)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="delete-student-button"
                        title="Delete student"
                        aria-label={`Delete ${student.name}`}
                        onClick={() => deleteStudent(student.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div
          className="student-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <section
            className="student-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-form-title"
          >
            <div className="student-modal-heading">
              <div>
                <h3 id="student-form-title">
                  {editingId !== null ? "Edit Student" : "Add Student"}
                </h3>
                <p>Enter the student's details below.</p>
              </div>
              <button
                className="close-student-modal"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form className="student-form" onSubmit={handleSubmit}>
              <label>
                Full Name
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
                Registration Number
                <input
                  required
                  value={form.registrationNumber}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      registrationNumber: event.target.value,
                    })
                  }
                  placeholder="Enter registration number"
                />
              </label>

              <label>
                Email Address
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="student@example.com"
                />
              </label>

              <label>
                Course
                <input
                  required
                  value={form.course}
                  onChange={(event) =>
                    setForm({ ...form, course: event.target.value })
                  }
                  placeholder="Enter course"
                />
              </label>

              <div className="student-form-actions">
                <button
                  type="button"
                  className="cancel-student-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="add-student-button">
                  {editingId !== null ? "Save Changes" : "Add Student"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Students;