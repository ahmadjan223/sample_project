import React from 'react';

const Alert = ({ heading, message, onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.alertBox}>
        <div style={styles.heading}>{heading}</div>
        <div style={styles.message}>{message}</div>
        <button style={styles.button} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    zIndex: 1000,
  },
  alertBox: {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    width: '300px',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: '18px',
    marginBottom: '10px',
  },
  message: {
    fontSize: '14px',
    marginBottom: '20px',
  },
  button: {
    background: '#007BFF', // Bootstrap primary color
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Alert;
