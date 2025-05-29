// frontend/src/utility/createRoom.js
export const createRoom = async (roomName) => {
  console.log("Creating room with name:", roomName); // Debug log
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
          description: `Consultation-${Date.now()}`,
        }),
      }
    );

    const data = await response.json();
    console.log("Create room response:", data); // Debug log

    if (!response.ok) {
      const error = new Error(data.error || "Room creation failed");
      error.details = data;
      throw error;
    }

    if (!data.room?.id) {
      throw new Error("Invalid room ID in response");
    }

    return {
      id: data.room.id,
      code: data.room.code,
      rawResponse: data, // Include for debugging
    };
  } catch (error) {
    console.error("Room creation error:", {
      message: error.message,
      details: error.details,
    });
    throw error;
  }
};
