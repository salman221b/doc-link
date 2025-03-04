import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
const AdminPanel = () => {
  return (
    <>
      <Navbar />
      <div>
        <Sidebar />
        <div>
          <Outlet /> {/* Render child routes */}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
