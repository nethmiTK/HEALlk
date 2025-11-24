const { query } = require('../config/database');

// Helper function to convert JSON fields to strings for database insertion
const serializeClinicData = (data) => {
  const newData = { ...data };
  if (newData.specializations) newData.specializations = JSON.stringify(newData.specializations);
  if (newData.facilities) newData.facilities = JSON.stringify(newData.facilities);
  if (newData.workingHours) newData.workingHours = JSON.stringify(newData.workingHours);
  if (newData.insuranceAccepted) newData.insuranceAccepted = JSON.stringify(newData.insuranceAccepted);
  if (newData.images) newData.images = JSON.stringify(newData.images);
  return newData;
};

// Helper function to parse JSON fields from database results
const deserializeClinicData = (data) => {
  const newData = { ...data };
  if (newData.specializations) newData.specializations = JSON.parse(newData.specializations);
  if (newData.facilities) newData.facilities = JSON.parse(newData.facilities);
  if (newData.working_hours) newData.working_hours = JSON.parse(newData.working_hours);
  if (newData.insurance_accepted) newData.insurance_accepted = JSON.parse(newData.insurance_accepted);
  if (newData.images) newData.images = JSON.parse(newData.images);
  return newData;
};

// GET clinic information for the logged-in user
exports.getClinicInfo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    const userId = req.user.id;
    const sql = `SELECT * FROM clinic_info WHERE user_id = ?`;
    const result = await query(sql, [userId]);
    
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Clinic information not found' });
    }
    res.json({ success: true, clinicInfo: deserializeClinicData(result[0]) });
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
    
    const result = await query(sql, [userId, clinicName, address, city, postalCode, phone, email, website, description, specializations, facilities, workingHours, emergencyContact, insuranceAccepted, images]);
    
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
    const data = serializeClinicData(req.body);
    const { clinicName, address, city, postalCode, phone, email, website, description, specializations, facilities, workingHours, emergencyContact, insuranceAccepted, images } = data;

    const sql = `UPDATE clinic_info SET clinic_name = ?, address = ?, city = ?, postal_code = ?, phone = ?, email = ?, website = ?, description = ?, specializations = ?, facilities = ?, working_hours = ?, emergency_contact = ?, insurance_accepted = ?, images = ? WHERE user_id = ?`;
    
    const result = await query(sql, [clinicName, address, city, postalCode, phone, email, website, description, specializations, facilities, workingHours, emergencyContact, insuranceAccepted, images, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Clinic information not found for this user' });
    }
    res.json({ success: true, message: 'Clinic information updated successfully' });
  } catch (err) {
    console.error('DB Update Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update clinic information' });
  }
};
