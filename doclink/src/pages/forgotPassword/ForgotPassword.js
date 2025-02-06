import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../static/DocLink_Logo_Bg.png";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "https://doc-link-backend.onrender.com/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, role }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        navigate("/verify_email", {
          state: { email: email, role: role, type: "forgotPassword" },
        });
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error(err);
    }
  };
  return (
    <div>
      <img src={logo} width={100} height={100} alt="Logo" />
      <h1 className="title1">Forgot Password?</h1>
      <h1 className="title2">Let’s Fix That!</h1>
      <div
        style={{
          justifyItems: "center",
          marginTop: "70px",
          marginBottom: "45vh",
        }}
      >
        <Box sx={{ width: 500, maxWidth: "100%" }}>
          <TextField
            fullWidth
            label="Email Address"
            id="fullWidth"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
            <InputLabel id="demo-simple-select-helper-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={role}
              label="Role"
              name="role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="" disabled>
                <em>None</em>
              </MenuItem>
              <MenuItem value={"patient"}>I'm a Patient</MenuItem>
              <MenuItem value={"doctor"}>I'm a Doctor</MenuItem>
            </Select>
            {/* <FormHelperText>With label + helper text</FormHelperText> */}
          </FormControl>
          <center>
            {message && (
              <p style={{ color: "green", marginTop: "20px" }}>{message}</p>
            )}
            {error && (
              <p style={{ color: "red", marginTop: "20px" }}>{error}</p>
            )}
          </center>
          <button
            className="btn btn-primary "
            style={{
              marginTop: "20px",
              width: "100%",
            }}
            onClick={handleResetPassword}
          >
            Request Password Reset
          </button>
        </Box>
      </div>
    </div>
  );
};

export default ForgotPassword;
