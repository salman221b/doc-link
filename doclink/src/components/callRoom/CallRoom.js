// src/pages/VideoPage.js
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Room } from "livekit-client";

const CallRoom = () => {
  const { roomName } = useParams();
  const { identity } = useLocation().state;
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        const res = await fetch(
          "https://doc-link-backend.onrender.com/get-livekit-token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identity, roomName }),
          }
        );

        const { token } = await res.json();

        const room = new Room();
        await room.connect("wss://doclink-gzihezdq.livekit.cloud", token, {
          autoSubscribe: true,
        });

        console.log("Connected to LiveKit room");
        setRoom(room);
      } catch (error) {
        console.error("Failed to connect to LiveKit:", error);
      }
    };

    connectToRoom();

    // Cleanup on unmount
    return () => {
      room?.disconnect();
    };
  }, [roomName, identity]);

  return <div>{room ? "Connected to room!" : "Connecting..."}</div>;
};

export default CallRoom;
