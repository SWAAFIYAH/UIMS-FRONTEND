
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

const KENYA_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet",
  "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga",
  "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
  "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit",
  "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi City",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
  "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River",
  "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu",
  "Vihiga", "Wajir", "West Pokot",
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  county: "",
  location: "",
};

function Organisations() {
  const [organisations, setOrganisations] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const filteredOrganisations = organisations.filter((organisation) =>
    [
      organisation.name,
      organisation.email,
      organisation.phone,
      organisation.county,
      organisation.location,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openAddForm() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setShowForm(true);
  }

  function openEditForm(organisation) {
    setEditingId(organisation.id);
    setForm({
      name: organisation.name,
      email: organisation.email,
      phone: organisation.phone,
      county: organisation.county || "",
      location: organisation.location,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const organisationData = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      county: form.county,
      location: form.location.trim(),
    };

    if (editingId !== null) {
      setOrganisations((current) =>
        current.map((organisation) =>
          organisation.id === editingId
            ? { ...organisation, ...organisationData }
            : organisation
        )
      );
    } else {
      setOrganisations((current) => [
        ...current,
        {
          id: Date.now(),
          ...organisationData,
        },
      ]);
    }

    closeForm();
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

        <button
          type="button"
          className="add-student-button"
          onClick={openAddForm}
        >
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
            <article
              className="organisation-card"
              key={organisation.id}
            >
              <div className="organisation-card-heading">
                <div className="organisation-icon">
                  <Building2 size={22} />
                </div>

                <div className="organisation-actions">
                  <button
                    type="button"
                    className="edit-student-button"
                    title="Edit organisation"
                    aria-label={`Edit ${organisation.name}`}
                    onClick={() => openEditForm(organisation)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
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
                <span>{organisation.county || "County not selected"}</span>
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
              closeForm();
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
                type="button"
                className="close-student-modal"
                onClick={closeForm}
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
                County
                <select
                  required
                  value={form.county}
                  onChange={(event) =>
                    setForm({ ...form, county: event.target.value })
                  }
                >
                  <option value="">Select county</option>
                  {KENYA_COUNTIES.map((county) => (
                    <option key={county} value={county}>
                      {county}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Location
                <input
                  required
                  value={form.location}
                  onChange={(event) =>
                    setForm({ ...form, location: event.target.value })
                  }
                  placeholder="Enter town or address"
                />
              </label>

              <div className="student-form-actions">
                <button
                  type="button"
                  className="cancel-student-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="add-student-button"
                >
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
