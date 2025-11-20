import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Services = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    price: '',
    category: '',
    mediaUrls: [''],
    uploadedFiles: [],
    isActive: true
  });

  const categories = [
    'General Consultation',
    'Specialist Consultation',
    'Diagnostic Services',
    'Treatment Services',
    'Emergency Care',
    'Preventive Care'
  ];

  useEffect(() => {
    // Load existing services
    const loadServices = () => {
      // This would be replaced with actual API call
      const mockServices = [
        {
          id: 1,
          title: 'General Consultation',
          description: 'Comprehensive health assessment and consultation',
          duration: '30 minutes',
          price: '2500',
          category: 'General Consultation',
          isActive: true
        },
        {
          id: 2,
          title: 'Health Checkup',
          description: 'Complete health screening and diagnostic tests',
          duration: '60 minutes',
          price: '5000',
          category: 'Diagnostic Services',
          isActive: true
        },
        {
          id: 3,
          title: 'Follow-up Consultation',
          description: 'Follow-up visit for ongoing treatment',
          duration: '20 minutes',
          price: '1500',
          category: 'General Consultation',
          isActive: true
        }
      ];
      setServices(mockServices);
    };

    loadServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMediaUrlChange = (index, value) => {
    const newMediaUrls = [...formData.mediaUrls];
    newMediaUrls[index] = value;
    setFormData(prev => ({
      ...prev,
      mediaUrls: newMediaUrls
    }));
  };

  const addMediaUrl = () => {
    if (formData.mediaUrls.length < 3) {
      setFormData(prev => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, '']
      }));
    }
  };

  const removeMediaUrl = (index) => {
    if (formData.mediaUrls.length > 1) {
      const newMediaUrls = formData.mediaUrls.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        mediaUrls: newMediaUrls
      }));
    }
  };

  // File upload handling functions
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    const allowedTypes = ['image/', 'video/'];
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      if (!allowedTypes.some(type => file.type.startsWith(type))) {
        toast.error(`File ${file.name} is not a valid image or video file.`);
        return false;
      }
      return true;
    });

    const currentFiles = formData.uploadedFiles || [];
    const totalFiles = currentFiles.length + validFiles.length;
    
    if (totalFiles > 3) {
      toast.error('Maximum 3 files allowed.');
      return;
    }

    setFormData(prev => ({ 
      ...prev, 
      uploadedFiles: [...currentFiles, ...validFiles] 
    }));
  };

  const removeUploadedFile = (index) => {
    const newFiles = formData.uploadedFiles.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, uploadedFiles: newFiles }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingService) {
      // Update existing service
      setServices(prev => prev.map(service => 
        service.id === editingService.id 
          ? { ...formData, id: editingService.id }
          : service
      ));
    } else {
      // Add new service
      const newService = {
        ...formData,
        id: Date.now() // Simple ID generation
      };
      setServices(prev => [...prev, newService]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      price: '',
      category: '',
      mediaUrls: [''],
      uploadedFiles: [],
      isActive: true
    });
    setEditingService(null);
    setIsModalOpen(false);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData(service);
    setIsModalOpen(true);
  };

  const handleDelete = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(service => service.id !== serviceId));
    }
  };

  const toggleServiceStatus = (serviceId) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, isActive: !service.isActive }
        : service
    ));
  };

  return (
    <div className="services-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Services Management</h1>
          <p className="page-subtitle">Manage your medical services and pricing</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            title="Create a new medical service - Add title, description, pricing, and media"
          >
            ➕ Add New Service
          </button>
        </div>
      </div>

      {/* Services Overview */}
      <div className="services-stats">
        <div className="stat-item">
          <span className="stat-number">{services.length}</span>
          <span className="stat-label">Total Services</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{services.filter(s => s.isActive).length}</span>
          <span className="stat-label">Active Services</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{new Set(services.map(s => s.category)).size}</span>
          <span className="stat-label">Categories</span>
        </div>
      </div>

      {/* Services List */}
      <div className="services-list">
        {services.map((service) => (
          <div key={service.id} className={`service-card ${!service.isActive ? 'inactive' : ''}`}>
            <div className="service-header">
              <div className="service-info">
                <h3 className="service-title">{service.title}</h3>
                <span className="service-category">{service.category}</span>
              </div>
              <div className="service-status">
                <span className={`status-badge ${service.isActive ? 'active' : 'inactive'}`}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="service-content">
              <p className="service-description">{service.description}</p>
              
              <div className="service-details">
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{service.duration}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value">LKR {service.price}</span>
                </div>
              </div>
            </div>

            <div className="service-actions">
              <button 
                className="btn btn-text"
                onClick={() => handleEdit(service)}
                title={`Edit ${service.title} - Modify service details, pricing, and availability`}
              >
                ✏️ Edit
              </button>
              <button 
                className="btn btn-text"
                onClick={() => toggleServiceStatus(service.id)}
                title={service.isActive ? `Deactivate ${service.title} - Hide from patient booking` : `Activate ${service.title} - Make available for patient booking`}
              >
                {service.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
              </button>
              <button 
                className="btn btn-text danger"
                onClick={() => handleDelete(service.id)}
                title={`Delete ${service.title} - Permanently remove this service (cannot be undone)`}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">⚕️</div>
          <h3>No services added yet</h3>
          <p>Start by adding your first medical service</p>
          <button 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Add First Service
          </button>
        </div>
      )}

      {/* Add/Edit Service Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
              <button className="modal-close" onClick={resetForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="service-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Service Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., General Consultation"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Describe the service and what it includes..."
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="duration">Duration</label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 30 minutes"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price (LKR)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Media URLs Section */}
              <div className="form-section">
                <h4 className="section-title" title="Add images, videos, or other media to showcase your service">Media URLs (Optional)</h4>
                {formData.mediaUrls.map((url, index) => (
                  <div key={index} className="form-row">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor={`mediaUrl${index}`} title="Enter a valid URL for images, videos, or documents">
                        Media URL {index + 1}
                      </label>
                      <input
                        type="url"
                        id={`mediaUrl${index}`}
                        value={url}
                        onChange={(e) => handleMediaUrlChange(index, e.target.value)}
                        placeholder="https://example.com/image.jpg or video URL"
                        title="Enter a complete URL starting with http:// or https://"
                      />
                    </div>
                    <div className="media-actions">
                      {formData.mediaUrls.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-text danger"
                          onClick={() => removeMediaUrl(index)}
                          title="Remove this media URL field"
                        >
                          🗑️ Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {formData.mediaUrls.length < 3 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addMediaUrl}
                    title="Add another media URL (maximum 3 allowed)"
                  >
                    ➕ Add Media URL
                  </button>
                )}
              </div>

              {/* File Upload Section */}
              <div className="form-section">
                <h4 className="section-title">
                  <i className="fas fa-upload"></i>
                  Upload Media Files (Optional)
                  <small> - Images or Videos (Max 5MB each, up to 3 files)</small>
                </h4>
                
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="file-input"
                    disabled={formData.uploadedFiles?.length >= 3}
                  />
                  <label htmlFor="file-upload" className={`file-upload-label ${formData.uploadedFiles?.length >= 3 ? 'disabled' : ''}`}>
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>Choose Files or Drag & Drop</span>
                    <small>Images, Videos • Max 5MB • Up to 3 files</small>
                  </label>
                </div>

                {formData.uploadedFiles?.length > 0 && (
                  <div className="uploaded-files">
                    <h4>Uploaded Files ({formData.uploadedFiles.length}/3)</h4>
                    {formData.uploadedFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        <div className="file-info">
                          <i className={`fas ${file.type.startsWith('video/') ? 'fa-video' : 'fa-image'}`}></i>
                          <div className="file-details">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{formatFileSize(file.size)}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeUploadedFile(index)}
                          className="remove-file-btn"
                          title="Remove this file"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    title="Check to make this service available for patient booking"
                  />
                  <span className="checkbox-text" title="Toggle service availability for patients">Service is active and available for booking</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;