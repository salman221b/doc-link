// VideoCall.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import "./VideoCall.css";

const VideoCall = () => {
  const { id: appointmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isCaller = !!location.state?.isCaller;
  const remoteUserId = location.state?.remoteUserId;

  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  useEffect(() => {
    console.log("VideoCall mount", { appointmentId, isCaller, remoteUserId });
    const s = io("https://doc-link-backend.onrender.com");
    socketRef.current = s;

    // Call-ended listener (other side ended)
    s.on("call-ended", ({ message, fromUserId }) => {
      console.log("Received call-ended:", message, fromUserId);
      alert(message || "Call ended by the other user.");
      cleanup();
      navigate("/dashboard");
    });

    // Optional: log incoming call-accepted/declined while on video page
    s.on("call-declined", (payload) => {
      console.log("call-declined received while on video page:", payload);
    });

    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        peerRef.current = pc;

        // Add tracks
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.ontrack = (ev) => {
          console.log("ontrack event", ev);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = ev.streams[0];
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("sending ICE candidate");
            s.emit("signal", {
              roomId: appointmentId,
              data: { candidate: event.candidate },
            });
          }
        };

        // Join signaling room (use appointmentId as room)
        s.emit("join-room", { userId: appointmentId, role: "call" });

        // Handle signaling messages
        s.on("signal", async ({ data }) => {
          console.log("signal received:", data);
          if (data.sdp) {
            // If offer: callee sets remote+answers
            if (data.sdp.type === "offer") {
              await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
              if (!isCaller) {
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                s.emit("signal", {
                  roomId: appointmentId,
                  data: { sdp: pc.localDescription },
                });
              }
            } else if (data.sdp.type === "answer") {
              // Caller sets remote answer
              await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
            }
          } else if (data.candidate) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (err) {
              console.error("Error adding candidate", err);
            }
          }
        });

        // Allow only the caller to create offer
        if (isCaller) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          s.emit("signal", { roomId: appointmentId, data: { sdp: offer } });
        }
      } catch (err) {
        console.error("Error getting media", err);
        alert("Please allow camera and microphone access.");
        navigate("/dashboard");
      }
    };

    startStream();

    return () => {
      cleanup();
      if (s) {
        s.off("call-ended");
        s.off("signal");
        s.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId, isCaller]); // remoteUserId used only by endCall

  const cleanup = () => {
    if (peerRef.current) {
      try {
        peerRef.current.close();
      } catch (e) {}
      peerRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
  };

  const endCall = () => {
    console.log("Ending call, remoteUserId:", remoteUserId);
    if (socketRef.current && remoteUserId) {
      socketRef.current.emit("end-call", { toUserId: remoteUserId });
    } else {
      console.warn("No remoteUserId available — end-call won't notify remote");
    }
    cleanup();
    navigate("/dashboard");
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
      setIsAudioMuted((p) => !p);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
      setIsVideoMuted((p) => !p);
    }
  };

  return (
    <div className="video-call-container">
      <div className="remote-video-wrapper">
        <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
        <span className="video-label">{isCaller ? "Doctor" : "Patient"}</span>
      </div>

      <div className="local-video-wrapper">
        <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
        <span className="video-label">You</span>
      </div>

      <div className="controls">
        <button onClick={toggleAudio}>{isAudioMuted ? "Unmute Audio" : "Mute Audio"}</button>
        <button onClick={toggleVideo}>{isVideoMuted ? "Start Video" : "Stop Video"}</button>
        <button onClick={endCall} className="end-call">End Call</button>
      </div>
    </div>
  );
};

export default VideoCall;
