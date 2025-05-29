const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./libs/db");
const bodyParser = require("body-parser");
const startReminderJob = require("./reminderSent/reminderSend");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://doc-link-hco2.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

connectDB();
app.options("*", cors());

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
app.use("/", require("./routes/video-conference"));

// 🟢 WebSocket logic
const onlineUsers = {}; // userId: socketId

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // ✅ Register user (enhanced with user type)
  socket.on("register", ({ userId, userType }) => {
    onlineUsers[userId] = {
      socketId: socket.id,
      userType: userType, // 'doctor' or 'patient'
    };
    console.log(`User ${userId} (${userType}) registered`);
  });

  // ✅ Patient initiates call (enhanced with appointment details)
  socket.on(
    "call-user",
    ({ toUserId, fromUserId, roomName, appointmentId }) => {
      const recipient = onlineUsers[toUserId];
      if (recipient && recipient.userType === "doctor") {
        io.to(recipient.socketId).emit("incoming-call", {
          fromUserId,
          roomName,
          appointmentId,
          callerSocketId: socket.id,
        });
        console.log(`Call initiated from ${fromUserId} to doctor ${toUserId}`);
      } else {
        // Notify caller that doctor is offline
        socket.emit("call-failed", {
          reason: recipient ? "Doctor is busy" : "Doctor is offline",
        });
      }
    }
  );

  // ✅ Doctor accepts call
  socket.on("accept-call", ({ toUserId, fromUserId }) => {
    const toSocket = onlineUsers[toUserId];
    if (toSocket) {
      io.to(toSocket).emit("call-accepted", { fromUserId });
    }
  });

  // ✅ Doctor declines call
  socket.on("decline-call", ({ toUserId, fromUserId }) => {
    const toSocket = onlineUsers[toUserId];
    if (toSocket) {
      io.to(toSocket).emit("call-declined", { fromUserId });
    }
  });

  // ✅ WebRTC signaling
  socket.on("send-signal", ({ toUserId, signalData, fromUserId }) => {
    const toSocket = onlineUsers[toUserId];
    if (toSocket) {
      io.to(toSocket).emit("receive-signal", {
        signalData,
        fromUserId,
      });
    }
  });

  // ✅ Clean up on disconnect
  socket.on("disconnect", () => {
    for (const [uid, sid] of Object.entries(onlineUsers)) {
      if (sid === socket.id) {
        delete onlineUsers[uid];
        break;
      }
    }
  });
});

// ✅ Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startReminderJob();
});
