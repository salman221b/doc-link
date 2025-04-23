import React, { useEffect, useState } from "react";
import NavBar from "../../../components/userNavbar/NavBar";
import { TextField } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Card, Button, Container, Row, Col, Table } from "react-bootstrap";
import { CircularProgress } from "@mui/material";
import ScrollToTop from "../../../components/scrollToTop/ScrollToTop";
import UploadButton from "../../../components/uploadButton/UploadButton";
import { data, useNavigate } from "react-router-dom";
import NoData from "../../../static/no_data.png";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const MedicalRecords = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");
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
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        // Extract filename from the URL
        const filename = url.substring(url.lastIndexOf("/") + 1);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Cleanup blob
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((err) => console.error("Download failed:", err));
  }
  const deleteFile = async (id) => {
    const result = await Swal.fire({
      title: "Remove medical record?",
      text: "Are you sure you want to remove this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `https://doc-link-backend.onrender.com/medical-records/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Role: "patient",
          },
        }
      );
      if (response.ok) {
        toast.success("File deleted successfully!");
        setRecords((prevRecords) =>
          prevRecords.filter((record) => record._id !== id)
        );
      } else {
        throw new Error("Failed to delete file");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete file");
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    console.log(startDate, endDate);

    if (!startDate || !endDate) {
      setError("Select both Start and End dates please.");
      return;
    }

    if (startDate > endDate) {
      setError("Start date should be lesser than end date.");
      return;
    }

    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token not found. Redirecting to login...");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `https://doc-link-backend.onrender.com/search-medical-records?startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Role: "patient",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRecords(data);
        toast.success("Files fetched successfully!");
      } else {
        toast.error(data?.message || "Failed to fetch records");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Something went wrong while fetching records.");
    }
  };

  function formattedDate(isoDate) {
    const date = new Date(isoDate);
    return date
      .toLocaleString("en-GB", {
        // timeZone: "Asia/Kolkata", // Optional: use for IST
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "");
  }
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          color: "#82EAAC", // Light Green Text
        }}
      >
        <CircularProgress
          size={80}
          thickness={3}
          sx={{
            color: "#F49696", // Light Red Spinner
          }}
        />
        <h2 style={{ marginTop: "20px", color: "#82EAAC" }}>Loading...</h2>
      </div>
    );
  }
  return (
    <div>
      <NavBar />
      <h1 className="title1">Your Health,</h1>
      <h1 className="title2">Just a Click Away.</h1>
      <form onSubmit={handleSearch}>
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
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
        {error && (
          <div style={{ textAlign: "center", color: "red" }}>{error}</div>
        )}
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
        <Container className="mt-4">
          <Row>
            {records.map((rec) => (
              <Col md={6} xs={12} className="mb-5">
                <Card key={rec._id}>
                  <Card.Body>
                    <div className="text">
                      <Card.Title>
                        {rec.file.endsWith(".pdf") ? (
                          // <div
                          //   style={{
                          //     width: "100%",
                          //     height: "100px",
                          //     display: "flex",
                          //     justifyContent: "center",
                          //     alignItems: "center",
                          //     backgroundColor: "#fdecea",
                          //     borderRadius: "8px",
                          //     color: "#d32f2f",
                          //   }}
                          //   onClick={() => window.open(rec.file, "_blank")}
                          // >
                          //   <PictureAsPdfIcon fontSize="large" />
                          // </div>
                          <embed
                            src={rec.file}
                            width="100%"
                            height="100px"
                            type="application/pdf"
                            onClick={() => window.open(rec.file, "_blank")}
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
                            onClick={() => window.open(rec.file, "_blank")}
                          />
                        )}
                      </Card.Title>
                      <Card.Text>
                        <Table>
                          <tr>
                            <td>Name:</td>
                            <td>{rec.fileName}</td>
                          </tr>
                          <tr>
                            <td>Category:</td>
                            <td>{rec.category}</td>
                          </tr>
                          <tr>
                            <td>Remarks:</td>
                            <td> {rec.remarks ? rec.remarks : "-"}</td>
                          </tr>
                          <tr>
                            <td>Created At:</td>
                            <td> {formattedDate(rec.createdAt)}</td>
                          </tr>
                        </Table>
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
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteFile(rec._id)}
                      style={{ marginRight: "10px", float: "right" }}
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}
      <UploadButton />
      <ScrollToTop />
    </div>
  );
};

export default MedicalRecords;
