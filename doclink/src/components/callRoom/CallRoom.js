// frontend/src/components/callRoom/CallRoom.jsx
import { HMSPrebuilt } from "@100mslive/roomkit-react";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const CallRoom = () => {
  const { roomName } = useParams();
  const { identity, role } = useLocation().state;
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch(
        "https://doc-link-backend.onrender.com/get-100ms-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: identity,
            room_id: roomName,
            role: role,
          }),
        }
      );

      const data = await res.json();
      setToken(data.token);
    };

    fetchToken();
  }, [roomName, identity, role]);

  if (!token) return <div>Loading...</div>;

  return (
    <div style={{ height: "100vh" }}>
      <HMSPrebuilt token={token} />
    </div>
  );
};

export default CallRoom;
