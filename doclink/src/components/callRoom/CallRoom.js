// frontend/src/components/callRoom/CallRoom.jsx
import { HMSPrebuilt } from "@100mslive/roomkit-react";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const CallRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomName } = useParams();
  const { identity, role } = location.state || {};
  const [token, setToken] = useState("");
  useEffect(() => {
    const fetchToken = async () => {
      console.log("Identity:", identity, "Room:", roomName, "Role:", role);

      try {
        const res = await fetch(
          "https://doc-link-backend.onrender.com/get-100ms-token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: identity,
              room_id: roomName,
              role,
            }),
          }
        );

        console.log("Token API status:", res.status);
        const data = await res.json();
        console.log("Token API response:", data);

        if (!data.token) {
          throw new Error("No token received");
        }

        setToken(data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
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
