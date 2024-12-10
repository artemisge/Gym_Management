import React, { useState, useEffect } from 'react';
import "./Packages.css"
const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({ name: '', price: '', duration: '' });

  useEffect(() => {
    // Fetch packages from the backend (this is just a placeholder)
    setPackages([
      { id: 1, name: '1 Month', price: 30, duration: 30 },
      { id: 2, name: '3 Months', price: 75, duration: 90 },
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the new package to the backend
    setPackages([...packages, { ...newPackage, id: packages.length + 1 }]);
    setNewPackage({ name: '', price: '', duration: '' });
  };

  return (
    <div className="packages">
      <h2>Manage Packages</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Package Name"
          value={newPackage.name}
          onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newPackage.price}
          onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Duration (days)"
          value={newPackage.duration}
          onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
        />
        <button type="submit">Add Package</button>
      </form>

      <ul>
        {packages.map((pkg) => (
          <li key={pkg.id}>
            {pkg.name} - ${pkg.price} for {pkg.duration} days
            <button>Edit</button>
            <button>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Packages;
