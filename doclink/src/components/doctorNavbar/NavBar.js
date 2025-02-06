import React from "react";
import "./NavBar.css";
import "boxicons";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import logo from "../../static/Logo_Navbar.png";

const NavBar = () => {
  return (
    <div className="main-container">
      <header className="header">
        <a href="/" className="logo">
          <img src={logo} width={100} height={40} alt="Logo" />
        </a>
        <input type="checkbox" id="check" />
        <label for="check" className="icons">
          <box-icon name="menu" id="menu-icon"></box-icon>
          <box-icon name="x" id="close-icon"></box-icon>
        </label>

        <nav className="navbar">
          <a href="/" style={{ "--i": 0 }}>
            Manage Appointments
          </a>

          <a href="/login" style={{ "--i": 1 }}>
            Patient List
          </a>

          <a href="/register" style={{ "--i": 2 }}>
            Medical Records
          </a>
        </nav>
        <NotificationsOutlinedIcon className="notification-icon" />
        <AccountCircleOutlinedIcon className="account-icon" />
      </header>
    </div>
  );
};

export default NavBar;
