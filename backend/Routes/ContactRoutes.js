const express = require("express");
const router = express.Router();
const { submitContact, submitGeneralContact } = require("../Controllers/ContactController");

router.post("/submit", submitGeneralContact); // General contact form
router.post("/appointment", submitContact); // Appointment booking

module.exports = router;
