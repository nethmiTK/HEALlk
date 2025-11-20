import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

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
    is_verified: false
  });

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
    'Other'
  ];

  useEffect(() => {
    loadQualifications();
  }, []);

  const loadQualifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('heallk_token');
      
      const response = await fetch('http://localhost:5000/api/qualifications', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('heallk_token');
      
      if (editingQual) {
        const response = await fetch(`http://localhost:5000/api/qualifications/${editingQual.qualification_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to update qualification');
        }
        
        toast.success('Qualification updated successfully!');
      } else {
        const response = await fetch('http://localhost:5000/api/qualifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to add qualification');
        }
        
        toast.success('Qualification added successfully!');
      }
      
      await loadQualifications();
      resetForm();
    } catch (error) {
      console.error('Error saving qualification:', error);
      toast.error(error.message || 'Failed to save qualification');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      degree_name: '',
      institution: '',
      year_completed: '',
      specialization: '',
      description: '',
      certificate_url: '',
      is_verified: false
    });
    setEditingQual(null);
    setIsModalOpen(false);
  };

  const handleEdit = (qualification) => {
    setEditingQual(qualification);
    setFormData({
      degree_name: qualification.degree_name,
      institution: qualification.institution,
      year_completed: qualification.year_completed,
      specialization: qualification.specialization,
      description: qualification.description || '',
      certificate_url: qualification.certificate_url || '',
      is_verified: qualification.is_verified
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (qualificationId) => {
    if (window.confirm('Are you sure you want to delete this qualification?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('heallk_token');
        
        const response = await fetch(`http://localhost:5000/api/qualifications/${qualificationId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
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

  const toggleVerification = async (qualificationId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('heallk_token');
      
      const response = await fetch(`http://localhost:5000/api/qualifications/${qualificationId}/toggle-verification`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="qualifications-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Qualifications & Certifications</h1>
          <p className="page-subtitle">Manage your medical qualifications and certifications</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
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
          <span className="stat-number">{qualifications.filter(q => q.is_verified).length}</span>
          <span className="stat-label">Verified</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{new Set(qualifications.map(q => q.specialization)).size}</span>
          <span className="stat-label">Specializations</span>
        </div>
      </div>

      {/* Qualifications Timeline */}
      <div className="qualifications-timeline">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading qualifications...</p>
          </div>
        ) : (
          qualifications
            .sort((a, b) => parseInt(b.year_completed) - parseInt(a.year_completed))
            .map((qual) => (
              <div key={qual.qualification_id} className="qualification-item">
                <div className="timeline-marker">
                  <div className={`marker-dot ${qual.is_verified ? 'verified' : 'pending'}`}>
                    {qual.is_verified ? '✓' : '⏳'}
                  </div>
                  <div className="timeline-line"></div>
                </div>

                <div className="qualification-card">
                  <div className="qualification-header">
                    <div className="qualification-main">
                      <h3 className="qualification-degree">{qual.degree_name}</h3>
                      <p className="qualification-institution">{qual.institution}</p>
                      <div className="qualification-meta">
                        <span className="qualification-year">{qual.year_completed}</span>
                        <span className="qualification-field">{qual.specialization}</span>
                      </div>
                    </div>
                    
                    <div className="qualification-status">
                      <span className={`status-badge ${qual.is_verified ? 'verified' : 'pending'}`}>
                        {qual.is_verified ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>

                {qual.description && (
                  <div className="qualification-description">
                    <p>{qual.description}</p>
                  </div>
                )}

                <div className="qualification-actions">
                  <button 
                    className="btn btn-text"
                    onClick={() => handleEdit(qual)}
                    disabled={loading}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn btn-text"
                    onClick={() => toggleVerification(qual.qualification_id)}
                    disabled={loading}
                  >
                    {qual.is_verified ? '❌ Mark as Pending' : '✅ Mark as Verified'}
                  </button>
                  {qual.certificate_url && (
                    <button 
                      className="btn btn-text"
                      onClick={() => window.open(qual.certificate_url, '_blank')}
                    >
                      📄 View Certificate
                    </button>
                  )}
                  <button 
                    className="btn btn-text danger"
                    onClick={() => handleDelete(qual.qualification_id)}
                    disabled={loading}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {qualifications.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎓</div>
          <h3>No qualifications added yet</h3>
          <p>Add your medical qualifications and certifications to build credibility</p>
          <button 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Add First Qualification
          </button>
        </div>
      )}

      {/* Add/Edit Qualification Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingQual ? 'Edit Qualification' : 'Add New Qualification'}</h2>
              <button className="modal-close" onClick={resetForm}>✕</button>
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
                    {specializations.map(field => (
                      <option key={field} value={field}>{field}</option>
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
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
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
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
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