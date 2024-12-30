import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalRevenue: 0,
  });

  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  // Function to fetch data for statistics, users, and packages
  const fetchData = () => {
    // Fetch total revenue
    axios.get('http://localhost:8080/payments/revenue') // Adjust the URL to your backend
      .then((response) => {
        setStats((prevStats) => ({
          ...prevStats,
          totalRevenue: response.data,
        }));
      })
      .catch((error) => {
        console.error('Error fetching revenue:', error);
      });

    // Fetch users list and their membership status
    axios.get('http://localhost:8080/users') // Adjust the URL to your backend
      .then((response) => {
        const usersWithStatus = response.data;

        // Fetch membership status for each user
        Promise.all(
          usersWithStatus.map((user) =>
            axios.get(`http://localhost:8080/users/${user.id}/membership-status`)
              .then((res) => ({ ...user, isActive: res.data }))
              .catch((error) => {
                console.error('Error fetching membership status:', error);
                return { ...user, isActive: false }; // Default to false if error occurs
              })
          )
        ).then((usersWithStatus) => {
          setUsers(usersWithStatus);

          // Count the number of active members
          const activeUsers = usersWithStatus.filter((user) => user.isActive);
          setStats((prevStats) => ({
            ...prevStats,
            totalMembers: activeUsers.length, // Set total active members count
          }));
        });
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });

    // Fetch packages list
    axios.get('http://localhost:8080/packages') // Adjust the URL to your backend
      .then((response) => {
        setPackages(response.data.filter(pkg => pkg.available)); // Filter active packages
      })
      .catch((error) => {
        console.error('Error fetching packages:', error);
      });
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUserSelect = (e) => {
    setSelectedUser(e.target.value);
  };

  const handlePackageSelect = (e) => {
    setSelectedPackage(e.target.value);
  };

  const handlePayment = () => {
    if (!selectedUser || !selectedPackage) {
      setPaymentStatus('Please select both a user and a package.');
      return;
    }

    // Find the selected user and package by name
    const user = users.find((user) => user.name === selectedUser);
    const pkg = packages.find((pkg) => pkg.name === selectedPackage);

    if (!user || !pkg) {
      setPaymentStatus('Invalid user or package selected.');
      return;
    }

    // Validate that the package has a duration and is not null
    if (!pkg.durationInDays || pkg.durationInDays === null) {
      setPaymentStatus('Selected package is invalid. Please choose a valid package.');
      return;
    }

    // Create payment object
    const paymentData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        membershipExpirationDate: user.membershipExpirationDate,
      },
      packageType: {
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        durationInDays: pkg.durationInDays,
        available: pkg.available,
      },
      paymentDate: new Date().toISOString().split('T')[0],
    };

    // Send POST request to save the payment
    axios.post('http://localhost:8080/payments', paymentData)
      .then((response) => {
        setPaymentStatus('Payment successful!');
        setStats((prevStats) => ({
          ...prevStats,
          totalRevenue: prevStats.totalRevenue + pkg.price,
        }));

        // After successful payment, update the user's membership
        axios.put(`http://localhost:8080/users/${user.id}/membership`, pkg)
          .then(() => {
            setPaymentStatus('Membership updated successfully!');
            // Refetch data to update statistics and user status
            fetchData();
          })
          .catch((error) => {
            console.error('Error updating membership:', error);
            setPaymentStatus('Failed to update membership. Please try again.');
          });
      })
      .catch((error) => {
        console.error('Error making payment:', error);
        setPaymentStatus('Payment failed. Please try again.');
      });
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) && user.isActive
  );

  const dropdownUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home">
      <h2>Welcome to the Gym Dashboard</h2>

      <div className="content-container">
        {/* Statistics */}
        <div className="stats">
          <div className="stat-card">
            <h3>Total Active Members</h3>
            <p>{stats.totalMembers}</p>
          </div>

          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p>${stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Buy New Package for User */}
        <div className="buy-package-container">
          <h3>Buy New Package for User</h3>
          <div className="dropdown-container">
            <div className="dropdown">
              <input
                className="dropdown-search"
                type="text"
                placeholder="Search User"
                value={searchQuery}
                onChange={handleSearch}
              />
              <select
                className="dropdown-select"
                value={selectedUser}
                onChange={handleUserSelect}
              >
                <option value="">Select a user</option>
                {dropdownUsers.length > 0 ? (
                  dropdownUsers.map((user) => (
                    <option key={user.id} value={user.name}>
                      {`${user.id} - ${user.name}`}
                    </option>
                  ))
                ) : (
                  <option value="">No users found</option>
                )}
              </select>
            </div>

            <div className="dropdown">
              <select
                className="dropdown-select"
                value={selectedPackage}
                onChange={handlePackageSelect}
              >
                <option value="">Select Package</option>
                {packages.length > 0 ? (
                  packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.name}>
                      {pkg.name} - ${pkg.price}
                    </option>
                  ))
                ) : (
                  <option value="">No active packages</option>
                )}
              </select>
            </div>

            <button className="submit-btn" onClick={handlePayment} disabled={!selectedUser || !selectedPackage}>
              Buy Package
            </button>

            {paymentStatus && <p className="payment-status">{paymentStatus}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
