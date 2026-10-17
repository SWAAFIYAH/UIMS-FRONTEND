
import Login from "./pages/login";
import Signup from "./pages/signup";
import StudentDashboard from "./pages/studentDashboard";
import SubmitLogbookForm from "./pages/submitLogbookForm";
import SubmitPlacementForm from "./pages/submitPlacementForm";
import VerifyEmail from "./pages/verifyEmail";
import AdminApp from "./admin/AdminApp";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      
<Route path="/submit-placement" element={<SubmitPlacementForm />} />
      <Route path="/submit-logbook" element={<SubmitLogbookForm />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/admin-dashboard" element={<AdminApp />} />
    </Routes>
  );
}

export default App;
