import { io } from "socket.io-client";

const socket = io("https://doc-link-backend.onrender.com"); 

export const initializeDoctorSocket = (doctorId, onCallRequest) => {
  socket.emit("register", { userId: doctorId, userType: "doctor" });

  socket.on("call-request", (data) => {
    console.log("Incoming call from patient:", data);
    if (onCallRequest) onCallRequest(data);
  });

  return socket;
};
