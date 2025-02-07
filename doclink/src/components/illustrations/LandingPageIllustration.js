import React from "react";
import Lottie from "lottie-react";
import animationData from "../../static/LandingPage.json"; // Update the path

const LandingPageIllustration = () => {
  return (
    <Lottie
      animationData={animationData}
      loop={true}
      style={{ height: 400, width: 400 }}
    />
  );
};

export default LandingPageIllustration;
