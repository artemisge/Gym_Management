import React, { useState, useEffect } from 'react';
import './UserDisplay.css';

const UserDisplay = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState(null); // Separate state for editable user
  const [payments, setPayments] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState({ email: '', phone: '' });

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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) => /^[+\-0-9]{10,15}$/.test(phone);

  const toggleEdit = () => {
    if (!isEditable) {
      setEditableUser({ ...user }); // Copy user data into editableUser
    }
    setIsEditable((prev) => !prev);
    setFormError({ email: '', phone: '' }); // Clear errors when toggling edit mode
  };

  const handleSave = async () => {
    const errors = {
      email: !validateEmail(editableUser.email) ? 'Invalid email format' : '',
      phone: !validatePhone(editableUser.phone) ? 'Phone must be 10-15 digits (0-9 and +/-)' : '',
    };

    setFormError(errors);

    if (errors.email || errors.phone) return;

    try {
      const response = await fetch(`http://localhost:8080/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editableUser),
      });
      if (!response.ok) {
        throw new Error('Failed to save user data');
      }
      const updatedUser = await response.json();
      setUser(updatedUser); // Update user with valid changes
      setEditableUser(null); // Clear editableUser after save
      setIsEditable(false);
      onClose(true); // Notify parent that the user was edited, trigger refresh in parent
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setIsEditable(false);
    setEditableUser(null); // Discard editable changes
    setFormError({ email: '', phone: '' }); // Clear validation errors
  };

  if (loading) return <div className="userdisplay-modal-overlay">Loading...</div>;

  if (error) {
    return (
      <div className="userdisplay-modal-overlay">
        <div className="userdisplay-modal">
          <button className="userdisplay-close-btn" onClick={onClose}>×</button>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="userdisplay-modal-overlay">
      <div className="userdisplay-modal">
        <button className="userdisplay-close-btn" onClick={onClose}>×</button>
        <h2 className="userdisplay-modal-title">User Profile</h2>
        <div className="userdisplay-modal-content">
          <div className="userdisplay-info">
            {['name', 'email', 'phone'].map((field) => (
              <div className="userdisplay-form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                {isEditable ? (
                  <>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      value={editableUser[field]}
                      onChange={(e) =>
                        setEditableUser({ ...editableUser, [field]: e.target.value })
                      }
                    />
                    {formError[field] && (
                      <small className="userdisplay-warning">{formError[field]}</small>
                    )}
                  </>
                ) : (
                  <span>{user[field]}</span>
                )}
              </div>
            ))}
            <div className="userdisplay-form-group">
              <label>Membership Expiration:</label>
              {isEditable ? (
                <input
                  type="date"
                  value={editableUser.expirationDate || ''}
                  onChange={(e) =>
                    setEditableUser({ ...editableUser, expirationDate: e.target.value })
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
          <div className="userdisplay-payments">
            <h4>Payment History</h4>
            <ul className="userdisplay-payment-list">
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
        <div className="userdisplay-modal-footer">
          {!isEditable ? (
            <button className="userdisplay-button userdisplay-button-edit" onClick={toggleEdit}>Edit</button>
          ) : (
            <>
              <button className="userdisplay-button userdisplay-button-save" onClick={handleSave}>Save</button>
              <button className="userdisplay-button userdisplay-button-cancel" onClick={handleCancel}>Cancel</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDisplay;
