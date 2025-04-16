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
import {
  IconButton,
  Badge,
  Popover,
  Typography,
  List,
  ListItem,
} from "@mui/material";

const NavBar = ({ hasNotification }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openTheme, setOpenTheme] = useState(false);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [reminders, setReminders] = useState([]);
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
  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget);

    // 👉 Fetch appointment reminders from backend
    try {
      const res = await fetch(
        "https://doc-link-backend.onrender.com/reminders",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setReminders(data);
          } else {
            setReminders([]); // fallback
            console.error("Reminders should be an array:", data);
          }
        });
    } catch (err) {
      console.error("Error fetching reminders:", err);
      setReminders([]);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
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
        <IconButton>
          <Badge color="error" variant="dot" invisible={!hasNotification}>
            <NotificationsOutlinedIcon
              className="notification-icon"
              onClick={handleClick}
            />
          </Badge>
        </IconButton>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <div style={{ padding: "10px", minWidth: "250px" }}>
            <Typography variant="h6" gutterBottom>
              Reminders
            </Typography>
            <List dense>
              {reminders.length === 0 ? (
                <ListItem>No new reminders</ListItem>
              ) : (
                reminders.map((reminder, index) => (
                  <ListItem key={index}>
                    Appointment with Dr. {reminder.doctorName} at{" "}
                    {reminder.time}
                  </ListItem>
                ))
              )}
            </List>
          </div>
        </Popover>
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
