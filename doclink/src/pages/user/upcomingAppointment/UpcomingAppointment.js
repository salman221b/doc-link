import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NoData from "../../../static/no_data.png";
import NavBar from "../../../components/userNavbar/NavBar";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import ScrollToTop from "../../../components/scrollToTop/ScrollToTop";

const UpcomingAppointment = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = JSON.parse(atob(token.split(".")[1]));

    return decoded.exp * 1000 < Date.now();
  };

  // Redirect if token is invalid
  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      console.error("Token expired. Redirecting to login...");
      navigate("/login");
    }
  }, [token, navigate]);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          "https://doc-link-backend.onrender.com/appointments",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
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
  }, []);

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <NavBar />
      <h1 className="title1">Your Health,</h1>
      <h1 className="title2">Just a Click Away.</h1>
      <h2
        className="text"
        style={{ textAlign: "center", marginBottom: "30px", marginTop: "30px" }}
      >
        Upcoming Appointments
      </h2>
      <form>
        <div
          className="searchArea "
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl sx={{ width: "200px", marginTop: "-20px" }}>
            <InputLabel id="demo-simple-select-helper-label">Mode</InputLabel>
            <Select
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
              }}
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              // value={formData.specialization}
              label="Mode"
              name="mode"
              // onChange={handleChange}
            >
              <MenuItem value={"in-person"} selected>
                In-person
              </MenuItem>
              <MenuItem value={"video-consultation"}>
                Video consultation
              </MenuItem>
              <MenuItem value={"tele-consultation"}>Tele consultation</MenuItem>
            </Select>
            {/* <FormHelperText>With label + helper text</FormHelperText> */}
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
            className="searchButton"
            type="submit"
            style={{
              marginLeft: "20px",
              marginBottom: "20px",
              backgroundColor: "#82EAAC",
              color: "#030E82",
              height: "50px",
              width: "100px",
              borderRadius: "10px",
            }}
          >
            Search
            <ArrowForwardIcon />
          </button>
        </div>
      </form>
      {appointments.length === 0 ? (
        <>
          <img
            src={NoData}
            alt="No Data"
            style={{ width: "300px", display: "block", margin: "auto" }}
          />
          <p
            className="text"
            style={{
              textAlign: "center",
              marginBottom: "80px",
              marginTop: "20px",
            }}
          >
            Oops, No upcoming appointments !
          </p>
        </>
      ) : (
        <Container className="mt-4">
          <Row>
            {appointments.map((appointment) => (
              <Col md={6} xs={12} className="mb-3">
                <Card key={appointment._id}>
                  <Card.Body>
                    <div className="text">
                      <Card.Title>
                        <PersonIcon />{" "}
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
                        {appointment.scheduledDate}. {appointment.scheduledTime}
                        <span style={{ float: "right", marginRight: "30px" }}>
                          {appointment.status}
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
