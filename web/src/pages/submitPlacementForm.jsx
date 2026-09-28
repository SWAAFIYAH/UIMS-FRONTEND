import React from "react";
import client from "../api/client";
import { toast } from "react-toastify";
import './submitPlacements.css';

export default function SubmitPlacementForm({ onSuccess, onCancel }) {
    const [formData, setFormData] = React.useState({
        company_name: "",
        company_location: "",
        role_description: "",
        company_supervisor_name: "",
        company_supervisor_contact: "",
        internship_start: "",
        internship_end: "",
        offer_letter: null
    });

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, offer_letter: e.target.files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!formData.company_name || !formData.company_location || !formData.role_description || !formData.internship_start || !formData.internship_end || !formData.company_supervisor_name || !formData.company_supervisor_contact) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        try {
            await client.post("internships/placements/", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            
            toast.success("Placement form submitted successfully!");
            localStorage.setItem("placementStatus", "pending");
            
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error("Submission failed:", err.response?.data || err.message);
            setError("Failed to submit placement. Please check your fields and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="placement-container">
            <div className="placement-card">
                <div className="form-header">
                    <h2 className="form-title">Submit Internship Placement</h2>
                    <p className="form-subtitle">Provide your official placement details for coordinator review.</p>
                </div>

                {error && (
                    <div className="error-banner" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="placement-form">
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Company Name</label>
                            <input 
                                type="text" 
                                name="company_name" 
                                value={formData.company_name} 
                                onChange={handleInputChange} 
                                required 
                                className="form-input"
                                placeholder="e.g., Nexora Tech"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Company Location</label>
                            <input 
                                type="text" 
                                name="company_location" 
                                value={formData.company_location} 
                                onChange={handleInputChange} 
                                required 
                                className="form-input"
                                placeholder="e.g., Nairobi, Kenya"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Role Description</label>
                        <input 
                            type="text" 
                            name="role_description" 
                            value={formData.role_description} 
                            onChange={handleInputChange} 
                            required 
                            className="form-input"
                            placeholder="e.g., Software Engineering Intern"
                        />
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Supervisor Name</label>
                            <input 
                                type="text" 
                                name="company_supervisor_name" 
                                value={formData.company_supervisor_name} 
                                onChange={handleInputChange} 
                                required 
                                className="form-input"
                                placeholder="e.g., John Doe"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Supervisor Contact</label>
                            <input 
                                type="text" 
                                name="company_supervisor_contact" 
                                value={formData.company_supervisor_contact} 
                                onChange={handleInputChange} 
                                required 
                                className="form-input"
                                placeholder="Email or phone"
                            />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Internship Start Date</label>
                            <input 
                                type="date" 
                                name="internship_start" 
                                value={formData.internship_start} 
                                onChange={handleInputChange} 
                                required 
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Internship End Date</label>
                            <input 
                                type="date" 
                                name="internship_end" 
                                value={formData.internship_end} 
                                onChange={handleInputChange} 
                                required 
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Offer Letter (PDF / Image)</label>
                        <input 
                            type="file" 
                            name="offer_letter" 
                            accept=".pdf,.png,.jpg,.jpeg" 
                            onChange={handleFileChange} 
                            className="form-file-input"
                        />
                    </div>

                    <div className="form-actions">
                        {onCancel && (
                            <button 
                                type="button" 
                                onClick={onCancel}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        )}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? "Submitting..." : "Submit Placement"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}