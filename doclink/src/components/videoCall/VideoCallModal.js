import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const VideoCallModal = ({ open, onClose, appointment, currentUser }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callStatus, setCallStatus] = useState("Connecting...");
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const socketRef = useRef();
  const peerConnectionRef = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  // Initialize call
  useEffect(() => {
    if (!open) return;

    const initCall = async () => {
      try {
        // Initialize socket connection
        socketRef.current = io("http://localhost:5000");

        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;

        // Join room
        const roomId = appointment._id;
        const userId = currentUser._id;
        const userType = currentUser.role;

        socketRef.current.emit("join-room", { roomId, userId, userType });

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
          setCallStatus("Call connected");
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.emit("ice-candidate", {
              roomId,
              candidate: event.candidate,
              toUserId:
                appointment[
                  currentUser.role === "doctor" ? "patient" : "doctor"
                ]._id,
            });
          }
        };

        peerConnectionRef.current = peerConnection;

        // Socket event listeners
        socketRef.current.on("existing-users", (users) => {
          if (users.length > 0) {
            createOffer(users[0].userId);
          }
        });

        socketRef.current.on("user-connected", (user) => {
          if (user.userId !== userId) {
            createOffer(user.userId);
          }
        });

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
          setCallStatus("Other participant left");
          setTimeout(() => onClose(), 3000);
        });
      } catch (error) {
        console.error("Error initializing call:", error);
        setCallStatus("Error connecting");
        toast.error("Failed to start video call");
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
    socketRef.current.emit("leave-room", {
      roomId: appointment._id,
      userId: currentUser._id,
    });
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
          <span>Video Consultation - {callStatus}</span>
          <IconButton onClick={handleEndCall}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
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
            {!remoteStream && (
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
                {callStatus}
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

          {/* Controls */}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallModal;
