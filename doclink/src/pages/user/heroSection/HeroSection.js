import React from "react";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <h1 className="title1">Your Health,</h1>
        <h1 className="title2">Just a Click Away.</h1>
        <div className="button-container">
          <button
            onClick={() => {
              navigate("/appointment");
            }}
            id="button"
            style={{
              marginRight: "20px",
              marginTop: "20px",
              width: "200px",
              height: "60px",
              backgroundColor: "#F49696",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "20px",
            }}
            className="text"
          >
            Book New Appointment
          </button>
          <button
            onClick={() => {
              navigate("/upcoming-appointment");
            }}
            id="button"
            style={{
              marginRight: "20px",
              marginTop: "20px",
              width: "200px",
              height: "60px",
              backgroundColor: "#82EAAC",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "20px",
            }}
            className="text"
          >
            Upcoming Appointments
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
