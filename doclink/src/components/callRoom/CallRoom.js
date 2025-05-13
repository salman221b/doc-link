import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

const CallRoom = () => {
  const { roomName } = useParams();
  const { identity } = useLocation().state;
  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      const res = await fetch(
        "https://doc-link-backend.onrender.com/get-livekit-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identity, roomName }),
        }
      );

      const data = await res.json();
      setToken(data.token);
    };

    getToken();
  }, [roomName, identity]);

  if (!token) return <div>Connecting...</div>;

  return (
    <LiveKitRoom
      token={token}
      serverUrl="wss://doclink-gzihezdq.livekit.cloud"
      data-lk-theme="default"
      connect={true}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default CallRoom;
