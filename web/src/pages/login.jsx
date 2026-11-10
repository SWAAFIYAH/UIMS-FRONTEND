import { useState } from "react";
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
            toast.success('Successfully logged in!');

           if (response && response.user) {
                localStorage.setItem('userName', response.user.name)
                if (response.user.role === "student") {
                    navigate("/student-dashboard");
                } 
                else if (response.user.role === "supervisor") {
                    navigate("/supervisor-dashboard");
                }
                else if (response.user.role === "coordinator") {
                    navigate("/coordinator-dashboard");
                }

                else if (response.user.role === "admin") {
                    navigate("/admin-dashboard");
                } else{
                    toast.error("invalid role");
                }
            } else {
                setError("Login succeeded, but the server did not return a user profile.");
                toast.error("Login succeeded, but no user profile was returned.");
            }

        } catch (err) {
            console.error("LOGIN ERROR:", err);
            const message = err.response?.data?.detail
                || (err.isAxiosError && !err.response
                    ? "Could not connect to the backend. Check your connection and try again."
                    : err.message || "Invalid email or password");
            toast.error(message);
            setError(message);
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

                {error && <div role="alert" className="error-banner">{error}</div>}

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