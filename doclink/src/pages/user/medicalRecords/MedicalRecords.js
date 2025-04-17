import React, { useEffect, useState } from "react";
import NavBar from "../../../components/userNavbar/NavBar";
import { TextField } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Table,
  Spinner,
} from "react-bootstrap";
import ScrollToTop from "../../../components/scrollToTop/ScrollToTop";
import UploadButton from "../../../components/uploadButton/UploadButton";
import { useNavigate } from "react-router-dom";
import NoData from "../../../static/no_data.png";

const MedicalRecords = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setRecords(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch records", err);
        setLoading(false);
      });
  }, []);

  function downloadFile(url) {
    const link = document.createElement("a");
    link.href = url;
    link.download = ""; // let browser use default filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) return <Spinner animation="border" variant="primary" />;
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
      <h2 className="text" style={{ textAlign: "center", margin: "30px 0" }}>
        Medical Records
      </h2>

      {records.length === 0 ? (
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <img
            src={NoData}
            alt="No Data"
            style={{ width: "300px", display: "block", margin: "auto" }}
          />
          <p className="text" style={{ marginTop: "20px" }}>
            Oops, No Records Found!
          </p>
        </div>
      ) : (
        records.map((rec) => (
          <Container className="mt-4">
            <Row>
              <Col md={6} xs={12} className="mb-3">
                <Card key={rec._id}>
                  <Card.Body>
                    <div className="text">
                      <Card.Title>
                        {rec.file.endsWith(".pdf") ? (
                          <embed
                            src={rec.file}
                            width="100%"
                            height="100px"
                            type="application/pdf"
                          />
                        ) : (
                          <img
                            src={rec.file}
                            alt={rec.fileName}
                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </Card.Title>
                      <Card.Text>
                        {rec.fileName}
                        <br />

                        {rec.category}
                        <br />
                        {rec.remarks}
                        <br />
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </Card.Text>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => window.open(rec.file, "_blank")}
                    >
                      View
                    </Button>{" "}
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => downloadFile(rec.file)}
                    >
                      Download
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        ))
      )}
      <UploadButton />
      <ScrollToTop />
    </div>
  );
};

export default MedicalRecords;
