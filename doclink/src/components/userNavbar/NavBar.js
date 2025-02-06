import React, { useState } from "react";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import logo from "../../static/Logo_Navbar.png";
import "./NavBar.css";

const NavBar = () => {
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
          <a href="/appointment" style={{ "--i": 0 }}>
            Book New Appointment
          </a>
          <a href="/upcoming-appointment" style={{ "--i": 1 }}>
            Upcoming Appointments
          </a>
          <a href="/medical-records" style={{ "--i": 2 }}>
            Medical Records
          </a>
          <a href="/prescriptions" style={{ "--i": 3 }}>
            Prescriptions
          </a>
          <a href="/payment-history" style={{ "--i": 4 }}>
            Payment History
          </a>
        </nav>

        <NotificationsOutlinedIcon className="notification-icon" />
        <div className="account-icon" onClick={toggleDropdown}>
          <AccountCircleOutlinedIcon />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="dropdown-content">
            <a href="/profile">Profile</a>
            <a href="/settings">Settings</a>
            <a href="/logout">Logout</a>
          </div>
        )}
      </header>
    </div>
  );
};

export default NavBar;
