import React, { useState, useEffect } from 'react';
import "./Payments.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/payments'); // Replace with your backend endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        const data = await response.json();
        setPayments(data);
        setFilteredPayments(data); // Initialize filtered payments
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const results = payments.filter(payment =>
      payment.user?.name?.toLowerCase().includes(term) ||
      payment.amount?.toString().includes(term) ||
      payment.packageType?.name?.toLowerCase().includes(term) ||
      payment.paymentDate?.toLowerCase().includes(term)
    );
    setFilteredPayments(results);
  };

  if (loading) {
    return <div className="payments">Loading...</div>;
  }

  if (error) {
    return <div className="payments">Error: {error}</div>;
  }

  return (
    <div className="payments">
      <h2>Payments</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by user, amount, package, or date..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />

      {/* Payment List */}
      <ul className="payment-list">
        {filteredPayments.map((payment) => (
          <li key={payment.id} className="payment-item">
            {/* Render user name */}
            <div className="payment-user">{payment.user?.name || 'Unknown User'}</div>
            {/* Render payment details */}
            <div className="payment-details">
              ${payment.amount} <span className="payment-date">on {payment.paymentDate}</span>
            </div>
            {/* Render package name and price */}
            <div className="payment-package">
              Package: {payment.packageType?.name || 'Unknown Package'} 
              <br />
              Price: ${payment.packageType?.price ? payment.packageType.price.toFixed(2) : '0.00'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Payments;
