const express = require("express");
const router = express.Router();
const { 
  submitContact, 
  submitGeneralContact,
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
} = require("../Controllers/ContactController");

// CRUD operations
router.get("/", getAllContacts);           // Get all contacts
router.get("/:id", getContactById);        // Get single contact
router.post("/", createContact);           // Create contact
router.put("/:id", updateContact);         // Update contact
router.delete("/:id", deleteContact);      // Delete contact

// Existing endpoints
router.post("/submit", submitGeneralContact); // General contact form
router.post("/appointment", submitContact); // Appointment booking

module.exports = router;
