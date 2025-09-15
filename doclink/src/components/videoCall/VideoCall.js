import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import "./VideoCall.css";

const VideoCall = () => {
  const { id: appointmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isCaller = location.state?.isCaller; // ✅ get caller/callee flag

  const [socket, setSocket] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const s = io("https://doc-link-backend.onrender.com");
    setSocket(s);

    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        peerRef.current = pc;

        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            s.emit("signal", {
              roomId: appointmentId,
              data: { candidate: event.candidate },
            });
          }
        };

        s.emit("join-room", { userId: appointmentId, role: "call" });

        // Handle incoming signal
        s.on("signal", async ({ data }) => {
          if (data.sdp) {
            await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));

            if (data.sdp.type === "offer" && !isCaller) {
              // ✅ Only callee answers
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              s.emit("signal", {
                roomId: appointmentId,
                data: { sdp: pc.localDescription },
              });
            }
          } else if (data.candidate) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (err) {
              console.error("Error adding candidate", err);
            }
          }
        });

        // ✅ Only caller creates the offer
        if (isCaller) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          s.emit("signal", { roomId: appointmentId, data: { sdp: offer } });
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
        alert("Please allow camera and microphone access.");
        navigate("/dashboard");
      }
    };

    startStream();

    return () => {
      if (peerRef.current) peerRef.current.close();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      s.disconnect();
    };
  }, [appointmentId, navigate, isCaller]);

  const toggleAudio = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioMuted((prev) => !prev);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoMuted((prev) => !prev);
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
        <button onClick={toggleAudio}>
          {isAudioMuted ? "Unmute Audio" : "Mute Audio"}
        </button>
        <button onClick={toggleVideo}>
          {isVideoMuted ? "Start Video" : "Stop Video"}
        </button>
        <button onClick={() => navigate("/dashboard")} className="end-call">
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
