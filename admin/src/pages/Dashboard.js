import React from "react";
import { useNavigate } from "react-router-dom";
import AppointmentChart from "../components/AppointmentChart";
import RevenueChart from "../components/RevenueChart";

const Dashboard = () => {
  const [infoVisible, setInfoVisible] = React.useState(false);
  const navigate = useNavigate();
  return (
    <div>
      <p
        style={{
          width: "90%",
          backgroundColor: "gray",
          borderRadius: "5px",
          marginLeft: "20px",
          marginRight: "20px",
          paddingLeft: "10px",
          color: "white",
        }}
        hidden={infoVisible}
      >
        This site only work in Destop View, Mobile View is not supported.
        <span
          style={{ float: "right", marginRight: "20px", cursor: "pointer" }}
          onClick={() => setInfoVisible(true)}
        >
          X
        </span>
      </p>
      <h1 className="text">Dashboard</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <div
          style={{
            width: "200px",
            height: "130px",
            backgroundColor: "#7D87E0",
            textAlign: "center",
            padding: "10px",
            marginRight: "20px",
            borderRadius: "20px",
          }}
        >
          <p
            style={{
              fontSize: "2rem",
              fontStyle: "italic",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Total Users
          </p>
          <p
            style={{
              fontSize: "2rem",
              fontStyle: "italic",
              fontWeight: "bold",
              color: "white",
            }}
          >
            478
          </p>
        </div>
        <div
          style={{
            width: "200px",
            height: "130px",
            backgroundColor: "#7D87E0",
            textAlign: "center",
            padding: "10px",
            marginRight: "20px",
            borderRadius: "20px",
          }}
        >
          <p
            style={{
              fontSize: "1.3rem",
              fontStyle: "italic",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Total Appointments
          </p>
          <p
            style={{
              fontSize: "2rem",
              fontStyle: "italic",
              fontWeight: "bold",
              color: "white",
            }}
          >
            1998
          </p>
        </div>
        <div
          style={{
            width: "200px",
            height: "130px",
            backgroundColor: "#7D87E0",
            textAlign: "center",
            padding: "10px",
            marginRight: "20px",
            borderRadius: "20px",
          }}
        >
          <p
            style={{
              fontSize: "1.3rem",
              fontStyle: "italic",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Total Revenue
          </p>
          <p
            style={{
              fontSize: "2rem",
              fontStyle: "italic",
              fontWeight: "bold",
              color: "white",
            }}
          >
            100650
          </p>
        </div>
      </div>

      {/* ---------------Chart Section------------------------- */}
      <AppointmentChart />
      <RevenueChart />

      {/* --------------------Buttons-------------------------------- */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <button
          style={{
            backgroundColor: "#7D87E0",
            border: "none",
            padding: "10px 20px",
            color: "white",
            borderRadius: "5px",
            marginRight: "20px",
          }}
          onClick={() => navigate("./doctors")}
        >
          Approve Doctors
        </button>
        <button
          style={{
            backgroundColor: "#7D87E0",
            border: "none",
            padding: "10px 20px",
            color: "white",
            borderRadius: "5px",
          }}
          onClick={() => navigate("./users")}
        >
          Manage Users
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
