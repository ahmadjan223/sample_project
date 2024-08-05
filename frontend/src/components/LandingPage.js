// src/components/LandingPage.js
import React from 'react';

const LandingPage = () => {
  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:3000/auth/google'; // Replace with your backend URL if it's different
  };

  

  return (
    <div style={styles.container}>
      <h1>Welcome to Our App</h1>
      <button onClick={handleGoogleSignIn} style={styles.button}>
        Sign in with Google
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#4285F4',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    marginTop: '20px',
  },
};

export default LandingPage;
