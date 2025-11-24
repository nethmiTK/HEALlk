import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

const ClinicForm = () => {
  const [clinics, setClinics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClinic, setEditingClinic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clinicName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    specializations: [],
    facilities: [],
    workingHours: {
      monday: { open: '09:00', close: '17:00', isOpen: true },
      tuesday: { open: '09:00', close: '17:00', isOpen: true },
      wednesday: { open: '09:00', close: '17:00', isOpen: true },
      thursday: { open: '09:00', close: '17:00', isOpen: true },
      friday: { open: '09:00', close: '17:00', isOpen: true },
      saturday: { open: '09:00', close: '13:00', isOpen: true },
      sunday: { open: '09:00', close: '17:00', isOpen: false }
    },
    emergencyContact: '',
    insuranceAccepted: []
  });

  const specializations = ['General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'Pediatrics'];
  const facilities = ['Parking', 'Wheelchair Accessible', 'Laboratory', 'X-Ray', 'ECG', 'Ultrasound'];
  const insuranceCompanies = ['Ceylinco Insurance', 'Sri Lanka Insurance', 'AIA Insurance'];
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  useEffect(() => {
    loadClinics();
  }, []);

  const loadClinics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('heallk_token');
      const response = await fetch(`${API_BASE_URL}/clinics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setClinics(data.clinics || []);
      }
    } catch (error) {
      console.error('Error loading clinics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('heallk_token');
      const url = editingClinic 
        ? `${API_BASE_URL}/clinics/${editingClinic.id}`
        : `${API_BASE_URL}/clinics`;
      
      const response = await fetch(url, {
        method: editingClinic ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingClinic ? 'Clinic updated!' : 'Clinic added!');
        resetForm();
        loadClinics();
      }
    } catch (error) {
      toast.error('Failed to save clinic');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (clinicId) => {
    if (!confirm('Delete this clinic?')) return;
    
    try {
      const token = localStorage.getItem('heallk_token');
      const response = await fetch(`${API_BASE_URL}/clinics/${clinicId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Clinic deleted!');
        loadClinics();
      }
    } catch (error) {
      toast.error('Failed to delete clinic');
    }
  };

  const handleEdit = (clinic) => {
    setEditingClinic(clinic);
    setFormData({
      ...clinic,
      workingHours: clinic.working_hours || formData.workingHours,
      insuranceAccepted: clinic.insurance_accepted || []
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingClinic(null);
    setFormData({
      clinicName: '', address: '', city: '', postalCode: '', phone: '', email: '', website: '', description: '',
      specializations: [], facilities: [], emergencyContact: '', insuranceAccepted: [],
      workingHours: {
        monday: { open: '09:00', close: '17:00', isOpen: true },
        tuesday: { open: '09:00', close: '17:00', isOpen: true },
        wednesday: { open: '09:00', close: '17:00', isOpen: true },
        thursday: { open: '09:00', close: '17:00', isOpen: true },
        friday: { open: '09:00', close: '17:00', isOpen: true },
        saturday: { open: '09:00', close: '13:00', isOpen: true },
        sunday: { open: '09:00', close: '17:00', isOpen: false }
      }
    });
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  if (loading && clinics.length === 0) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🏥 My Clinics</h1>
            <p className="text-gray-600">Manage your clinic information</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            + Add Clinic
          </button>
        </div>
      </div>

      {/* Clinics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {clinics.map(clinic => (
          <div key={clinic.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{clinic.clinicName || clinic.clinic_name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(clinic)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(clinic.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p>📍 {clinic.address}, {clinic.city}</p>
              <p>📞 {clinic.phone}</p>
              {clinic.email && <p>✉️ {clinic.email}</p>}
              {clinic.description && <p className="text-xs">{clinic.description.substring(0, 100)}...</p>}
              
              {clinic.specializations && clinic.specializations.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {clinic.specializations.slice(0, 3).map(spec => (
                    <span key={spec} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {spec}
                    </span>
                  ))}
                  {clinic.specializations.length > 3 && (
                    <span className="text-xs text-gray-500">+{clinic.specializations.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editingClinic ? 'Edit Clinic' : 'Add New Clinic'}</h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name *</label>
                    <input
                      type="text"
                      value={formData.clinicName}
                      onChange={(e) => setFormData({...formData, clinicName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {specializations.map(spec => (
                      <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specializations.includes(spec)}
                          onChange={() => handleArrayChange('specializations', spec)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Working Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {daysOfWeek.map(day => (
                      <div key={day} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.workingHours[day].isOpen}
                            onChange={() => setFormData(prev => ({
                              ...prev,
                              workingHours: {
                                ...prev.workingHours,
                                [day]: { ...prev.workingHours[day], isOpen: !prev.workingHours[day].isOpen }
                              }
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium capitalize">{day}</span>
                        </label>
                        {formData.workingHours[day].isOpen && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="time"
                              value={formData.workingHours[day].open}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                workingHours: {
                                  ...prev.workingHours,
                                  [day]: { ...prev.workingHours[day], open: e.target.value }
                                }
                              }))}
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                            <span className="text-sm">to</span>
                            <input
                              type="time"
                              value={formData.workingHours[day].close}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                workingHours: {
                                  ...prev.workingHours,
                                  [day]: { ...prev.workingHours[day], close: e.target.value }
                                }
                              }))}
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingClinic ? 'Update' : 'Add'} Clinic
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

export default ClinicForm;