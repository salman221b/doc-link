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

    // Register user
    socketRef.current.emit("register", { userId, userType: role });

    // 🔹 Caller feedback (works for both doctor & patient)
    socketRef.current.on("call-accepted", ({ appointmentId }) => {
      toast.success("Call accepted!");
      navigate(`/video-call/${appointmentId}`, { state: { isCaller: true } });
    });

    socketRef.current.on("call-declined", ({ reason }) => {
      toast.error(reason || "Call was declined.");
    });

    socketRef.current.on("doctor-unavailable", () => {
      toast.warning("User is currently unavailable.");
    });

    // 🔹 When doctor receives call
    if (role === "doctor") {
      socketRef.current.on(
        "call-request",
        ({ fromUserId, appointmentId, patientName }) => {
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
          }).then((result) => {
            if (result.isConfirmed) {
              socketRef.current.emit("call-accept", {
                toUserId: fromUserId, // ✅ FIXED
                appointmentId,
              });
              navigate(`/video-call/${appointmentId}`, {
                state: { isCaller: false },
              }); // ✅ callee
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // only emit decline if user *clicked Reject*
              socketRef.current.emit("call-decline", {
                toUserId: fromUserId,
                reason: "Doctor declined the call",
              });
            }
          });
        }
      );
    }

    // 🔹 When patient receives call
    if (role === "patient") {
      socketRef.current.on("call-request", (data) => {
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
        }).then((result) => {
          if (result.isConfirmed) {
            socketRef.current.emit("call-accept", {
              toUserId: data.fromUserId, // ✅ FIXED
              appointmentId: data.appointmentId,
            });
            navigate(`/video-call/${data.appointmentId}`, {
              state: { isCaller: false },
            }); // ✅ callee
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // only emit decline if user *clicked Reject*
            socketRef.current.emit("call-decline", {
              toUserId: data.fromUserId, // ✅ FIXED
              reason: "Patient declined the call",
            });
          }
        });
      });
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, role, navigate]);

  return null;
};

export default SocketProvider;
