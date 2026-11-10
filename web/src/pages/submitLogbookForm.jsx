import { useEffect, useState } from "react";
import client from "../api/client";
import "./submitLogbookForm.css";
import { toast } from "react-toastify";

export default function SubmitLogbookForm({ placementId: suppliedPlacementId, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({ week_number: "", content: "" });
    const [placementId, setPlacementId] = useState(suppliedPlacementId || null);
    const [loadingPlacement, setLoadingPlacement] = useState(!suppliedPlacementId);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (suppliedPlacementId) {
            return undefined;
        }

        const controller = new AbortController();
        const loadPlacement = async () => {
            try {
                const { data } = await client.get("/internships/placements/mine/", {
                    signal: controller.signal,
                });
                if (data?.status === "none" || !data?.id) {
                    setError("Submit a placement and wait for approval before submitting a logbook.");
                    return;
                }
                setPlacementId(data.id);
            } catch (requestError) {
                if (controller.signal.aborted) return;
                console.error("Could not load placement for logbook:", requestError);
                setError(requestError.response?.data?.detail || "Could not load your placement. Please try again.");
            } finally {
                if (!controller.signal.aborted) setLoadingPlacement(false);
            }
        };

        loadPlacement();
        return () => controller.abort();
    }, [suppliedPlacementId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const selectedPlacementId = suppliedPlacementId || placementId;
        if (!selectedPlacementId) {
            setError("An approved placement is required to submit a logbook entry.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            await client.post("/logbooks/", {
                placement: selectedPlacementId,
                week_number: Number(formData.week_number),
                content: formData.content.trim(),
            });
            toast.success("Logbook entry submitted successfully!");
            onSuccess?.();
        } catch (requestError) {
            console.error("Logbook submission failed:", requestError);
            const message = requestError.response?.data?.detail || "Could not submit the logbook. Check your information and try again.";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="logbook-form-title">
                <h3 id="logbook-form-title">Submit Weekly Logbook</h3>
                {error && <div role="alert" className="error-banner">{error}</div>}
                {loadingPlacement ? (
                    <p role="status">Loading your placement…</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="logbook-week">Week Number</label>
                            <input
                                id="logbook-week"
                                type="number"
                                min="1"
                                placeholder="e.g. 1, 2, 3..."
                                value={formData.week_number}
                                onChange={(event) => setFormData({ ...formData, week_number: event.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="logbook-content">Activities / Content</label>
                            <textarea
                                id="logbook-content"
                                rows="4"
                                placeholder="Describe what you worked on this week..."
                                value={formData.content}
                                onChange={(event) => setFormData({ ...formData, content: event.target.value })}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
                            <button type="submit" className="btn-primary" disabled={loading || !(suppliedPlacementId || placementId)}>
                                {loading ? "Submitting..." : "Submit Entry"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
