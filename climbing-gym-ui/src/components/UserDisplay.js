import React, { useState, useEffect } from 'react';
import './UserDisplay.css';

const UserDisplay = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPayments = async () => {
      try {
        const response = await fetch(`http://localhost:8080/payments/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user payments');
        }
        const data = await response.json();
        setPayments(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
    fetchUserPayments();
  }, [userId]);

  const toggleEdit = () => setIsEditable((prev) => !prev);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Failed to save user data');
      }
      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditable(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => setIsEditable(false);

  if (loading) return <div className="modal-overlay">Loading...</div>;

  if (error) {
    return (
      <div className="modal-overlay">
        <div className="user-display-modal">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="user-display-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="modal-title">User Profile</h2>
        <div className="modal-content">
          <div className="user-info">
            {['name', 'email', 'phone'].map((field) => (
              <div className="form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                {isEditable ? (
                  <input
                    type="text"
                    value={user[field]}
                    onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                  />
                ) : (
                  <span>{user[field]}</span>
                )}
              </div>
            ))}
            <div className="form-group">
              <label>Membership Expiration:</label>
              {isEditable ? (
                <input
                  type="date"
                  value={user.expirationDate || ''}
                  onChange={(e) =>
                    setUser({ ...user, expirationDate: e.target.value })
                  }
                />
              ) : (
                <span>
                  {user.expirationDate 
                    ? new Date(user.expirationDate).toLocaleDateString('en-US') 
                    : 'Inactive'}
                </span>
              )}
            </div>
          </div>
          <div className="user-payments">
            <h4>Payment History</h4>
            <ul className="payment-list">
              {payments.length > 0
                ? payments.map((payment) => (
                    <li key={payment.id}>
                      {payment.paymentDate} - ${payment.amount} ({payment.packageType?.name || 'Unknown'})
                    </li>
                  ))
                : <li>No payments available</li>}
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          {!isEditable ? (
            <button className="edit-btn" onClick={toggleEdit}>Edit</button>
          ) : (
            <>
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDisplay;
