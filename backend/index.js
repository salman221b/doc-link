const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./libs/db");
const bodyParser = require("body-parser");
const startReminderJob = require("./reminderSent/reminderSend");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const http = require("http"); // ✅ For socket.io
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // or specify your frontend origin
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/", require("./routes/patientRoute"));
app.use("/", require("./routes/doctorRoute"));
app.use("/", require("./routes/verifyOtp"));
app.use("/", require("./routes/resendOtp"));
app.use("/", require("./routes/login"));
app.use("/", require("./routes/forgotPassword"));
app.use("/", require("./routes/resetPassword"));
app.use("/", require("./routes/dashboard"));
app.use("/", require("./routes/appointment"));
app.use("/", require("./routes/payment"));
app.use("/", require("./routes/book-appointment"));
app.use("/", require("./routes/upcomingAppointments"));
app.use("/", require("./routes/reminders"));
app.use("/", require("./routes/medical-records"));

// ✅ 100ms token route
app.post("/api/video/get-token", (req, res) => {
  const { user_id, room_id, role } = req.body;
  console.log(user_id, room_id, role);

  const payload = {
    access_key: process.env.HMS_ACCESS_KEY,
    room_id,
    user_id,
    role,
    type: "app",
    version: 2,
  };

  const token = jwt.sign(payload, process.env.HMS_SECRET, {
    algorithm: "HS256",
    expiresIn: "24h",
  });

  res.json({ token });
});

// ✅ Socket.IO call signaling
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", ({ userId }) => {
    onlineUsers[userId] = socket.id;
    console.log("Registered:", userId);
  });

  socket.on("call-user", ({ toUserId, fromUserId, roomId }) => {
    const toSocketId = onlineUsers[toUserId];
    if (toSocketId) {
      io.to(toSocketId).emit("incoming-call", {
        roomId,
        fromUserId,
      });
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(onlineUsers)) {
      if (socket.id === socketId) {
        delete onlineUsers[userId];
        break;
      }
    }
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startReminderJob();
});
