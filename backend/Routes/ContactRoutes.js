const express = require("express");
const router = express.Router();
const { submitContact } = require("../Controllers/ContactController");

router.post("/submit", submitContact);

module.exports = router;
