import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

import FastBooking from "../../static//features/booking.png";
import Doctor from "../../static//features/doctor.png";
import Secure from "../../static//features/secure-data.png";
import AI from "../../static//features/ai.png";
import Devices from "../../static//features/devices.png";
import Plans from "../../static//features/plans.png";
const Features = () => {
  return (
    <div className="features">
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
        What Makes Our App Unique?
      </h4>
      <div className="services" style={{ textAlign: "center" }}>
        <Container className="mt-4">
          <Row className="justify-content-center align-items-center text-center mb-3 gap-5">
            <Col md={4} xs={12} sm={12} lg={3} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <img
                      src={FastBooking}
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
                      Easy & Fast Booking{" "}
                    </p>
                    <p> Book an appointment in seconds.</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* -------------------------------------------------------- */}
            <Col md={4} xs={12} sm={12} lg={3} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <img src={Doctor} width={100} height={100} alt="Logo" />
                  </Card.Title>
                  <Card.Text className="body">
                    <p
                      style={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: "1.2rem",
                      }}
                    >
                      Certified Doctors
                    </p>
                    <p> Consult top-rated medical professionals.</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* -------------------------------------------------------- */}
            <Col md={4} xs={12} sm={12} lg={3} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <img src={Secure} width={100} height={100} alt="Logo" />
                  </Card.Title>
                  <Card.Text className="body">
                    <p
                      style={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: "1.2rem",
                      }}
                    >
                      Secure & Private
                    </p>
                    <p>Your health data is encrypted and protected.</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* -------------------------------------------------------- */}
            <Col md={4} xs={12} sm={12} lg={3} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <img src={AI} width={100} height={100} alt="Logo" />
                  </Card.Title>
                  <Card.Text className="body">
                    <p
                      style={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: "1.2rem",
                      }}
                    >
                      AI-Powered Symptom Checker
                    </p>
                    <p> Get instant insights before a consultation.</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* -------------------------------------------------------- */}
            <Col md={4} xs={12} sm={12} lg={3} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <img src={Devices} width={100} height={100} alt="Logo" />
                  </Card.Title>
                  <Card.Text className="body">
                    <p
                      style={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: "1.2rem",
                      }}
                    >
                      Multi-Device Access
                    </p>
                    <p>Use on mobile, tablet, or desktop.</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* -------------------------------------------------------- */}
            <Col md={4} xs={12} sm={12} lg={3} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <img src={Plans} width={100} height={100} alt="Logo" />
                  </Card.Title>
                  <Card.Text className="body">
                    <p
                      style={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: "1.2rem",
                      }}
                    >
                      Affordable Healthcare Plans
                    </p>
                    <p> Flexible pricing options for all.</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* -------------------------------------------------------- */}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Features;
