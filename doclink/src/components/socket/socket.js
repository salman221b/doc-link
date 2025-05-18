import { io } from "socket.io-client";

const socket = io("https://doc-link-backend.onrender.com", {
  transports: ["websocket", "polling"], // explicitly specify transports
  withCredentials: true, // required when credentials are used in CORS
});

export default socket;
