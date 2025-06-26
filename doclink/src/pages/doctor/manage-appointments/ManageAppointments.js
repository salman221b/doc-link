import React, { useEffect, useState } from "react";
import NavBar from "../../../components/doctorNavbar/NavBar";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";

import { Card, Button, Container, Row, Col } from "react-bootstrap";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import ScrollToTop from "../../../components/scrollToTop/ScrollToTop";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const ManageAppointments = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;

  const doctorId = decoded?.id; // Extract user ID
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false); // New state for video modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [timers, setTimers] = useState({});
  const [hasUpcomingNotification, setHasUpcomingNotification] = useState(false);

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true; // Invalid token format
    }
  };

  // Redirect to login if token is invalid
  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      toast.error("Session expired. Please log in again.");
      navigate("/login");
    }
  }, [token, navigate]);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          "https://doc-link-backend.onrender.com/manage-appointments",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Role: "doctor",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch appointments. Status: ${response.status}`
          );
        }

        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  // Timer for countdown to appointments
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers = {};
      appointments.forEach((appointment) => {
        updatedTimers[appointment._id] = getTimeLeft(
          appointment.scheduledDate,
          appointment.scheduledTime
        );
      });
      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [appointments]);

  // Notification for upcoming appointments
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();

      const notifications = appointments.filter((appointment) => {
        const dateOnly = new Date(appointment.scheduledDate)
          .toISOString()
          .split("T")[0];
        const appointmentTime = new Date(
          `${dateOnly}T${appointment.scheduledTime}:00`
        );
        const timeDiff = (appointmentTime - now) / 60000; // in minutes

        return timeDiff <= 15 && timeDiff > 14; // exactly between 14-15 mins left
      });

      if (notifications.length > 0) {
        toast.info(
          `You have an appointment in 15 minutes with Dr. ${notifications[0].doctorId.firstName}`,
          {
            position: "top-right",
            autoClose: 8000,
          }
        );
      }
    };

    const interval = setInterval(checkNotifications, 60000); // check every 1 minute
    return () => clearInterval(interval);
  }, [appointments]);

  // Check for upcoming notifications
  useEffect(() => {
    const checkNotify = () => {
      const now = new Date();
      const notify = appointments.some((appointment) => {
        const dateOnly = new Date(appointment.scheduledDate)
          .toISOString()
          .split("T")[0];
        const appointmentTime = new Date(
          `${dateOnly}T${appointment.scheduledTime}:00`
        );
        const timeDiff = (appointmentTime - now) / 60000;
        return timeDiff <= 15 && timeDiff > 0;
      });
      setHasUpcomingNotification(notify);
    };

    const interval = setInterval(checkNotify, 60000);
    return () => clearInterval(interval);
  }, [appointments]);

  // Format date for display
  const formatReadableDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Cancel appointment handler
  const handleCancelAppointment = async (appointmentId) => {
    const result = await Swal.fire({
      title: "Cancel appointment?",
      text: "Are you sure you want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (!result.isConfirmed) return;
    try {
      const response = await fetch(
        `https://doc-link-backend.onrender.com/manage-appointments/${appointmentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Role: "doctor",
          },
        }
      );
      if (response.ok) {
        toast.success("Appointment cancelled successfully!");
        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment._id !== appointmentId
          )
        );
      } else {
        toast.error("Failed to cancel appointment.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Open/close reschedule modal
  const handleOpenModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  // Open/close video call modal
  const handleOpenVideoModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowVideoModal(true);
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setSelectedAppointment(null);
  };

  // Reschedule appointment handler
  const handleReschedule = async (appointmentId, updatedData) => {
    try {
      const res = await fetch(
        `https://doc-link-backend.onrender.com/manage-appointments/${appointmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Role: "patient",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!res.ok) throw new Error("Failed to reschedule");

      toast.success("Appointment rescheduled successfully");
      handleCloseModal();

      // Refresh appointments
      const response = await fetch(
        "https://doc-link-backend.onrender.com/manage-appointments",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Role: "patient",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch appointments. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Calculate time left until appointment
  const getTimeLeft = (scheduledDate, scheduledTime) => {
    const dateOnly = new Date(scheduledDate).toISOString().split("T")[0];
    const appointmentDateTime = new Date(`${dateOnly}T${scheduledTime}:00`);
    const now = new Date();
    const diff = appointmentDateTime.getTime() - now.getTime();

    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Check if it's time to join the call
  const isJoinTime = (scheduledDate, scheduledTime) => {
    const dateOnly = new Date(scheduledDate).toISOString().split("T")[0];
    const appointmentDateTime = new Date(`${dateOnly}T${scheduledTime}:00`);
    const now = new Date();
    return now >= appointmentDateTime;
  };

  // Handle join call button click
  const handleJoinCall = (appointment) => {
    if (!isJoinTime(appointment.scheduledDate, appointment.scheduledTime)) {
      toast.warning("The appointment time hasn't arrived yet");
      return;
    }
    handleOpenVideoModal(appointment);
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          color: "#82EAAC",
        }}
      >
        <CircularProgress
          size={80}
          thickness={3}
          sx={{
            color: "#F49696",
          }}
        />
        <h2 style={{ marginTop: "20px", color: "#82EAAC" }}>Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="header-text">
        <h1 className="title1">Your Practice,</h1>

        <h1 className="title2">Simplified.</h1>
        <p className="text" style={{ fontSize: "1rem", fontStyle: "italic" }}>
          Manage your appointments, patients, and medical records with ease.
        </p>
      </div>
      <div className="search-area">
        <form>
          <div
            className="searchArea"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl sx={{ width: "200px", marginTop: "-20px" }}>
              <InputLabel id="demo-simple-select-helper-label">
                Status
              </InputLabel>
              <Select
                style={{ backgroundColor: "white", borderRadius: "10px" }}
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                // value={formData.specialization}
                label="Status"
                name="status"
                // onChange={handleChange}
              >
                <MenuItem value={"all"} selected>
                  All
                </MenuItem>
                <MenuItem value={"upcoming"}>Upcoming</MenuItem>
                <MenuItem value={"completed"}>Completed</MenuItem>
                <MenuItem value={"cancelled"}>Cancelled</MenuItem>
              </Select>
            </FormControl>
            <TextField
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                marginLeft: "20px",
                marginBottom: "20px",
              }}
              id="outlined-basic"
              label="Start date"
              variant="outlined"
              type="date"
              InputLabelProps={{
                shrink: true, // This removes the default dd-mm-yyyy placeholder
              }}
            />
            <TextField
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                marginLeft: "20px",
                marginBottom: "20px",
              }}
              id="outlined-basic"
              label="End date"
              variant="outlined"
              type="date"
              InputLabelProps={{
                shrink: true, // This removes the default dd-mm-yyyy placeholder
              }}
            />
            <button
              type="submit"
              style={{
                marginLeft: "20px",
                marginBottom: "20px",
                backgroundColor: "#82EAAC",
                height: "50px",
                width: "100px",
                borderRadius: "10px",
              }}
              className="text"
            >
              Search
            </button>
          </div>
        </form>
        <div
          className="searchById"
          style={{
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            borderRadius: "10px",
            border: "1px solid ",
            borderColor: "#82EAAC",

            padding: "5px",
            width: "300px",
            margin: "0 auto",
          }}
        >
          <input
            className="text"
            type="text"
            placeholder="Enter Appointment ID"
            style={{
              width: "200px",
              border: "none",
              outline: "none",
              padding: "5px",
              // color: "#030E82",
              fontSize: "15px",
              fontWeight: "bold",
              //   marginRight: "10px",
              //   marginLeft: "10px",
              //   marginTop: "5px",
              //   marginBottom: "5px",
              backgroundColor: "transparent",
              borderRadius: "5px",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0)",
              textAlign: "center",
            }}
          />
          <ArrowForwardIcon
            className="input"
            style={{
              color: "#82EAAC",
              fontSize: "30px",
              float: "right",
              margin: "2px",
              cursor: "pointer",
              // backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderRadius: "5px",
            }}
          />
        </div>
        <Container className="mt-4">
          <Row>
            {appointments.map((appointment) => (
              <Col md={6} xs={12} key={appointment._id} className="mb-3">
                <Card>
                  <Card.Body>
                    <div
                      className="text"
                      style={{ cursor: "pointer" }}
                      onClick={() => setOpen(true)}
                    >
                      <Card.Title>
                        <PersonIcon />{" "}
                        <span style={{ marginLeft: "20px" }}>
                          {appointment.patientId.firstName}{" "}
                          {appointment.patientId.lastName} (
                          {appointment.patientId.age})
                        </span>
                      </Card.Title>
                      <Card.Text>
                        {formatReadableDate(appointment.scheduledDate)} •{" "}
                        {appointment.scheduledTime}
                        <span style={{ float: "right", marginRight: "30px" }}>
                          Status: {appointment.status}
                        </span>
                        <p>Mode: {appointment.mode}</p>
                        <p>Prescription / Notes</p>
                      </Card.Text>
                      {getTimeLeft(
                        appointment.scheduledDate,
                        appointment.scheduledTime
                      ) && (
                        <p style={{ color: "green", fontWeight: "bold" }}>
                          Starts in:{" "}
                          {getTimeLeft(
                            appointment.scheduledDate,
                            appointment.scheduledTime
                          )}
                        </p>
                      )}
                    </div>
                    <Button
                      style={{
                        width: "100%",
                        color: "#030E82",
                        backgroundColor: "#82EAAC",
                        fontWeight: "bold",
                      }}
                      hidden={appointment.mode === "In-Person Consultation"}
                      onClick={() => handleJoinCall(appointment)}
                    >
                      Join
                      <ArrowForwardIcon style={{ color: "#F49696" }} />
                    </Button>
                    <Button
                      style={{
                        width: "49%",
                        marginTop: "10px",
                        backgroundColor: "#030E82",
                        fontWeight: "bold",
                      }}
                      onClick={() => handleOpenModal(appointment)}
                    >
                      Reschedule
                    </Button>
                    <Button
                      style={{
                        width: "49%",
                        marginTop: "10px",
                        backgroundColor: "#F49696",
                        fontWeight: "bold",
                        float: "right",
                      }}
                      onClick={() => handleCancelAppointment(appointment._id)}
                    >
                      Cancel
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
        {/* Modal Component */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>
            <CloseIcon
              style={{ float: "right", cursor: "pointer" }}
              onClick={() => setOpen(false)}
              color="secondary"
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "20px",
                borderRadius: "10px",
                // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                backgroundColor: "#fff",
              }}
            >
              {/* Left: Profile Picture */}
              <PersonIcon
                alt="Profile"
                style={{
                  width: "20%",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              {/* Right: Name & Contacts */}
              <div style={{ marginLeft: "20px", width: "80%" }}>
                {appointments.map((appointment) => (
                  <div key={appointment._id}>
                    <h3 style={{ margin: "0", color: "#333" }}>
                      {appointment.patientName} ({appointment.patientAge})
                    </h3>

                    <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                      specialization: {appointment.specialization}
                    </p>
                    <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                      📞 {appointment.phone}
                    </p>
                    <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                      ✉️ {appointment.email}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div>Symptoms</div>
            <div style={{ marginTop: "20px" }}>Reason for Visit</div>
          </DialogContent>
          <DialogActions>
            <div style={{ width: "100%" }}>
              <Button
                style={{
                  width: "100%",
                  color: "#030E82",
                  backgroundColor: "#82EAAC",
                  fontWeight: "bold",
                }}
                onClick={() => {}}
              >
                Accept
              </Button>
              <br />
              <Button
                style={{
                  width: "49%",
                  marginTop: "10px",
                  backgroundColor: "#030E82",
                  fontWeight: "bold",
                }}
              >
                Reschedule
              </Button>
              <Button
                style={{
                  width: "49%",
                  marginTop: "10px",
                  backgroundColor: "#F49696",
                  fontWeight: "bold",
                  float: "right",
                }}
              >
                Cancel
              </Button>
            </div>
          </DialogActions>
        </Dialog>
        <ScrollToTop />
      </div>
    </div>
  );
};

export default ManageAppointments;
