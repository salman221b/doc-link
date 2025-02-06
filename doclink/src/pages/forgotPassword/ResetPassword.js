import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import React, { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import logo from "../../static/DocLink_Logo_Bg.png";

import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const role = location.state?.role;
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(" ");
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;

    if (!pattern.test(password)) {
      setError(
        "Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, and one special character."
      );
    } else if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
      const response = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role, password }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Something went wrong.");
      }
    }
  };

  return (
    <div>
      <img src={logo} width={100} height={100} alt="Logo" />
      <h1 className="title1">Your Health,</h1>
      <h1 className="title2">Just a Click Away.</h1>
      <div
        style={{
          justifyItems: "center",
          marginTop: "70px",
          marginBottom: "220px",
        }}
      >
        <Box sx={{ width: 500, maxWidth: "100%" }}>
          <form onSubmit={handleSetNewPassword}>
            <FormControl
              fullWidth
              variant="outlined"
              style={{ marginTop: "20px" }}
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                label="Password"
                // id="fullWidth"
                //   style={{ marginTop: "20px" }}
                // type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl
              fullWidth
              variant="outlined"
              style={{ marginTop: "20px" }}
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Confirm Password
              </InputLabel>
              <OutlinedInput
                label="Confirm Password"
                // id="fullWidth"
                //   style={{ marginTop: "20px" }}
                // type="password"
                name="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="outlined-adornment-password"
                type={showConfirmPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showConfirmPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <center>{error && <p style={{ color: "red" }}>{error}</p>}</center>
            <button
              type="submit"
              class="btn btn-primary"
              style={{ marginTop: "20px", width: "100%", fontWeight: "bold" }}
            >
              Set New Password
            </button>
          </form>
        </Box>
      </div>
    </div>
  );
};

export default ResetPassword;
