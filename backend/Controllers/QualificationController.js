const { db } = require("../config/database.js");

// GET ALL QUALIFICATIONS FOR USER
exports.getQualifications = (req, res) => {
  const userId = req.user.id;

  const sql = `SELECT * FROM qualifications WHERE user_id = ? ORDER BY year_completed DESC`;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error", err });

    res.json({ qualifications: results });
  });
};

// ADD NEW QUALIFICATION
exports.addQualification = (req, res) => {
  const userId = req.user.id;
  const data = { ...req.body, user_id: userId };

  const sql = `INSERT INTO qualifications SET ?`;

  db.query(sql, data, (err) => {
    if (err) return res.status(500).json({ message: "Insert Failed", err });

    res.json({ message: "Qualification added successfully" });
  });
};

// UPDATE QUALIFICATION
exports.updateQualification = (req, res) => {
  const { id } = req.params;

  const sql = `UPDATE qualifications SET ? WHERE qualification_id = ?`;

  db.query(sql, [req.body, id], (err) => {
    if (err) return res.status(500).json({ message: "Update Failed", err });

    res.json({ message: "Qualification updated successfully" });
  });
};

// DELETE QUALIFICATION
exports.deleteQualification = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM qualifications WHERE qualification_id = ?`;

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Delete Failed", err });

    res.json({ message: "Qualification deleted successfully" });
  });
};

// TOGGLE VERIFICATION STATUS
exports.toggleVerification = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE qualifications
    SET is_verified = NOT is_verified
    WHERE qualification_id = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Toggle Failed", err });

    res.json({ message: "Verification status updated!" });
  });
};
