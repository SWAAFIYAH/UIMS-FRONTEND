import React, { useState } from "react";
import { toast } from "react-toastify";
import client from "../api/client";

export default function SubmitLogbookForm({ placementId, onSuccess, onCancel }) {
    const [weekNumber, setWeekNumber] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!weekNumber || !content) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            await client.post('/logbooks/', {
                placement: placementId,
                week_number: Number(weekNumber),
                content: content.trim()
            });
            toast.success("Logbook entry submitted successfully!");
            onSuccess();
        } catch (error) {
            console.error("Error submitting logbook:", error);
            toast.error(error.response?.data?.detail || "Failed to submit logbook entry.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="submit-logbook-page">
            <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Submit Weekly Logbook</h2>
                <button type="button" className="cancel-btn" onClick={onCancel} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
            </div>
            <form onSubmit={handleSubmit} className="submit-logbook-form">
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Week Number</label>
                    <input 
                        type="number" 
                        value={weekNumber} 
                        onChange={(e) => setWeekNumber(e.target.value)} 
                        placeholder="e.g. 1, 2, 3..." 
                        required 
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Activities & Content</label>
                    <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        placeholder="Describe tasks undertaken, skills acquired, etc..." 
                        rows="5"
                        required 
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>
                <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="submit-placement-btn" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Logbook"}
                    </button>
                    <button type="button" className="cancel-btn" onClick={onCancel} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ccc', background: '#f5f5f5', cursor: 'pointer' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}