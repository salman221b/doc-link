// videoCallSocket.js
module.exports = (io) => {
  const connectedUsers = {}; // userId -> socket.id

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register user
    socket.on("register", ({ userId, userType }) => {
      socket.userId = userId;
      socket.userType = userType;
      connectedUsers[userId] = socket.id;
      socket.join(userId);
      console.log(`${userType} registered with ID: ${userId} -> socket ${socket.id}`);
    });

    // Patient OR Doctor initiates call
    socket.on(
      "call-request",
      ({ doctorId, patientId, appointmentId, patientName, fromUserId }) => {
        const targetUserId = doctorId || patientId;
        const targetSocketId = connectedUsers[targetUserId];

        console.log(
          `call-request: from=${fromUserId} toUser=${targetUserId} appointment=${appointmentId}`
        );

        if (targetSocketId) {
          io.to(targetSocketId).emit("call-request", {
            appointmentId,
            patientName,
            fromUserId,
          });
          console.log(`Call request forwarded to socket ${targetSocketId}`);
        } else {
          socket.emit("doctor-unavailable");
          console.log(`User ${targetUserId} is unavailable`);
        }
      }
    );

    // Accept the call (doctor or patient)
    socket.on("call-accept", ({ toUserId, appointmentId }) => {
      const targetSocketId = connectedUsers[toUserId];
      console.log(`call-accept: by=${socket.userId} -> to=${toUserId} appointment=${appointmentId}`);
      if (targetSocketId) {
        // include fromUserId so caller knows who accepted
        io.to(targetSocketId).emit("call-accepted", {
          appointmentId,
          fromUserId: socket.userId,
        });
        console.log(`call-accepted emitted to socket ${targetSocketId}`);
      }
    });

    // Decline the call
    socket.on("call-decline", ({ toUserId, reason }) => {
      const targetSocketId = connectedUsers[toUserId];
      console.log(`call-decline: by=${socket.userId} -> to=${toUserId} reason=${reason}`);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call-declined", {
          reason,
          fromUserId: socket.userId,
        });
        console.log(`call-declined emitted to socket ${targetSocketId}`);
      }
    });

    // Join room for WebRTC signaling (roomId could be appointmentId)
    socket.on("join-room", ({ userId, role }) => {
      connectedUsers[userId] = socket.id;
      socket.join(userId);
      console.log(`${role} joined signaling room ${userId} (socket ${socket.id})`);
    });

    // End the call: notify the other user
    socket.on("end-call", ({ toUserId }) => {
      const targetSocketId = connectedUsers[toUserId];
      console.log(`end-call: by=${socket.userId} -> to=${toUserId}`);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call-ended", {
          message: "The other person has ended the call",
          fromUserId: socket.userId,
        });
        console.log(`call-ended emitted to socket ${targetSocketId}`);
      }
    });

    // Signaling exchange (WebRTC)
    socket.on("signal", ({ roomId, data, userId }) => {
      socket.to(roomId).emit("signal", { data, userId });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id} (userId=${socket.userId})`);
      if (socket.userId) {
        delete connectedUsers[socket.userId];
      }
      // Optional: notify everyone that this user disconnected (useful)
      // socket.broadcast.emit("call-ended", { message: `${socket.userType || 'User'} disconnected`, fromUserId: socket.userId });
    });
  });
};
