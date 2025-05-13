import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";

const DoctorPopup = ({ doctorId }) => {
  const [incomingCall, setIncomingCall] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Register doctor socket
    if (doctorId) {
      socket.emit("register", { userId: doctorId });
    }

    socket.on("incoming-call", ({ roomId, fromUserId }) => {
      console.log("Incoming call from:", fromUserId);
      setIncomingCall({ roomId, fromUserId });
    });

    // Cleanup on unmount
    return () => {
      socket.off("incoming-call");
    };
  }, [doctorId]);

  const handleAccept = () => {
    if (incomingCall) {
      navigate(`/call/${incomingCall.roomId}`, {
        state: {
          role: "doctor",
          userName: doctorId,
        },
      });
      setIncomingCall(null);
    }
  };

  const handleDecline = () => {
    setIncomingCall(null);
  };

  if (!incomingCall) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <p>📞 Incoming call from a patient</p>
        <button onClick={handleAccept} style={styles.accept}>
          Accept
        </button>
        <button onClick={handleDecline} style={styles.decline}>
          Decline
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  popup: {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    background: "white",
    borderRadius: "10px",
    textAlign: "center",
  },
  accept: {
    marginRight: "10px",
    background: "green",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
  },
  decline: {
    background: "red",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
  },
};

export default DoctorPopup;
