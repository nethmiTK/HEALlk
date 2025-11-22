import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

const Qualifications = () => {
  const [qualifications, setQualifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQual, setEditingQual] = useState(null);
  const [formData, setFormData] = useState({
    degree_name: '',
    institution: '',
    year_completed: '',
    specialization: '',
    description: '',
    certificate_url: '',
    is_verified: false,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const specializations = [
    'General Medicine',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Dermatology',
    'Pediatrics',
    'Gynecology',
    'Psychiatry',
    'Surgery',
    'Emergency Medicine',
    'Anesthesiology',
    'Radiology',
    'Pathology',
    'Oncology',
    'Other',
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  useEffect(() => {
    loadQualifications();
  }, []);

  // Load all qualifications from backend
  const loadQualifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('heallk_token');
      const response = await fetch(`${API_BASE_URL}/qualifications`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setQualifications(data.qualifications || []);
      } else {
        throw new Error(data.message || 'Failed to load qualifications');
      }
    } catch (error) {
      console.error('Error loading qualifications:', error);
      toast.error('Failed to load qualifications');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit form to add/update qualification
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem('heallk_token');
      if (!token) throw new Error('User is not authenticated');

      let response;

      if (editingQual) {
        // Update existing qualification
        response = await fetch(
          `${API_BASE_URL}/qualifications/${editingQual.qualification_id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );
      } else {
        // Add new qualification
        response = await fetch(`${API_BASE_URL}/qualifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save qualification');
      }

      toast.success(editingQual ? 'Qualification updated successfully!' : 'Qualification added successfully!');
      await loadQualifications();

      // Close modal and reset form ONLY after successful save
      resetForm();
    } catch (error) {
      console.error('Error saving qualification:', error);
      toast.error(error.message || 'Failed to save qualification');
    } finally {
      setLoading(false);
    }
  };

  // Reset form and close modal
  const resetForm = () => {
    if (loading) return; // Prevent closing modal while loading
    setFormData({
      degree_name: '',
      institution: '',
      year_completed: '',
      specialization: '',
      description: '',
      certificate_url: '',
      is_verified: false,
    });
    setEditingQual(null);
    setIsModalOpen(false);
  };

  // Open modal and populate form for editing
  const handleEdit = (qualification) => {
    setEditingQual(qualification);
    setFormData({
      degree_name: qualification.degree_name,
      institution: qualification.institution,
      year_completed: qualification.year_completed,
      specialization: qualification.specialization,
      description: qualification.description || '',
      certificate_url: qualification.certificate_url || '',
      is_verified: qualification.is_verified,
    });
    setIsModalOpen(true);
  };

  // Delete qualification with confirmation
  const handleDelete = async (qualificationId) => {
    if (window.confirm('Are you sure you want to delete this qualification?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('heallk_token');

        const response = await fetch(`${API_BASE_URL}/qualifications/${qualificationId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to delete qualification');
        }

        toast.success('Qualification deleted successfully!');
        await loadQualifications();
      } catch (error) {
        console.error('Error deleting qualification:', error);
        toast.error(error.message || 'Failed to delete qualification');
      } finally {
        setLoading(false);
      }
    }
  };

  // Toggle qualification verification status
  const toggleVerification = async (qualificationId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('heallk_token');

      const response = await fetch(`${API_BASE_URL}/qualifications/${qualificationId}/toggle-verification`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        await loadQualifications();
      } else {
        throw new Error(data.message || 'Failed to update verification status');
      }
    } catch (error) {
      console.error('Error toggling verification:', error);
      toast.error(error.message || 'Failed to update verification status');
    } finally {
      setLoading(false);
    }
  };

  // Filter qualifications based on search term
  const filteredQualifications = qualifications.filter(
    (qual) =>
      qual.degree_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qual.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qual.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="qualifications-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Qualifications & Certifications</h1>
          <p className="page-subtitle">Manage your medical qualifications and certifications</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search qualifications..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            ➕ Add Qualification
          </button>
        </div>
      </div>

      {/* Qualifications Stats */}
      <div className="qualifications-stats">
        <div className="stat-item">
          <span className="stat-number">{qualifications.length}</span>
          <span className="stat-label">Total Qualifications</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{qualifications.filter((q) => q.is_verified).length}</span>
          <span className="stat-label">Verified</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{new Set(qualifications.map((q) => q.specialization)).size}</span>
          <span className="stat-label">Specializations</span>
        </div>
      </div>

      {/* Qualifications Table */}
      <div className="qualifications-table-container">
        <table className="qualifications-table">
          <thead>
            <tr>
              <th>Degree/Certificate</th>
              <th>Institution</th>
              <th>Specialization</th>
              <th>Year</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading-state-table">
                  <div className="loading-spinner-small"></div>
                  <p>Loading qualifications...</p>
                </td>
              </tr>
            ) : filteredQualifications.length > 0 ? (
              filteredQualifications
                .sort((a, b) => parseInt(b.year_completed) - parseInt(a.year_completed))
                .map((qual) => (
                  <tr key={qual.qualification_id} className="qualification-table-row">
                    <td>
                      <h3 className="qualification-degree-small">{qual.degree_name}</h3>
                    </td>
                    <td>{qual.institution}</td>
                    <td>{qual.specialization}</td>
                    <td>{qual.year_completed}</td>
                    <td>
                      <button
                        className={`status-toggle-btn ${
                          qual.is_verified ? 'status-verified' : 'status-pending'
                        }`}
                        onClick={() => toggleVerification(qual.qualification_id)}
                        title={qual.is_verified ? 'Mark as Pending' : 'Mark as Verified'}
                      >
                        {qual.is_verified ? 'Verified' : 'Pending'}
                      </button>
                    </td>
                    <td>
                      <div className="qualification-actions-table">
                        <button
                          className="action-btn-small edit-btn"
                          onClick={() => handleEdit(qual)}
                          title={`Edit ${qual.degree_name}`}
                        >
                          ✏️ Edit
                        </button>
                        {qual.certificate_url && (
                          <button
                            className="action-btn-small view-btn"
                            onClick={() => window.open(qual.certificate_url, '_blank')}
                            title="View Certificate"
                          >
                            📄 View
                          </button>
                        )}
                        <button
                          className="action-btn-small delete-btn"
                          onClick={() => handleDelete(qual.qualification_id)}
                          title={`Delete ${qual.degree_name}`}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state-table">
                  <div className="empty-icon">🎓</div>
                  <h3>No qualifications found</h3>
                  <p>Try adjusting your search or add a new qualification.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {qualifications.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🎓</div>
          <h3>No qualifications added yet</h3>
          <p>Add your medical qualifications and certifications to build credibility</p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            Add First Qualification
          </button>
        </div>
      )}

      {/* Add/Edit Qualification Modal */}
      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (!loading) resetForm();
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingQual ? 'Edit Qualification' : 'Add New Qualification'}</h2>
              <button className="modal-close" onClick={() => { if (!loading) resetForm(); }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="qualification-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="degree_name">Degree/Certificate</label>
                  <input
                    type="text"
                    id="degree_name"
                    name="degree_name"
                    value={formData.degree_name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., MBBS, MD, PhD"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="specialization">Field/Specialization</label>
                  <select
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="institution">Institution</label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., University of Colombo"
                />
              </div>

              <div className="form-group">
                <label htmlFor="year_completed">Year Completed</label>
                <select
                  id="year_completed"
                  name="year_completed"
                  value={formData.year_completed}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Additional details about this qualification..."
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="certificate_url">Certificate URL (Optional)</label>
                <input
                  type="url"
                  id="certificate_url"
                  name="certificate_url"
                  value={formData.certificate_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/certificate.pdf"
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_verified"
                    checked={formData.is_verified}
                    onChange={handleInputChange}
                  />
                  <span className="checkbox-text">This qualification is verified</span>
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    if (!loading) resetForm();
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : editingQual ? 'Update Qualification' : 'Add Qualification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Qualifications;
