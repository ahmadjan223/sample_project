import React, { useState } from 'react';

const BottomBar = ({
  layer,
  date,
  setDate,
  setLayer
}) => {

  return (
    <div style={styles.bottomBar}>
      {/* Date Picker */}
      <input 
        type="date" 
        value={date} 
        onChange={(e) => setDate(e.target.value)} 
        style={styles.datePicker}
      />

      {/* Dropdown Menu */}
      <select 
        value={layer} 
        onChange={(e) => {setLayer(e.target.value)
          console.log('ndvi value is changed')
        }} 
        style={styles.dropdownMenu}
      >
       <option value="AGRICULTURE">Agriculture</option>
            <option value="BATHYMETRIC">Bathymetric</option>
            <option value="FALSE-COLOR-URBAN">False color (urban)</option>
            <option value="FALSE-COLOR">False color (vegetation)</option>
            <option value="GEOLOGY">Geology</option>
            <option value="MOISTURE-INDEX">Moisture Index</option>
            <option value="NATURAL-COLOR">Natural color (true color)</option>
            <option value="NDVI">NDVI</option>
            <option value="SWIR">SWIR</option>
            <option value="TRUE-COLOR-S2L2A">TRUE COLOR S2L2A</option>
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
