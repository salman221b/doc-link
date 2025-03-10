import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", Revenue: 4000 },
  { month: "Feb", Revenue: 3000 },
  { month: "Mar", Revenue: 5000 },
  { month: "Apr", Revenue: 7000 },
  { month: "May", Revenue: 6000 },
  { month: "Jun", Revenue: 8000 },
];

const RevenueChart = () => {
  return (
    <>
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>Revenue Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Revenue" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default RevenueChart;
