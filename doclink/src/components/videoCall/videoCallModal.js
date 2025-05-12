import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./videoCall.css";
const VideoCallModal = ({
  show,
  onHide,
  localVideo,
  remoteVideo,
  incomingCall,
  answerCall,
  rejectCall,
  endCall,
  isCallActive,
  callerName,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isCallActive
            ? `Video Call with ${callerName}`
            : incomingCall
            ? `Incoming Call from ${callerName}`
            : "Video Call"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="video-container">
          <video
            ref={remoteVideo}
            autoPlay
            playsInline
            className="remote-video"
          />
          <video
            ref={localVideo}
            autoPlay
            playsInline
            muted
            className="local-video"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        {isCallActive ? (
          <Button variant="danger" onClick={endCall}>
            End Call
          </Button>
        ) : incomingCall ? (
          <>
            <Button variant="success" onClick={answerCall}>
              Answer
            </Button>
            <Button variant="danger" onClick={rejectCall}>
              Reject
            </Button>
          </>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
};

export default VideoCallModal;
