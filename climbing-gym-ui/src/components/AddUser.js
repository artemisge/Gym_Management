import React, { useState } from 'react';
import './AddUser.css'; // Styling for the modal

const AddUser = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null); // For error handling
  const [successMessage, setSuccessMessage] = useState(''); // For success feedback

  // Function to check if the email or phone already exists
  const validateUserUniqueness = async () => {
    try {
      // Check if the email already exists
      const emailResponse = await fetch(`http://localhost:8080/users/email/${email}`);
      console.log("email" + emailResponse.ok);
      if (!emailResponse.ok) {
        setError('Email is already taken');
        return false; // Validation failed
      }

      // Check if the phone already exists
      const phoneResponse = await fetch(`http://localhost:8080/users/phone/${phone}`);
      console.log("phone" + phoneResponse.ok);
      if (!phoneResponse.ok) {
        setError('Phone number is already taken');
        return false; // Validation failed
      }

      return true; // If both are unique, return true
    } catch (error) {
      throw new Error(error.message); // Propagate the error message
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate user uniqueness before proceeding
      const isValid = await validateUserUniqueness();
      if (!isValid) {
        return; // Stop submission if validation fails
      }
      const newUser = { name, email, phone };
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      console.log('Response Text:', response);

      if (!response.ok) {
        throw new Error('Failed to add the user');
      }

      const result = await response.json();
      console.log('User added:', result); // Log the added user
      setSuccessMessage('User added successfully!');
      onClose(true);
      setTimeout(() => {
        onClose(); // Close the modal after a delay
      }, 1000);
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
            <button type="button" className="add-user-cancel-btn" onClick={onClose}>
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
