import React from "react";
import NavBar from "../../components/doctorNavbar/NavBar";
import HeroSection from "./heroSection/HeroSection";
import Carousel from "./heroSection/Carousel";
import TipsSection from "./tipsSection.js/TipsSection";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";

const Dashboard = () => {
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
    </div>
  );
};

export default Dashboard;
