const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./libs/db");
const bodyParser = require("body-parser");
const startReminderJob = require("./reminderSent/reminderSend");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 8000;

// Create HTTP server for Socket.io
const httpServer = createServer(app);

// Configure Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
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
app.options("*", cors());

// Database connection
connectDB();

// Initialize video call socket
require("./videoCall/videoCallSocket")(io);

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

// Start the server with HTTP (for Socket.io) instead of Express
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startReminderJob();
});
