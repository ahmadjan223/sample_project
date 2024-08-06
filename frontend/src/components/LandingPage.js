// src/components/LandingPage.js
import React from "react";
import landingPageImage from "../images/landingPage.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons"; // Correct import for the Google icon

const LandingPage = () => {
  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:3000/auth/google"; // Replace with your backend URL if it's different
  };

  return (
    <div style={styles.container}>
      <div style={styles.imgContainer}>
        <img src={landingPageImage} alt="Landing Page" style={styles.image} />
      </div>
      <div style={styles.textbox}>
        <div style={styles.makeCenter}>
          <h1 style={styles.text}>Dense Fusion</h1>
          <a>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi a praesentium quibusdam blanditiis harum suscipit minima voluptate dolorum quo totam.</a>
          <button onClick={handleGoogleSignIn} style={styles.button}>
            <FontAwesomeIcon icon={faGoogle} style={styles.icon} /> Sign in with
            Google
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  },
  makeCenter: {
    justifyContent: "left",
    // backgroundColor:'green'
    width: "50%",
  },
  imgContainer: {
    flex: 1,
    backgroundColor: "green",
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100vh", // Ensure it covers the full height of the viewport
    objectFit: "cover", // Ensures the image covers the container without stretching
    marginBottom: "20px",
  },
  textbox: {
    flex: 1,
    display: "flex", // Enable Flexbox
    justifyContent: "center", // Center horizontally
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
  text: {
    color: "#333", // Dark grey text color
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Adds shadow to the text
    fontFamily: "'Arial', sans-serif", // Change font family
    fontSize: "36px", // Change font size
    fontWeight: "bold", // Make the text bold
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold", // Corrected spelling
    cursor: "pointer",
    backgroundColor: "transparent", // Transparent background
    color: "grey", // Dark grey text color
    border: "2px solid #00BFFF", // Blue border
    borderRadius: "50px", // Fully rounded corners
    marginTop: "20px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow to the button
  },
  icon: {
    marginRight: "10px",
    color: "00BFFF", // Space between icon and text
  },
};

export default LandingPage;