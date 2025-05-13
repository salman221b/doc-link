import React, { useEffect } from "react";
import NavBar from "../../components/doctorNavbar/NavBar";
import HeroSection from "./heroSection/HeroSection";
import Carousel from "./heroSection/Carousel";
import TipsSection from "./tipsSection.js/TipsSection";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";
import DoctorIncomingCallPopup from "../../components/doctorPopup/DoctorPopup";
import { jwtDecode } from "jwt-decode";
import socket from "../../components/socket/socket";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;

  const doctorId = decoded?.id; // Extract user ID
  console.log(doctorId);
  useEffect(() => {
    if (doctorId) {
      socket.emit("register", { userId: doctorId });
    }
  }, [doctorId]);
  return (
    <div>
      <NavBar />
      <DoctorIncomingCallPopup doctorId={doctorId} />
      <div className="dashboard-container">
        <div className="hero">
          <HeroSection />
        </div>
        <div className="carousel">
          <Carousel />
        </div>
      </div>

      {/* -----------------------------Heath Tips Section--------------------------------- */}
      <div>
        <TipsSection />
      </div>
      <ScrollToTop />
    </div>
  );
};

export default Dashboard;
