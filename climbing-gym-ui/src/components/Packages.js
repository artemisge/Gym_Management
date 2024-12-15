import React, { useState, useEffect } from 'react';
import './Packages.css';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({ name: '', price: '', duration: '', available: true });
  const [filter, setFilter] = useState('active'); // 'active' or 'all'

  useEffect(() => {
    // Fetch packages from the backend (placeholder data for now)
    setPackages([
      { id: 1, name: 'Day Pass', price: 7, duration: 1, available: true },
      { id: 2, name: '1 Month Pass', price: 50, duration: 30, available: true },
      { id: 3, name: '3 Month Pass', price: 130, duration: 90, available: false },
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure valid inputs
    if (newPackage.price <= 0 || newPackage.duration <= 0) {
      alert('Price and duration must be positive values.');
      return;
    }
    setPackages([...packages, { ...newPackage, id: packages.length + 1 }]);
    setNewPackage({ name: '', price: '', duration: '', available: true });
    document.getElementById('add-package-form').style.display = 'none';
  };

  const handleToggleAvailability = (id) => {
    setPackages(packages.map(pkg => pkg.id === id ? { ...pkg, available: !pkg.available } : pkg));
  };

  const handleDeletePackage = (id) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

  const filteredPackages = packages.filter(pkg => filter === 'all' || pkg.available);

  return (
    <div className="packages">
      <h2>Manage Packages</h2>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Active Packages
        </button>
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Packages
        </button>
      </div>

      {/* Add New Package Button */}
      <button
        className="add-package-button"
        onClick={() => (document.getElementById('add-package-form').style.display = 'block')}
      >
        + Add New Package
      </button>

      {/* Package List */}
      <div className="package-list">
        {filteredPackages.map(pkg => (
          <div className="package-item" key={pkg.id}>
            <div>
              <strong>{pkg.name}</strong> - ${pkg.price} for {pkg.duration} day(s)
            </div>
            <div>
              <span className={pkg.available ? 'status-active' : 'status-inactive'}>
                {pkg.available ? 'Active' : 'Inactive'}
              </span>
              <button onClick={() => handleToggleAvailability(pkg.id)}>
                {pkg.available ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => handleDeletePackage(pkg.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Package Form (Hidden by default) */}
      <div id="add-package-form" className="add-package-form">
        <h3>Add New Package</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Package Name"
            value={newPackage.name}
            onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newPackage.price}
            onChange={(e) =>
              setNewPackage({ ...newPackage, price: e.target.value >= 0 ? e.target.value : '' })
            }
            required
          />
          <input
            type="number"
            placeholder="Duration (days)"
            value={newPackage.duration}
            onChange={(e) =>
              setNewPackage({ ...newPackage, duration: e.target.value >= 0 ? e.target.value : '' })
            }
            required
          />
          <button type="submit">Add Package</button>
          <button
            type="button"
            onClick={() => (document.getElementById('add-package-form').style.display = 'none')}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default Packages;
