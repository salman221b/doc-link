import React, { useEffect, useRef, useState } from "react";
import NavBar from "../../components/doctorNavbar/NavBar";
import HeroSection from "./heroSection/HeroSection";
import Carousel from "./heroSection/Carousel";
import TipsSection from "./tipsSection.js/TipsSection";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;

  const doctorId = decoded?.id; // Extract user ID
  console.log(doctorId);
  const [callRequest, setCallRequest] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("https://doc-link-backend.onrender.com");

    // Listen for call requests
    socketRef.current.on("call-request", ({ fromUserId, appointmentId }) => {
      // Fetch appointment details if needed
      setCallRequest({
        appointmentId,
        patientId: fromUserId,
        patientName: "Patient Name", // You might want to fetch this
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  const handleCallResponse = (response) => {
    socketRef.current.emit("call-response", {
      appointmentId: callRequest.appointmentId,
      response,
      toUserId: callRequest.patientId,
    });

    if (response === "accept") {
      setActiveCall(callRequest);
    }
    setCallRequest(null);
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };
  return (
    <div>
      <NavBar />
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
