import React, { useState } from "react";
import NavBar from "../../../components/doctorNavbar/NavBar";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { blue } from "@mui/material/colors";
import FilterPatients from "../../../components/filter/FilterPatients";
import CloseIcon from "@mui/icons-material/Close";
import { Card, Col, Container, Row } from "react-bootstrap";
import PersonIcon from "@mui/icons-material/Person";

const PatientsList = () => {
  const [filter, setFilter] = React.useState(false);
  const [open, setOpen] = useState(false); // State to track modal visibility

  return (
    <div>
      <NavBar />
      <h1 className="title1">Your Practice,</h1>
      <h1 className="title2"> Simplified.</h1>
      <p style={{ color: "#030E82", fontSize: "1rem", fontStyle: "italic" }}>
        Manage your appointments, patients, and medical records with ease.
      </p>

      <div className="search-area" style={{ marginTop: "50px" }}>
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
                Search By
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                // value={formData.specialization}
                label="Search By"
                name="search-by"
                // onChange={handleChange}
              >
                <MenuItem value={"name"} selected>
                  Name
                </MenuItem>
                <MenuItem value={"id"}>ID</MenuItem>
                <MenuItem value={"contact-no"}>Contact No.</MenuItem>
              </Select>
            </FormControl>
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
                // margin: "0 auto",
                marginLeft: "20px",
                marginTop: "-20px",
              }}
            >
              <input
                type="text"
                placeholder="Enter ID "
                style={{
                  width: "75%",
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
            <FormControl
              sx={{ width: "200px", marginTop: "-20px", marginLeft: "20px" }}
            >
              <InputLabel id="demo-simple-select-helper-label">
                Sort By
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                // value={formData.specialization}
                label="Sort By"
                name="sort-by"
                // onChange={handleChange}
              >
                <MenuItem value={"name"} selected>
                  Name
                </MenuItem>
                <MenuItem value={"last-visit"}>Last Visit</MenuItem>
                <MenuItem value={"appointment-date"}>Appointment Date</MenuItem>
              </Select>
            </FormControl>
          </div>
        </form>
        <hr />
        <p
          style={{
            textDecoration: "underline",
            color: blue[500],
            cursor: "pointer",
          }}
          onClick={() => setFilter(!filter)}
        >
          Filters:
        </p>

        <CloseIcon
          style={{
            color: "red",
            float: "right",
            cursor: "pointer",
            display: filter ? "block" : "none",
          }}
          onClick={() => setFilter(false)}
        />
        {filter && <FilterPatients />}
        {/* ------------------------------------------------------------------------------------------------------------------------- */}
        <Container className="mt-4">
          <Row>
            <Col md={6} xs={12} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <PersonIcon />{" "}
                    <span style={{ marginLeft: "20px" }}>
                      Patient Name (Age), Male
                    </span>
                    <span style={{ float: "right" }}>ID: 123</span>
                  </Card.Title>
                  <Card.Text>
                    Contact Information
                    <p>Last Visit</p>
                    <p>Medical Condition (if available)</p>
                    <p>Appointment History (upcoming & past visits)</p>
                  </Card.Text>
                  <Button
                    style={{
                      width: "100%",
                      color: "#030E82",
                      backgroundColor: "#82EAAC",
                      fontWeight: "bold",
                    }}
                    onClick={() => setOpen(true)}
                  >
                    View Profile
                    <ArrowForwardIcon style={{ color: "#F49696" }} />
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
                  Patient Name (Age), &nbsp; Male
                </h3>

                <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                  📞 +91 98765 43210
                </p>
                <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                  ✉️ johndoe@email.com
                </p>
                <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                  Medical History
                </p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div>
              Appointments
              <p> (Upcoming, Completed, and Canceled)</p>
            </div>
            <div style={{ marginTop: "20px" }}>
              Prescriptions(Doctor’s past prescriptions)
            </div>
            <div style={{ marginTop: "20px" }}>
              Reports & Test Results (Blood test, X-rays, MRI, etc.)
            </div>
            <p
              style={{
                float: "right",
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Download / Print
            </p>
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
                Schedule a New Appointment{" "}
              </Button>
              <br />
              <Button
                style={{
                  width: "49%",
                  marginTop: "10px",
                  backgroundColor: "#030E82",
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                View/Write Prescription
              </Button>
              <Button
                style={{
                  width: "49%",
                  marginTop: "10px",
                  backgroundColor: "#F49696",
                  fontWeight: "bold",
                  float: "right",
                  color: "#fff",
                }}
              >
                Upload Medical Reports
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default PatientsList;
