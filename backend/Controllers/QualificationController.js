const { query } = require("../config/database");

// GET all qualifications for logged-in user
exports.getQualifications = async (req, res) => {
  try {
    // For testing without auth
    if (!req.user) {
      return res.json({ success: true, qualifications: [] });
    }
    
    const userId = req.user.id;
    const sql = `SELECT * FROM qualifications WHERE user_id = ? ORDER BY year_completed DESC`;
    const results = await query(sql, [userId]);
    
    return res.json({
      success: true,
      qualifications: results,
    });
  } catch (err) {
    console.error("Fetch Error:", err);
    return res.status(500).json({ message: "Failed to fetch qualifications" });
  }
};

// ADD new qualification
exports.addQualification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { degree_name, institution, specialization, year_completed, description, certificate_url, is_verified } = req.body;
    
    const sql = `INSERT INTO qualifications (user_id, degree_name, institution, specialization, year_completed, description, certificate_url, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    await query(sql, [userId, degree_name, institution, specialization, year_completed, description, certificate_url, is_verified ? 1 : 0]);
    
    return res.json({ success: true, message: "Qualification added successfully" });
  } catch (err) {
    console.error("Insert Error:", err);
    return res.status(500).json({ message: "Failed to add qualification" });
  }
};

// UPDATE qualification
exports.updateQualification = async (req, res) => {
  try {
    const userId = req.user.id;
    const qualificationId = req.params.id;
    const { degree_name, institution, specialization, year_completed, description, certificate_url, is_verified } = req.body;
    
    const sql = `UPDATE qualifications SET degree_name=?, institution=?, specialization=?, year_completed=?, description=?, certificate_url=?, is_verified=? WHERE qualification_id=? AND user_id=?`;
    
    const result = await query(sql, [degree_name, institution, specialization, year_completed, description, certificate_url, is_verified ? 1 : 0, qualificationId, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Qualification not found" });
    }
    
    return res.json({ success: true, message: "Qualification updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    return res.status(500).json({ message: "Failed to update qualification" });
  }
};

// DELETE qualification
exports.deleteQualification = async (req, res) => {
  try {
    const userId = req.user.id;
    const qualificationId = req.params.id;
    
    const sql = `DELETE FROM qualifications WHERE qualification_id=? AND user_id=?`;
    await query(sql, [qualificationId, userId]);
    
    return res.json({ success: true, message: "Qualification deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({ message: "Failed to delete qualification" });
  }
};

// TOGGLE verification status
exports.toggleVerification = async (req, res) => {
  try {
    const userId = req.user.id;
    const qualificationId = req.params.id;
    
    const sql = `UPDATE qualifications SET is_verified = NOT is_verified WHERE qualification_id=? AND user_id=?`;
    await query(sql, [qualificationId, userId]);
    
    return res.json({ success: true, message: "Verification status updated" });
  } catch (err) {
    console.error("Toggle Error:", err);
    return res.status(500).json({ message: "Failed to update status" });
  }
};
