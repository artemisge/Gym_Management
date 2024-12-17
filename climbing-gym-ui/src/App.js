import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Users from './components/Users';
import Packages from './components/Packages';
import Payments from './components/Payments';
import './App.css'; // Import global styles

const App = () => {
  return (
    <Router>
      <div className="app-container"> {/* Updated to match the CSS structure */}
        <Sidebar />
        <main className="main-content"> {/* Apply the main-content class */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/payments" element={<Payments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
