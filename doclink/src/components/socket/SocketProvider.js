// SocketProvider.jsx
import React, { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SocketProvider = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.id;
  const role = decoded?.role;

  const socketRef = useRef();

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io("https://doc-link-backend.onrender.com");
    const socket = socketRef.current;
    console.log("SocketProvider mounted, socket id:", socket.id);

    // Register
    socket.emit("register", { userId, userType: role });
    console.log("Emitted register:", userId, role);

    // When the other side accepts your call (this is for the caller)
    socket.on("call-accepted", ({ appointmentId, fromUserId }) => {
      console.log("call-accepted received:", appointmentId, fromUserId);
      toast.success("Call accepted!");
      // Caller should navigate and mark themselves as caller.
      navigate(`/video-call/${appointmentId}`, {
        state: { isCaller: true, remoteUserId: fromUserId },
      });
    });

    // When the other side declines
    socket.on("call-declined", ({ reason, fromUserId }) => {
      console.log("call-declined received:", reason, fromUserId);
      toast.error(reason || "Call was declined.");
    });

    socket.on("doctor-unavailable", () => {
      console.log("doctor-unavailable event");
      toast.warning("User is currently unavailable.");
    });

    // Doctor receives call-request
    if (role === "doctor") {
      socket.on("call-request", ({ fromUserId, appointmentId, patientName }) => {
        console.log("Doctor received call-request:", { fromUserId, appointmentId, patientName });
        Swal.fire({
          title: `Incoming Call from ${patientName}`,
          text: "Accept the call?",
          iconHtml: '<i class="fa fa-phone"></i>',
          showCancelButton: true,
          confirmButtonText: '<i class="fa fa-phone"></i> Accept',
          cancelButtonText: '<i class="fa fa-phone-slash"></i> Reject',
          confirmButtonColor: "#82EAAC",
          cancelButtonColor: "#F49696",
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((result) => {
          console.log("Swal result (doctor):", result);
          if (result.isConfirmed) {
            socket.emit("call-accept", {
              toUserId: fromUserId,
              appointmentId,
            });
            navigate(`/video-call/${appointmentId}`, {
              state: { isCaller: false, remoteUserId: fromUserId },
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            socket.emit("call-decline", {
              toUserId: fromUserId,
              reason: "Doctor declined the call",
            });
          } else {
            // other dismiss reasons (backdrop, esc, timer) -> do NOTHING
            console.log("Doctor dismissed popup without explicit reject:", result.dismiss);
          }
        });
      });
    }

    // Patient receives call-request
    if (role === "patient") {
      socket.on("call-request", (data) => {
        console.log("Patient received call-request:", data);
        Swal.fire({
          title: `Incoming Call from Doctor`,
          text: "Accept the call?",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: '<i class="fas fa-phone"></i> Accept',
          cancelButtonText: '<i class="fas fa-phone-slash"></i> Reject',
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#dc3545",
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((result) => {
          console.log("Swal result (patient):", result);
          if (result.isConfirmed) {
            socket.emit("call-accept", {
              toUserId: data.fromUserId,
              appointmentId: data.appointmentId,
            });
            navigate(`/video-call/${data.appointmentId}`, {
              state: { isCaller: false, remoteUserId: data.fromUserId },
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            socket.emit("call-decline", {
              toUserId: data.fromUserId,
              reason: "Patient declined the call",
            });
          } else {
            console.log("Patient dismissed popup without explicit reject:", result.dismiss);
          }
        });
      });
    }

    return () => {
      console.log("SocketProvider unmount, disconnecting socket");
      socket.disconnect();
    };
  }, [userId, role, navigate]);

  return null;
};

export default SocketProvider;
