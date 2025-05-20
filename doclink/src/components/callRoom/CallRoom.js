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

        // 1. Create or get the room
        const roomData = await createRoom(roomName);
        if (!roomData?.id) {
          throw new Error("Failed to create room");
        }

        // 2. Get auth token for the participant
        const response = await fetch(
          "https://doc-link-backend.onrender.com/get-token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: identity,
              room_id: roomData.id, // Make sure this is the correct room ID
              role,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to get token");
        }

        const { token } = await response.json();
        if (!token) {
          throw new Error("Invalid token received");
        }

        setToken(token);
      } catch (err) {
        console.error("Call initialization error:", err);
        setError(err.message || "Failed to initialize call");
        // Redirect after showing error
        setTimeout(() => navigate("/"), 5000);
      } finally {
        setLoading(false);
      }
    };

    // Only initialize if we have required parameters
    if (roomName && identity && role) {
      initializeCall();
    } else {
      setError("Missing call parameters");
      setLoading(false);
    }
  }, [roomName, identity, role, navigate]);

  if (loading) {
    return <div className="loading-screen">Loading call room...</div>;
  }

  if (error) {
    return (
      <div className="error-screen">
        <p>{error}</p>
        <p>Redirecting to home page...</p>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh" }}>
      {token && (
        <HMSPrebuilt
          roomCode={roomName} // Use either roomCode or token
          token={token} // Providing both is okay but one is sufficient
          options={{
            userName: `${role}-${identity}`,
            muteOnJoin: false,
            videoOnJoin: true,
            debugMode: process.env.NODE_ENV === "development",
          }}
          onLeave={() => navigate("/")}
        />
      )}
    </div>
  );
};

export default CallRoom;
