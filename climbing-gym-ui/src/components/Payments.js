import React, { useState, useEffect } from 'react';
import "./Payments.css";
import { jsPDF } from 'jspdf';

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
      payment.packageType?.price?.toString().includes(term) ||
      payment.packageType?.name?.toLowerCase().includes(term) ||
      payment.paymentDate?.toLowerCase().includes(term)
    );
    setFilteredPayments(results);
  };

  const generateInvoiceForPayment = (payment) => {
    const doc = new jsPDF();

    // Set the document title
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    // Add invoice title
    doc.text('Invoice', 20, 20);

    // Add payment details
    doc.text(`User: ${payment.user?.name || 'Unknown User'} (ID: ${payment.user?.id || 'N/A'})`, 20, 30);
    doc.text(`Amount: $${payment.packageType?.price}`, 20, 40); // Corrected to price field
    doc.text(`Package: ${payment.packageType?.name || 'Unknown Package'}`, 20, 50);
    doc.text(`Date: ${payment.paymentDate}`, 20, 60);

    // Generate and download the PDF
    doc.save(`Invoice_${payment.id}.pdf`);
  };

  const generateAllInvoicesForUser = (userId) => {
    const userPayments = payments.filter(payment => payment.user?.id === userId);

    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    // Add a title for the bulk invoices
    doc.text(`Invoices for User ID: ${userId}`, 20, 20);
    
    // Loop through all payments of the user and add them to the PDF
    let yPosition = 30; // Initial position for text on the PDF
    const pageHeight = doc.internal.pageSize.height; // Get the height of the page
    const marginBottom = 30; // Reserve space at the bottom of the page (to avoid cutting off the last invoice)
    const invoiceSpacing = 20; // Space between each invoice (for readability)

    userPayments.forEach((payment, index) => {
      // Check if there's enough space left on the page for the next invoice
      if (yPosition + invoiceSpacing > pageHeight - marginBottom) {
        doc.addPage(); // Add a new page if there's not enough space left
        yPosition = 20; // Reset yPosition for the new page
      }

      // Add the invoice content
      doc.text(`Invoice ${index + 1}:`, 20, yPosition);
      yPosition += 10;
      doc.text(`User: ${payment.user?.name || 'Unknown User'} (ID: ${payment.user?.id || 'N/A'})`, 20, yPosition);
      yPosition += 10;
      doc.text(`Amount: $${payment.packageType?.price}`, 20, yPosition); // Corrected to price field
      yPosition += 10;
      doc.text(`Package: ${payment.packageType?.name || 'Unknown Package'}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Date: ${payment.paymentDate}`, 20, yPosition);
      yPosition += invoiceSpacing; // Space between invoices
    });

    // Generate and download the bulk invoices PDF
    doc.save(`Invoices_for_User_${userId}.pdf`);
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
        className="payment-search-bar"
      />

      {/* Payment List */}
      <ul className="payment-list">
        {filteredPayments.map((payment) => (
          <li key={payment.id} className="payment-item">
            {/* Payment Info Section (Vertical) */}
            <div className="payment-info">
              <div className="payment-user">
                {payment.user?.name || 'Unknown User'} (ID: {payment.user?.id || 'N/A'})
              </div>

              <div className="payment-details">
                ${payment.packageType?.price} <span className="payment-date">on {payment.paymentDate}</span>
              </div>

              <div className="payment-package">
                Package: {payment.packageType?.name || 'Unknown Package'} 
                <br />
                Price: ${payment.packageType?.price ? payment.packageType.price.toFixed(2) : '0.00'}
              </div>
            </div>

            {/* Payment Action Buttons (Horizontal) */}
            <div className="payment-actions">
              <button
                className="btn-generate-invoice"
                onClick={() => generateInvoiceForPayment(payment)}
              >
                Generate Invoice
              </button>
              <button
                className="btn-generate-all-invoices"
                onClick={() => generateAllInvoicesForUser(payment.user?.id)}
              >
                Generate All Invoices For User
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Payments;
