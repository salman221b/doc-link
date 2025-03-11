import React from "react";
import animationData from "../static/Under prgressing.json";
import Lottie from "lottie-react";
const Settings = () => {
  return (
    <>
      <h1 style={{ height: "18%" }}>Settings</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70%",
          flexDirection: "column",
        }}
      >
        <Lottie
          animationData={animationData}
          style={{ width: 300, height: 300 }}
          loop={true} // Animation loops forever
        />
        <br />
        <p>This page is under progress</p>
      </div>
    </>
  );
};

export default Settings;
