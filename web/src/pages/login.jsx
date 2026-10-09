import { useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import './login.css';
import { Link, useNavigate } from 'react-router-dom'; 
import { login } from '../api/auth';
import logo from '../assets/logo.png';

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        if(!email || !password){
            toast.error("Please enter both email and password");
            setLoading(false);
            return;
        }

        try {
            const response = await login(email, password);
            console.log("FULL LOGIN RESPONSE:", response); // <--- Look at this in your F12 Console!
            
            toast.success('Successfully logged in!');

           if (response && response.user) {
                console.log("USER ROLE:", response.user.role);
                localStorage.setItem('userName', response.user.name)
                if (response.user.role === "student") {
                    navigate("/student-dashboard");
                } else {
                    toast.error("Access restricted to students.");
                }
            } else {
                console.log("Could not find user object in response structure.");
            }

        } catch (err) {
            console.error("LOGIN ERROR:", err);
            toast.error("Invalid email or password");
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    }
    
    return(
        <div className="loginpage">
            <div className="logincontainer">
                <div className="logocontainer">
                    <img src={logo} alt="logo"/>
                </div>

                <div className="heading">
                    <h2>University Internship Management System</h2>
                </div>
                
                <div className="logintextdiv">
                    <p className="login-tittle">LOGIN</p>
                </div>

                {/* Wrapped inside a form element */}
                <form onSubmit={handleLoginSubmit} className="loginform">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'LOGGING IN...' : 'LOGIN'}
                    </button>
                </form>

                <div className="signup-redirect">
                    <p>Don't have a student account yet? <Link to="/signup">Signup</Link></p>
                </div>
            </div>
        </div>
    );
}