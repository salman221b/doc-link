import React, { useRef } from "react";
import "./LandingPage.css";
import LandingPageIllustration from "../../components/illustrations/LandingPageIllustration";
import Services from "./Services";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import CustomizedSwitches from "../../components/theme/Theme";
import Hero from "./Hero";
const LandingPage = () => {
  const navigate = useNavigate();
  const servicesRef = useRef(null);
  const scrollToServices = () => {
    servicesRef.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <div
        style={{
          marginBottom: "20px",
        }}
        className="landing-container"
      >
        <div className="hero">
          <Hero scrollToServices={scrollToServices} />
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
