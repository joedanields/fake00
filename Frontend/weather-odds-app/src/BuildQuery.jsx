import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BuildQuery.css';

const BuildQuery = () => {
  const [selectedDate, setSelectedDate] = useState(3);

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const handlePrevMonth = () => {
    // Previous month logic
  };

  const handleNextMonth = () => {
    // Next month logic
  };

  return (
    <div className="build-query-container">
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-icon">📊</span>
            <span className="logo-text">Weather Odds</span>
          </div>
        </div>
        <div className="nav-center">
          <Link to="/" className="nav-link">Home</Link>
          <a href="#" className="nav-link">Explore</a>
          <a href="#" className="nav-link">Docs</a>
          <a href="#" className="nav-link">Community</a>
        </div>
        <div className="nav-right">
          <Link to="/build-query">
            <button className="new-query-btn">New Query</button>
          </Link>
          <div className="user-avatar">
            <span>J</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">Build Query</h1>
            <p className="page-subtitle">Select location, time, and conditions to build your query.</p>
          </div>

          <div className="query-sections">
            {/* Location Section */}
            <section className="query-section">
              <h2 className="section-title">1. Location</h2>

              <div className="search-container">
                <div className="search-input-wrapper">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search for a location"
                    className="location-search"
                  />
                </div>
              </div>

              <div className="map-container">
                <div className="map-view">
                  <div className="map-overlay">
                    <div className="map-location-marker marker-beach">Beach</div>
                    <div className="map-location-marker marker-golden-gate">🌁</div>
                    <div className="map-location-marker marker-sf">San Francisco</div>
                    <div className="map-location-marker marker-park">🌳</div>
                    <div className="map-location-marker marker-china-town">China Town</div>
                  </div>
                </div>

                <div className="map-controls">
                  <button className="map-control-btn">
                    <span className="control-icon">📍</span>
                    Drop a Pin
                  </button>
                  <button className="map-control-btn">
                    <span className="control-icon">🔗</span>
                    Draw Area of Interest
                  </button>
                  <button className="map-control-btn">
                    <span className="control-icon">📍</span>
                    Use my location
                  </button>
                </div>
              </div>
            </section>

            {/* Time Section */}
            <section className="query-section">
              <h2 className="section-title">2. Time</h2>

              <div className="time-tabs">
                <button className="time-tab active">Single Date</button>
                <button className="time-tab">Date Range</button>
                <button className="time-tab">Season Window</button>
              </div>

              <div className="calendar-container">
                <div className="calendar-header">
                  <button className="calendar-nav" onClick={handlePrevMonth}>‹</button>
                  <h3 className="calendar-title">July 2024</h3>
                  <button className="calendar-nav" onClick={handleNextMonth}>›</button>
                </div>

                <div className="calendar-grid">
                  <div className="calendar-weekdays">
                    {daysOfWeek.map((day, index) => (
                      <div key={index} className="weekday">{day}</div>
                    ))}
                  </div>

                  <div className="calendar-days">
                    {calendarDays.map((day) => (
                      <button
                        key={day}
                        className={`calendar-day ${selectedDate === day ? 'selected' : ''}`}
                        onClick={() => handleDateClick(day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuildQuery;