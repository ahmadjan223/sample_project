import React from 'react';

const Dashboard = ({ user }) => {
    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
            <p>You are logged in as {user.displayName}</p>
            <p>Your user ID is {user.id}</p>
            <img src={user.image} alt={user.displayName} />
        </div>
    );
}

export default Dashboard;
