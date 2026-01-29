const { query } = require('../config/database');

// GET all verified doctors for public display
exports.getVerifiedDoctors = async (req, res) => {
  try {
    const sql = `
      SELECT 
        u.user_id,
        u.full_name,
        u.email,
        u.phone,
        u.profile_pic,
        u.specialization,
        u.created_at,
        GROUP_CONCAT(DISTINCT c.clinic_name) as clinic_names,
        GROUP_CONCAT(DISTINCT c.city) as cities,
        COUNT(DISTINCT c.id) as clinic_count
      FROM users u
      LEFT JOIN clinic_info c ON u.user_id = c.user_id
      WHERE u.role = 'doctor' AND u.status = 'accepted'
      GROUP BY u.user_id
      ORDER BY u.created_at DESC
      LIMIT 20
    `;
    
    const doctors = await query(sql);
    
    const formattedDoctors = doctors.map(doctor => ({
      id: doctor.user_id,
      name: doctor.full_name,
      email: doctor.email,
      phone: doctor.phone,
      profilePic: doctor.profile_pic,
      specialization: doctor.specialization,
      clinics: doctor.clinic_names ? doctor.clinic_names.split(',') : [],
      cities: doctor.cities ? doctor.cities.split(',') : [],
      clinicCount: doctor.clinic_count || 0,
      joinedDate: doctor.created_at
    }));
    
    res.json({ success: true, doctors: formattedDoctors });
  } catch (err) {
    console.error('Error fetching verified doctors:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch doctors' });
  }
};

// GET single doctor profile for public view
exports.getDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.params.id;
    
    // Get doctor basic info
    const doctorSql = `SELECT user_id, full_name, email, phone, profile_pic, role, description, specialization, status, created_at FROM users WHERE user_id = ? AND role = 'doctor' AND status = 'accepted'`;
    const doctorResult = await query(doctorSql, [doctorId]);
    
    if (doctorResult.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    const doctor = doctorResult[0];
    
    // Get doctor's clinics
    const clinicsSql = `SELECT * FROM clinic_info WHERE user_id = ?`;
    const clinics = await query(clinicsSql, [doctorId]);
    
    // Get doctor's qualifications
    const qualificationsSql = `SELECT * FROM qualifications WHERE user_id = ? ORDER BY year_completed DESC`;
    const qualifications = await query(qualificationsSql, [doctorId]);
    
    // Get doctor's reviews
    const reviewsSql = `SELECT * FROM doctor_reviews WHERE doctor_id = ? ORDER BY created_at DESC`;
    const reviews = await query(reviewsSql, [doctorId]);
    
    const profile = {
      id: doctor.user_id,
      name: doctor.full_name,
      email: doctor.email,
      phone: doctor.phone,
      profilePic: doctor.profile_pic,
      specialization: doctor.specialization,
      role: doctor.role,
      description: doctor.description,
      joinedDate: doctor.created_at,
      clinics: clinics.map(clinic => ({
        id: clinic.id,
        name: clinic.clinic_name,
        address: clinic.address,
        city: clinic.city,
        phone: clinic.phone,
        email: clinic.email,
        specializations: clinic.specializations ? JSON.parse(clinic.specializations) : [],
        facilities: clinic.facilities ? JSON.parse(clinic.facilities) : [],
        workingHours: clinic.working_hours ? JSON.parse(clinic.working_hours) : null
      })),
      qualifications: qualifications.map(qual => ({
        id: qual.qualification_id,
        degreeName: qual.degree_name,
        institution: qual.institution,
        specialization: qual.specialization,
        yearCompleted: qual.year_completed,
        description: qual.description,
        isVerified: qual.is_verified
      })),
      reviews: reviews.map(review => ({
        id: review.id,
        reviewerName: review.reviewer_name,
        reviewerEmail: review.reviewer_email,
        rating: review.rating,
        reviewText: review.review_text,
        createdAt: review.created_at
      }))
    };
    
    res.json({ success: true, doctor: profile });
  } catch (err) {
    console.error('Error fetching doctor profile:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch doctor profile' });
  }
};

// GET doctor profile by name
exports.getDoctorByName = async (req, res) => {
  try {
    const doctorName = req.params.name;
    
    // Get doctor basic info by name
    const doctorSql = `SELECT user_id, full_name, email, phone, profile_pic, role, description, specialization, status, created_at FROM users WHERE full_name = ? AND role = 'doctor' AND status = 'accepted'`;
    const doctorResult = await query(doctorSql, [doctorName]);
    
    if (doctorResult.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    const doctor = doctorResult[0];
    const doctorId = doctor.user_id;
    
    // Get doctor's clinics
    const clinicsSql = `SELECT * FROM clinic_info WHERE user_id = ?`;
    const clinics = await query(clinicsSql, [doctorId]);
    
    // Get doctor's qualifications
    const qualificationsSql = `SELECT * FROM qualifications WHERE user_id = ? ORDER BY year_completed DESC`;
    const qualifications = await query(qualificationsSql, [doctorId]);
    
    // Get doctor's reviews
    const reviewsSql = `SELECT * FROM doctor_reviews WHERE doctor_id = ? ORDER BY created_at DESC`;
    const reviews = await query(reviewsSql, [doctorId]);
    
    const profile = {
      id: doctor.user_id,
      name: doctor.full_name,
      email: doctor.email,
      phone: doctor.phone,
      profilePic: doctor.profile_pic,
      specialization: doctor.specialization,
      role: doctor.role,
      description: doctor.description,
      joinedDate: doctor.created_at,
      clinics: clinics.map(clinic => ({
        id: clinic.id,
        name: clinic.clinic_name,
        address: clinic.address,
        city: clinic.city,
        phone: clinic.phone,
        email: clinic.email,
        specializations: clinic.specializations ? JSON.parse(clinic.specializations) : [],
        facilities: clinic.facilities ? JSON.parse(clinic.facilities) : [],
        workingHours: clinic.working_hours ? JSON.parse(clinic.working_hours) : null
      })),
      qualifications: qualifications.map(qual => ({
        id: qual.qualification_id,
        degreeName: qual.degree_name,
        institution: qual.institution,
        specialization: qual.specialization,
        yearCompleted: qual.year_completed,
        description: qual.description,
        isVerified: qual.is_verified
      })),
      reviews: reviews.map(review => ({
        id: review.id,
        reviewerName: review.reviewer_name,
        reviewerEmail: review.reviewer_email,
        rating: review.rating,
        reviewText: review.review_text,
        createdAt: review.created_at
      }))
    };
    
    res.json({ success: true, doctor: profile });
  } catch (err) {
    console.error('Error fetching doctor profile by name:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch doctor profile' });
  }
};

// GET user phone for product ordering
exports.getUserPhone = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const sql = `SELECT user_id, full_name, phone FROM users WHERE user_id = ?`;
    const result = await query(sql, [userId]);
    
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const user = result[0];
    res.json({ 
      success: true, 
      phone: user.phone,
      full_name: user.full_name,
      user_id: user.user_id
    });
  } catch (err) {
    console.error('Error fetching user phone:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch user phone' });
  }
};