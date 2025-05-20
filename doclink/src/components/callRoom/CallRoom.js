// frontend/src/components/callRoom/CallRoom.jsx
import { HMSPrebuilt } from "@100mslive/roomkit-react";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { createRoom } from "../../utility/createRoom";

const CallRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomName } = useParams();
  const { identity, role } = location.state || {};
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const initializeCall = async () => {
      try {
        setLoading(true);
        setError("");

        // Validate parameters
        if (!roomName || !identity || !role) {
          throw new Error("Missing required call parameters");
        }

        // Create room and get ID
        const roomId = await createRoom(roomName);
        console.log("Created room with ID:", roomId);

        // Get auth token
        const tokenResponse = await fetch(
          "https://doc-link-backend.onrender.com/get-token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: identity,
              room_id: roomId, // Now using the direct ID
              role,
            }),
          }
        );

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json().catch(() => ({}));
          throw new Error(errorData.error || "Token request failed");
        }

        const { token } = await tokenResponse.json();
        if (!token) {
          throw new Error("Empty token received");
        }

        setToken(token);
      } catch (err) {
        console.error("Call initialization failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeCall();
  }, [roomName, identity, role]);

  if (loading) {
    return <div className="loading-screen">Initializing video call...</div>;
  }

  if (error) {
    return (
      <div className="error-screen">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
        <button onClick={() => navigate("/appointments")}>Cancel</button>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh" }}>
      <HMSPrebuilt
        roomCode={roomName}
        token={token}
        options={{
          userName: `${role}-${identity}`,
          muteOnJoin: false,
          videoOnJoin: true,
        }}
        onLeave={() => navigate("/appointments")}
      />
    </div>
  );
};

export default CallRoom;
