import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-icon">○</span>
            <span className="logo-text">Weather Odds</span>
          </div>
        </div>
        <div className="nav-center">
          <Link to="/" className="nav-link">Home</Link>
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">Contact</a>
        </div>
        <div className="nav-right">
          <Link to="/build-query">
            <button className="login-btn">Log In</button>
          </Link>
          <Link to="/build-query">
            <button className="signup-btn">Sign Up</button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="hero-section">
          <h1 className="hero-title">
            Plan your outdoor<br />
            activities with<br />
            confidence
          </h1>
          <p className="hero-subtitle">
            Get historical weather data to know the odds of adverse<br />
            conditions for your next adventure.
          </p>

          <div className="search-section">
            <div className="search-container">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search for a location, e.g., 'Yosemite National Park'"
                className="search-input"
              />
            </div>

            <div className="activity-buttons">
              <button className="activity-btn">
                <span className="activity-icon">🏖</span>
                Beach
              </button>
              <button className="activity-btn">
                <span className="activity-icon">🥾</span>
                Hike
              </button>
              <button className="activity-btn">
                <span className="activity-icon">🎣</span>
                Fishing
              </button>
              <button className="activity-btn">
                <span className="activity-icon">🏢</span>
                City
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;