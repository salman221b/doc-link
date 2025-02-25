import React from "react";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <h1 className="title1">Your Practice,</h1>
        <h1 className="title2">Simplified.</h1>
        <p className="text">
          Manage your appointments, patients, and medical records with ease.
        </p>
        <div className="button-container">
          <button
            onClick={() => navigate("/manage-appointments")}
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
            View Appointments{" "}
          </button>
          <button
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
            Check Reports{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
