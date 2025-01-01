import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import "./Home.css";
import ReactQRScanner from "react-qr-scanner";

const Home = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalRevenue: 0,
  });

  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [userName, setUserName] = useState(""); // To store the user's name
  const [membershipStatus, setMembershipStatus] = useState(""); // To store the membership status

  const fetchData = () => {
    // Fetch statistics
    axios
      .get("http://localhost:8080/payments/revenue")
      .then((response) => {
        setStats((prevStats) => ({
          ...prevStats,
          totalRevenue: response.data,
        }));
      })
      .catch((error) => {
        console.error("Error fetching revenue:", error);
      });

    // Fetch users with membership status
    axios
      .get("http://localhost:8080/users")
      .then((response) => {
        const usersWithStatus = response.data;
        Promise.all(
          usersWithStatus.map((user) =>
            axios
              .get(`http://localhost:8080/users/${user.id}/membership-status`)
              .then((res) => ({ ...user, isActive: res.data }))
              .catch((error) => {
                console.error("Error fetching membership status:", error);
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
        console.error("Error fetching users:", error);
      });

    // Fetch available packages
    axios
      .get("http://localhost:8080/packages")
      .then((response) => {
        setPackages(response.data.filter((pkg) => pkg.available));
      })
      .catch((error) => {
        console.error("Error fetching packages:", error);
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
      setPaymentStatus("Please select both a user and a package.");
      return;
    }

    const user = users.find((user) => user.id === selectedUser.value);
    const pkg = packages.find((pkg) => pkg.name === selectedPackage.value);

    if (!user || !pkg) {
      setPaymentStatus("Invalid user or package selected.");
      return;
    }

    if (!pkg.durationInDays || pkg.durationInDays === null) {
      setPaymentStatus(
        "Selected package is invalid. Please choose a valid package."
      );
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
      paymentDate: new Date().toISOString().split("T")[0],
    };

    axios
      .post("http://localhost:8080/payments", paymentData)
      .then((response) => {
        setStats((prevStats) => ({
          ...prevStats,
          totalRevenue: prevStats.totalRevenue + pkg.price,
        }));

        axios
          .put(`http://localhost:8080/users/${user.id}/membership`, pkg)
          .then(() => {
            setPaymentStatus("Membership updated successfully!");
            fetchData();
            setTimeout(() => {
              setShowPackageModal(false);
              resetForm();
            }, 1000);
          })
          .catch((error) => {
            console.error("Error updating membership:", error);
            setPaymentStatus("Failed to update membership. Please try again.");
          });
      })
      .catch((error) => {
        console.error("Error making payment:", error);
        setPaymentStatus("Payment failed. Please try again.");
      });
  };

  const handleClosePackageModal = () => {
    setShowPackageModal(false);
    resetForm();
  };

  const handleCloseQrModal = () => {
    setShowQrModal(false);
    setIsScanning(false); // Stop scanning when modal closes
  };

  const handleOpenQrModal = () => {
    setQrCodeData(""); // Clear previous QR code data
    setUserId(null); // Reset the extracted user ID
    setUserName(""); // Reset the user name
    setMembershipStatus(""); // Reset membership status
    setIsScanning(true); // Restart scanning
    setShowQrModal(true); // Open the modal
  };

  const resetForm = () => {
    setSelectedUser("");
    setSelectedPackage("");
    setPaymentStatus("");
  };

  const [qrCodeData, setQrCodeData] = useState("");
  const [userId, setUserId] = useState(null); // To store the extracted user ID
  const [isScanning, setIsScanning] = useState(true); // State to control the scanning status
  const [membershipExpirationDate, setMembershipExpirationDate] =
    useState(null);

  const handleScan = (data) => {
    if (data && data.text) {
      setQrCodeData(data.text); // Store the QR code text

      // Extract the UserID and Name from the QR code
      const userIdMatch = data.text.match(/UserID:(\d+)/); // Regex to extract the user ID
      const userNameMatch = data.text.match(/Name:([^,]+)/); // Regex to extract the user name

      // Validate the format of the QR code
      if (!userIdMatch || !userNameMatch) {
        setMembershipStatus("Invalid QR Code");
        setIsScanning(false); // Stop scanning for invalid QR codes

        // Close the modal after an invalid scan
        setTimeout(() => {
          setShowQrModal(false); // Close the modal
        }, 1500); // Wait 1 second before closing for smooth UI experience

        return;
      }

      const extractedUserId = userIdMatch[1];
      const extractedUserName = userNameMatch[1];

      setUserId(extractedUserId);
      setUserName(extractedUserName);

      // Check if the user exists in the database
      axios
        .get(`http://localhost:8080/users/${extractedUserId}`)
        .then((response) => {
          const user = response.data;

          // Check if the user exists and their name matches
          if (user && user.name === extractedUserName) {
            // Fetch membership status
            axios
              .get(
                `http://localhost:8080/users/${extractedUserId}/membership-status`
              )
              .then((res) => {
                setMembershipStatus(res.data ? "Active" : "Inactive");

                // If the membership is active, fetch the expiration date
                if (res.data) {
                  axios
                    .get(
                      `http://localhost:8080/users/${extractedUserId}/membership-expiration`
                    )
                    .then((expRes) => {
                      // Set the expiration date
                      setMembershipExpirationDate(expRes.data);
                    })
                    .catch((error) => {
                      console.error(
                        "Error fetching membership expiration date:",
                        error
                      );
                      setMembershipExpirationDate(
                        "Error fetching expiration date"
                      );
                    });
                } else {
                  setMembershipExpirationDate(null);
                }
              })
              .catch((error) => {
                console.error("Error fetching membership status:", error);
                setMembershipStatus("Inactive");
                setMembershipExpirationDate(null); // No active membership
              });
          } else {
            setMembershipStatus("Invalid QR Code");
            setMembershipExpirationDate(null); // Reset expiration if user mismatch
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setMembershipStatus("Invalid QR Code");
          setMembershipExpirationDate(null); // Reset expiration if user does not exist
        });

      // Stop scanning but do not close the modal
      setIsScanning(false);
    }
  };

  const handleError = (err) => {
    console.error("Error scanning QR code:", err);
    setMembershipStatus("Invalid QR Code");
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
          <button
            className="open-popup-btn"
            onClick={() => setShowPackageModal(true)}
          >
            Buy Package for User
          </button>
          <button className="open-popup-btn" onClick={handleOpenQrModal}>
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
                    options={users
                      .sort((a, b) => a.id - b.id) // Sort users by their ID in ascending order
                      .map((user) => ({
                        label: `${user.id} - ${user.name}`,
                        value: user.id,
                      }))}
                    onChange={handleUserSelect}
                    placeholder="Select User"
                    isClearable={true}
                    isSearchable={true}
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
                    isClearable={false} // Make the packages dropdown not clearable
                    isSearchable={false} // Make the packages dropdown not searchable
                  />
                </div>

                <button
                  className="submit-btn"
                  onClick={handlePayment}
                  disabled={!selectedUser || !selectedPackage}
                >
                  Buy Package
                </button>

                {paymentStatus && (
                  <p className="payment-status">{paymentStatus}</p>
                )}
              </div>
              <button
                className="close-modal-btn"
                onClick={handleClosePackageModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showQrModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Scan QR Code</h3>
              <div className="scanner-container">
                {isScanning ? (
                  <ReactQRScanner
                    delay={300}
                    onScan={handleScan}
                    onError={handleError}
                  />
                ) : (
                  <p>Scan completed.</p>
                )}
              </div>
              {membershipStatus !== "Invalid QR Code" && userName && (
                <p>
                  {userName} (ID: {userId})
                </p>
              )}
              {membershipStatus === "Active" && (
                <>
                  <p style={{ color: "green" }}>WELCOME</p>
                  {membershipExpirationDate && (
                    <p style={{ color: "green" }}>{membershipExpirationDate}</p>
                  )}
                </>
              )}
              {membershipStatus === "Inactive" && (
                <p style={{ color: "orange" }}>PLEASE BUY A PACKAGE FIRST</p>
              )}
              {membershipStatus === "Invalid QR Code" && (
                <p style={{ color: "red" }}>INVALID QR CODE</p>
              )}

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
