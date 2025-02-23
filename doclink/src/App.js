import React, { useEffect, useState } from "react";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/login/Login";
import Footer from "./components/footer/Footer";
import Registration from "./pages/registration/Registration";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import VerifyEmail from "./pages/verifyEmail/VerifyEmail";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import PatientDashboard from "./pages/user/Dashboard";
import DoctorDashboard from "./pages/doctor/Dashboard";
import ResetPassword from "./pages/forgotPassword/ResetPassword";
// import Navbar from "./components/navbar/NavBar";
import NotFoundPage from "./pages/notFound/NotFound";
import PrivateRoute from "./components/PrivateRoutes";
import Dashboard from "./pages/dashboard/Dashboard";
import Appointment from "./pages/user/newAppointment/Appointment";
import UpcomingAppointment from "./pages/user/upcomingAppointment/UpcomingAppointment";
import MedicalRecords from "./pages/user/medicalRecords/MedicalRecords";
import MedicalRecordsDoctor from "./pages/doctor/medical-records/MedicalRecords";

import Prescriptions from "./pages/user/prescriptions/Prescriptions";
import LandingPage from "./pages/landing/LandingPage";
import ManageAppointments from "./pages/doctor/manage-appointments/ManageAppointments";
import PatientsList from "./pages/doctor/patients-list/PatientsList";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch token from local storage
    const token = localStorage.getItem("token");
    if (token) {
      setUser(true); // Assume user is logged in if token exists
    }
  }, []);
  return (
    <>
      <div className="container">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/verify_email" element={<VerifyEmail />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route
            path="/upcoming-appointment"
            element={<UpcomingAppointment />}
          />
          <Route path="/patients-list" element={<PatientsList />} />
          <Route path="/medical-records-patient" element={<MedicalRecords />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/manage-appointments" element={<ManageAppointments />} />
          <Route
            path="medical-records-doctor"
            element={<MedicalRecordsDoctor />}
          />
          <Route path="/unauthorized" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
};

export default App;
