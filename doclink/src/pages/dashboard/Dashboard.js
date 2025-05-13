import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorDashboard from "../doctor/Dashboard";
import PatientDashboard from "../user/Dashboard";
import LoadingScreen from "../../components/loadingScreen/LoadingScreen";
import socket from "../../components/socket/socket";
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login"); // Redirect if no token
      return;
    }

    // Verify token and fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch(
          "https://doc-link-backend.onrender.com/dashboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Role: role,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        if (!data.isVerified) {
          alert("Your account is not verified yet.");
          localStorage.clear();
          navigate("/login");
          return;
        }

        setUser(data); // Set user data
      } catch (error) {
        console.error("Error:", error);
        localStorage.clear();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);
  useEffect(() => {
    if (user?._id) {
      socket.emit("register", { userId: user._id });
    }
  }, [user]);

  if (loading) return <LoadingScreen />;
  if (!user) return null;

  return (
    <>{user.role === "doctor" ? <DoctorDashboard /> : <PatientDashboard />}</>
  );
};

export default Dashboard;
