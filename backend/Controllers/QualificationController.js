const db = require('../config/database');

// GET all qualifications for logged-in user
exports.getQualifications = (req, res) => {
  const userId = req.user.id;

  const sql = `SELECT * FROM qualifications WHERE user_id = ? ORDER BY year_completed DESC`;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('DB Fetch Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch qualifications' });
    }
    res.json({ success: true, qualifications: results });
  });
};

// POST add new qualification
exports.addQualification = (req, res) => {
  const userId = req.user.id;

  const {
    degree_name,
    institution,
    year_completed,
    specialization,
    description,
    certificate_url,
    is_verified
  } = req.body;

  const sql = `
    INSERT INTO qualifications 
    (user_id, degree_name, institution, year_completed, specialization, description, certificate_url, is_verified) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    userId,
    degree_name,
    institution,
    year_completed,
    specialization,
    description || null,
    certificate_url || null,
    is_verified ? 1 : 0
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('DB Insert Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to add qualification' });
    }

    res.status(201).json({ success: true, message: 'Qualification added successfully', qualificationId: result.insertId });
  });
};

// PUT update existing qualification
exports.updateQualification = (req, res) => {
  const userId = req.user.id;
  const qualificationId = req.params.id;

  const {
    degree_name,
    institution,
    year_completed,
    specialization,
    description,
    certificate_url,
    is_verified
  } = req.body;

  // Check if qualification belongs to user
  const checkSql = `SELECT * FROM qualifications WHERE qualification_id = ? AND user_id = ?`;
  db.query(checkSql, [qualificationId, userId], (err, rows) => {
    if (err) {
      console.error('DB Check Error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Qualification not found or unauthorized' });
    }

    const updateSql = `
      UPDATE qualifications
      SET degree_name = ?, institution = ?, year_completed = ?, specialization = ?, description = ?, certificate_url = ?, is_verified = ?
      WHERE qualification_id = ? AND user_id = ?
    `;

    const values = [
      degree_name,
      institution,
      year_completed,
      specialization,
      description || null,
      certificate_url || null,
      is_verified ? 1 : 0,
      qualificationId,
      userId
    ];

    db.query(updateSql, values, (err2, result) => {
      if (err2) {
        console.error('DB Update Error:', err2);
        return res.status(500).json({ success: false, message: 'Failed to update qualification' });
      }

      res.json({ success: true, message: 'Qualification updated successfully' });
    });
  });
};

// DELETE qualification
exports.deleteQualification = (req, res) => {
  const qualificationId = req.params.id;
  const userId = req.user.id;

  const sql = `DELETE FROM qualifications WHERE qualification_id = ? AND user_id = ?`;

  db.query(sql, [qualificationId, userId], (err, result) => {
    if (err) {
      console.error('DB Delete Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete qualification' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Qualification not found or unauthorized' });
    }

    res.json({ success: true, message: 'Qualification deleted successfully' });
  });
};

// PATCH toggle verification status
exports.toggleVerification = (req, res) => {
  const qualificationId = req.params.id;
  const userId = req.user.id;

  const getSql = `SELECT is_verified FROM qualifications WHERE qualification_id = ? AND user_id = ?`;
  db.query(getSql, [qualificationId, userId], (err, rows) => {
    if (err) {
      console.error('DB Fetch Error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Qualification not found or unauthorized' });
    }

    const currentStatus = rows[0].is_verified ? 1 : 0;
    const newStatus = currentStatus === 1 ? 0 : 1;

    const updateSql = `UPDATE qualifications SET is_verified = ? WHERE qualification_id = ? AND user_id = ?`;
    db.query(updateSql, [newStatus, qualificationId, userId], (err2) => {
      if (err2) {
        console.error('DB Update Error:', err2);
        return res.status(500).json({ success: false, message: 'Failed to toggle verification status' });
      }

      res.json({ success: true, message: newStatus === 1 ? 'Marked as Verified' : 'Marked as Pending' });
    });
  });
};
