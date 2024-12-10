import React, { useState, useEffect } from 'react';
import './Users.css';
import AddUser from './AddUser'; // Import AddUser modal
import UserDisplay from './UserDisplay'; // Import UserDisplay modal

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false); // Modal state
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Fetch users from the backend (this is just a placeholder)
    setUsers([
      { 
        id: 1, 
        name: 'John Doe', 
        email: 'john@example.com', 
        phone: '123-456-7890',
        payments: [
          { date: '2024/12/09', amount: 20, package: 'Monthly Package' },
          { date: '2024/08/23', amount: 8, package: 'Daypass' }
        ],
        activeMembershipExpiration: '2025/12/09'
      },
      { 
        id: 2, 
        name: 'Jane Smith', 
        email: 'jane@example.com', 
        phone: '987-654-3210',
        payments: [],
        activeMembershipExpiration: 'Inactive'
      }
    ]);
  }, []);

  // Handle Add User Modal visibility
  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleCloseAddUserModal = () => {
    setShowAddUserModal(false);
  };

  // Handle User Display (Edit) Modal
  const handleUserDisplay = (user) => {
    setSelectedUser(user);
  };

  const handleCloseUserDisplay = () => {
    setSelectedUser(null);
  };

  return (
    <div className="users">
      <h2>Manage Users</h2>

      {/* User List */}
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <span onClick={() => handleUserDisplay(user)}>{user.name}</span>
          </li>
        ))}
      </ul>

      {/* Add New User Button */}
      <button onClick={handleAddUser} className="add-user-button">
        +
      </button>

      {/* Show Add User Modal */}
      {showAddUserModal && <AddUser onClose={handleCloseAddUserModal} />}

      {/* Show User Display Modal for Edit */}
      {selectedUser && (
        <UserDisplay
          user={selectedUser}
          onClose={handleCloseUserDisplay}
        />
      )}
    </div>
  );
};

export default Users;
