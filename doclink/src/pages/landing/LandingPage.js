import React, { useRef } from "react";
import logo from "../../static/DocLink_Logo_Bg.png";
import "./LandingPage.css";
import LandingPageIllustration from "../../components/illustrations/LandingPageIllustration";
import Services from "./Services";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import CustomizedSwitches from "../../components/theme/Theme";
const LandingPage = () => {
  const navigate = useNavigate();
  const servicesRef = useRef(null);
  const scrollToServices = () => {
    servicesRef.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <div style={{ marginBottom: "20px" }} className="landing-container">
        <div className="hero">
          <img src={logo} width={100} height={100} alt="Logo" />
          <div style={{ float: "right", right: 0 }}>
            <CustomizedSwitches />
          </div>
          <h1 className="title1">Your Health,</h1>
          <h1 className="title2">Just a Click Away.</h1>
          <h5
            className="text"
            style={{ fontWeight: "1px", fontStyle: "italic" }}
          >
            Seamless Healthcare, Anytime, Anywhere!
          </h5>
          <div className="button-container">
            <button
              onClick={() => {
                navigate("/register");
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
              onClick={scrollToServices}
              //   navigate("/upcoming-appointment");

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
          <LandingPageIllustration />
        </div>
      </div>
      <div ref={servicesRef}>
        <Services />
        <Features />
        <HowItWorks />
      </div>
      <ScrollToTop />
    </>
  );
};

export default LandingPage;
