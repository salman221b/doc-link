import React from "react";
import { Fab } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

export default function UploadButton() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000, // Ensures it stays on top
      }}
    >
      <Fab color="primary" component="label" aria-label="upload">
        <CloudUpload />
        <input type="file" hidden />
      </Fab>
    </div>
  );
}
