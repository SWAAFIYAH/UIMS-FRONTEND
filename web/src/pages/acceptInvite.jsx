import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import './acceptInvite.css';

export default function AcceptInvite() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [status, setStatus] = useState('loading'); // 'loading' | 'valid' | 'error' | 'success'
    const [inviteData, setInviteData] = useState({ email: '', role: '' });
    const [formData, setFormData] = useState({ name: '', password: '', confirmPassword: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Prevent double-firing in React 18 Strict Mode
    const hasChecked = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMessage('No invitation token provided in the URL.');
            return;
        }

        if (hasChecked.current) return;
        hasChecked.current = true;

        checkInviteToken(token);
    }, [token]);

    const checkInviteToken = async (inviteToken) => {
        try {
            const response = await api.get('/auth/invite/check/', {
                params: { token: inviteToken }
            });
            setInviteData({
                email: response.data.email,
                role: response.data.role
            });
            setStatus('valid');
        } catch (error) {
            setStatus('error');
            setErrorMessage(
                error.response?.data?.error || 
                error.response?.data?.detail || 
                'This invite link is invalid, expired, or has already been used.'
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/auth/invite/accept/', {
                token: token,
                name: formData.name,
                password: formData.password,
                password2: formData.confirmPassword // Matched to Django's expected confirmation field
            });

            setStatus('success');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            alert(
                error.response?.data?.error || 
                error.response?.data?.detail || 
                JSON.stringify(error.response?.data) || 
                'Failed to complete registration. Please try again.'
            );
            setSubmitting(false);
        }
    };

    return (
        <div className="accept-invite-container">
            <h2 className="accept-invite-title">UIMS Account Setup</h2>
            <p className="accept-invite-subtitle">Complete your registration to accept the invitation</p>

            {/* Loading State */}
            {status === 'loading' && (
                <div className="state-card state-card-loading">
                    <p>Verifying your invitation link...</p>
                </div>
            )}

            {/* Error State */}
            {status === 'error' && (
                <div className="state-card state-card-error">
                    <h4>Invalid Invitation</h4>
                    <p>{errorMessage}</p>
                </div>
            )}

            {/* Form State */}
            {status === 'valid' && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            type="text" 
                            value={inviteData.email} 
                            disabled 
                            className="form-input form-input-readonly" 
                        />
                    </div>

                    <div className="form-group">
                        <label>Assigned Role</label>
                        <input 
                            type="text" 
                            value={inviteData.role} 
                            disabled 
                            className="form-input form-input-readonly" 
                        />
                    </div>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="e.g. Jane Doe"
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="form-input" 
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            required 
                            placeholder="Enter new password"
                            value={formData.password} 
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="form-input" 
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input 
                            type="password" 
                            required 
                            placeholder="Confirm new password"
                            value={formData.confirmPassword} 
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            className="form-input" 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="submit-btn"
                    >
                        {submitting ? 'Creating Account...' : 'Complete Registration'}
                    </button>
                </form>
            )}

            {/* Success State */}
            {status === 'success' && (
                <div className="state-card state-card-success">
                    <h4>Account Created!</h4>
                    <p>Redirecting you to the login page...</p>
                </div>
            )}
        </div>
    );
}