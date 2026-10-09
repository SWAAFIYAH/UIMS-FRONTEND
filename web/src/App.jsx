import Login from "./pages/login";
import Signup from "./pages/signup";
import StudentDashboard from "./pages/studentDashboard";
import SubmitPlacementForm from "./pages/submitPlacementForm";
import VerifyEmail from "./pages/verifyEmail";
import { Routes, Route } from 'react-router-dom';
import OukDashboard from "./coordinator/dashboard";
import PlacementDashboard from "./coordinator/placement";
import SupervisorDashboard from "./coordinator/supervisor-dash";


function App() {
  return (
    <Routes>
      {/* The main login page */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/*signup page*/}
      <Route path="/signup" element={<Signup/>}/>

      {/* The email verification page */}
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Dashboard and other pages */}
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/submit-placement" element={<SubmitPlacementForm />} />
      <Route path="/coordinator-dashboard" element={<OukDashboard />} />
      <Route path="/coordinator-placements" element={<PlacementDashboard />} />
      <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
      
    </Routes>
  );
}

export default App;



