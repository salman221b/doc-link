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
import ScrollToTop from "../../../components/scrollToTop/ScrollToTop";

const UpcomingAppointment = () => {
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
          <FormControl sx={{ width: "200px", marginTop: "-20px" }}>
            <InputLabel id="demo-simple-select-helper-label">Mode</InputLabel>
            <Select
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
            id="outlined-basic"
            label="Start date"
            variant="outlined"
            type="date"
            style={{ marginLeft: "20px", marginBottom: "20px" }}
            InputLabelProps={{
              shrink: true, // This removes the default dd-mm-yyyy placeholder
            }}
          />
          <TextField
            id="outlined-basic"
            label="End date"
            variant="outlined"
            type="date"
            style={{ marginLeft: "20px", marginBottom: "20px" }}
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
                  Appointment date & time{" "}
                  <span style={{ float: "right", marginRight: "30px" }}>
                    Status
                  </span>
                  <p>Mode (Video Call / In-Person)</p>
                  <p>Prescription / Notes</p>
                </Card.Text>
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

          <Col md={6} xs={12} className="mb-3">
            <Card>
              <Card.Body>
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
                  Appointment date & time{" "}
                  <span style={{ float: "right", marginRight: "30px" }}>
                    Status
                  </span>
                  <p>Mode (Video Call / In-Person)</p>
                  <p>Prescription / Notes</p>
                </Card.Text>
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

          <Col md={6} xs={12} className="mb-3">
            <Card>
              <Card.Body>
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
                  Appointment date & time{" "}
                  <span style={{ float: "right", marginRight: "30px" }}>
                    Status
                  </span>
                  <p>Mode (Video Call / In-Person)</p>
                  <p>Prescription / Notes</p>
                </Card.Text>
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

          <Col md={6} xs={12} className="mb-3">
            <Card>
              <Card.Body>
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
                  Appointment date & time{" "}
                  <span style={{ float: "right", marginRight: "30px" }}>
                    Status
                  </span>
                  <p>Mode (Video Call / In-Person)</p>
                  <p>Prescription / Notes</p>
                </Card.Text>
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

          <Col md={6} xs={12} className="mb-3">
            <Card>
              <Card.Body>
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
                  Appointment date & time{" "}
                  <span style={{ float: "right", marginRight: "30px" }}>
                    Status
                  </span>
                  <p>Mode (Video Call / In-Person)</p>
                  <p>Prescription / Notes</p>
                </Card.Text>
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
        </Row>
      </Container>
      <ScrollToTop />
    </div>
  );
};

export default UpcomingAppointment;
