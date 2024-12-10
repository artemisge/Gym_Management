import React, { useState, useEffect } from 'react';
import './Home.css'
const Home = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [revenue, setRevenue] = useState({ monthly: 0, yearly: 0, total: 0 });
  
  useEffect(() => {
    // Replace these with API calls to fetch actual data from your backend
    setActiveUsers(10); // Dummy data for active users
    setRevenue({
      monthly: 500,
      yearly: 6000,
      total: 25000
    });
  }, []);

  return (
    <div className="home">
      <h2>Home</h2>
      <div className="stats">
        <div>
          <h3>Active Users: {activeUsers}</h3>
        </div>
        <div>
          <h3>Revenue:</h3>
          <ul>
            <li>Monthly: ${revenue.monthly}</li>
            <li>Yearly: ${revenue.yearly}</li>
            <li>Total: ${revenue.total}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
