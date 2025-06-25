import React, { useEffect, useState, useContext } from "react";
import NavBar from "../../../components/userNavbar/NavBar";
import { CircularProgress, TextField } from "@mui/material";
import NoData from "../../../static/no_data.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { ThemeContext } from "../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useContext(ThemeContext);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(
          `https://doc-link-backend.onrender.com/payment-history`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",

              Role: "patient",
            },
          }
        );

        const data = await res.json();
        if (res.ok) {
          setPayments(data.history || []);
        } else {
          console.error(data.message || "Failed to fetch payment history.");
        }
      } catch (err) {
        console.error("Error fetching payment history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);
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
        `https://doc-link-backend.onrender.com/search-payment-history?startDate=${startDate}&endDate=${endDate}`,
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
        setPayments(data);
        toast.success("Files fetched successfully!");
      } else {
        toast.error(data?.message || "Failed to fetch records");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Something went wrong while fetching records.");
    }
  };

  return (
    <>
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
      </form>
      <div
        style={{ padding: "20px", textAlign: "center", marginBottom: "240px" }}
        className="text"
      >
        <h2>Payment History</h2>
        {payments.length === 0 ? (
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <img
              src={NoData}
              alt="No Data"
              style={{ width: "300px", display: "block", margin: "auto" }}
            />
            <p className="text" style={{ marginTop: "20px" }}>
              Oops, No Payment History Found!
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table
              className={`table table-striped ${
                darkMode ? "table-dark" : ""
              } themed-table`}
            >
              <thead>
                <tr>
                  <th>Date, Time</th>
                  <th>Doctor ID</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Payment ID</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, index) => (
                  <tr key={index}>
                    <td>{new Date(p.created_at).toLocaleString()}</td>
                    <td>{p.doctorId || "N/A"}</td>
                    <td>₹{p.amount}</td>
                    <td>{p.payment_mode}</td>
                    <td>{p.payment_status}</td>
                    <td>{p.payment_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentHistory;
