import React, { useState } from 'react';
import './UserDisplay.css';

const UserDisplay = ({ user, onClose }) => {
  const [isEditable, setIsEditable] = useState(false);

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  return (
    <div className="modal-overlay">
      <div className="user-display-modal">
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {/* Title */}
        <h2 className="modal-title">User Profile</h2>

        <div className="modal-content">
          {/* Left Side: User Info */}
          <div className="user-info">
            <div className="form-group">
              <label>Name:</label>
              {isEditable ? (
                <input type="text" defaultValue={user.name} />
              ) : (
                <span>{user.name}</span>
              )}
            </div>
            <div className="form-group">
              <label>Email:</label>
              {isEditable ? (
                <input type="email" defaultValue={user.email} />
              ) : (
                <span>{user.email}</span>
              )}
            </div>
            <div className="form-group">
              <label>Phone:</label>
              {isEditable ? (
                <input type="text" defaultValue={user.phone} />
              ) : (
                <span>{user.phone}</span>
              )}
            </div>
            <div className="form-group">
              <label>Membership Expiration:</label>
              {isEditable ? (
                <input
                  type="text"
                  defaultValue={user.activeMembershipExpiration || 'Inactive'}
                />
              ) : (
                <span>{user.activeMembershipExpiration || 'Inactive'}</span>
              )}
            </div>
          </div>

          {/* Right Side: Payment History */}
          <div className="user-payments">
            <h4>Payment History</h4>
            <ul className="payment-list">
              {user.payments.length > 0 ? (
                user.payments.map((payment, index) => (
                  <li key={index}>
                    {payment.date} - ${payment.amount} ({payment.package})
                  </li>
                ))
              ) : (
                <li>No payments available</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="modal-footer">
          {!isEditable && (
            <button className="edit-btn" onClick={toggleEdit}>
              Edit
            </button>
          )}
          {isEditable && (
            <>
              <button className="save-btn" onClick={toggleEdit}>
                Save
              </button>
              <button className="cancel-btn" onClick={toggleEdit}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDisplay;
