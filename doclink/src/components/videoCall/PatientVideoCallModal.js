import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VideoCallModal = ({ open, onClose, appointment, currentUser }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callState, setCallState] = useState("initiating"); // initiating, requesting, connecting, active, declined, ended
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const socketRef = useRef();
  const peerConnectionRef = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const callTimerRef = useRef();

  // Start/stop call timer
  useEffect(() => {
    if (callState === "active") {
      const startTime = Date.now();
      callTimerRef.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      clearInterval(callTimerRef.current);
    }

    return () => clearInterval(callTimerRef.current);
  }, [callState]);

  // Format call duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Initialize call
  useEffect(() => {
    if (!open) return;

    const initCall = async () => {
      try {
        setCallState("initiating");
        socketRef.current = io("https://doc-link-backend.onrender.com");

        // Register user with socket
        socketRef.current.emit("register-user", {
          userId: currentUser._id,
          userType: currentUser.role,
        });

        // Request call with doctor
        setCallState("requesting");
        socketRef.current.emit("request-call", {
          appointmentId: appointment._id,
          userId: currentUser._id,
          patientName: `${currentUser.firstName} ${currentUser.lastName}`,
        });

        // Set timeout for call request (60 seconds)
        const requestTimeout = setTimeout(() => {
          if (callState === "requesting") {
            setCallState("ended");
            toast.error("Doctor did not respond to your call request");
            setTimeout(() => onClose(), 3000);
          }
        }, 60000);

        // Listen for doctor's response
        socketRef.current.on("call-accepted", ({ appointmentId }) => {
          clearTimeout(requestTimeout);
          setCallState("connecting");
          startCall(appointmentId);
        });

        socketRef.current.on("call-declined", ({ appointmentId }) => {
          clearTimeout(requestTimeout);
          setCallState("declined");
          toast.warning("Doctor declined your call request");
          setTimeout(() => onClose(), 3000);
        });

        // Handle connection errors
        socketRef.current.on("connect_error", (err) => {
          setCallState("ended");
          toast.error("Connection error: " + err.message);
        });
      } catch (error) {
        console.error("Error initializing call:", error);
        setCallState("ended");
        toast.error("Failed to start video call");
      }
    };

    const startCall = async (roomId) => {
      try {
        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;

        // Join the room
        socketRef.current.emit("join-room", {
          roomId,
          userId: currentUser._id,
          userType: currentUser.role,
        });

        // Set up WebRTC peer connection
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            // Add TURN servers if needed
          ],
        });

        // Add local stream to connection
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

        // Handle remote stream
        peerConnection.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
          remoteVideoRef.current.srcObject = event.streams[0];
          setCallState("active");
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.emit("ice-candidate", {
              roomId,
              candidate: event.candidate,
              toUserId: appointment.doctor._id,
            });
          }
        };

        peerConnectionRef.current = peerConnection;

        // Listen for existing users (doctor already in room)
        socketRef.current.on("existing-users", (users) => {
          if (users.length > 0) {
            createOffer(users[0].userId);
          }
        });

        // Listen for WebRTC signaling
        socketRef.current.on("offer", async ({ offer, fromUserId }) => {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(offer)
          );
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          socketRef.current.emit("answer", {
            roomId,
            answer,
            toUserId: fromUserId,
          });
        });

        socketRef.current.on("answer", async ({ answer, fromUserId }) => {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        });

        socketRef.current.on(
          "ice-candidate",
          async ({ candidate, fromUserId }) => {
            if (candidate) {
              try {
                await peerConnection.addIceCandidate(
                  new RTCIceCandidate(candidate)
                );
              } catch (error) {
                console.error("Error adding ICE candidate:", error);
              }
            }
          }
        );

        socketRef.current.on("user-disconnected", () => {
          setCallState("ended");
          toast.info("Doctor has left the call");
          setTimeout(() => onClose(), 3000);
        });
      } catch (error) {
        console.error("Error starting call:", error);
        setCallState("ended");
        toast.error("Failed to establish call connection");
      }
    };

    initCall();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [open, appointment, currentUser]);

  const createOffer = async (toUserId) => {
    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      socketRef.current.emit("offer", {
        roomId: appointment._id,
        offer,
        toUserId,
      });
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error("Failed to initiate call");
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const handleEndCall = () => {
    if (socketRef.current) {
      socketRef.current.emit("leave-room", {
        roomId: appointment._id,
        userId: currentUser._id,
      });
    }
    setCallState("ended");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleEndCall} fullWidth maxWidth="md">
      <DialogTitle>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            {callState === "requesting" && "Requesting call with doctor..."}
            {callState === "connecting" && "Connecting to doctor..."}
            {callState === "active" &&
              `Video Consultation (${formatDuration(callDuration)})`}
            {callState === "declined" && "Call declined"}
            {callState === "ended" && "Call ended"}
          </span>
          <IconButton onClick={handleEndCall}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        {callState === "requesting" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "300px",
            }}
          >
            <CircularProgress size={60} />
            <p style={{ marginTop: "20px", fontSize: "1.2rem" }}>
              Waiting for doctor to accept your call...
            </p>
            <Button
              variant="outlined"
              color="error"
              onClick={handleEndCall}
              style={{ marginTop: "20px" }}
            >
              Cancel Request
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              position: "relative",
            }}
          >
            {/* Remote Video */}
            <div
              style={{
                width: "100%",
                height: "400px",
                backgroundColor: "#000",
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {!remoteStream && callState === "active" && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    backgroundColor: "rgba(0,0,0,0.7)",
                  }}
                >
                  Waiting for doctor's video...
                </div>
              )}
            </div>

            {/* Local Video */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                width: "160px",
                height: "120px",
                borderRadius: "8px",
                overflow: "hidden",
                border: "2px solid white",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              }}
            >
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "rotateY(180deg)",
                  backgroundColor: !isVideoOn ? "#333" : "transparent",
                }}
              />
            </div>

            {/* Controls - Only show when call is active */}
            {callState === "active" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "16px",
                  marginTop: "16px",
                }}
              >
                <button
                  onClick={toggleVideo}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: isVideoOn ? "#4CAF50" : "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {isVideoOn ? "Video On" : "Video Off"}
                </button>
                <button
                  onClick={toggleAudio}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: isAudioOn ? "#4CAF50" : "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {isAudioOn ? "Audio On" : "Audio Off"}
                </button>
                <button
                  onClick={handleEndCall}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  End Call
                </button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallModal;
