import Login from "./pages/login";
import Signup from "./pages/signup";
import StudentDashboard from "./pages/studentDashboard";
import SubmitLogbookForm from "./pages/submitLogbookForm";
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

<<<<<<< HEAD
      {/* Supervisor Dashboard route */}
      <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
      <Route path="/supervisor" element={<SupervisorDashboard />} />
=======
      {/*logbook pages*/}
      <Route path="/submit-logbook" element={<SubmitLogbookForm/>}/>
>>>>>>> b12c1b62e5d8464bf40c25f4ab41d0846fcf4223
    </Routes>
  );
}

export default App;