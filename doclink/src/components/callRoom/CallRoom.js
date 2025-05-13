// CallRoom.js
import {
  HMSRoomProvider,
  useHMSActions,
  useHMSStore,
  selectIsConnectedToRoom,
} from "@100mslive/react-sdk";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const CallRoomInner = ({ role, userName }) => {
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const { roomId } = useParams();

  useEffect(() => {
    const joinRoom = async () => {
      const { data } = await axios.post(
        "https://doc-link-backend.onrender.com/api/video/get-token",
        {
          user_id: userName,
          room_id: "6821b98236d4cfc1981f3b17",
          role,
        }
      );
      console.log(userName, role);
      console.log("data:", data);

      await hmsActions.join({
        userName,
        authToken: data.token,
        settings: {
          isAudioMuted: false,
          isVideoMuted: false,
        },
      });
    };

    joinRoom();
  }, [roomId]);

  if (!isConnected) return <p>Joining room...</p>;

  return <h2>You’re in the room! Implement video tiles here.</h2>;
};

const CallRoom = () => {
  const location = useLocation();
  const { role, userName } = location.state || {};
  return (
    <HMSRoomProvider>
      <CallRoomInner role={role} userName={userName} />
    </HMSRoomProvider>
  );
};

export default CallRoom;
