import { v4 as uuidv4 } from "uuid";

export const createRoom = async (roomName) => {
  const session_id = uuidv4(); // unique ID per session
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
          session_id,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok || !data.room?.id) {
      throw new Error(data.error || "Room creation failed");
    }

    return {
      id: data.room.id,
      code: data.room.code,
      session_id,
    };
  } catch (error) {
    console.error("Room creation error:", error.message);
    throw error;
  }
};
