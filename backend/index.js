const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./libs/db");
const bodyParser = require("body-parser");
const startReminderJob = require("./reminderSent/reminderSend");
const cors = require("cors");
const authMiddleware = require("./middlewares/authMiddleware");
const http = require("http");
const { Server } = require("socket.io");

require("./reminderSent/reminderSend");
dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Connect to DB
connectDB();

// Routes
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

// Socket.IO setup
const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Register user when they connect
  socket.on("register", (userId, userType) => {
    onlineUsers[userId] = {
      socketId: socket.id,
      userType,
      lastSeen: new Date(),
    };
    console.log(`User registered: ${userId} (${userType})`);
  });

  socket.on("call-user", (data) => {
    io.to(data.to).emit("incoming-call", {
      from: data.from,
      offer: data.offer,
    });
  });

  socket.on("answer-call", (data) => {
    io.to(data.to).emit("call-answered", {
      from: data.from,
      answer: data.answer,
    });
  });

  socket.on("reject-call", (data) => {
    io.to(data.to).emit("call-rejected", { from: data.from });
  });

  socket.on("send-ice-candidate", (data) => {
    io.to(data.to).emit("ice-candidate", {
      from: data.from,
      candidate: data.candidate,
    });
  });
  socket.on("disconnect", () => {
    // Remove user from online list
    for (const userId in onlineUsers) {
      if (onlineUsers[userId].socketId === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});
// Add a helper to check if user is online
io.of("/").adapter.on("getOnlineUsers", (callback) => {
  callback(onlineUsers);
});
// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startReminderJob();
});
