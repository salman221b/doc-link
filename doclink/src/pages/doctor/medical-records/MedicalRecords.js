import { InputLabel, MenuItem, Select, FormControl } from "@mui/material";
import React, { useState } from "react";
import NavBar from "../../../components/doctorNavbar/NavBar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Card, Col, Container, Row } from "react-bootstrap";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";

const MedicalRecords = () => {
  const [open, setOpen] = useState(false); // State to track modal visibility

  return (
    <div>
      <NavBar />
      <h1 className="title1">Your Practice,</h1>
      <h1 className="title2"> Simplified.</h1>
      <p className="text" style={{ fontSize: "1rem", fontStyle: "italic" }}>
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
                style={{ backgroundColor: "white", borderRadius: "10px" }}
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
                border: "1px solid #82EAAC",
                padding: "5px",
                width: "300px",
                // margin: "0 auto",
                marginLeft: "20px",
                marginTop: "-20px",
              }}
            >
              <input
                className="text"
                type="text"
                placeholder="Enter ID "
                style={{
                  width: "75%",
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
            <FormControl
              sx={{ width: "200px", marginTop: "-20px", marginLeft: "20px" }}
            >
              <InputLabel id="demo-simple-select-helper-label">
                Sort By
              </InputLabel>
              <Select
                style={{ backgroundColor: "white", borderRadius: "10px" }}
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                // value={formData.specialization}
                label="Sort By"
                name="sort-by"
                // onChange={handleChange}
              >
                <MenuItem value={"diagnosis"} selected>
                  Diagnosis
                </MenuItem>
                <MenuItem value={"test-type"}>Test type</MenuItem>
                <MenuItem value={"last-visit"}> Last visit</MenuItem>
                <MenuItem value={"record-date"}> Record date</MenuItem>
              </Select>
            </FormControl>
          </div>
        </form>
        <hr className="text" />
      </div>
      <Container className="mt-4">
        <Row>
          <Col md={6} xs={12} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>
                  <PersonIcon className="text" />{" "}
                  <span style={{ marginLeft: "20px" }} className="text">
                    Patient Name (Age), Male
                  </span>
                  <span style={{ float: "right" }} className="text">
                    ID: 123
                  </span>
                </Card.Title>
                <Card.Text className="text">
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
                  Medical Record Details
                  <ArrowForwardIcon style={{ color: "#F49696" }} />
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} xs={12} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>
                  <PersonIcon className="text" />{" "}
                  <span style={{ marginLeft: "20px" }} className="text">
                    Patient Name (Age), Male
                  </span>
                  <span style={{ float: "right" }} className="text">
                    ID: 123
                  </span>
                </Card.Title>
                <Card.Text className="text">
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
                  Medical Record Details
                  <ArrowForwardIcon style={{ color: "#F49696" }} />
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} xs={12} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>
                  <PersonIcon className="text" />{" "}
                  <span style={{ marginLeft: "20px" }} className="text">
                    Patient Name (Age), Male
                  </span>
                  <span style={{ float: "right" }} className="text">
                    ID: 123
                  </span>
                </Card.Title>
                <Card.Text className="text">
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
                  Medical Record Details
                  <ArrowForwardIcon style={{ color: "#F49696" }} />
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} xs={12} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>
                  <PersonIcon className="text" />{" "}
                  <span style={{ marginLeft: "20px" }} className="text">
                    Patient Name (Age), Male
                  </span>
                  <span style={{ float: "right" }} className="text">
                    ID: 123
                  </span>
                </Card.Title>
                <Card.Text className="text">
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
                  Medical Record Details
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
              <p style={{ margin: "5px 0", fontSize: "1rem" }}>ID</p>
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
          <p> Diagnosis History (Previous and ongoing conditions)</p>

          <div style={{ marginTop: "20px" }}>
            Prescriptions (Medications prescribed by the doctor)
          </div>
          <div style={{ marginTop: "20px" }}>
            Lab Reports & Test Results (Blood tests, X-rays, MRI, ECG, etc.)
          </div>
          <div style={{ marginTop: "20px" }}>
            Surgical & Treatment History (Past surgeries and procedures){" "}
          </div>
          <div style={{ marginTop: "20px" }}>
            Doctor’s Notes & Observations (Doctors can add/update notes)
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
              Add New Record{" "}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MedicalRecords;
