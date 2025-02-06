import React from "react";
const HeroSection = () => {
  return (
    <div>
      <div>
        <h1
          style={{
            color: "#030E82",
            fontWeight: "bold",
            fontSize: "60px",
          }}
        >
          Your Practice,
        </h1>
        <h1
          style={{
            color: "#030E82",
            fontStyle: "italic",
            fontSize: "60px",
            marginTop: "10px",
          }}
        >
          Simplified.
        </h1>
        <p
          style={{
            color: "#030E82",
            marginTop: "10px",
          }}
        >
          Manage your appointments, patients, and medical records with ease.
        </p>
        <div className="button-container">
          <button
            id="button"
            style={{
              marginRight: "20px",
              marginTop: "20px",
              width: "200px",
              height: "60px",
              backgroundColor: "#F49696",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              color: "#030E82",
              fontWeight: "bold",
              fontSize: "20px",
            }}
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
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              color: "#030E82",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            Check Reports{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
