import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DoctorDashboard from "../doctor/Dashboard";
import PatientDashboard from "../user/Dashboard";
import LoadingScreen from "../../components/loadingScreen/LoadingScreen";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
      navigate("/login");
      return;
    }

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

      setUser(data);
    } catch (error) {
      console.error("Dashboard fetch error:", error.message);
      localStorage.clear();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) return <LoadingScreen />;
  if (!user) return null;

  return (
    <>
      {user.role === "doctor" ? (
        <DoctorDashboard user={user} />
      ) : (
        <PatientDashboard user={user} />
      )}
    </>
  );
};

export default Dashboard;
