import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';
import { registerStudent } from '../api/auth';
import './signup.css';

export default function Signup() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        student_id: '',
        password: '',
        password2: '',
    });
    
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (formData.password !== formData.password2) {
            const matchError = 'Passwords do not match.';
            setError(matchError);
            toast.error(matchError);
            return;
        }

        setLoading(true);

        try {
            const response = await registerStudent(formData);

            // Define success message properly here
            const successMsg = response.message || 
                'Registration successful! Please check your email inbox to verify your account before logging in.';

            // 1. Toast the success message
            toast.success(successMsg, { duration: 4000 });

            // 2. Set UI success state banner
            setSuccessMessage(successMsg);
            
            // 3. Clear form fields
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                student_id: '',
                password: '',
                password2: '',
            });

            // 4. Automatically navigate to login page after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
            
        } catch (err) {
            console.error("Registration error caught:", err);
            const errorData = err.response?.data;
            if (errorData) {
                const errorMessages = Object.entries(errorData).map(([field, messages]) => {
                    const msg = Array.isArray(messages) ? messages[0] : messages;
                    return `${msg}`;
                });
                const firstError = errorMessages[0] || 'Registration failed. Please check your inputs.';
                setError(firstError);
                toast.error(firstError);
            } else {
                const fallbackError = 'Registration failed. Please try again.';
                setError(fallbackError);
                toast.error(fallbackError);
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