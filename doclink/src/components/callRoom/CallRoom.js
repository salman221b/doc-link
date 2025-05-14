import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles"; // import default LiveKit UI styles
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const CallRoom = () => {
  const { roomName } = useParams();
  const { identity, role, userName } = useLocation().state;
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
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
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };

    getToken();
  }, [identity, roomName]);

  if (!token) return <div>Connecting...</div>;

  return (
    <LiveKitRoom
      token={token}
      serverUrl="wss://doclink-gzihezdq.livekit.cloud"
      connect={true}
      data-lk-theme="default"
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default CallRoom;
