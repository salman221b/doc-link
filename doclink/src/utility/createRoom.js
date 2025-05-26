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

    return {
      id: data.room.id,
      code: data.room.code, // This is what we'll use for roomCode
    };
  } catch (error) {
    console.error("Room creation error:", error);
    throw error;
  }
};
