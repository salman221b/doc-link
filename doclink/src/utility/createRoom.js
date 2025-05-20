// frontend/src/utility/createRoom.js
export const createRoom = async (roomName) => {
  try {
    const response = await fetch(
      "https://doc-link-backend.onrender.com/create-room",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: roomName,
          description: `Telemedicine consultation - ${new Date().toLocaleString()}`,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Room creation failed");
    }

    // Handle both response formats
    const roomId = data.id || data.room?.id;
    if (!roomId) {
      throw new Error("Invalid room ID in response");
    }

    return roomId; // Now returns just the ID string
  } catch (error) {
    console.error("Room creation error:", error);
    throw error;
  }
};
