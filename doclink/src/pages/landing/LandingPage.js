import React from "react";
import logo from "../../static/DocLink_Logo_Bg.png";
import image from "../../static/LandingPic.png";
import "./LandingPage.css";
const LandingPage = () => {
  return (
    <div style={{ marginBottom: "20px" }} className="landing-container">
      <div className="hero">
        <img src={logo} width={100} height={100} alt="Logo" />
        <h1 className="title1">Your Health,</h1>
        <h1 className="title2">Just a Click Away.</h1>
        <h5
          style={{ fontWeight: "1px", fontStyle: "italic", color: "#030E82" }}
        >
          Seamless Healthcare, Anytime, Anywhere!
        </h5>
        <div className="button-container">
          <button
            onClick={() => {
              //   navigate("/appointment");
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
              color: "#030E82",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              //   navigate("/upcoming-appointment");
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
              color: "#030E82",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            Explore Services
          </button>
        </div>
      </div>

      <div className="picture">
        <img src={image} height={400} width={400} />
      </div>
    </div>
  );
};

export default LandingPage;
