const db = require('../config/database');

exports.submitContact = (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({
      success: false,
      message: "Name and message are required.",
    });
  }

  const sql = `INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)`;

  db.query(sql, [name, email, phone, message], (err, result) => {
    if (err) {
      console.error("Database Insert Error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to save contact message",
      });
    }

    return res.json({
      success: true,
      message: "Message submitted successfully!",
    });
  });
};
