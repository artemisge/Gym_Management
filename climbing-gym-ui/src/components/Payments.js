import React, { useState, useEffect } from 'react';
import "./Payments.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);

  useEffect(() => {
    // Fetch payments from the backend (this is just a placeholder)
    const fetchedPayments = [
      { id: 1, user: 'John Doe', amount: 30, package: 'Monthly Package', date: '2024-12-01' },
      { id: 2, user: 'Jane Smith', amount: 75, package: 'Annual Package', date: '2024-12-05' },
    ];
    setPayments(fetchedPayments);
    setFilteredPayments(fetchedPayments); // Initialize filtered payments
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const results = payments.filter(payment =>
      payment.user.toLowerCase().includes(term) ||
      payment.amount.toString().includes(term) ||
      payment.package.toLowerCase().includes(term) ||
      payment.date.toLowerCase().includes(term)
    );
    setFilteredPayments(results);
  };

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
            <div className="payment-user">{payment.user}</div>
            <div className="payment-details">
              ${payment.amount} <span className="payment-date">on {payment.date}</span>
            </div>
            <div className="payment-package">Package: {payment.package}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Payments;
