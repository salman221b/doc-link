// useVideoCall.js
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://doc-link-backend.onrender.com/");

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

      socket.emit("call-user", { to: toUserId, from: socket.id, offer });
    } catch (error) {
      console.error("Error starting call:", error);
      setCallStatus("idle");
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
    localVideo,
    remoteVideo,
    startCall,
    incomingCall,
    answerCall,
    rejectCall,
    callStatus,
  };
};
