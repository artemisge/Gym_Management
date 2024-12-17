import React, { useState, useEffect } from 'react';
import './Packages.css';
import axios from 'axios';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({ name: '', price: '', duration: '', available: true });
  const [filter, setFilter] = useState('active'); // 'active' or 'all'

  useEffect(() => {
    // Fetch packages from the backend
    axios.get('http://localhost:8080/packages')
      .then(response => {
        setPackages(response.data);  // Set the fetched packages data
      })
      .catch(error => console.error('Error fetching packages:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure valid inputs
    if (newPackage.price <= 0 || newPackage.duration <= 0) {
      alert('Price and duration must be positive values.');
      return;
    }

    // Send the new package to the backend
    axios.post('http://localhost:8080/packages', newPackage)
      .then(response => {
        // Add the new package to the state after successfully creating it
        setPackages([...packages, response.data]);
        setNewPackage({ name: '', price: '', duration: '', available: true });
        document.getElementById('add-package-form').style.display = 'none';
      })
      .catch(error => {
        console.error('Error adding new package:', error);
      });
  };

  const handleToggleAvailability = (id) => {
    setPackages(packages.map(pkg => pkg.id === id ? { ...pkg, available: !pkg.available } : pkg));
    
    // Update the availability in the backend
    const packageToUpdate = packages.find(pkg => pkg.id === id);
    axios.put(`http://localhost:8080/packages/${id}`, { ...packageToUpdate, available: !packageToUpdate.available })
      .catch(error => console.error('Error updating package availability:', error));
  };

  const handleDeletePackage = (id) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
    
    // Send delete request to backend
    axios.delete(`http://localhost:8080/packages/${id}`)
      .catch(error => console.error('Error deleting package:', error));
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
