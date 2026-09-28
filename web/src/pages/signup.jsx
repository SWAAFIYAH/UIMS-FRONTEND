import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client'; // Your centralized Axios client
import './signup.css'; // Optional: style file mirroring your verification design
import logo from '../assets/logo.png';

export default function Signup() {
    const [formData, setFormData]= useState({
        first_name:'',
        last_name:'',
        email:'',
        student_id:'',
        password:'',
        password2:'',

    })
    
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleChange =(e)=>{
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (formData.password !== formData.password2) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            // Adjust the endpoint path to match your Django registration route (e.g., /api/auth/register/)
            const response = await api.post('/auth/register/', formData
                
            );

            setSuccessMessage(
                response.data.message || 
                'Registration successful! Please check your email inbox to verify your account before logging in.'
            );
            
            // Optional: clear form fields
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                student_id: '',
                password: '',
                password2: '',
            });
            
        } catch (err) {
            // Pull backend validation error fields gracefully
            const errorData = err.response?.data;
            if (errorData) {
                const firstKey = Object.keys(errorData)[0];
                const firstErrorMsg = Array.isArray(errorData[firstKey]) ? errorData[firstKey][0] : errorData[firstKey];
                setError(typeof firstErrorMsg === 'string' ? `${firstKey}: ${firstErrorMsg}` : 'Registration failed. Please check your inputs.');
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verify-container">
            <div className="verify-card">
                <div className="heading">
                    <img src={logo} alt="UIMS Logo" className="verify-logo" />
                    <h2>University Information Management System</h2>
                </div>

                <div className="verify-content-box">
                    <h3>Student Signup</h3>

                    {error && (
                        <div className="verify-status-box error">
                            <p>{error}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="verify-status-box success">
                            <p>{successMessage}</p>
                        </div>
                    )}

                    {!successMessage ? (
                        <form onSubmit={handleSignup} className="signup-form">
                            <div className="form-group">
                                <label>First Name</label>
                                <input 
                                    type="text" 
                                    name="first_name"
                                    value={formData.first_name} 
                                    onChange={handleChange} 
                                    required
                                    placeholder="Enter your first name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Last Name</label>
                                <input 
                                    type="text" 
                                    name="last_name"
                                    value={formData.last_name} 
                                    onChange={handleChange} 
                                    required
                                    placeholder="Enter your last name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required
                                    placeholder="Enter your university email"
                                />
                            </div>

                            <div className="form-group">
                                <label>Student ID</label>
                                <input 
                                    type="text" 
                                    name="student_id"
                                    value={formData.student_id} 
                                    onChange={handleChange} 
                                    required
                                    placeholder="Enter your student ID"
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    required
                                    placeholder="Create a password"
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input 
                                    type="password" 
                                    name="password2"
                                    value={formData.password2} 
                                    onChange={handleChange} 
                                    required
                                    placeholder="Confirm your password"
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="verify-action-btn" 
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </form>
                    ) : (
                        <button 
                            className="verify-action-btn" 
                            onClick={() => navigate('/login')}
                        >
                            Proceed to Login
                        </button>
                    )}

                    <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                        Already have an account? <Link to="/login" style={{ color: '#0f25a2', fontWeight: '600' }}>Log in here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}