import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div>
      <div
        className="card"
        style={{
          width: "20%",
          height: "80vh",
          backgroundColor: "#2E3150",
          marginTop: "20px",
          padding: "20px",
        }}
      >
        <Button
          variant="outlined"
          style={{
            borderColor: "#7D87E0",
            color: "#7D87E0",
            fontWeight: "bold",
            marginTop: "20px",
          }}
          // onClick={() => navigate("/dashboard")}
        >
          <Link to="/admin/dashboard"> Dashboard</Link>
        </Button>
        <Button
          variant="outlined"
          style={{
            borderColor: "#7D87E0",
            color: "#7D87E0",
            fontWeight: "bold",
            marginTop: "20px",
          }}
          // onClick={() => navigate("/users")}
        >
          <Link to="/admin/dashboard/users">Users</Link>
        </Button>
        <Button
          variant="outlined"
          style={{
            borderColor: "#7D87E0",
            color: "#7D87E0",
            fontWeight: "bold",
            marginTop: "20px",
          }}
        >
          Appointments{" "}
        </Button>
        <Button
          variant="outlined"
          style={{
            borderColor: "#7D87E0",
            color: "#7D87E0",
            fontWeight: "bold",
            marginTop: "20px",
          }}
        >
          Doctors Management
        </Button>
        <Button
          variant="outlined"
          style={{
            borderColor: "#7D87E0",

            color: "#7D87E0",
            fontWeight: "bold",
            marginTop: "20px",
          }}
        >
          Patients Management
        </Button>
        <Button
          variant="outlined"
          style={{
            borderColor: "#7D87E0",
            color: "#7D87E0",
            fontWeight: "bold",
            marginTop: "20px",
          }}
        >
          Medical Records
        </Button>
        <Button
          variant="outlined"
          style={{
            borderColor: "#7D87E0",
            color: "#7D87E0",
            fontWeight: "bold",
            marginTop: "20px",
          }}
        >
          Payments & Subscriptions
        </Button>
        <Button
          variant="outlined"
          style={{
            borderColor: "#7D87E0",
            color: "#7D87E0",
            fontWeight: "bold",
            marginTop: "20px",
          }}
        >
          Reports & Analytics
        </Button>
        <Button
          variant="outlined"
          style={{
            borderColor: "#7D87E0",
            color: "#7D87E0",
            fontWeight: "bold",
            marginTop: "20px",
          }}
        >
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
