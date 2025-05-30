const { v4: uuidv4 } = require("uuid");

module.exports = (io) => {
  const activeRooms = new Map();

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

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

      // Notify other participants
      socket.to(roomId).emit("user-connected", { userId, userType });

      // Send existing participants to the new user
      const others = room.participants.filter((p) => p.userId !== userId);
      socket.emit("existing-users", others);
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
      socket
        .to(roomId)
        .emit("ice-candidate", { candidate, fromUserId: socket.userId });
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
      activeRooms.forEach((room, roomId) => {
        const participant = room.participants.find(
          (p) => p.socketId === socket.id
        );
        if (participant) {
          room.participants = room.participants.filter(
            (p) => p.socketId !== socket.id
          );
          socket
            .to(roomId)
            .emit("user-disconnected", { userId: participant.userId });

          if (room.participants.length === 0) {
            activeRooms.delete(roomId);
          }
        }
      });
    });
  });
};
