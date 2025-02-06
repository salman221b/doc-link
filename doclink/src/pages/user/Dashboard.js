import React from "react";
import "./Dashboard.css";
import NavBar from "../../components/userNavbar/NavBar";
import Carousel from "./heroSection/Carousel";
import HeroSection from "./heroSection/HeroSection";
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

      {/* -----------------------------Heath Tips Section--------------------------------- */}
      <div>
        <TipsSection />
      </div>
      <ScrollToTop />
    </div>
  );
};

export default Dashboard;
