// useVideoCall.js
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const token = localStorage.getItem("token");
const decoded = token ? jwtDecode(token) : null;
const userId = decoded?.id;
const socket = io("https://doc-link-backend.onrender.com/", {
  auth: {
    token: localStorage.getItem("token"), // Send auth token
    userId: userId, // Send user ID
  },
});

export const useVideoCall = () => {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerConnection = useRef(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callStatus, setCallStatus] = useState("idle"); // 'idle', 'calling', 'ringing', 'in-call'

  useEffect(() => {
    socket.on("incoming-call", async ({ from, offer }) => {
      setIncomingCall({ from, offer });
      setCallStatus("ringing");
    });

    socket.on("call-answered", async ({ answer }) => {
      await peerConnection.current.setRemoteDescription(answer);
      setCallStatus("in-call");
    });

    socket.on("ice-candidate", ({ candidate }) => {
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on("call-rejected", () => {
      setCallStatus("idle");
      alert("Call was rejected.");
    });

    return () => {
      socket.off();
    };
  }, []);

  const startCall = async (toUserId) => {
    setCallStatus("calling");

    try {
      // First check if the doctor is available
      const isAvailable = await new Promise((resolve) => {
        socket.emit("check-user-available", toUserId, (response) => {
          resolve(response.available);
        });
      });

      if (!isAvailable) {
        toast.error("Doctor is not available for video call");
        setCallStatus("idle");
        return false;
      }

      peerConnection.current = createPeerConnection(toUserId);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideo.current.srcObject = stream;
      stream
        .getTracks()
        .forEach((track) => peerConnection.current.addTrack(track, stream));

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit("call-user", {
        to: toUserId,
        from: socket.id,
        offer,
        callerInfo: {
          name: "Patient", // Or get from user data
          id: localStorage.getItem("userId"),
        },
      });
      const timeout = setTimeout(() => {
        if (callStatus === "calling") {
          setCallStatus("idle");
          // Emit event that can be listened to in component
          socket.emit("call-timeout", { to: toUserId });
        }
      }, 30000);

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("Error starting call:", error);
      toast.error("Failed to start call");
      setCallStatus("idle");
      throw error;
    }
  };

  const answerCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideo.current.srcObject = stream;

      peerConnection.current = createPeerConnection(incomingCall.from);
      stream
        .getTracks()
        .forEach((track) => peerConnection.current.addTrack(track, stream));

      await peerConnection.current.setRemoteDescription(incomingCall.offer);
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit("answer-call", {
        to: incomingCall.from,
        from: socket.id,
        answer,
      });

      setIncomingCall(null);
      setCallStatus("in-call");
    } catch (error) {
      console.error("Error answering call:", error);
      setCallStatus("idle");
    }
  };

  const rejectCall = () => {
    socket.emit("reject-call", { to: incomingCall.from });
    setIncomingCall(null);
    setCallStatus("idle");
  };

  const createPeerConnection = (to) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Add your TURN servers here if needed
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("send-ice-candidate", {
          to,
          from: socket.id,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      remoteVideo.current.srcObject = event.streams[0];
    };

    pc.onconnectionstatechange = () => {
      console.log("Connection state:", pc.connectionState);
    };

    return pc;
  };

  return {
    socket,
    localVideo,
    remoteVideo,
    startCall,
    incomingCall,
    answerCall,
    rejectCall,
    callStatus,
    setCallStatus,
  };
};
