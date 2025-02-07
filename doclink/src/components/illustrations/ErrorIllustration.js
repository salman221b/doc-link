import React from "react";
import Lottie from "lottie-react";
import animationData from "../../static/Illustration404Error.json"; // Update the path

const ErrorIllustration = () => {
  return (
    <Lottie
      animationData={animationData}
      loop={true}
      style={{ height: 400, width: 400 }}
    />
  );
};

export default ErrorIllustration;
