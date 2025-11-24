// Backend API endpoints for doctor about functionality
// Add these routes to your Express.js server

const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Get doctor about information
router.get('/doctor-about/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'heallk_db'
    });

    const [rows] = await connection.execute(
      'SELECT * FROM doctor_about WHERE doctor_id = ?',
      [doctorId]
    );

    await connection.end();

    if (rows.length > 0) {
      const aboutData = rows[0];
      // Parse JSON fields
      aboutData.gallery_images = JSON.parse(aboutData.gallery_images || '[]');
      aboutData.specialties = JSON.parse(aboutData.specialties || '[]');
      aboutData.languages = JSON.parse(aboutData.languages || '[]');
      
      res.json({
        success: true,
        aboutData
      });
    } else {
      res.json({
        success: true,
        aboutData: null
      });
    }
  } catch (error) {
    console.error('Error fetching doctor about:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor about information'
    });
  }
});

// Save/Update doctor about information
router.post('/doctor-about', async (req, res) => {
  try {
    const {
      doctor_id,
      description,
      profile_image,
      gallery_images,
      specialties,
      experience_years,
      education,
      languages,
      achievements
    } = req.body;

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'heallk_db'
    });

    // Check if record exists
    const [existing] = await connection.execute(
      'SELECT id FROM doctor_about WHERE doctor_id = ?',
      [doctor_id]
    );

    if (existing.length > 0) {
      // Update existing record
      await connection.execute(
        `UPDATE doctor_about SET 
         description = ?, profile_image = ?, gallery_images = ?, 
         specialties = ?, experience_years = ?, education = ?, 
         languages = ?, achievements = ?, updated_at = NOW()
         WHERE doctor_id = ?`,
        [
          description,
          profile_image,
          JSON.stringify(gallery_images || []),
          JSON.stringify(specialties || []),
          experience_years,
          education,
          JSON.stringify(languages || []),
          achievements,
          doctor_id
        ]
      );
    } else {
      // Insert new record
      await connection.execute(
        `INSERT INTO doctor_about 
         (doctor_id, description, profile_image, gallery_images, specialties, 
          experience_years, education, languages, achievements) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          doctor_id,
          description,
          profile_image,
          JSON.stringify(gallery_images || []),
          JSON.stringify(specialties || []),
          experience_years,
          education,
          JSON.stringify(languages || []),
          achievements
        ]
      );
    }

    await connection.end();

    res.json({
      success: true,
      message: 'Doctor about information saved successfully'
    });
  } catch (error) {
    console.error('Error saving doctor about:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save doctor about information'
    });
  }
});

module.exports = router;