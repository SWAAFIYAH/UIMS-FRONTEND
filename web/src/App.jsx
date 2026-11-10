import AcceptInvite from "./pages/acceptInvite";
import Login from "./pages/login";
import Signup from "./pages/signup";
import StudentDashboard from "./pages/studentDashboard";
import SubmitLogbookForm from "./pages/submitLogbookForm";
import SubmitPlacementForm from "./pages/submitPlacementForm";
import VerifyEmail from "./pages/verifyEmail";
import { Routes, Route } from 'react-router-dom';
import OukDashboard from "./coordinator/dashboard";
import { AssignedStudentsDashboard } from "./coordinator/supervisor-dash";


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
      <Route path="/invite/accept" element={<AcceptInvite/>}/>

      {/* Dashboard and other pages */}
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/submit-placement" element={<SubmitPlacementForm />} />
      <Route path="/coordinator-dashboard" element={<OukDashboard />} />
      <Route path="/coordinator-placements" element={<OukDashboard initialPage="placements" />} />
      <Route path="/coordinator-logbooks" element={<OukDashboard initialPage="logbooks" />} />
      <Route path="/supervisor-dashboard" element={<AssignedStudentsDashboard />} />
      <Route path="/coordinator-grades" element={<OukDashboard initialPage="grades" />} />
      <Route path="/coordinator-reports" element={<OukDashboard initialPage="reports" />} />
      <Route path="/admin-dashboard" element={<OukDashboard initialPage="reports" />} />

      {/* Logbook pages */}
      <Route path="/submit-logbook" element={<SubmitLogbookForm />} />
    </Routes>
  );
}

export default App;
