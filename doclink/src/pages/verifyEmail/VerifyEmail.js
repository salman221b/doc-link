import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VerifyEmail.css";
import logo from "../../static/DocLink_Logo_Bg.png";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const role = location.state?.role;
  const type = location.state?.type;
  //   const [otp, setOtp] = useState(""); // To store OTP entered by the user
  const [status, setStatus] = useState(""); // For status messages
  const [timer, setTimer] = useState(10); // Countdown for resend OTP
  const [otp, setOtp] = useState(["", "", "", ""]); // State to hold OTP digits
  const inputRefs = useRef([]); // Refs for input fields
  // const [isResending, setIsResending] = useState(false); // To show a loader or disable button

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d?$/.test(value)) {
      // Allow only single digit (0-9)
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input field
      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        // Move focus to the previous input field
        inputRefs.current[index - 1].focus();
      }
      const newOtp = [...otp];
      newOtp[index] = ""; // Clear the current digit
      setOtp(newOtp);
    }
  };

  // Handle OTP submission
  const handleVerifyOtp = async () => {
    // Add logic to verify the OTP (API call)
    const fullOtp = otp.join("");
    console.log("Entered OTP:", fullOtp);
    if (type === "register") {
      const response = await fetch(
        "https://doc-link-backend.onrender.com/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, otp: fullOtp, role: role }),
        }
      );

      if (response.ok) {
        setStatus("OTP verified successfully!");
        navigate("/login");

        // Redirect user to the next step or dashboard
      } else {
        setStatus("Invalid OTP. Please try again.");
      }
    }
    if (type === "forgotPassword") {
      const response = await fetch(
        "https://doc-link-backend.onrender.com/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, otp: fullOtp, role: role }),
        }
      );

      if (response.ok) {
        setStatus("OTP verified successfully!");
        navigate("/reset_password", { state: { email: email, role: role } });

        // Redirect user to the next step or dashboard
      } else {
        setStatus("Invalid OTP. Please try again.");
      }
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    // Add logic to resend OTP (API call)
    // setIsResending(true);
    setStatus("OTP has been resent to your email.");
    setTimer(10); // Reset the timer

    try {
      const response = await fetch(
        "https://doc-link-backend.onrender.com/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, role: role }), // Pass the email to the backend
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("OTP sent successfully. Please check your email.");
      } else {
        setStatus(data.message || "Failed to resend OTP. Try again later.");
      }
    } catch (error) {
      setStatus("An error occurred. Please try again later.");
      console.error("Error resending OTP:", error);
    } finally {
      // setIsResending(false); // Re-enable the button
    }
  };

  // Countdown Timer Logic
  React.useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);
  return (
    <div className="verifyEmail" style={{}}>
      <img src={logo} width={100} height={100} alt="Logo" />
      <h1 className="title1">Enter the OTP, </h1>
      <h1 className="title2"> Verify Your Email.</h1>
      <div
        style={{
          justifyItems: "center",
          marginTop: "70px",
          border: "2px solid #82EAAC",
          backgroundColor: "rgb(180, 228, 199)",
          borderRadius: "10px",
          color: "#030E82",
          marginBottom: "70px",
          padding: "20px",
        }}
      >
        <p style={{ fontSize: "20px", fontWeight: "bold" }}>
          We've sent a One-Time Password (OTP) to your email address. Please
          enter it below to verify your email address.
        </p>
        <p style={{ fontSize: "18px" }}>
          If you haven't received the OTP, please check your spam folder or
          click the Resend button.
        </p>
      </div>
      <div
        className="otpInput"
        style={{ textAlign: "center", marginBottom: "50px" }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)} // Set refs for input fields
              style={{
                width: "50px",
                height: "50px",
                textAlign: "center",
                fontSize: "20px",
                border: "1px solid #F49696",
                borderRadius: "5px",
              }}
            />
          ))}
        </div>
      </div>
      <div
        className="buttons"
        style={{ marginBottom: "90px", textAlign: "center" }}
      >
        <button
          onClick={handleVerifyOtp}
          style={{
            marginRight: "10px",
            height: "40px",
            width: "100px",
            borderRadius: "10px",
            backgroundColor: "#82EAAC",
            border: "none",
            fontWeight: "bold",
            color: "#030E82",
          }}
        >
          Verify
        </button>
        {timer === 0 ? (
          <button
            onClick={handleResendOtp}
            style={{
              marginLeft: "10px",
              height: "40px",
              width: "100px",
              borderRadius: "10px",
              backgroundColor: "#F49696",
              border: "none",
              fontWeight: "bold",
              color: "#030E82",
            }}
          >
            Resend
          </button>
        ) : (
          <p>Resend OTP in {timer}s</p>
        )}
        {status && <p className="status-message">{status}</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;
