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
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

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
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startReminderJob();
});
