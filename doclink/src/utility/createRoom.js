export const createRoom = async (roomName) => {
  try {
    const response = await fetch(
      "https://doc-link-backend.onrender.com/create-room",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: roomName }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create room");
    }

    return data; // contains room_id, name, etc.
  } catch (error) {
    console.error("Error creating room:", error);
    return null;
  }
};
