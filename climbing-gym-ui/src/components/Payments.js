import React, { useState, useEffect } from 'react';
import "./Payments.css"
const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Fetch payments from the backend (this is just a placeholder)
    setPayments([
      { id: 1, user: 'John Doe', amount: 30, date: '2024-12-01' },
      { id: 2, user: 'Jane Smith', amount: 75, date: '2024-12-05' },
    ]);
  }, []);

  return (
    <div className="payments">
      <h2>Payments</h2>
      <ul>
        {payments.map((payment) => (
          <li key={payment.id}>
            {payment.user} - ${payment.amount} on {payment.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Payments;
