import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { CircularProgress } from "@mui/material";

import { Card, Button, Container, Row, Col } from "react-bootstrap";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import NavBar from "../../../components/userNavbar/NavBar";
import ScrollToTop from "../../../components/scrollToTop/ScrollToTop";
import NoData from "../../../static/no_data.png";

const UpcomingAppointment = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, [token]); // Ensure API is refetched only when token changes

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
          color: "#82EAAC", // Light Green Text
        }}
      >
        <CircularProgress
          size={80}
          thickness={3}
          sx={{
            color: "#F49696", // Light Red Spinner
          }}
        />
        <h2 style={{ marginTop: "20px", color: "#82EAAC" }}>Loading...</h2>
      </div>
    );
  }
  const formatReadableDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  const handleCancelAppointment = async (appointmentId) => {
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

  return (
    <div style={{ marginBottom: "130px" }}>
      <NavBar />
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
                          {appointment.doctorId.lastName}
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

                      <Card.Text>
                        {formatReadableDate(appointment.scheduledDate)} •{" "}
                        {appointment.scheduledTime}
                        <span style={{ float: "right", marginRight: "30px" }}>
                          Status: {appointment.status}
                        </span>
                        <p>{appointment.mode}</p>
                        <p>Prescription / Notes</p>
                      </Card.Text>
                    </div>

                    <Button
                      style={{
                        width: "100%",
                        color: "#030E82",
                        backgroundColor: "#82EAAC",
                        fontWeight: "bold",
                      }}
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
                      >
                        Reschedule
                      </Button>
                      <Button
                        style={{
                          width: "48%",
                          backgroundColor: "#F49696",
                          fontWeight: "bold",
                        }}
                        onClick={handleCancelAppointment}
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

      <ScrollToTop />
    </div>
  );
};

export default UpcomingAppointment;
