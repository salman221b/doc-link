module.exports = (io) => {
  const connectedUsers = {}; // userId: socket.id

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("register", ({ userId, userType }) => {
      socket.userId = userId;
      socket.userType = userType;
      connectedUsers[userId] = socket.id;
      socket.join(userId);
      console.log(`${userType} registered with ID: ${userId}`);
    });

    // Patient OR Doctor initiates call
    socket.on(
      "call-request",
      ({ doctorId, patientId, appointmentId, patientName, fromUserId }) => {
        let targetUserId = doctorId || patientId;
        const targetSocketId = connectedUsers[targetUserId];

        if (targetSocketId) {
          io.to(targetUserId).emit("call-request", {
            appointmentId,
            patientName,
            fromUserId,
          });
          console.log(
            `Call request sent from ${fromUserId} to ${targetUserId}`
          );
        } else {
          socket.emit("doctor-unavailable");
          console.log(`User ${targetUserId} is unavailable`);
        }
      }
    );

    // Accept the call (works for doctor or patient)
    socket.on("call-accept", ({ toUserId, appointmentId }) => {
      if (connectedUsers[toUserId]) {
        io.to(toUserId).emit("call-accepted", { appointmentId });
        console.log(
          `${socket.userType} ${socket.userId} accepted the call with ${toUserId}`
        );
      }
    });

    // Decline the call (works for doctor or patient)
    socket.on("call-decline", ({ toUserId, reason }) => {
      if (connectedUsers[toUserId]) {
        io.to(toUserId).emit("call-declined", { reason });
        console.log(
          `${socket.userType} ${socket.userId} declined the call with ${toUserId}`
        );
      }
    });

    socket.on("join-room", ({ userId, role }) => {
      connectedUsers[userId] = socket.id;
      socket.join(userId);
      console.log(`${role} joined room ${userId}`);
    });

    socket.on("signal", ({ roomId, data, userId }) => {
      socket.to(roomId).emit("signal", { data, userId });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      if (socket.userId) {
        delete connectedUsers[socket.userId];
      }
    });
  });
};
