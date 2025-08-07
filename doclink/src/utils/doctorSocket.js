import { io } from "socket.io-client";

const socket = io("https://doc-link-backend.onrender.com"); // Replace with your actual backend

export const initializeDoctorSocket = (doctorId, onCallRequest) => {
  socket.emit("register", { userId: doctorId, userType: "doctor" });

  socket.on("call-request", (data) => {
    console.log("Incoming call from patient:", data);
    if (onCallRequest) onCallRequest(data);
  });

  return socket;
};
