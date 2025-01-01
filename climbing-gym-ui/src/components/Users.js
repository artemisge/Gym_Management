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
  const [filter, setFilter] = useState('active'); // Filter for active or all users

  // Fetch users and membership statuses
  const fetchUsers = () => {
    axios.get('http://localhost:8080/users')
      .then(response => {
        const usersWithStatus = response.data.map(user => ({
          ...user,
          isMembershipActive: false, // Initialize membership status
        }));

        // Sort users by ID in ascending order (default behavior)
        const sortedUsers = usersWithStatus.sort((a, b) => a.id - b.id);

        setUsers(sortedUsers);
        fetchMembershipStatuses(sortedUsers); // Fetch membership status for each user
      })
      .catch(error => console.error('Error fetching users:', error));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply the filter and search term on initial load or when users or filter/search term changes
    const filtered = filterUsers(users, filter, searchTerm);
    setFilteredUsers(filtered);
  }, [users, filter, searchTerm]);

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
        })
        .catch(error => console.error('Error fetching membership status:', error));
    });
  };

  // Filter users based on active status and search term
  const filterUsers = (users, filter, searchTerm) => {
    const filteredByStatus = filter === 'active'
      ? users.filter(user => user.isMembershipActive)
      : users;

    return filteredByStatus.filter((user) =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.phone.toLowerCase().includes(searchTerm)
    );
  };

  // Search Functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  // Clear Search
  const clearSearch = () => {
    setSearchTerm('');
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
  const handleCloseAddUserModal = (isUserAdded) => {
    setShowAddUserModal(false);
    if (isUserAdded) {
      fetchUsers(); // Refresh user list if a user was added
    }
  };

  const handleUserDisplay = (user) => {
    window.history.pushState({}, '', `/users/${user.id}`); // Update URL
    setSelectedUser(user);
  };

  const handleCloseUserDisplay = (isUserEdited) => {
    setSelectedUser(null);
    window.history.pushState({}, '', '/users'); // Reset the URL to /users
    if (isUserEdited) {
      fetchUsers(); // Refresh the user list if a user was edited
    }
    // Reapply the current search term and active status filter
    const updatedFilteredUsers = filterUsers(users, filter, searchTerm);
    setFilteredUsers(updatedFilteredUsers);
  };

  // Toggle Active/All Users
  const handleToggleFilter = (status) => {
    setFilter(status);
    // Re-filter the users based on both active status and search term
    const updatedFilteredUsers = filterUsers(users, status, searchTerm);
    setFilteredUsers(updatedFilteredUsers);
  };

  const activeUserCount = users.filter(user => user.isMembershipActive).length;
  const totalUserCount = users.length;

  // Function to delete a user
const deleteUser = (userId) => {
  axios
    .delete(`http://localhost:8080/users/${userId}`)
    .then(() => {
      alert(`User with ID ${userId} has been successfully deleted.`);
      fetchUsers(); // Refresh the user list after deletion
    })
    .catch((error) => {
      console.error('Error deleting user:', error);
      alert('Failed to delete the user. Please try again.');
    });
};

  return (
    <div className="users">
      <h2>Manage Users</h2>

      {/* Search and Sort Controls */}
      <div className="controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={handleSearch}
            className="user-search-bar"
          />
          {searchTerm && (
            <button className="clear-btn" onClick={clearSearch}>×</button>
          )}
        </div>
        <select value={sortOption} onChange={handleSort} className="sort-dropdown">
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Toggle Buttons for Active/All Users */}
      <div className="user-filter">
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => handleToggleFilter('active')}
        >
          Show Active Users ({activeUserCount})
        </button>
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => handleToggleFilter('all')}
        >
          Show All Users ({totalUserCount})
        </button>
      </div>

      {/* User List */}
      <ul className="user-list">
        {/* Column Header */}
        <li className="user-item user-header">
          <div className="user-id">ID</div>
          <div className="user-name">Name</div>
          <div className="membership-status">Membership Status</div>
        </li>

        {filteredUsers.map((user) => (
          <li
            key={user.id}
            className="user-item"
            onClick={() => handleUserDisplay(user)} // Make the whole row clickable
          >
            <div className="user-id">{user.id}</div>
            <div className="user-name">{user.name}</div>
            <div className={`membership-status ${user.isMembershipActive ? 'active' : 'inactive'}`}>
              {user.isMembershipActive ? 'Active' : 'Inactive'}
            </div>
            <div
              className="user-trash"
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click from firing
                if (
                  window.confirm(
                    `Are you sure you want to delete user ${user.name}? All payments will be deleted.`
                  )
                ) {
                  deleteUser(user.id);
                }
              }}
            >
              <div className="tooltip-container">
                🗑️ {/* Trash Icon */}
                <span className="tooltip-text">Delete user</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Add New User Button */}
      <button onClick={handleAddUser} className="add-user-button">+ Add New User</button>

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
