// frontend/src/components/callRoom/CallRoom.jsx
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
      console.log("Initializing call with params:", { roomName, state }); // Debug log

      try {
        if (!roomName || !state?.identity || !state?.role) {
          throw new Error("Missing required call parameters");
        }

        // 1. Create room and get connection details
        const { id: roomId, code: roomCode } = await createRoom(roomName);
        console.log("Room created:", { roomId, roomCode }); // Debug log

        // 2. Get auth token
        const tokenResponse = await fetch(
          "https://doc-link-backend.onrender.com/get-token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: state.identity,
              room_id: roomId,
              role: state.role,
              session_id: uuidv4(),
            }),
          }
        );
        const { token, room_id: verifiedRoomId } = await tokenResponse.json();

        // Verify room ID matches
        if (verifiedRoomId !== roomId) {
          throw new Error("Room ID mismatch in token response");
        }

        console.log("Final join parameters:", {
          roomCode,
          token: token.slice(0, 50) + "...",
          roomId: verifiedRoomId,
        });

        setCallState({
          loading: false,
          error: null,
          token,
          roomCode,
        });
      } catch (error) {
        console.error("Call initialization failed:", {
          error: error.message,
          response: error.response?.data,
        });
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
    return (
      <div className="loading-screen">
        <p>Setting up your consultation room...</p>
        <p>Please wait</p>
      </div>
    );
  }

  if (callState.error) {
    return (
      <div className="error-screen">
        <h3>Could not start video call</h3>
        <p>{callState.error}</p>
        <div className="action-buttons">
          <button onClick={() => window.location.reload()}>Try Again</button>
          <button onClick={() => navigate("/appointments")}>
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  console.log("Joining room with:", {
    // Debug log
    roomCode: callState.roomCode,
    token: callState.token?.slice(0, 10) + "...",
  });

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
          console.error("100MS SDK Error:", {
            code: error.code,
            message: error.message,
            isTerminal: error.isTerminal,
          });

          // Handle specific error codes
          if (error.code === 3001) {
            // Room not found
            setCallState((prev) => ({
              ...prev,
              error: "Room not found. Please create a new appointment.",
            }));
          } else {
            setCallState((prev) => ({
              ...prev,
              error: "Connection error. Please try again.",
            }));
          }
        }}
      />
    </div>
  );
};

export default CallRoom;
