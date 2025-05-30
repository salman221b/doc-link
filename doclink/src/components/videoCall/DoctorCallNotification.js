// components/CallNotification.js
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";

const CallNotification = ({ callRequest, onResponse }) => {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds to respond

  useEffect(() => {
    if (callRequest) {
      setOpen(true);
      setTimeLeft(30);

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleResponse("decline");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [callRequest]);

  const handleResponse = (response) => {
    onResponse(response);
    setOpen(false);
  };

  if (!callRequest) return null;

  return (
    <Dialog open={open} onClose={() => handleResponse("decline")}>
      <DialogTitle>Incoming Video Call</DialogTitle>
      <DialogContent>
        <p>
          Patient {callRequest.patientName} is requesting a video consultation.
        </p>
        <p>Time remaining: {timeLeft} seconds</p>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handleResponse("accept")}
          color="primary"
          variant="contained"
        >
          Accept
        </Button>
        <Button
          onClick={() => handleResponse("decline")}
          color="secondary"
          variant="outlined"
        >
          Decline
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CallNotification;
