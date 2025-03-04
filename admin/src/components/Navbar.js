import React from "react";
import Logo from "../static/Logo_Navbar.png";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CustomizedSwitches from "./theme/Theme";

const Navbar = () => {
  return (
    <div
      className="navbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
      }}
    >
      <img src={Logo} width={100} height={50} alt="Logo" />
      <div
        style={{ border: "1px solid ", borderRadius: "5px", padding: "3px" }}
      >
        <input
          placeholder="Search"
          style={{
            padding: "5px",
            border: "none",
            width: "250px",
            backgroundColor: "transparent",
          }}
          className="text"
        />
        <SearchIcon className="text" style={{ cursor: "pointer" }} />
      </div>
      <NotificationsNoneIcon className="text" />
      <AccountCircleIcon className="text" />
      <CustomizedSwitches className="text" />
    </div>
  );
};

export default Navbar;
