import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import NavBar from "../../../components/userNavbar/NavBar";
import ScrollToTop from "../../../components/scrollToTop/ScrollToTop";
import NoData from "../../../static/no_data.png";
import RescheduleModal from "./RescheduleModal";
import { io } from "socket.io-client";
const socket = io("https://doc-link-backend.onrender.com");

const UpcomingAppointment = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false); // New state for video modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [timers, setTimers] = useState({});
  const [hasUpcomingNotification, setHasUpcomingNotification] = useState(false);

  // Check if the token is expired
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

  // Fetch upcoming appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          "https://doc-link-backend.onrender.com/appointments",
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
        `https://doc-link-backend.onrender.com/appointments/${appointmentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Role: "patient",
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
        `https://doc-link-backend.onrender.com/appointments/${appointmentId}`,
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
        "https://doc-link-backend.onrender.com/appointments",
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

  // Handle join call button click
  const handleJoinCall = (appointment) => {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const userId = decoded.id;
    const patientName = decoded.name || "Patient";

    if (appointment.status !== "Accepted") {
      toast.warning("Appointment not yet accepted by doctor.");
      return;
    }

    // ✅ Step 3: Restrict joining time window
    // const dateOnly = new Date(appointment.scheduledDate)
    //   .toISOString()
    //   .split("T")[0];
    // const appointmentDateTime = new Date(
    //   `${dateOnly}T${appointment.scheduledTime}:00`
    // );
    // const now = new Date();
    // const minutesUntilStart = (appointmentDateTime - now) / 60000;

    // if (minutesUntilStart > 5) {
    //   // e.g., allow only 5 mins before start
    //   toast.warning(
    //     "You can only join the call within 5 minutes of your appointment."
    //   );
    //   return;
    // }
    // if (minutesUntilStart < -30) {
    //   // e.g., disallow if more than 30 mins late
    //   toast.warning("This appointment has already ended.");
    //   return;
    // }

    socket.emit("call-request", {
      doctorId: appointment.doctorId._id,
      appointmentId: appointment._id,
      patientName,
      fromUserId: userId,
    });

    toast.info("Calling doctor...");
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
    <div style={{ marginBottom: "130px" }}>
      <NavBar hasNotification={hasUpcomingNotification} />
      <h1 className="title1">Your Health,</h1>
      <h1 className="title2">Just a Click Away.</h1>

      <h2 className="text" style={{ textAlign: "center", margin: "30px 0" }}>
        Upcoming Appointments
      </h2>

      {/* No Appointments Case */}
      {appointments.length === 0 ? (
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <img
            src={NoData}
            alt="No Data"
            style={{ width: "300px", display: "block", margin: "auto" }}
          />
          <p className="text" style={{ marginTop: "20px" }}>
            Oops, No upcoming appointments!
          </p>
        </div>
      ) : (
        <Container className="mt-4">
          <Row>
            {appointments.map((appointment) => (
              <Col md={6} xs={12} key={appointment._id} className="mb-3">
                <Card>
                  <Card.Body>
                    <div className="text">
                      <Card.Title>
                        <PersonIcon />
                        <span style={{ marginLeft: "20px" }}>
                          {appointment.doctorId.firstName}{" "}
                          {appointment.doctorId.lastName}{" "}
                          <span
                            style={{ fontSize: ".9rem", fontStyle: "italic" }}
                          >
                            {appointment.doctorId.qualification}
                          </span>
                        </span>
                        <span
                          style={{
                            float: "right",
                            fontSize: "15px",
                            marginRight: "30px",
                          }}
                        >
                          {appointment.specialization}
                        </span>
                      </Card.Title>
                      <hr />

                      <Card.Text>
                        {formatReadableDate(appointment.scheduledDate)} •{" "}
                        {appointment.scheduledTime}
                        <span
                          style={{
                            float: "right",
                            marginRight: "30px",
                            color:
                              appointment.status === "Accepted"
                                ? "green"
                                : appointment.status === "Cancelled"
                                ? "red"
                                : "",
                          }}
                        >
                          Status: {appointment.status}
                        </span>
                        <p>Mode: {appointment.mode}</p>
                        <p>Reason: {appointment.reason}</p>
                        <p>Symptoms: {appointment.symptoms}</p>
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

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                      }}
                    >
                      <Button
                        style={{
                          width: "48%",
                          backgroundColor: "#030E82",
                          fontWeight: "bold",
                        }}
                        onClick={() => handleOpenModal(appointment)}
                      >
                        Reschedule
                      </Button>
                      <Button
                        style={{
                          width: "48%",
                          backgroundColor: "#F49696",
                          fontWeight: "bold",
                        }}
                        onClick={() => handleCancelAppointment(appointment._id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {/* Modals */}
      <RescheduleModal
        show={showModal}
        handleClose={handleCloseModal}
        appointment={selectedAppointment}
        onReschedule={handleReschedule}
      />

      <ScrollToTop />
    </div>
  );
};

export default UpcomingAppointment;
