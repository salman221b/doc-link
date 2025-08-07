// components/CallPopup.js
import React from "react";

const CallPopup = ({ patientName, onAccept, onDecline }) => {
  return (
    <div style={styles.backdrop}>
      <div style={styles.popup}>
        <p>{patientName || "Patient"} is calling...</p>
        <button onClick={onAccept} style={styles.accept}>
          Accept
        </button>
        <button onClick={onDecline} style={styles.decline}>
          Decline
        </button>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 9999,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    textAlign: "center",
  },
  accept: {
    marginRight: "1rem",
    padding: "0.5rem 1rem",
    background: "green",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
  decline: {
    padding: "0.5rem 1rem",
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
};

export default CallPopup;
