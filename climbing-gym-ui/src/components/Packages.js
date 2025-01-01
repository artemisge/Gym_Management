import React, { useState, useEffect } from 'react';
import './Packages.css';
import axios from 'axios';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({ name: '', price: '', duration: '', available: true });
  const [filter, setFilter] = useState('active'); // 'active' or 'all'
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (newPackage.price <= 0 || newPackage.durationInDays <= 0) {
      alert('Price and duration must be positive values.');
      return;
    }

    // Send the new package to the backend
    axios.post('http://localhost:8080/packages', newPackage)
      .then(response => {
        // Add the new package to the state after successfully creating it
        setPackages([...packages, response.data]);
        setNewPackage({ name: '', price: '', duration: '', available: true });
        setIsModalOpen(false); // Close the modal
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
    const packageToDelete = packages.find(pkg => pkg.id === id);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the package "${packageToDelete.name}"? This action cannot be undone.`
    );
  
    if (confirmDelete) {
      setPackages(packages.filter(pkg => pkg.id !== id));
  
      // Send delete request to backend
      axios
        .delete(`http://localhost:8080/packages/${id}`)
        .then(() => {
          alert(`Package "${packageToDelete.name}" has been deleted successfully.`);
        })
        .catch(error => {
          console.error('Error deleting package:', error);
          alert(`Failed to delete the package "${packageToDelete.name}". Please try again.`);
        });
    }
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
        onClick={() => setIsModalOpen(true)}
      >
        + Add New Package
      </button>

      {/* Package List */}
      <div className="package-list">
        {filteredPackages.map(pkg => (
          <div className="package-item" key={pkg.id}>
            <div>
              <strong>{pkg.name}</strong> - ${pkg.price} for {pkg.durationInDays} day(s)
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

      {/* Add Package Form Modal */}
      {isModalOpen && (
        <div className="overlay">
          <div className="add-package-modal">
            <div className="modal-header">
              <h3>Add New Package</h3>
            </div>
            <form className="packages-addform" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Package Name:</label>
                <input
                  type="text"
                  value={newPackage.name}
                  onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  value={newPackage.price}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, price: e.target.value >= 0 ? e.target.value : '' })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration (days):</label>
                <input
                  type="number"
                  value={newPackage.durationInDays}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, durationInDays: e.target.value >= 0 ? e.target.value : '' })
                  }
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="submit" className="package-submit-btn">Add Package</button>
                <button type="button" className="package-cancel-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;
