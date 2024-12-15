import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalRevenue: 0,
    monthlyRevenue: [],
    yearlyRevenue: [],
  });
  const [view, setView] = useState('month'); // Default view for revenue stats

  useEffect(() => {
    // Fetch statistics from the backend (this is just a placeholder)
    const fetchedStats = {
      totalMembers: 120,
      totalRevenue: 15000,
      monthlyRevenue: [
        { month: 'January', revenue: 2000 },
        { month: 'February', revenue: 1800 },
      ],
      yearlyRevenue: [
        { year: 2023, revenue: 15000 },
        { year: 2022, revenue: 12000 },
      ],
    };
    setStats(fetchedStats);
  }, []);

  return (
    <div className="home">
      <h2>Welcome to the Gym Dashboard</h2>

      <div className="stats">
        {/* Total Active Members */}
        <div className="stat-card">
          <h3>Total Active Members</h3>
          <p>{stats.totalMembers}</p>
        </div>

        {/* Total Revenue */}
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${stats.totalRevenue.toLocaleString()}</p>
        </div>

        {/* Revenue Stats */}
        <div className="stat-card revenue">
          <h3>Revenue Statistics</h3>
          <div className="toggle-buttons">
            <button
              className={view === 'month' ? 'active' : ''}
              onClick={() => setView('month')}
            >
              By Month
            </button>
            <button
              className={view === 'year' ? 'active' : ''}
              onClick={() => setView('year')}
            >
              By Year
            </button>
          </div>
          <ul>
            {view === 'month' &&
              stats.monthlyRevenue.map((item) => (
                <li key={item.month}>
                  {item.month}: ${item.revenue.toLocaleString()}
                </li>
              ))}
            {view === 'year' &&
              stats.yearlyRevenue.map((item) => (
                <li key={item.year}>
                  {item.year}: ${item.revenue.toLocaleString()}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
