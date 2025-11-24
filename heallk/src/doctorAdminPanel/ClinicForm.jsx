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
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading your clinics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r ">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold ">🏥 My Clinics</h1><br></br>
            <p >Manage your clinic information and settings</p><br></br><br></br>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add New Clinic
          </button>
        </div>
      </div>

      {/* Clinics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {clinics.map(clinic => (
          <div key={clinic.id} className={`bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${showForm ? 'blur-sm' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800 leading-tight">{clinic.clinicName || clinic.clinic_name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(clinic)}
                  className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(clinic.id)}
                  className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="text-blue-500">📍</span>
                <p className="flex-1">{clinic.address}, {clinic.city}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">📞</span>
                <p>{clinic.phone}</p>
              </div>
              {clinic.email && (
                <div className="flex items-center gap-2">
                  <span className="text-purple-500">✉️</span>
                  <p>{clinic.email}</p>
                </div>
              )}
              {clinic.description && (
                <div className="bg-gray-50 p-3 rounded-lg mt-3">
                  <p className="text-xs text-gray-700 leading-relaxed">{clinic.description.substring(0, 120)}...</p>
                </div>
              )}
              
              {clinic.specializations && clinic.specializations.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">SPECIALIZATIONS</p>
                  <div className="flex flex-wrap gap-2">
                    {clinic.specializations.slice(0, 3).map(spec => (
                      <span key={spec} className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                        {spec}
                      </span>
                    ))}
                    {clinic.specializations.length > 3 && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">+{clinic.specializations.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Blur Background */}
      {showForm && <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40"></div>}
      
      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border-2 border-gray-100">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{editingClinic ? '✏️ Edit Clinic' : '🏥 Add New Clinic'}</h2>
                  <p className="text-blue-100 mt-1">Fill in the details below to {editingClinic ? 'update' : 'create'} your clinic</p>
                </div>
                <button 
                  onClick={resetForm} 
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
                    📋 Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Clinic Name *</label>
                      <input
                        type="text"
                        value={formData.clinicName}
                        onChange={(e) => setFormData({...formData, clinicName: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                        placeholder="Enter clinic name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                        placeholder="0771234567"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                        placeholder="Enter full address"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                        placeholder="Colombo"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                        placeholder="clinic@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                        rows="3"
                        placeholder="Brief description of your clinic and services..."
                      />
                    </div>
                  </div>
                </div>

                {/* Specializations Section */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    ⚕️ Medical Specializations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {specializations.map(spec => (
                      <label key={spec} className="flex items-center space-x-3 cursor-pointer bg-white p-3 rounded-lg border-2 border-transparent hover:border-blue-300 transition-all duration-200 shadow-sm">
                        <input
                          type="checkbox"
                          checked={formData.specializations.includes(spec)}
                          onChange={() => handleArrayChange('specializations', spec)}
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Working Hours Section */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    🕐 Working Hours
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {daysOfWeek.map(day => (
                      <div key={day} className="bg-white p-4 rounded-lg border-2 border-gray-100 shadow-sm">
                        <label className="flex items-center space-x-3 cursor-pointer mb-3">
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
                            className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm font-semibold capitalize text-gray-700">{day}</span>
                        </label>
                        {formData.workingHours[day].isOpen ? (
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
                              className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            <span className="text-sm font-medium text-gray-500">to</span>
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
                              className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <span className="text-red-500 font-medium text-sm">Closed</span>
                          </div>
                        )}
                      </div>
                    ))}
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
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        {editingClinic ? '✏️ Update' : '🏥 Add'} Clinic
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

export default ClinicForm;