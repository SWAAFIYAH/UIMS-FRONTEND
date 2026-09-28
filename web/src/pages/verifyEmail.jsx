import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/client'; // Or wherever your configured api client is located
import './verifyEmail.css';
import logo from '../assets/logo.png';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('Verifying your email address, please wait...');
    
    // Prevent double-firing in React 18 Strict Mode
    const hasVerified = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing verification link. Please request a new verification email.');
            return;
        }

        if (hasVerified.current) return;
        hasVerified.current = true;

        verifyEmailToken(token);
    }, [token]);

    const verifyEmailToken = async (verificationToken) => {
        try {
            // Using your central api client instance
            const response = await api.post('/auth/verify-email/', {
                token: verificationToken,
            });

            setStatus('success');
            setMessage(response.data.message || 'Email verified successfully! You can now log in to your account.');
        } catch (error) {
            setStatus('error');
            setMessage(
                error.response?.data?.error || 
                error.response?.data?.detail || 
                'Verification failed. The link may have expired or already been used.'
            );
        }
    };

    return (
        <div className="verify-container">
            <div className="verify-card">
                <div className="verify-brand-header">
                    <img src={logo} alt="UIMS Logo" className="verify-logo" />
                    <h2>University Information Management System</h2>
                </div>

                <div className="verify-content-box">
                    <h3>Email Verification</h3>

                    {status === 'loading' && (
                        <div className="verify-loader-wrapper">
                            <div className="spinner"></div>
                            <p className="verify-text">{message}</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="verify-status-box success">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            <p>{message}</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="verify-status-box error">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                            <p>{message}</p>
                        </div>
                    )}

                    {status !== 'loading' && (
                        <button className="verify-action-btn" onClick={() => navigate('/login')}>
                            Proceed to Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}