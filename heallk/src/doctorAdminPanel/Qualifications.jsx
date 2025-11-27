import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';
import Pagination from './Pagination';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [qualificationsPerPage] = useState(5);

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
    <div className="bg-green-50 min-h-screen p-6 sm:p-4">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Qualifications & Certifications</h1>
          <p className="text-gray-600">Manage your medical qualifications and certifications</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search qualifications..."
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Qualification
          </button>
        </div>
      </div>

      {/* Qualifications Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <span className="text-3xl font-bold text-blue-600 block mb-2">{qualifications.length}</span>
          <span className="text-sm text-gray-600 font-medium">Total Qualifications</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <span className="text-3xl font-bold text-green-600 block mb-2">{qualifications.filter((q) => q.is_verified).length}</span>
          <span className="text-sm text-gray-600 font-medium">Verified</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <span className="text-3xl font-bold text-purple-600 block mb-2">{new Set(qualifications.map((q) => q.specialization)).size}</span>
          <span className="text-sm text-gray-600 font-medium">Specializations</span>
        </div>
      </div>

      {/* Qualifications Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree/Certificate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="animate-pulse text-2xl mb-2">⏳</div>
                  <p className="text-gray-500">Loading qualifications...</p>
                </td>
              </tr>
            ) : filteredQualifications.length > 0 ? (
              filteredQualifications
                .sort((a, b) => parseInt(b.year_completed) - parseInt(a.year_completed))
                .slice((currentPage - 1) * qualificationsPerPage, currentPage * qualificationsPerPage)
                .map((qual) => (
                  <tr key={qual.qualification_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <h3 className="text-sm font-medium text-gray-900">{qual.degree_name}</h3>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qual.institution}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qual.specialization}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qual.year_completed}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          qual.is_verified 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                        onClick={() => toggleVerification(qual.qualification_id)}
                        title={qual.is_verified ? 'Mark as Pending' : 'Mark as Verified'}
                      >
                        {qual.is_verified ? 'Verified' : 'Pending'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium hover:bg-green-200 transition-colors flex items-center gap-1"
                          onClick={() => handleEdit(qual)}
                          title={`Edit ${qual.degree_name}`}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        {qual.certificate_url && (
                          <button
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors"
                            onClick={() => window.open(qual.certificate_url, '_blank')}
                            title="View Certificate"
                          >
                            📄 View
                          </button>
                        )}
                        <button
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium hover:bg-red-200 transition-colors flex items-center gap-1"
                          onClick={() => handleDelete(qual.qualification_id)}
                          title={`Delete ${qual.degree_name}`}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="text-6xl mb-4">🎓</div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No qualifications found</h3>
                  <p className="text-gray-500">Try adjusting your search or add a new qualification.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredQualifications.length}
        itemsPerPage={qualificationsPerPage}
        onPageChange={setCurrentPage}
      />

      {qualifications.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No qualifications added yet</h3>
          <p className="text-gray-500 mb-6">Add your medical qualifications and certifications to build credibility</p>
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add First Qualification
          </button>
        </div>
      )}

      {/* Modal Background */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0bg-opacity-80 backdrop-blur-sm"></div>
        </div>
      )}
      
      {/* Add/Edit Qualification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border-2 border-gray-100">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{editingQual ? '✏️ Edit Qualification' : '🎓 Add New Qualification'}</h2>
                  <p className="text-green-100 mt-1">Fill in the details below to {editingQual ? 'update' : 'add'} your qualification</p>
                </div>
                <button 
                  onClick={() => { if (!loading) resetForm(); }} 
                  data-modal-close
                  className="text-white hover:text-red-200 text-2xl font-bold bg-white bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-30 transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-8">

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="degree_name" className="block text-sm font-medium text-gray-700 mb-1">Degree/Certificate</label>
                  <input
                    type="text"
                    id="degree_name"
                    name="degree_name"
                    value={formData.degree_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="e.g., MBBS, MD, PhD"
                  />
                </div>

                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Field/Specialization</label>
                  <select
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
                  onClick={() => {
                    if (!loading) resetForm();
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium disabled:opacity-50 shadow-md hover:shadow-lg flex items-center gap-2" disabled={loading}>
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : editingQual ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Update Qualification
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Qualification
                    </>
                  )}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Qualifications;
