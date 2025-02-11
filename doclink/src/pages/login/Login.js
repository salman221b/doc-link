import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Select from "@mui/material/Select";
import { Button, MenuItem } from "@mui/material";
import logo from "../../static/DocLink_Logo_Bg.png";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient"); // Default to 'patient'
  const [message, setMessage] = useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "https://doc-link-backend.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, role }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Login successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", role);

        navigate("/dashboard");
        // navigate(role === "doctor" ? "/dashboard_doctor" : "/dashboard_user");
      } else {
        setMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
      console.error("Error:", error);
    }
  };
  return (
    <>
      {" "}
      <img src={logo} width={100} height={100} alt="Logo" />
      <h1 className="title1">Your Health,</h1>
      <h1 className="title2">Just a Click Away.</h1>
      <div
        className="decider"
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div className="decider1" style={{ backgroundColor: "" }}>
          <Button
            className="button btn btn-primary"
            variant="outlined"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </div>
        {"|"}
        <div className="decider2" style={{ backgroundColor: "" }}>
          <Button
            className="button btn btn-primary"
            variant="contained"
            disabled
          >
            Login
          </Button>
        </div>
      </div>
      <form onSubmit={handleLogin}>
        <div
          style={{
            justifyItems: "center",
            marginTop: "70px",
            marginBottom: "220px",
          }}
        >
          <Box sx={{ width: 500, maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Username/Email"
              id="fullWidth"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div>
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
            </div>
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

            <label
              style={{
                float: "right",
                marginTop: "10px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              <Link to="/forgot_password">Forgot Password?</Link>
            </label>
            {message && (
              <center>
                <p
                  style={{
                    color: "red",
                    marginTop: "50px",
                  }}
                >
                  {message}
                </p>
              </center>
            )}
            <button
              type="submit"
              class="btn btn-primary"
              style={{ marginTop: "20px", width: "100%", fontWeight: "bold" }}
            >
              Login
            </button>
            <label style={{ marginTop: "30px" }}>
              Don't have an account?{" "}
              <a style={{ cursor: "pointer", textDecoration: "underline" }}>
                <Link to="/register">Signup here.</Link>
              </a>
            </label>
          </Box>
        </div>
      </form>
    </>
  );
}

export default Login;
