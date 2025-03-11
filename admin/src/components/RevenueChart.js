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
  { month: "Jan", Revenue: 190000 },
  { month: "Feb", Revenue: 200900 },
  { month: "Mar", Revenue: 508000 },
  { month: "Apr", Revenue: 798000 },
  { month: "May", Revenue: 799000 },
  { month: "Jun", Revenue: 889000 },
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
          <Bar dataKey="Revenue" fill="#7D87E0" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default RevenueChart;
