import React, { useState } from "react";
import Logo from "../static/Logo_Navbar.png";
import CustomizedSwitches from "../components/theme/Theme";
import { Box, Button, TextField } from "@mui/material";
const Login = () => {
  const [error, setError] = useState();
  const [username, setUsrename] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      window.location.replace("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          // alignItems: "center",
          // height: "100vh",
          marginTop: "50px",
        }}
      >
        <img src={Logo} width={100} height={50} alt="Logo" />
        <CustomizedSwitches />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20%",
        }}
      >
        <Box sx={{ width: 500, maxWidth: "100%" }}>
          <TextField
            style={{ backgroundColor: "white", borderRadius: "8px" }}
            fullWidth
            label="User name"
            id="fullWidth"
            onChange={(e) => setUsrename(e.target.value)}
          />
          <TextField
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              marginTop: "20px",
            }}
            fullWidth
            label="Password"
            id="fullWidth"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p style={{ color: "red", alignItems: "center" }}>{error}</p>
          )}
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "20px", width: "100%" }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Login;
