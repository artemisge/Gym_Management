import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalRevenue: 0,
  });

  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const fetchData = () => {
    // Fetch statistics
    axios.get('http://localhost:8080/payments/revenue')
      .then((response) => {
        setStats((prevStats) => ({
          ...prevStats,
          totalRevenue: response.data,
        }));
      })
      .catch((error) => {
        console.error('Error fetching revenue:', error);
      });

    // Fetch users with membership status
    axios.get('http://localhost:8080/users')
      .then((response) => {
        const usersWithStatus = response.data;
        Promise.all(
          usersWithStatus.map((user) =>
            axios.get(`http://localhost:8080/users/${user.id}/membership-status`)
              .then((res) => ({ ...user, isActive: res.data }))
              .catch((error) => {
                console.error('Error fetching membership status:', error);
                return { ...user, isActive: false };
              })
          )
        ).then((usersWithStatus) => {
          setUsers(usersWithStatus);
          const activeUsers = usersWithStatus.filter((user) => user.isActive);
          setStats((prevStats) => ({
            ...prevStats,
            totalMembers: activeUsers.length,
          }));
        });
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });

    // Fetch available packages
    axios.get('http://localhost:8080/packages')
      .then((response) => {
        setPackages(response.data.filter(pkg => pkg.available));
      })
      .catch((error) => {
        console.error('Error fetching packages:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUserSelect = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  const handlePackageSelect = (selectedOption) => {
    setSelectedPackage(selectedOption);
  };

  const handlePayment = () => {
    if (!selectedUser || !selectedPackage) {
      setPaymentStatus('Please select both a user and a package.');
      return;
    }

    const user = users.find((user) => user.id === selectedUser.value);
    const pkg = packages.find((pkg) => pkg.name === selectedPackage.value);

    if (!user || !pkg) {
      setPaymentStatus('Invalid user or package selected.');
      return;
    }

    if (!pkg.durationInDays || pkg.durationInDays === null) {
      setPaymentStatus('Selected package is invalid. Please choose a valid package.');
      return;
    }

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

    axios.post('http://localhost:8080/payments', paymentData)
      .then((response) => {
        setStats((prevStats) => ({
          ...prevStats,
          totalRevenue: prevStats.totalRevenue + pkg.price,
        }));

        axios.put(`http://localhost:8080/users/${user.id}/membership`, pkg)
          .then(() => {
            setPaymentStatus('Membership updated successfully!');
            fetchData();
            setTimeout(() => {
              setShowPackageModal(false);
              resetForm();
            }, 1000);
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

  const handleClosePackageModal = () => {
    setShowPackageModal(false);
    resetForm();
  };

  const handleCloseQrModal = () => {
    setShowQrModal(false);
  };

  const resetForm = () => {
    setSelectedUser('');
    setSelectedPackage('');
    setPaymentStatus('');
  };

  return (
    <div className="home">
      <h2>Welcome to the Gym Dashboard</h2>

      <div className="content-container">
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

        <div className="open-popup-btn-container">
          <button className="open-popup-btn" onClick={() => setShowPackageModal(true)}>
            Buy Package for User
          </button>
          <button className="open-popup-btn" onClick={() => setShowQrModal(true)}>
            Scan QR Code
          </button>
        </div>

        {showPackageModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Buy New Package for User</h3>
              <div className="dropdown-container">
                <div className="dropdown">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    options={users.map((user) => ({
                      label: `${user.id} - ${user.name}`,
                      value: user.id,
                    }))}
                    onChange={handleUserSelect}
                    placeholder="Select User"
                    isClearable={true}  // Make the users dropdown clearable
                    isSearchable={true}  // Make the users dropdown searchable
                  />
                </div>

                <div className="dropdown">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    options={packages.map((pkg) => ({
                      label: `${pkg.name} - $${pkg.price}`,
                      value: pkg.name,
                    }))}
                    onChange={handlePackageSelect}
                    placeholder="Select Package"
                    isClearable={false}  // Make the packages dropdown not clearable
                    isSearchable={false}  // Make the packages dropdown not searchable
                  />
                </div>

                <button className="submit-btn" onClick={handlePayment} disabled={!selectedUser || !selectedPackage}>
                  Buy Package
                </button>

                {paymentStatus && <p className="payment-status">{paymentStatus}</p>}
              </div>
              <button className="close-modal-btn" onClick={handleClosePackageModal}>
                Close
              </button>
            </div>
          </div>
        )}

        {showQrModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Scan QR Code</h3>
              <p>QR code scanning functionality will be added here.</p>
              <button className="close-modal-btn" onClick={handleCloseQrModal}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
