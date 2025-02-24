import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

import SignUp from "../../static/works/signUp.png";
import DoctorIcon from "../../static/works/doctor.png";
import VideoCall from "../../static/works/video-call.png";
import Prescription from "../../static/works/prescription.png";
import Wellness from "../../static/works/better-health.png";
const HowItWorks = () => {
  return (
    <div className="how-it-works">
      <hr />
      <h4
        className="text"
        style={{
          fontWeight: "bold",
          fontStyle: "italic",
          textAlign: "center",
          marginTop: "50px",
          marginBottom: "50px",
        }}
      >
        How It Works?
      </h4>
      <div className="services" style={{ textAlign: "center" }}>
        <Container className="mt-4">
          <Row className="justify-content-center align-items-center text-center mb-3 gap-5">
            <Col md={4} xs={12} sm={12} lg={3} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <img src={SignUp} width={100} height={100} alt="Logo" />
                  </Card.Title>
                  <Card.Text className="body">
                    <p
                      style={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: "1.2rem",
                      }}
                    >
                      1. Sign Up & Create Your Profile
                    </p>
                    <p>
                      Register with your email/phone and set up your health
                      profile.
                    </p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* -------------------------------------------------------- */}
            <Col md={4} xs={12} sm={12} lg={3} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <img src={DoctorIcon} width={100} height={100} alt="Logo" />
                  </Card.Title>
                  <Card.Text className="body">
                    <p
                      style={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: "1.2rem",
                      }}
                    >
                      2. Choose a Doctor & Book an Appointment
                    </p>
                    <p>
                      Browse top doctors by specialty and book your
                      consultation.
                    </p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* -------------------------------------------------------- */}
            <Col md={4} xs={12} sm={12} lg={3} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <img src={VideoCall} width={100} height={100} alt="Logo" />
                  </Card.Title>
                  <Card.Text className="body">
                    <p
                      style={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: "1.2rem",
                      }}
                    >
                      3. Connect via Video or Chat
                    </p>
                    <p>
                      {" "}
                      Join a secure video call or chat for expert medical
                      advice.
                    </p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* -------------------------------------------------------- */}
            <Col md={4} xs={12} sm={12} lg={3} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <img
                      src={Prescription}
                      width={100}
                      height={100}
                      alt="Logo"
                    />
                  </Card.Title>
                  <Card.Text className="body">
                    <p
                      style={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: "1.2rem",
                      }}
                    >
                      4. Get Your Prescription & Health Records
                    </p>
                    <p>
                      Receive digital prescriptions and access medical records
                      anytime.
                    </p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* -------------------------------------------------------- */}
            <Col md={4} xs={12} sm={12} lg={3} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <img src={Wellness} width={100} height={100} alt="Logo" />
                  </Card.Title>
                  <Card.Text className="body">
                    <p
                      style={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: "1.2rem",
                      }}
                    >
                      5. Follow Up & Stay Healthy
                    </p>
                    <p>
                      {" "}
                      Schedule follow-ups, track progress, and get health tips.
                    </p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HowItWorks;
