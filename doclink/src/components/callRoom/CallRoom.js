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

        // Create room and get BOTH id and code
        const { id: roomId, code: roomCode } = await createRoom(roomName);
        console.log("Room created:", { roomId, roomCode });

        // Get token using the room ID
        const tokenResponse = await fetch(
          "https://doc-link-backend.onrender.com/get-token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: identity,
              room_id: roomId, // Use ID for token generation
              role,
            }),
          }
        );

        const { token } = await tokenResponse.json();
        if (!token) throw new Error("Empty token received");

        setToken({ token, roomCode }); // Store both values
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
      {token && (
        <HMSPrebuilt
          roomCode={token.roomCode} // Use the actual room code here
          token={token.token}
          options={{
            userName: `${role}-${identity}`,
            muteOnJoin: false,
            videoOnJoin: true,
          }}
          onLeave={() => navigate("/appointments")}
        />
      )}
    </div>
  );
};

export default CallRoom;
