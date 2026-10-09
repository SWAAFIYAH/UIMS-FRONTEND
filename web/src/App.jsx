import Login from "./pages/login";
import Signup from "./pages/signup";
import StudentDashboard from "./pages/studentDashboard";
import SubmitPlacementForm from "./pages/submitPlacementForm";
import VerifyEmail from "./pages/verifyEmail";
import SupervisorDashboard from "../supervisor/SupervisorDashboard"; // Added supervisor import
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      {/* The main login page */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* signup page */}
      <Route path="/signup" element={<Signup />} />

      {/* The email verification page */}
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Dashboard and other pages */}
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/submit-placement" element={<SubmitPlacementForm />} />

      {/* Supervisor Dashboard route */}
      <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
      <Route path="/supervisor" element={<SupervisorDashboard />} />
    </Routes>
  );
}

export default App;