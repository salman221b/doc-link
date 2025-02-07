import React from "react";
import { useNavigate } from "react-router-dom";
import ErrorIllustration from "../../components/illustrations/ErrorIllustration";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <ErrorIllustration />

      <h2 style={styles.message}>Oops! Page Not Found</h2>
      <p style={styles.description}>
        Sorry, the page you're looking for doesn't exist. It might have been
        removed or the link is incorrect.
      </p>
      <button style={styles.button} onClick={() => navigate("/login")}>
        Go to Homepage
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",
    padding: "20px",
  },
  errorCode: {
    fontSize: "6rem",
    fontWeight: "bold",
    color: "#dc3545",
  },
  message: {
    fontSize: "2rem",
    margin: "20px 0",
    color: "#343a40",
  },
  description: {
    fontSize: "1rem",
    color: "#6c757d",
    marginBottom: "30px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default NotFoundPage;
