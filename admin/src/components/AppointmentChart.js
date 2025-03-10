import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", Appointments: 198 },
  { name: "Feb", Appointments: 238 },
  { name: "Mar", Appointments: 500 },
  { name: "Apr", Appointments: 706 },
  { name: "May", Appointments: 860 },
  { name: "Jun", Appointments: 880 },
];

const AppointmentChart = () => {
  return (
    <>
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Appointment Chart
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Appointments" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default AppointmentChart;
