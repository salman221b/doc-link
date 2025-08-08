import React, { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const SocketProvider = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.id;
  const role = decoded?.role;

  const socketRef = useRef();

  useEffect(() => {
    if (!userId || role !== "doctor") return;

    socketRef.current = io("https://doc-link-backend.onrender.com");

    socketRef.current.emit("join-room", { userId, role });

    socketRef.current.on(
      "call-request",
      ({ fromUserId, appointmentId, patientName }) => {
        Swal.fire({
          title: `Incoming Call from ${patientName}`,
          text: "Accept the call?",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Accept",
          cancelButtonText: "Reject",
          allowOutsideClick: false,
        }).then((result) => {
          const response = result.isConfirmed ? "accept" : "reject";

          if (response === "accept") {
            socketRef.current.emit("call-accept", {
              patientId: fromUserId,
              appointmentId,
            });
            navigate(`/video-call/${appointmentId}`);
          } else {
            socketRef.current.emit("call-decline", {
              patientId: fromUserId,
              reason: "Doctor declined the call",
            });
          }
        });
      }
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, role]);

  return null;
};

export default SocketProvider;
