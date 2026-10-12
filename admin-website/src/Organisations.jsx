import { useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

function Organisations() {
  const [organisations, setOrganisations] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  const filteredOrganisations = organisations.filter((organisation) =>
    `${organisation.name} ${organisation.email} ${organisation.phone} ${organisation.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openAddForm() {
    setEditingId(null);
    setForm({ name: "", email: "", phone: "", location: "" });
    setShowForm(true);
  }

  function openEditForm(organisation) {
    setEditingId(organisation.id);
    setForm({
      name: organisation.name,
      email: organisation.email,
      phone: organisation.phone,
      location: organisation.location,
    });
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (editingId !== null) {
      setOrganisations((current) =>
        current.map((organisation) =>
          organisation.id === editingId
            ? { ...organisation, ...form }
            : organisation
        )
      );
    } else {
      setOrganisations((current) => [
        ...current,
        { id: Date.now(), ...form },
      ]);
    }

    setShowForm(false);
  }

  function deleteOrganisation(id) {
    if (window.confirm("Delete this organisation?")) {
      setOrganisations((current) =>
        current.filter((organisation) => organisation.id !== id)
      );
    }
  }

  return (
    <div className="organisations-page">
      <div className="organisations-toolbar">
        <label className="organisations-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search organisations..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <button className="add-student-button" onClick={openAddForm}>
          <Plus size={18} />
          Add Organisation
        </button>
      </div>

      <section className="organisations-summary">
        <div>
          <h3>Organisation Records</h3>
          <p>
            {filteredOrganisations.length} organisation
            {filteredOrganisations.length === 1 ? "" : "s"} found
          </p>
        </div>
        <div className="organisations-summary-icon">
          <Building2 size={23} />
        </div>
      </section>

      <section className="organisations-grid">
        {filteredOrganisations.length === 0 ? (
          <div className="organisations-empty">
            <div className="organisations-empty-icon">
              <Building2 size={28} />
            </div>
            <h3>
              {search ? "No matching organisations" : "No organisations yet"}
            </h3>
            <p>
              {search
                ? "Try a different search term."
                : "Add an organisation to begin managing placement partners."}
            </p>
          </div>
        ) : (
          filteredOrganisations.map((organisation) => (
            <article className="organisation-card" key={organisation.id}>
              <div className="organisation-card-heading">
                <div className="organisation-icon">
                  <Building2 size={22} />
                </div>
                <div className="organisation-actions">
                  <button
                    className="edit-student-button"
                    title="Edit organisation"
                    aria-label={`Edit ${organisation.name}`}
                    onClick={() => openEditForm(organisation)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="delete-student-button"
                    title="Delete organisation"
                    aria-label={`Delete ${organisation.name}`}
                    onClick={() => deleteOrganisation(organisation.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3>{organisation.name}</h3>

              <div className="organisation-detail">
                <Mail size={15} />
                <span>{organisation.email}</span>
              </div>
              <div className="organisation-detail">
                <Phone size={15} />
                <span>{organisation.phone}</span>
              </div>
              <div className="organisation-detail">
                <MapPin size={15} />
                <span>{organisation.location}</span>
              </div>
            </article>
          ))
        )}
      </section>

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
            aria-labelledby="organisation-form-title"
          >
            <div className="student-modal-heading">
              <div>
                <h3 id="organisation-form-title">
                  {editingId !== null
                    ? "Edit Organisation"
                    : "Add Organisation"}
                </h3>
                <p>Enter the organisation's contact details.</p>
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
                Organisation Name
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Enter organisation name"
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
                  placeholder="contact@example.com"
                />
              </label>

              <label>
                Phone Number
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </label>

              <label>
                Location
                <input
                  required
                  value={form.location}
                  onChange={(event) =>
                    setForm({ ...form, location: event.target.value })
                  }
                  placeholder="Enter location"
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
                  {editingId !== null ? "Save Changes" : "Add Organisation"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Organisations;