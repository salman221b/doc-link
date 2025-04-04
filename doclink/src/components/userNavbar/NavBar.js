import React, { useContext, useEffect, useRef, useState } from "react";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import logo from "../../static/Logo_Navbar.png";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";

import "./NavBar.css";
import CustomizedSwitches from "../theme/Theme";
import { ThemeContext } from "../../context/ThemeContext";

const NavBar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openTheme, setOpenTheme] = useState(false);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setOpenTheme(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
        setOpenTheme(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="main-container">
      <header className="header">
        <a href="/" className="logo">
          <img src={logo} width={100} height={40} alt="Logo" />
        </a>
        <input type="checkbox" id="check" />
        <label htmlFor="check" className="icons">
          <box-icon name="menu" id="menu-icon"></box-icon>
          <box-icon name="x" id="close-icon"></box-icon>
        </label>

        <nav className="navbar">
          <NavLink to="/appointment" style={{ "--i": 0 }}>
            Book New Appointment
          </NavLink>
          <NavLink to="/upcoming-appointment" style={{ "--i": 1 }}>
            Upcoming Appointments
          </NavLink>
          <NavLink to="/medical-records-patient" style={{ "--i": 2 }}>
            Medical Records
          </NavLink>
          <NavLink to="/prescriptions" style={{ "--i": 3 }}>
            Prescriptions
          </NavLink>
          <NavLink to="/payment-history" style={{ "--i": 4 }}>
            Payment History
          </NavLink>
        </nav>
        <NotificationsOutlinedIcon className="notification-icon" />
        <div className="account-icon" onClick={toggleDropdown}>
          <AccountCircleOutlinedIcon />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            className="dropdown-content"
            ref={dropdownRef}
            onClick={(e) => e.stopPropagation()}
          >
            <a href="/profile">
              <PersonIcon /> Profile
            </a>
            <a onClick={() => setOpenTheme(!openTheme)}>
              <SettingsIcon /> Settings
            </a>
            {openTheme && (
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#f1f1f1",
                  borderRadius: "5px",
                }}
              >
                <div style={{ fontWeight: "bold" }}>Mode:</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: ".8rem" }}>Light</span>

                  <CustomizedSwitches
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                  />

                  <span style={{ fontSize: ".8rem", marginLeft: "-25px" }}>
                    {" "}
                    Dark
                  </span>
                </div>
              </div>
            )}
            <a onClick={handleLogout}>
              <LogoutIcon style={{ color: "red" }} /> Logout
            </a>
          </div>
        )}
      </header>
    </div>
  );
};

export default NavBar;
