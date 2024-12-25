import React, { useState } from 'react';
import './AddUser.css'; // Styling for the modal

const AddUser = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null); // For error handling
  const [successMessage, setSuccessMessage] = useState(''); // For success feedback

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = { name, email, phone };

    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to add the user');
      }

      const result = await response.json();
      console.log('User added:', result); // Log the added user
      setSuccessMessage('User added successfully!');
      setTimeout(() => {
        onClose(); // Close the modal after a delay
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Failed to add the user. Please try again.');
    }
  };

  return (
    <div className="overlay">
      <div className="add-user-modal">
        <div className="modal-header">
          <h3>Add New User</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="modal-footer">
            <button type="submit" className="add-user-btn">
              Add User
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default AddUser;
