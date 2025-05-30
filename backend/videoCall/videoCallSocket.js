const { v4: uuidv4 } = require("uuid");

module.exports = (io) => {
  const activeRooms = new Map();
  const pendingCalls = new Map(); // Stores pending call requests
  const doctorSockets = new Map(); // Maps doctor IDs to their socket IDs

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Track user role and ID when they first connect
    socket.on("register-user", ({ userId, userType }) => {
      if (userType === "doctor") {
        doctorSockets.set(userId, socket.id);
      }
      socket.userId = userId;
      socket.userType = userType;
    });

    // Join video call room
    socket.on("join-room", ({ roomId, userId, userType }) => {
      // Initialize room if it doesn't exist
      if (!activeRooms.has(roomId)) {
        activeRooms.set(roomId, {
          participants: [],
          offers: {},
          answers: {},
          iceCandidates: {},
        });
      }

      const room = activeRooms.get(roomId);
      room.participants.push({ socketId: socket.id, userId, userType });
      socket.join(roomId);

      // If doctor joins, check for pending call request
      if (userType === "doctor") {
        const pendingCall = pendingCalls.get(roomId);
        if (pendingCall) {
          socket.emit("call-request", {
            fromUserId: pendingCall.fromUserId,
            appointmentId: roomId,
            patientName: pendingCall.patientName,
          });
        }
      }

      // Notify other participants
      socket.to(roomId).emit("user-connected", { userId, userType });

      // Send existing participants to the new user
      const others = room.participants.filter((p) => p.userId !== userId);
      socket.emit("existing-users", others);
    });

    // Patient initiates a call request
    socket.on("request-call", ({ appointmentId, userId, patientName }) => {
      pendingCalls.set(appointmentId, {
        fromUserId: userId,
        patientName,
        timestamp: Date.now(),
      });

      // Notify doctor if online
      const room = activeRooms.get(appointmentId);
      if (room) {
        const doctor = room.participants.find((p) => p.userType === "doctor");
        if (doctor) {
          io.to(doctor.socketId).emit("call-request", {
            fromUserId: userId,
            appointmentId,
            patientName,
          });
        }
      }
    });

    // Doctor responds to call request
    socket.on("call-response", ({ appointmentId, response, toUserId }) => {
      if (response === "accept") {
        // Initialize room if not already exists
        if (!activeRooms.has(appointmentId)) {
          activeRooms.set(appointmentId, {
            participants: [],
            offers: {},
            answers: {},
            iceCandidates: {},
          });
        }

        // Notify patient
        io.to(toUserId).emit("call-accepted", { appointmentId });
      } else {
        // Notify patient call was declined
        io.to(toUserId).emit("call-declined", { appointmentId });
      }

      // Remove pending call
      pendingCalls.delete(appointmentId);
    });

    // WebRTC Signaling
    socket.on("offer", ({ roomId, offer, toUserId }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        room.offers[toUserId] = offer;
        socket.to(roomId).emit("offer", { offer, fromUserId: socket.userId });
      }
    });

    socket.on("answer", ({ roomId, answer, toUserId }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        room.answers[toUserId] = answer;
        socket.to(roomId).emit("answer", { answer, fromUserId: socket.userId });
      }
    });

    socket.on("ice-candidate", ({ roomId, candidate, toUserId }) => {
      socket.to(roomId).emit("ice-candidate", {
        candidate,
        fromUserId: socket.userId,
      });
    });

    // Leave room
    socket.on("leave-room", ({ roomId, userId }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        room.participants = room.participants.filter(
          (p) => p.socketId !== socket.id
        );
        socket.to(roomId).emit("user-disconnected", { userId });

        if (room.participants.length === 0) {
          activeRooms.delete(roomId);
        }
      }
    });

    // Cleanup on disconnect
    socket.on("disconnect", () => {
      // Remove from doctor tracking
      if (socket.userType === "doctor") {
        doctorSockets.delete(socket.userId);
      }

      // Clean up pending calls
      for (const [appointmentId, call] of pendingCalls.entries()) {
        if (call.fromUserId === socket.userId) {
          pendingCalls.delete(appointmentId);
        }
      }

      // Clean up active rooms
      activeRooms.forEach((room, roomId) => {
        const participant = room.participants.find(
          (p) => p.socketId === socket.id
        );
        if (participant) {
          room.participants = room.participants.filter(
            (p) => p.socketId !== socket.id
          );
          io.to(roomId).emit("user-disconnected", {
            userId: participant.userId,
          });

          if (room.participants.length === 0) {
            activeRooms.delete(roomId);
          }
        }
      });
    });
  });
};
