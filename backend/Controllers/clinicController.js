const db = require('../config/database');

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
exports.getClinicInfo = (req, res) => {
  const userId = req.user.id;

  const sql = `SELECT * FROM clinic_info WHERE user_id = ?`;
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('DB Fetch Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch clinic information' });
    }
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Clinic information not found' });
    }
    res.json({ success: true, clinicInfo: deserializeClinicData(result[0]) });
  });
};

// POST add new clinic information
exports.addClinicInfo = (req, res) => {
  const userId = req.user.id;
  const data = serializeClinicData(req.body);

  const { clinicName, address, city, postalCode, phone, email, website, description, specializations, facilities, workingHours, emergencyContact, insuranceAccepted, images } = data;

  const sql = `
    INSERT INTO clinic_info 
    (user_id, clinic_name, address, city, postal_code, phone, email, website, description, specializations, facilities, working_hours, emergency_contact, insurance_accepted, images)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    userId,
    clinicName,
    address,
    city,
    postalCode,
    phone,
    email,
    website,
    description,
    specializations,
    facilities,
    workingHours,
    emergencyContact,
    insuranceAccepted,
    images
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('DB Insert Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to add clinic information' });
    }
    res.status(201).json({ success: true, message: 'Clinic information added successfully', id: result.insertId });
  });
};

// PUT update existing clinic information
exports.updateClinicInfo = (req, res) => {
  const userId = req.user.id;
  const data = serializeClinicData(req.body);

  const { clinicName, address, city, postalCode, phone, email, website, description, specializations, facilities, workingHours, emergencyContact, insuranceAccepted, images } = data;

  const sql = `
    UPDATE clinic_info
    SET 
      clinic_name = ?,
      address = ?,
      city = ?,
      postal_code = ?,
      phone = ?,
      email = ?,
      website = ?,
      description = ?,
      specializations = ?,
      facilities = ?,
      working_hours = ?,
      emergency_contact = ?,
      insurance_accepted = ?,
      images = ?
    WHERE user_id = ?
  `;
  const values = [
    clinicName,
    address,
    city,
    postalCode,
    phone,
    email,
    website,
    description,
    specializations,
    facilities,
    workingHours,
    emergencyContact,
    insuranceAccepted,
    images,
    userId
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('DB Update Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update clinic information' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Clinic information not found for this user' });
    }
    res.json({ success: true, message: 'Clinic information updated successfully' });
  });
};
