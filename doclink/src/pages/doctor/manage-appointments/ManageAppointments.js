import React, { useState } from "react";
import NavBar from "../../../components/doctorNavbar/NavBar";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
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
import DoctorVideoCallHandler from "../../../components/videoCall/DoctorVideoCallHandler";

const ManageAppointments = () => {
  const [open, setOpen] = useState(false); // State to track modal visibility

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
            <Col md={6} xs={12} className="mb-3">
              <Card>
                <Card.Body>
                  <div
                    className="text"
                    style={{ cursor: "pointer" }}
                    onClick={() => setOpen(true)}
                  >
                    <Card.Title>
                      <PersonIcon />{" "}
                      <span style={{ marginLeft: "20px" }}>Patient Name</span>
                    </Card.Title>
                    <Card.Text>
                      Appointment date & time{" "}
                      <span style={{ float: "right", marginRight: "30px" }}>
                        Status
                      </span>
                      <p>Mode (Video Call / In-Person)</p>
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
                    onClick={() => {
                      alert(" join clicked");
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
                <h3 style={{ margin: "0", color: "#333" }}>
                  Patient Name (Age)
                </h3>
                <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                  Medical Condition
                </p>
                <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                  📞 +91 98765 43210
                </p>
                <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                  ✉️ johndoe@email.com
                </p>
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
                onClick={() => {
                  alert(" join clicked");
                }}
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

        <DoctorVideoCallHandler />
        <ScrollToTop />
      </div>
    </div>
  );
};

export default ManageAppointments;
