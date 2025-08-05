module.exports = (io) => {
  const connectedUsers = {}; // userId: socket.id

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // When a user connects and registers
    socket.on("register", ({ userId, userType }) => {
      socket.userId = userId;
      socket.userType = userType;
      connectedUsers[userId] = socket.id;
      socket.join(userId); // join personal room for direct communication
      console.log(`${userType} registered with ID: ${userId}`);
    });

    // Patient initiates call to Doctor
    socket.on("call-request", ({ doctorId, appointmentId, patientName }) => {
      const doctorSocketId = connectedUsers[doctorId];
      if (doctorSocketId) {
        io.to(doctorId).emit("call-request", {
          appointmentId,
          patientName,
          fromUserId: socket.userId,
        });
        console.log(
          `Call request sent from patient ${socket.userId} to doctor ${doctorId}`
        );
      } else {
        socket.emit("doctor-unavailable");
      }
    });

    // Doctor accepts the call
    socket.on("call-accept", ({ patientId, appointmentId }) => {
      io.to(patientId).emit("call-accepted", { appointmentId });
      console.log(
        `Doctor ${socket.userId} accepted the call with patient ${patientId}`
      );
    });

    // Doctor declines the call
    socket.on("call-decline", ({ patientId, reason }) => {
      io.to(patientId).emit("call-declined", { reason });
      console.log(
        `Doctor ${socket.userId} declined the call with patient ${patientId}`
      );
    });

    // Join the WebRTC room
    socket.on("join-call-room", ({ roomId, userId }) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", { userId });
      console.log(`${userId} joined room ${roomId}`);
    });

    // Signaling data (WebRTC)
    socket.on("signal", ({ roomId, data, userId }) => {
      socket.to(roomId).emit("signal", { data, userId });
    });

    // On disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      if (socket.userId) {
        delete connectedUsers[socket.userId];
      }
    });
  });
};
