import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <h1>Welcome to the Class Schedule and Homework Management App</h1>
            <p>This application helps you manage your class schedules and homework assignments efficiently.</p>
            <div className="navigation-links">
                <Link to="/login">Login</Link>
                <Link to="/dashboard">Dashboard</Link>
            </div>
        </div>
    );
};

export default Home;