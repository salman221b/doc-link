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

const ManageAppointments = () => {
  const [open, setOpen] = useState(false); // State to track modal visibility

  return (
    <div>
      <NavBar />
      <div className="header-text">
        <h1 className="title1">Your Practice,</h1>

        <h1 className="title2">Simplified.</h1>
        <p style={{ color: "#030E82", fontSize: "1rem", fontStyle: "italic" }}>
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
            border: "1px solid #030E82",
            padding: "5px",
            width: "300px",
            margin: "0 auto",
          }}
        >
          <input
            type="text"
            placeholder="Enter Appointment ID"
            style={{
              width: "200px",
              border: "none",
              outline: "none",
              padding: "5px",
              color: "#030E82",
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
            style={{
              color: "#82EAAC",
              fontSize: "30px",
              float: "right",
              margin: "2px",
              cursor: "pointer",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
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
                    style={{ cursor: "pointer" }}
                    onClick={() => setOpen(true)}
                  >
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
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Modal Title</DialogTitle>
          <DialogContent>
            <p>This is the content of the modal.</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <ScrollToTop />
      </div>
    </div>
  );
};

export default ManageAppointments;
