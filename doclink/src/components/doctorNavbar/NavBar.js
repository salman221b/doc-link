import React, { useState } from "react";
import "./NavBar.css";
import "boxicons";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import logo from "../../static/Logo_Navbar.png";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";

const NavBar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  const closeDropdown = (e) => {
    if (!e.target.closest(".account-icon")) {
      setIsDropdownOpen(false);
    }
  };

  // Add event listener to close dropdown when clicking outside
  React.useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
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
        <label for="check" className="icons">
          <box-icon name="menu" id="menu-icon"></box-icon>
          <box-icon name="x" id="close-icon"></box-icon>
        </label>
        <nav className="navbar">
          <a href="/manage-appointments" style={{ "--i": 0 }}>
            Manage Appointments
          </a>

          <a href="/patients-list" style={{ "--i": 1 }}>
            Patient List
          </a>

          <a href="/medical-records-doctor" style={{ "--i": 2 }}>
            Medical Records
          </a>
        </nav>
        <NotificationsOutlinedIcon className="notification-icon" />
        <div className="account-icon" onClick={toggleDropdown}>
          <AccountCircleOutlinedIcon />
        </div>{" "}
        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="dropdown-content">
            <a href="/profile">
              <PersonIcon /> Profile
            </a>
            <a href="/settings">
              <SettingsIcon /> Settings
            </a>
            <a onClick={handleLogout}>
              {" "}
              <LogoutIcon style={{ color: "red" }} /> Logout
            </a>
          </div>
        )}
      </header>
    </div>
  );
};

export default NavBar;
