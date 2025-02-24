import React from "react";
import NavBar from "../../../components/userNavbar/NavBar";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const Prescriptions = () => {
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
                    <p style={{ marginTop: "10px" }}>Prescribed Medicines:</p>
                    <ol>
                      <li>
                        Name <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Dosage & Instructions
                        </span>
                        <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Validity / Expiry Date{" "}
                        </span>
                      </li>
                      <li>
                        Name <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Dosage & Instructions
                        </span>
                        <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Validity / Expiry Date{" "}
                        </span>
                      </li>
                      <li>
                        Name <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Dosage & Instructions
                        </span>
                        <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Validity / Expiry Date{" "}
                        </span>
                      </li>
                    </ol>
                    <p style={{ marginTop: "10px" }}> Next Follow-up Date : </p>
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
                  Download
                  <ArrowForwardIcon style={{ color: "#F49696" }} />
                </Button>
              </Card.Body>
            </Card>
          </Col>

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
                    <p style={{ marginTop: "10px" }}>Prescribed Medicines:</p>
                    <ol>
                      <li>
                        Name <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Dosage & Instructions
                        </span>
                        <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Validity / Expiry Date{" "}
                        </span>
                      </li>
                      <li>
                        Name <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Dosage & Instructions
                        </span>
                        <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Validity / Expiry Date{" "}
                        </span>
                      </li>
                      <li>
                        Name <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Dosage & Instructions
                        </span>
                        <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Validity / Expiry Date{" "}
                        </span>
                      </li>
                    </ol>
                    <p style={{ marginTop: "10px" }}> Next Follow-up Date : </p>
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
                  Download
                  <ArrowForwardIcon style={{ color: "#F49696" }} />
                </Button>
              </Card.Body>
            </Card>
          </Col>

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
                    <p style={{ marginTop: "10px" }}>Prescribed Medicines:</p>
                    <ol>
                      <li>
                        Name <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Dosage & Instructions
                        </span>
                        <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Validity / Expiry Date{" "}
                        </span>
                      </li>
                      <li>
                        Name <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Dosage & Instructions
                        </span>
                        <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Validity / Expiry Date{" "}
                        </span>
                      </li>
                      <li>
                        Name <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Dosage & Instructions
                        </span>
                        <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Validity / Expiry Date{" "}
                        </span>
                      </li>
                    </ol>
                    <p style={{ marginTop: "10px" }}> Next Follow-up Date : </p>
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
                  Download
                  <ArrowForwardIcon style={{ color: "#F49696" }} />
                </Button>
              </Card.Body>
            </Card>
          </Col>

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
                    <p style={{ marginTop: "10px" }}>Prescribed Medicines:</p>
                    <ol>
                      <li>
                        Name <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Dosage & Instructions
                        </span>
                        <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Validity / Expiry Date{" "}
                        </span>
                      </li>
                      <li>
                        Name <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Dosage & Instructions
                        </span>
                        <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Validity / Expiry Date{" "}
                        </span>
                      </li>
                      <li>
                        Name <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Dosage & Instructions
                        </span>
                        <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Validity / Expiry Date{" "}
                        </span>
                      </li>
                    </ol>
                    <p style={{ marginTop: "10px" }}> Next Follow-up Date : </p>
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
                  Download
                  <ArrowForwardIcon style={{ color: "#F49696" }} />
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Prescriptions;
