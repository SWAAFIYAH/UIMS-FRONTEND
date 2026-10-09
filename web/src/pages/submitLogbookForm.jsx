import React, {useState} from "react";
import client from "../api/client";
import './submitLogbookForm.css'
import {toast} from "react-toastify";

export default function SubmitLogbookForm(onSuccess, onCancel){
    const [formData, setFormData] = useState({
        week_number: "",
        content: ""
    });


    const [loading, setLoading]= useState(false);
    const [error, setError]=useState(null);

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setLoading(true);

        try{

            // Converts week_number to an integer before sending
            const payload = {
                ...formData,
                week_number: parseInt(formData.week_number, 10),
                content: formData.content,
                placement: placementId // Default placement as required by backend schema

            };
            const response = await client.post("/logbooks/", payload);
            toast.success("Logbook entry submitted successfully!");
            onSuccess();
        }catch(err){

        }finally{
            setLoading(false);
        }
    }

    return(
       <div className="modal-backdrop">
            <div className="modal-card">
                <h3>Submit Weekly Logbook</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Week Number</label>
                        <input 
                            type="number" 
                            min="1"
                            placeholder="e.g. 1, 2, 3..."
                            value={formData.week_number}
                            onChange={(e) => setFormData({...formData, week_number: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Activities / Content</label>
                        <textarea 
                            rows="4"
                            placeholder="Describe what you worked on this week..."
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            required
                        ></textarea>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Entry"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}