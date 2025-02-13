import React from "react";
import { CircularProgress } from "@mui/material";

export default function LoadingScreen() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        color: "#82EAAC", // Light Green Text
      }}
    >
      <CircularProgress
        size={80}
        thickness={1}
        sx={{
          color: "#F49696", // Light Red Spinner
        }}
      />
      <h2 style={{ marginTop: "20px", color: "#82EAAC" }}>Loading...</h2>
    </div>
  );
}
