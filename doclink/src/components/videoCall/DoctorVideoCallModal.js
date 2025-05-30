import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorVideoCallModal = ({ open, onClose, callRequest, currentUser }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callState, setCallState] = useState("idle"); // idle, ringing, connecting, active, ended
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const socketRef = useRef();
  const peerConnectionRef = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const callTimerRef = useRef();
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds to respond

  // Handle call timer
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

  // Handle incoming call request timeout
  useEffect(() => {
    if (callState === "ringing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (callState === "ringing" && timeLeft === 0) {
      handleDeclineCall();
    }
  }, [callState, timeLeft]);

  // Format call duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Initialize socket connection
  useEffect(() => {
    if (!open) return;

    socketRef.current = io("https://doc-link-backend.onrender.com");

    // Register doctor with socket
    socketRef.current.emit("register-user", {
      userId: currentUser._id,
      userType: "doctor",
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [open, currentUser]);

  // Handle incoming call request
  useEffect(() => {
    if (!open || !callRequest) return;

    setCallState("ringing");
    setTimeLeft(30);

    const handleRequestTimeout = setTimeout(() => {
      if (callState === "ringing") {
        handleDeclineCall();
      }
    }, 30000);

    return () => clearTimeout(handleRequestTimeout);
  }, [open, callRequest]);

  // Start call after acceptance
  const startCall = async () => {
    try {
      setCallState("connecting");

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Join the room
      socketRef.current.emit("join-room", {
        roomId: callRequest.appointmentId,
        userId: currentUser._id,
        userType: "doctor",
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
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
        setCallState("active");
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit("ice-candidate", {
            roomId: callRequest.appointmentId,
            candidate: event.candidate,
            toUserId: callRequest.patientId,
          });
        }
      };

      peerConnectionRef.current = peerConnection;

      // Listen for existing users (patient already in room)
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
          roomId: callRequest.appointmentId,
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
        toast.info("Patient has left the call");
        setTimeout(() => onClose(), 3000);
      });
    } catch (error) {
      console.error("Error starting call:", error);
      setCallState("ended");
      toast.error("Failed to establish call connection");
    }
  };

  const createOffer = async (toUserId) => {
    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      socketRef.current.emit("offer", {
        roomId: callRequest.appointmentId,
        offer,
        toUserId,
      });
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error("Failed to initiate call");
    }
  };

  const handleAcceptCall = () => {
    socketRef.current.emit("call-response", {
      appointmentId: callRequest.appointmentId,
      response: "accept",
      toUserId: callRequest.patientId,
    });
    startCall();
  };

  const handleDeclineCall = () => {
    if (socketRef.current) {
      socketRef.current.emit("call-response", {
        appointmentId: callRequest.appointmentId,
        response: "decline",
        toUserId: callRequest.patientId,
      });
    }
    setCallState("ended");
    onClose();
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
        roomId: callRequest?.appointmentId,
        userId: currentUser._id,
      });
    }
    setCallState("ended");
    onClose();
  };

  // Clean up resources
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  return (
    <Dialog open={open} onClose={handleDeclineCall} fullWidth maxWidth="md">
      <DialogTitle>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            {callState === "ringing" && `Incoming Call (${timeLeft}s)`}
            {callState === "connecting" && "Connecting to patient..."}
            {callState === "active" &&
              `Consultation with ${callRequest?.patientName} (${formatDuration(
                callDuration
              )})`}
            {callState === "ended" && "Call ended"}
          </span>
          {callState !== "ringing" && (
            <IconButton onClick={handleEndCall}>
              <CloseIcon />
            </IconButton>
          )}
        </div>
      </DialogTitle>
      <DialogContent>
        {callState === "ringing" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "300px",
              textAlign: "center",
            }}
          >
            <h3>Incoming Video Call</h3>
            <p style={{ fontSize: "1.1rem", margin: "10px 0" }}>
              From: {callRequest?.patientName}
            </p>
            <p style={{ marginBottom: "30px" }}>
              Appointment ID: {callRequest?.appointmentId}
            </p>
            <div style={{ display: "flex", gap: "20px" }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleAcceptCall}
                style={{ padding: "10px 24px" }}
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeclineCall}
                style={{ padding: "10px 24px" }}
              >
                Decline
              </Button>
            </div>
          </div>
        ) : callState === "connecting" ? (
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
              Connecting to patient...
            </p>
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
                  Waiting for patient's video...
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
                <Button
                  variant={isVideoOn ? "contained" : "outlined"}
                  color={isVideoOn ? "primary" : "error"}
                  onClick={toggleVideo}
                  startIcon={isVideoOn ? "🎥" : "❌"}
                >
                  {isVideoOn ? "Video On" : "Video Off"}
                </Button>
                <Button
                  variant={isAudioOn ? "contained" : "outlined"}
                  color={isAudioOn ? "primary" : "error"}
                  onClick={toggleAudio}
                  startIcon={isAudioOn ? "🎤" : "❌"}
                >
                  {isAudioOn ? "Audio On" : "Audio Off"}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleEndCall}
                  startIcon="📞"
                >
                  End Call
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DoctorVideoCallModal;
