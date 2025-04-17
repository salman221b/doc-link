import React, { useEffect, useState } from "react";
import NavBar from "../../../components/userNavbar/NavBar";
import { TextField } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import ScrollToTop from "../../../components/scrollToTop/ScrollToTop";
import UploadButton from "../../../components/uploadButton/UploadButton";
import { useNavigate } from "react-router-dom";

const MedicalRecords = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [medicalRecords, setMedicalRecords] = useState([]);
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
    window.scrollTo(0, 0);
    fetch("https://doc-link-backend.onrender.com/medical-records", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Role: "patient",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMedicalRecords(data);
      });
  });
  return (
    <div>
      <NavBar />
      <h1 className="title1">Your Health,</h1>
      <h1 className="title2">Just a Click Away.</h1>
      <form>
        <div
          className="searchArea"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Start date"
            variant="outlined"
            type="date"
            style={{
              marginLeft: "20px",
              marginBottom: "20px",
              backgroundColor: "white",
              borderRadius: "10px",
            }}
            InputLabelProps={{
              shrink: true, // This removes the default dd-mm-yyyy placeholder
            }}
          />
          <TextField
            id="outlined-basic"
            label="End date"
            variant="outlined"
            type="date"
            style={{
              marginLeft: "20px",
              marginBottom: "20px",
              backgroundColor: "white",
              borderRadius: "10px",
            }}
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

      <Container className="mt-4">
        <Row>
          <Col md={6} xs={12} className="mb-3">
            <Card>
              <Card.Body>
                <div className="text">
                  <Card.Title>
                    <PersonIcon />{" "}
                    <span style={{ marginLeft: "20px" }}>Name</span>
                    <span
                      style={{
                        float: "right",
                        fontSize: "15px",
                        marginRight: "30px",
                      }}
                    >
                      Specialization
                    </span>
                  </Card.Title>
                  <Card.Text>
                    Consultaion Date & Time
                    <br />
                    <TextField
                      style={{ backgroundColor: "white", borderRadius: "10px" }}
                      fullWidth
                      id="outlined-multiline-static"
                      label="Diagnosis / Summary"
                      multiline
                      rows={4}
                      defaultValue=""
                    />
                    <table style={{ width: "100%", marginTop: "10px" }}>
                      <tr>
                        <td>Prescription</td>
                        <td
                          style={{
                            textDecoration: "underline",
                            color: "blue",
                            cursor: "pointer",
                          }}
                        >
                          view
                        </td>
                        <td
                          style={{
                            textDecoration: "underline",
                            color: "blue",
                            cursor: "pointer",
                          }}
                        >
                          Download
                        </td>
                      </tr>
                      <tr>
                        <td>Lab Reports</td>
                        <td
                          style={{
                            textDecoration: "underline",
                            color: "blue",
                            cursor: "pointer",
                          }}
                        >
                          view
                        </td>
                        <td
                          style={{
                            textDecoration: "underline",
                            color: "blue",
                            cursor: "pointer",
                          }}
                        >
                          Download
                        </td>
                      </tr>
                    </table>
                    <p style={{ marginTop: "10px" }}> Next Follow-up Date</p>
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
                  View Full Details
                  <ArrowForwardIcon style={{ color: "#F49696" }} />
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <UploadButton />
      <ScrollToTop />
    </div>
  );
};

export default MedicalRecords;
