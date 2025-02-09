import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import videoConsultaion from "../../static/services/video-consultaion.png";
import appointment from "../../static/services/appointment.png";
import MedicalRecords from "../../static/services/Medical-Records.png";
import Prescriptions from "../../static/services/prescription.png";
import HealthTips from "../../static/services/epidemic-prevention.png";
import Support from "../../static/services/technical-support.png";

import FastBooking from "../../static//features/booking.png";
import Doctor from "../../static//features/doctor.png";
import Secure from "../../static//features/secure-data.png";
import AI from "../../static//features/ai.png";
import Devices from "../../static//features/devices.png";
import Plans from "../../static//features/plans.png";

const Services = () => {
  return (
    <div id="services">
      <div className="explore-services">
        <h4
          style={{ color: "#030E82", fontWeight: "bold", fontStyle: "italic" }}
        >
          Explore Our Services
        </h4>
        <div className="services" style={{ textAlign: "center" }}>
          <Container className="mt-4">
            <Row className="justify-content-center align-items-center text-center mb-3 gap-5">
              <Col md={4} xs={12} sm={12} lg={3} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={videoConsultaion}
                        width={100}
                        height={100}
                        alt="Logo"
                      />
                    </Card.Title>
                    <Card.Text>
                      <p
                        style={{
                          fontWeight: "bold",
                          color: "#030E82",
                          fontStyle: "italic",
                          fontSize: "1.2rem",
                        }}
                      >
                        Virtual Consultations
                      </p>
                      <p>Connect with doctors via video or chat.</p>
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
                        src={appointment}
                        width={100}
                        height={100}
                        alt="Logo"
                      />
                    </Card.Title>
                    <Card.Text>
                      <p
                        style={{
                          fontWeight: "bold",
                          color: "#030E82",
                          fontStyle: "italic",
                          fontSize: "1.2rem",
                        }}
                      >
                        Book Appointments
                      </p>
                      <p>Schedule in-person or online doctor visits.</p>
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
                        src={MedicalRecords}
                        width={100}
                        height={100}
                        alt="Logo"
                      />
                    </Card.Title>
                    <Card.Text>
                      <p
                        style={{
                          fontWeight: "bold",
                          color: "#030E82",
                          fontStyle: "italic",
                          fontSize: "1.2rem",
                        }}
                      >
                        Medical Records
                      </p>
                      <p>Securely store and access health history.</p>
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
                        src={Prescriptions}
                        width={100}
                        height={100}
                        alt="Logo"
                      />
                    </Card.Title>
                    <Card.Text>
                      <p
                        style={{
                          fontWeight: "bold",
                          color: "#030E82",
                          fontStyle: "italic",
                          fontSize: "1.2rem",
                        }}
                      >
                        E-Prescriptions
                      </p>
                      <p> Get prescriptions digitally from doctors.</p>
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
                        src={HealthTips}
                        width={100}
                        height={100}
                        alt="Logo"
                      />
                    </Card.Title>
                    <Card.Text>
                      <p
                        style={{
                          fontWeight: "bold",
                          color: "#030E82",
                          fontStyle: "italic",
                          fontSize: "1.2rem",
                        }}
                      >
                        Health Tips & News
                      </p>
                      <p>Stay updated with expert healthcare insights.</p>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              {/* -------------------------------------------------------- */}
              <Col md={4} xs={12} sm={12} lg={3} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>
                      <img src={Support} width={100} height={100} alt="Logo" />
                    </Card.Title>
                    <Card.Text>
                      <p
                        style={{
                          fontWeight: "bold",
                          color: "#030E82",
                          fontStyle: "italic",
                          fontSize: "1.2rem",
                        }}
                      >
                        24/7 Support
                      </p>
                      <p>Access healthcare assistance anytime.</p>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              {/* -------------------------------------------------------- */}
            </Row>
          </Container>
        </div>
      </div>

      {/* ----What Makes Your App Unique?---------------------------------------------------------------------------------------------------------------------------------- */}
      <div className="features">
        <h4
          style={{ color: "#030E82", fontWeight: "bold", fontStyle: "italic" }}
        >
          Explore Our Services
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
                    <Card.Text>
                      <p
                        style={{
                          fontWeight: "bold",
                          color: "#030E82",
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
                    <Card.Text>
                      <p
                        style={{
                          fontWeight: "bold",
                          color: "#030E82",
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
                    <Card.Text>
                      <p
                        style={{
                          fontWeight: "bold",
                          color: "#030E82",
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
                    <Card.Text>
                      <p
                        style={{
                          fontWeight: "bold",
                          color: "#030E82",
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
                    <Card.Text>
                      <p
                        style={{
                          fontWeight: "bold",
                          color: "#030E82",
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
                    <Card.Text>
                      <p
                        style={{
                          fontWeight: "bold",
                          color: "#030E82",
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
    </div>
  );
};

export default Services;
