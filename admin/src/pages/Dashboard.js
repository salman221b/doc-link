import React from "react";

const Dashboard = () => {
  return (
    <div>
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
    </div>
  );
};

export default Dashboard;
