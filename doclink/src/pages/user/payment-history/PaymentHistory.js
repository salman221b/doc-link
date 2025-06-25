import React, { useEffect, useState } from "react";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(
          `https://doc-link-backend.onrender.com/payment-history`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok) {
          setPayments(data.history || []);
        } else {
          console.error(data.message || "Failed to fetch payment history.");
        }
      } catch (err) {
        console.error("Error fetching payment history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Payment History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <p>No payment history found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Doctor</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Payment ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, index) => (
              <tr key={index}>
                <td>{new Date(p.created_at).toLocaleString()}</td>
                <td>{p.doctorId || "N/A"}</td>
                <td>₹{p.amount}</td>
                <td>{p.payment_mode}</td>
                <td>{p.payment_status}</td>
                <td>{p.payment_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistory;
