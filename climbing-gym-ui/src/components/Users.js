import React, { useState, useEffect } from 'react';
import './Users.css';
import AddUser from './AddUser'; // Import AddUser modal
import UserDisplay from './UserDisplay'; // Import UserDisplay modal
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('id');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActiveUsers, setShowActiveUsers] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/users')
      .then(response => {
        const usersWithStatus = response.data.map(user => ({
          ...user,
          isMembershipActive: false, // Initialize membership status
        }));
        setUsers(usersWithStatus);
        setFilteredUsers(usersWithStatus);
        fetchMembershipStatuses(usersWithStatus); // Fetch membership status for each user
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  // Fetch membership status for each user
  const fetchMembershipStatuses = (users) => {
    users.forEach(user => {
      axios.get(`http://localhost:8080/users/${user.id}/membership-status`)
        .then(response => {
          const updatedUsers = [...users];
          const userIndex = updatedUsers.findIndex(u => u.id === user.id);
          if (userIndex !== -1) {
            updatedUsers[userIndex].isMembershipActive = response.data;
          }
          setUsers(updatedUsers); // Update the users with the membership status
          setFilteredUsers(updatedUsers); // Update filtered users as well
        })
        .catch(error => console.error('Error fetching membership status:', error));
    });
  };

  // Filter users based on active status
  const filterUsers = () => {
    if (showActiveUsers) {
      return users.filter(user => user.isMembershipActive);
    }
    return users;
  };

  // Search Functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const results = filterUsers().filter((user) =>
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
  const handleUserDisplay = (user) => {
    window.history.pushState({}, '', `/users/${user.id}`); // Update URL
    setSelectedUser(user);
  };
  const handleCloseUserDisplay = () => {
    setSelectedUser(null); // Close the modal
    window.history.pushState({}, '', '/users'); // Reset the URL to /users
  };

  // Toggle Active/All Users
  const handleToggleActiveUsers = () => {
    setShowActiveUsers(!showActiveUsers);
    setFilteredUsers(filterUsers());
  };

  const activeUserCount = users.filter(user => user.isMembershipActive).length;

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

      {/* Toggle Button for Active/All Users */}
      <div className="user-filter">
        <button
          className={`filter-btn ${showActiveUsers ? 'active' : ''}`}
          onClick={handleToggleActiveUsers}
        >
          {showActiveUsers ? 'Show All Users' : 'Show Active Users'}
        </button>
        <span className="user-count">
          {showActiveUsers ? `${activeUserCount} Active` : `${users.length} Total`}
        </span>
      </div>

      {/* User List */}
      <ul className="user-list">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            className="user-item"
            onClick={() => handleUserDisplay(user)} // Make the whole row clickable
          >
            <div className="user-name">{user.name}</div>
            <div className={`membership-status ${user.isMembershipActive ? 'active' : 'inactive'}`}>
              {user.isMembershipActive ? 'Active' : 'Inactive'}
            </div>
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
          userId={selectedUser.id} // Pass only the userId
          onClose={handleCloseUserDisplay}
        />
      )}
    </div>
  );
};

export default Users;
