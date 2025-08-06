import logo from "../../static/DocLink_Logo_Bg.png";
import { useNavigate } from "react-router-dom";
import "./Hero.css"; // Make sure to create or update this CSS file

const Hero = ({ scrollToServices }) => {
  const navigate = useNavigate();
  return (
    <div className="hero">
      <img src={logo} width={100} height={100} alt="Logo" />
      <div style={{ float: "right", right: 0 }}></div>
      <h1 className="title1">Your Health,</h1>
      <h1 className="title2">Just a Click Away.</h1>
      <h5 className="text" style={{ fontWeight: "1px", fontStyle: "italic" }}>
        Seamless Healthcare, Anytime, Anywhere!
      </h5>
      <div className="button-container">
        <button
          onClick={() => {
            navigate("/register");
          }}
          className="hero-button"
        >
          Sign Up
        </button>
        <button onClick={scrollToServices} className="hero-button">
          Explore Services
        </button>
      </div>
    </div>
  );
};

export default Hero;
