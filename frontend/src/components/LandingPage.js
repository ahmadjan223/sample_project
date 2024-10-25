// src/components/LandingPage.js
import React from "react";
import logo from "../images/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons"; // Correct import for the Google icon

const LandingPage = () => {
  console.log(process.env.REACT_APP_BACKEND, "Backend URL");
  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:3000/auth/google"; // Replace with your backend URL if it's different
  };

  return (
    //     <div style={styles.container}>
    // //left dide ki photo
    //       <div style={styles.imgContainer}>
    //         <img src={landingPageImage} alt="Landing Page" style={styles.image} />
    //       </div>

    //       <div style={styles.textbox}>
    //         <div style={styles.makeCenter}>
    //           <h1 style={styles.text}>Dense Fusion</h1>

    //           <a>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi a praesentium quibusdam blanditiis harum suscipit minima voluptate dolorum quo totam.</a>

    //           <button onClick={handleGoogleSignIn} style={styles.button}>

    //             <FontAwesomeIcon icon={faGoogle} style={styles.icon} /> Sign in with
    //             Google
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        height: "100vh", // Full height of the viewport
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: 678,
          height: "100vh", // Full height of the viewport

          gap: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            flexGrow: 0,
            flexShrink: 0,
            width: 557,
            position: "relative",
            gap: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              alignSelf: "stretch",
              flexGrow: 0,
              flexShrink: 0,
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                flexGrow: 0,
                flexShrink: 0,
                width: 521,
                gap: 64,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexGrow: 0,
                  flexShrink: 0,
                  position: "relative",
                  gap: 16,
                }}
              >
                <img
                  src={logo}
                  style={{
                    flexGrow: 0,
                    flexShrink: 0,
                    width: 48,
                    height: 48,
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexGrow: 0,
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  <p
                    style={{
                      flexGrow: 0,
                      flexShrink: 0,
                      fontSize: 32,
                    
                      fontWeight: 700,
                      textAlign: "center", // Changed to "center"
                      color: "#000",
                      paddingTop:10,
                    }}
                  >
                    Crop Monitoring
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "stretch",
                  flexGrow: 0,
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                <p
                  style={{
                    flexGrow: 0,
                    flexShrink: 0,
                    fontSize: 40,
                    fontWeight: 700,
                    textAlign: "left",
                    color: "#000",
                  }}
                >
                  Welcome to Crop Monitoring
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "stretch",
                flexGrow: 0,
                flexShrink: 0,
                position: "relative",
              }}
            >
              <p
                style={{
                  flexGrow: 0,
                  flexShrink: 0,
                  fontSize: 20,
                  textAlign: "left",
                  color: "#708090",
                }}
              >
                Please continue with your google account to login to crop
                control.
              </p>
            </div>
          </div>
          <div
            style={{
              alignSelf: "stretch",
              flexGrow: 0,
              flexShrink: 0,
              height: 52,
              position: "relative",
            }}
          >
            <button
              style={{
                width: 557,
                height: 52,
                position: "absolute",
                left: 0,
                top: 1,
                borderRadius: 6,
                background: "#fff",
                borderWidth: 0.5,
                // borderColor: "#cbd5e1",
              }}
              onClick={handleGoogleSignIn}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  position: "absolute",
                  left: 169,
                  top: 4,
                  gap: 8,
                }}
              >
                <svg
                  width={45}
                  height={44}
                  viewBox="0 0 45 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    flexGrow: 0,
                    flexShrink: 0,
                    width: 44,
                    height: 44,
                    position: "relative",
                  }}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <rect x="0.5" width={44} height={44} rx={1} fill="white" />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M32.004 22.225C32.004 21.523 31.941 20.848 31.824 20.2H22.5V24.0295H27.828C27.5985 25.267 26.901 26.3155 25.8525 27.0175V29.5015H29.052C30.924 27.778 32.004 25.24 32.004 22.225Z"
                    fill="#4285F4"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22.5 31.9C25.173 31.9 27.414 31.0135 29.052 29.5015L25.8525 27.0175C24.966 27.6115 23.832 27.9625 22.5 27.9625C19.9215 27.9625 17.739 26.221 16.9605 23.881H13.653V26.446C15.282 29.6815 18.63 31.9 22.5 31.9Z"
                    fill="#34A853"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16.9605 23.881C16.7625 23.287 16.65 22.6525 16.65 22C16.65 21.3475 16.7625 20.713 16.9605 20.119V17.554H13.653C12.9825 18.8905 12.6 20.4025 12.6 22C12.6 23.5975 12.9825 25.1095 13.653 26.446L16.9605 23.881Z"
                    fill="#FBBC05"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22.5 16.0375C23.9535 16.0375 25.2585 16.537 26.2845 17.518L29.124 14.6785C27.4095 13.081 25.1685 12.1 22.5 12.1C18.63 12.1 15.282 14.3185 13.653 17.554L16.9605 20.119C17.739 17.779 19.9215 16.0375 22.5 16.0375Z"
                    fill="#EA4335"
                  />
                </svg>
                <p
                  style={{
                    flexGrow: 0,
                    flexShrink: 0,
                    fontSize: 18,
                    textAlign: "left",
                    color: "#0f172a",
                    fontFamily: "Segoe UI",
                    paddingTop:5,
                  }}
                >
                  Continue with Google
                </p>
              </div>
            </button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "stretch",
            flexGrow: 0,
            flexShrink: 0,
            position: "relative",
          }}
        >
          <p
            style={{
              flexGrow: 0,
              flexShrink: 0,
              fontSize: 20,
              textAlign: "left",
              color: "#708090",
            }}
          >
            By continuing you agree to Crop Control’s terms &amp; conditions and
            Privacy Policy.
          </p>
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
