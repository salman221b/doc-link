import React, { useEffect, useRef, useState } from "react";
import NavBar from "../../components/doctorNavbar/NavBar";
import HeroSection from "./heroSection/HeroSection";
import Carousel from "./heroSection/Carousel";
import TipsSection from "./tipsSection.js/TipsSection";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";
import { jwtDecode } from "jwt-decode";
import { initializeDoctorSocket } from "../../utils/doctorSocket"; // Your global socket handler
import CallPopup from "../../components/callPopup/CallPopup"; // Make sure this is created

const Dashboard = () => {
  const [callRequest, setCallRequest] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const doctorId = decoded?.id;
    if (!doctorId) return;

    // Initialize socket and register doctor
    socketRef.current = initializeDoctorSocket(doctorId, (data) => {
      setCallRequest(data);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleAccept = () => {
    socketRef.current.emit("call-accept", {
      patientId: callRequest.fromUserId,
      appointmentId: callRequest.appointmentId,
    });
    setCallRequest(null);
    window.location.href = `/video-room/${callRequest.appointmentId}`;
  };

  const handleDecline = () => {
    socketRef.current.emit("call-decline", {
      patientId: callRequest.fromUserId,
      reason: "Doctor declined the call",
    });
    setCallRequest(null);
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

      <div>
        <TipsSection />
      </div>

      <ScrollToTop />

      {callRequest && (
        <CallPopup
          patientName={callRequest.patientName}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
    </div>
  );
};

export default Dashboard;
