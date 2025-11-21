const express = require("express");
const {
  getQualifications,
  addQualification,
  updateQualification,
  deleteQualification,
  toggleVerification
} = require("../Controllers/QualificationController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/", protect, addQualification);
router.get("/", protect, getQualifications);
router.put("/:id", protect, updateQualification);
router.delete("/:id", protect, deleteQualification);
router.patch("/:id/toggle-verification", protect, toggleVerification);

module.exports = router;
