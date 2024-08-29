import React, { useState } from 'react';

const BottomBar = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedImageOption, setSelectedImageOption] = useState('');

  return (
    <div style={styles.bottomBar}>
      {/* Date Picker */}
      <input 
        type="date" 
        value={selectedDate} 
        onChange={(e) => setSelectedDate(e.target.value)} 
        style={styles.datePicker}
      />

      {/* Dropdown Menu */}
      <select 
        value={selectedImageOption} 
        onChange={(e) => setSelectedImageOption(e.target.value)} 
        style={styles.dropdownMenu}
      >
        <option value="">Select Image Option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
    </div>
  );
};

const styles = {
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px',
    backgroundColor: '#f8f8f8',
    boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
  },
  datePicker: {
    padding: '8px',
    fontSize: '16px',
  },
  dropdownMenu: {
    padding: '8px',
    fontSize: '16px',
  }
};

export default BottomBar;
