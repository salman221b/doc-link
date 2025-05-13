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
const { AccessToken } = require("livekit-server-sdk");

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
app.post("/get-livekit-token", (req, res) => {
  const { identity, roomName } = req.body;

  if (!identity || !roomName) {
    return res.status(400).json({ message: "Missing identity or roomName" });
  }

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_SECRET,
    { identity }
  );

  at.addGrant({ roomJoin: true, room: roomName });

  const token = at.toJwt();
  res.json({ token });
});
const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", ({ userId }) => {
    onlineUsers[userId] = socket.id;
  });

  socket.on("call-user", ({ toUserId, fromUserId, roomName }) => {
    const toSocket = onlineUsers[toUserId];
    if (toSocket) {
      io.to(toSocket).emit("incoming-call", {
        fromUserId,
        roomName,
      });
    }
  });

  socket.on("disconnect", () => {
    for (const [uid, sid] of Object.entries(onlineUsers)) {
      if (sid === socket.id) {
        delete onlineUsers[uid];
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startReminderJob();
});
