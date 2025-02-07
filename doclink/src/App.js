import React from "react";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/login/Login";
import Footer from "./components/footer/Footer";
import Registration from "./pages/registration/Registration";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
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
import Prescriptions from "./pages/user/prescriptions/Prescriptions";
import LandingPage from "./pages/landing/LandingPage";

const App = () => {
  return (
    <>
      <div className="container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/verify_email" element={<VerifyEmail />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          {/* Protected Routes */}
          {/* <Route element={<PrivateRoute allowedRoles={["doctor"]} />}>
            <Route path="/dashboard_doctor" element={<DoctorDashboard />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["patient"]} />}>
            <Route path="/dashboard_user" element={<PatientDashboard />} />
          </Route> */}

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route
            path="/upcoming-appointment"
            element={<UpcomingAppointment />}
          />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/unauthorized" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
