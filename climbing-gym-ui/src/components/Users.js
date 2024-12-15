import React, { useState, useEffect } from 'react';
import './Users.css';
import AddUser from './AddUser'; // Import AddUser modal
import UserDisplay from './UserDisplay'; // Import UserDisplay modal

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('id');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Fetch users from the backend (this is just a placeholder)
    const fetchedUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        payments: [
          { date: '2024/12/09', amount: 20, package: 'Monthly Package' },
          { date: '2024/08/23', amount: 8, package: 'Daypass' }
        ],
        activeMembershipExpiration: '2025/12/09',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '987-654-3210',
        payments: [],
        activeMembershipExpiration: 'Inactive',
      },
    ];
    setUsers(fetchedUsers);
    setFilteredUsers(fetchedUsers); // Initialize filtered users
  }, []);

  // Search Functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const results = users.filter((user) =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.phone.toLowerCase().includes(term)
    );
    setFilteredUsers(results);
  };

  // Sorting Functionality
  const handleSort = (e) => {
    const option = e.target.value;
    setSortOption(option);

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (option === 'id') return a.id - b.id;
      if (option === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    setFilteredUsers(sortedUsers);
  };

  // Modal Handlers
  const handleAddUser = () => setShowAddUserModal(true);
  const handleCloseAddUserModal = () => setShowAddUserModal(false);
  const handleUserDisplay = (user) => setSelectedUser(user);
  const handleCloseUserDisplay = () => setSelectedUser(null);

  return (
    <div className="users">
      <h2>Manage Users</h2>

      {/* Search and Sort Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <select value={sortOption} onChange={handleSort} className="sort-dropdown">
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* User List */}
      <ul className="user-list">
        {filteredUsers.map((user) => (
          <li key={user.id} className="user-item">
            <span onClick={() => handleUserDisplay(user)}>{user.name}</span>
          </li>
        ))}
      </ul>

      {/* Add New User Button */}
      <button onClick={handleAddUser} className="add-user-button">+</button>

      {/* Show Add User Modal */}
      {showAddUserModal && <AddUser onClose={handleCloseAddUserModal} />}

      {/* Show User Display Modal */}
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
