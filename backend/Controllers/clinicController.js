const { query } = require('../config/database');

// Helper function to convert JSON fields to strings for database insertion
const serializeClinicData = (data) => {
  const newData = { ...data };
  
  // Convert arrays to JSON strings
  if (newData.specializations && Array.isArray(newData.specializations)) {
    newData.specializations = JSON.stringify(newData.specializations);
  }
  if (newData.facilities && Array.isArray(newData.facilities)) {
    newData.facilities = JSON.stringify(newData.facilities);
  }
  if (newData.workingHours && typeof newData.workingHours === 'object') {
    newData.workingHours = JSON.stringify(newData.workingHours);
  }
  if (newData.insuranceAccepted && Array.isArray(newData.insuranceAccepted)) {
    newData.insuranceAccepted = JSON.stringify(newData.insuranceAccepted);
  }
  if (newData.images && Array.isArray(newData.images)) {
    newData.images = JSON.stringify(newData.images);
  }
  
  return newData;
};

// Helper function to parse JSON fields from database results
const deserializeClinicData = (data) => {
  const newData = { ...data };
  // Map database field names to frontend field names
  if (newData.clinic_name) newData.clinicName = newData.clinic_name;
  if (newData.postal_code) newData.postalCode = newData.postal_code;
  if (newData.emergency_contact) newData.emergencyContact = newData.emergency_contact;
  
  // Parse JSON fields
  try {
    if (newData.specializations && typeof newData.specializations === 'string') {
      newData.specializations = JSON.parse(newData.specializations);
    }
    if (newData.facilities && typeof newData.facilities === 'string') {
      newData.facilities = JSON.parse(newData.facilities);
    }
    if (newData.working_hours && typeof newData.working_hours === 'string') {
      newData.working_hours = JSON.parse(newData.working_hours);
    }
    if (newData.insurance_accepted && typeof newData.insurance_accepted === 'string') {
      newData.insurance_accepted = JSON.parse(newData.insurance_accepted);
    }
    if (newData.images && typeof newData.images === 'string') {
      newData.images = JSON.parse(newData.images);
    }
  } catch (error) {
    console.error('Error parsing JSON fields:', error);
  }
  
  return newData;
};

// GET all clinics for the logged-in user
exports.getClinicInfo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    const userId = req.user.id;
    const sql = `SELECT * FROM clinic_info WHERE user_id = ? ORDER BY created_at DESC`;
    const result = await query(sql, [userId]);
    
    const clinics = result.map(clinic => deserializeClinicData(clinic));
    res.json({ success: true, clinics });
  } catch (err) {
    console.error('DB Fetch Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch clinic information' });
  }
};

// POST add new clinic information
exports.addClinicInfo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    const userId = req.user.id;
    const data = serializeClinicData(req.body);
    const { clinicName, address, city, postalCode, phone, email, website, description, specializations, facilities, workingHours, emergencyContact, insuranceAccepted, images } = data;

    const sql = `INSERT INTO clinic_info (user_id, clinic_name, address, city, postal_code, phone, email, website, description, specializations, facilities, working_hours, emergency_contact, insurance_accepted, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const result = await query(sql, [
      userId,
      clinicName || null,
      address || null,
      city || null, 
      postalCode || null,
      phone || null,
      email || null,
      website || null,
      description || null,
      specializations || null,
      facilities || null,
      workingHours || null,
      emergencyContact || null,
      insuranceAccepted || null,
      images || null
    ]);
    
    res.status(201).json({ success: true, message: 'Clinic information added successfully', id: result.insertId });
  } catch (err) {
    console.error('DB Insert Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to add clinic information' });
  }
};

// PUT update existing clinic information
exports.updateClinicInfo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    const userId = req.user.id;
    const clinicId = req.params.id;
    const data = serializeClinicData(req.body);
    const { clinicName, address, city, postalCode, phone, email, website, description, specializations, facilities, workingHours, emergencyContact, insuranceAccepted, images } = data;

    const sql = `UPDATE clinic_info SET clinic_name = ?, address = ?, city = ?, postal_code = ?, phone = ?, email = ?, website = ?, description = ?, specializations = ?, facilities = ?, working_hours = ?, emergency_contact = ?, insurance_accepted = ?, images = ? WHERE id = ? AND user_id = ?`;
    
    const result = await query(sql, [
      clinicName || null,
      address || null, 
      city || null,
      postalCode || null,
      phone || null,
      email || null,
      website || null,
      description || null,
      specializations || null,
      facilities || null,
      workingHours || null,
      emergencyContact || null,
      insuranceAccepted || null,
      images || null,
      clinicId,
      userId
    ]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }
    res.json({ success: true, message: 'Clinic updated successfully' });
  } catch (err) {
    console.error('DB Update Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update clinic' });
  }
};

// DELETE clinic
exports.deleteClinic = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    const userId = req.user.id;
    const clinicId = req.params.id;
    
    const sql = `DELETE FROM clinic_info WHERE id = ? AND user_id = ?`;
    const result = await query(sql, [clinicId, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }
    
    res.json({ success: true, message: 'Clinic deleted successfully' });
  } catch (err) {
    console.error('DB Delete Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete clinic' });
  }
};
