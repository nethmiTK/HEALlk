import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Pagination from './Pagination';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(5);

  const categories = [
    'General Consultation',
    'Specialist Consultation',
    'Diagnostic Services',
    'Treatment Services',
    'Emergency Care',
    'Preventive Care'
  ];

  useEffect(() => {
    const loadServices = async () => {
      try {
        const token = localStorage.getItem('heallk_token');
        if (!token) {
          toast.error('Please login to access services');
          window.location.href = '/login';
          return;
        }

        const response = await fetch('http://localhost:5000/api/services', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setServices(data.services);
          }
        }
      } catch (error) {
        console.error('Error loading services:', error);
        toast.error('Failed to load services');
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('heallk_token');
      const endpoint = editingService 
        ? `http://localhost:5000/api/services/${editingService.id}`
        : 'http://localhost:5000/api/services';
      
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(editingService ? 'Service updated successfully!' : 'Service added successfully!');
        
        const servicesResponse = await fetch('http://localhost:5000/api/services', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          if (servicesData.success) {
            setServices(servicesData.services);
          }
        }

        resetForm();
      } else {
        toast.error(data.message || 'Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
    }
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

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const token = localStorage.getItem('heallk_token');
        const response = await fetch(`http://localhost:5000/api/services/${serviceId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success('Service deleted successfully!');
          setServices(prev => prev.filter(service => service.id !== serviceId));
        } else {
          toast.error(data.message || 'Failed to delete service');
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('Failed to delete service');
      }
    }
  };

  const toggleServiceStatus = async (serviceId) => {
    try {
      const token = localStorage.getItem('heallk_token');
      const response = await fetch(`http://localhost:5000/api/services/${serviceId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message);
        setServices(prev => prev.map(service => 
          service.id === serviceId 
            ? { ...service, isActive: data.isActive }
            : service
        ));
      } else {
        toast.error(data.message || 'Failed to toggle service status');
      }
    } catch (error) {
      console.error('Error toggling service status:', error);
      toast.error('Failed to toggle service status');
    }
  };

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-green-50 min-h-screen p-2 sm:p-4 lg:p-6 relative">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Services Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your medical services and offerings</p>
          </div>
          <button 
            className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
            onClick={() => setIsModalOpen(true)}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Service
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search services..."
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Services Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">{services.length}</div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Services</div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">{services.filter(s => s.isActive).length}</div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">Active Services</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-purple-600 mb-2">{new Set(services.map(s => s.category)).size}</div>
          <div className="text-sm text-gray-600 font-medium">Categories</div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentServices.filter(service => 
              service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              service.category.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <h3 className="text-sm font-medium text-gray-900">{service.title}</h3>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">LKR {service.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      service.isActive 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    } transition-colors`}
                    onClick={() => toggleServiceStatus(service.id)}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium hover:bg-green-200 transition-colors flex items-center gap-1"
                      onClick={() => handleEdit(service)}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium hover:bg-red-200 transition-colors flex items-center gap-1"
                      onClick={() => handleDelete(service.id)}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={services.length}
        itemsPerPage={servicesPerPage}
        onPageChange={setCurrentPage}
      />

      {services.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚕️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No services added yet</h3>
          <p className="text-gray-500 mb-6">Start by adding your first medical service</p>
          <button 
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add First Service
          </button>
        </div>
      )}

      {/* Modal Background with Blur */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0  bg-opacity-80 backdrop-blur-sm"></div>
        </div>
      )}
      
      {/* Add/Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center">
          <div className={`bg-white rounded-b-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border-2 border-gray-100 transform transition-all duration-300 ease-out ${
            isModalOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`} style={{ marginTop: '0' }}>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{editingService ? '✏️ Edit Service' : '🏥 Add New Service'}</h2>
                  <p className="text-blue-100 mt-1">Fill in the details below to {editingService ? 'update' : 'create'} your service</p>
                </div>
                <button 
                  onClick={resetForm} 
                  data-modal-close
                  className="text-white hover:text-red-200 text-2xl font-bold bg-white bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-30 transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    📋 Service Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        placeholder="e.g., General Consultation"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                        required
                        rows="3"
                        placeholder="Describe the service and what it includes..."
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Pricing Section */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    💰 Pricing Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        placeholder="e.g., 30 minutes"
                      />
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (LKR)</label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    ⚙️ Service Status
                  </h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Service is active and available to patients
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t-2 border-gray-100">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    {editingService ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Update Service
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Service
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

export default Services;