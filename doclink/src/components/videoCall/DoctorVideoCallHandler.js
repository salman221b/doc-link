import { useEffect } from "react";
import { useVideoCall } from "./useVideoCall";
import VideoCallModal from "./videoCallModal";

const DoctorVideoCallHandler = () => {
  const {
    localVideo,
    remoteVideo,
    incomingCall,
    answerCall,
    rejectCall,
    callStatus,
  } = useVideoCall();

  return (
    <VideoCallModal
      show={!!incomingCall || callStatus === "in-call"}
      onHide={rejectCall}
      localVideo={localVideo}
      remoteVideo={remoteVideo}
      incomingCall={incomingCall}
      answerCall={answerCall}
      rejectCall={rejectCall}
      endCall={rejectCall} // Same as reject for now
      isCallActive={callStatus === "in-call"}
      callerName={incomingCall ? "Patient" : ""}
    />
  );
};

export default DoctorVideoCallHandler;
