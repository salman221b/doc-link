import { HMSPrebuilt } from "@100mslive/roomkit-react";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { createRoom } from "../../utility/createRoom";
import { v4 as uuidv4 } from "uuid";

const CallRoom = () => {
  const { roomName } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [callState, setCallState] = useState({
    loading: true,
    error: null,
    token: null,
    roomCode: null,
  });

  useEffect(() => {
    const initializeCall = async () => {
      try {
        if (!roomName || !state?.identity || !state?.role) {
          throw new Error("Missing call parameters");
        }

        // Step 1: Create a unique room
        const session_id = uuidv4();
        const { id: roomId, code: roomCode } = await createRoom(roomName);

        // Step 2: Get auth token for that room
        const tokenRes = await fetch(
          "https://doc-link-backend.onrender.com/get-token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: state.identity,
              room_id: roomId,
              role: state.role,
            }),
          }
        );
        const data = await tokenRes.json();

        if (!data.token || data.room_id !== roomId) {
          throw new Error("Room ID mismatch in token response");
        }

        setCallState({
          loading: false,
          error: null,
          token: data.token,
          roomCode,
        });
      } catch (error) {
        console.error("Initialization failed:", error.message);
        setCallState({
          loading: false,
          error: "Failed to join call. Please try again.",
          token: null,
          roomCode: null,
        });
      }
    };

    initializeCall();
  }, []);

  if (callState.loading) {
    return <div>Setting up consultation room...</div>;
  }

  if (callState.error) {
    return (
      <div>
        <h3>Error</h3>
        <p>{callState.error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
        <button onClick={() => navigate("/appointments")}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh" }}>
      <HMSPrebuilt
        roomCode={callState.roomCode}
        token={callState.token}
        options={{
          userName: `${state.role}-${state.identity}`,
          muteOnJoin: false,
          videoOnJoin: true,
        }}
        onError={(error) => {
          console.error("100ms Error:", error.message);
          setCallState((prev) => ({
            ...prev,
            error: "Video call failed. Try again.",
          }));
        }}
      />
    </div>
  );
};

export default CallRoom;
