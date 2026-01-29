import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import './PaymentSlips.css';

const PaymentSlips = () => {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('requested');
  const [selectedSlip, setSelectedSlip] = useState(null);

  useEffect(() => {
    fetchPaymentSlips();
  }, [filter]);

  const fetchPaymentSlips = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/payment-slips?status=${filter}`);
      const data = await response.json();
      if (data.success) {
        setSlips(data.slips);
      } else {
        setError(data.message || 'Failed to load payment slips');
      }
    } catch (err) {
      setError('Error loading payment slips');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('heallk_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        fetchPaymentSlips();
        setSelectedSlip(null);
      } else {
        alert('Failed to update user status');
      }
    } catch (err) {
      alert('Error updating status');
      console.error(err);
    }
  };

  const downloadSlip = (slipUrl) => {
    const link = document.createElement('a');
    link.href = slipUrl;
    link.download = true;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="payment-slips-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="payment-slips-container">
      <div className="slips-header">
        <h2>Payment Slips</h2>
        <p>Manage and verify doctor registration payment slips</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-tabs">
        {['requested', 'active', 'inactive'].map(status => (
          <button
            key={status}
            className={`filter-tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="slips-table-wrapper">
        <table className="slips-table">
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Status</th>
              <th>Uploaded On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slips.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No payment slips found</td>
              </tr>
            ) : (
              slips.map(slip => (
                <tr key={slip.id}>
                  <td className="doctor-name">{slip.full_name}</td>
                  <td>{slip.email}</td>
                  <td>{slip.specialization}</td>
                  <td>
                    <span className={`status-badge status-${slip.status}`}>
                      {slip.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{new Date(slip.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-view"
                      onClick={() => setSelectedSlip(slip)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing slip and updating status */}
      {selectedSlip && (
        <div className="slip-modal-overlay" onClick={() => setSelectedSlip(null)}>
          <div className="slip-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedSlip(null)}>×</button>
            
            <div className="modal-content">
              <div className="modal-header">
                <h3>{selectedSlip.full_name}</h3>
                <p className="modal-email">{selectedSlip.email}</p>
              </div>

              <div className="modal-info">
                <div className="info-row">
                  <label>Specialization:</label>
                  <span>{selectedSlip.specialization}</span>
                </div>
                <div className="info-row">
                  <label>Phone:</label>
                  <span>{selectedSlip.phone}</span>
                </div>
                <div className="info-row">
                  <label>Status:</label>
                  <span className={`status-badge status-${selectedSlip.status}`}>
                    {selectedSlip.status.toUpperCase()}
                  </span>
                </div>
                <div className="info-row">
                  <label>Submitted On:</label>
                  <span>{new Date(selectedSlip.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="slip-preview">
                <h4>Payment Slip Preview</h4>
                {selectedSlip.paymentSlip?.endsWith('.pdf') ? (
                  <iframe
                    src={selectedSlip.paymentSlip}
                    title="Payment Slip PDF"
                    className="slip-pdf-viewer"
                  ></iframe>
                ) : (
                  <img src={selectedSlip.paymentSlip} alt="Payment Slip" className="slip-image" />
                )}
              </div>

              <div className="modal-actions">
                <button
                  className="btn-download"
                  onClick={() => downloadSlip(selectedSlip.paymentSlip)}
                >
                  📥 Download Slip
                </button>
                
                {selectedSlip.status === 'requested' && (
                  <>
                    <button
                      className="btn-approve"
                      onClick={() => updateUserStatus(selectedSlip.id, 'active')}
                    >
                      ✓ Approve
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => updateUserStatus(selectedSlip.id, 'inactive')}
                    >
                      ✗ Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSlips;
