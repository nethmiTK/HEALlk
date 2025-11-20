const { query, execute } = require('../config/database');

class QualificationController {
  // Get all qualifications for the current user
  static async getQualifications(req, res) {
    try {
      const userId = req.user.id;
      
      const qualifications = await query(
        `SELECT qualification_id, degree_name, specialization, institution, 
                year_completed, description, certificate_url, is_verified,
                created_at, updated_at
         FROM doctor_qualifications 
         WHERE user_id = ?
         ORDER BY year_completed DESC`,
        [userId]
      );

      res.json({
        success: true,
        qualifications: qualifications
      });
    } catch (error) {
      console.error('Error fetching qualifications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch qualifications'
      });
    }
  }

  // Add a new qualification
  static async addQualification(req, res) {
    try {
      const userId = req.user.id;
      const {
        degree_name,
        specialization,
        institution,
        year_completed,
        description,
        certificate_url,
        is_verified
      } = req.body;

      // Validate required fields
      if (!degree_name || !specialization || !institution || !year_completed) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields: degree_name, specialization, institution, year_completed'
        });
      }

      // Validate year
      const currentYear = new Date().getFullYear();
      if (year_completed > currentYear || year_completed < 1950) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid year'
        });
      }

      const [result] = await execute(
        `INSERT INTO doctor_qualifications 
         (user_id, degree_name, specialization, institution, year_completed, description, certificate_url, is_verified)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, degree_name, specialization, institution, year_completed, description || null, certificate_url || null, is_verified || false]
      );

      // Get the newly created qualification
      const newQualification = await query(
        `SELECT qualification_id, degree_name, specialization, institution, 
                year_completed, description, certificate_url, is_verified,
                created_at, updated_at
         FROM doctor_qualifications 
         WHERE qualification_id = ?`,
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message: 'Qualification added successfully',
        qualification: newQualification[0]
      });
    } catch (error) {
      console.error('Error adding qualification:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add qualification'
      });
    }
  }

  // Update an existing qualification
  static async updateQualification(req, res) {
    try {
      const userId = req.user.id;
      const qualificationId = req.params.id;
      const {
        degree_name,
        specialization,
        institution,
        year_completed,
        description,
        certificate_url,
        is_verified
      } = req.body;

      // Check if qualification exists and belongs to user
      const existingQual = await query(
        'SELECT qualification_id FROM doctor_qualifications WHERE qualification_id = ? AND user_id = ?',
        [qualificationId, userId]
      );

      if (existingQual.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Qualification not found or access denied'
        });
      }

      // Validate required fields
      if (!degree_name || !specialization || !institution || !year_completed) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields'
        });
      }

      // Validate year
      const currentYear = new Date().getFullYear();
      if (year_completed > currentYear || year_completed < 1950) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid year'
        });
      }

      await query(
        `UPDATE doctor_qualifications 
         SET degree_name = ?, specialization = ?, institution = ?, year_completed = ?, 
             description = ?, certificate_url = ?, is_verified = ?
         WHERE qualification_id = ? AND user_id = ?`,
        [degree_name, specialization, institution, year_completed, 
         description || null, certificate_url || null, is_verified || false, 
         qualificationId, userId]
      );

      // Get the updated qualification
      const updatedQualification = await query(
        `SELECT qualification_id, degree_name, specialization, institution, 
                year_completed, description, certificate_url, is_verified,
                created_at, updated_at
         FROM doctor_qualifications 
         WHERE qualification_id = ?`,
        [qualificationId]
      );

      res.json({
        success: true,
        message: 'Qualification updated successfully',
        qualification: updatedQualification[0]
      });
    } catch (error) {
      console.error('Error updating qualification:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update qualification'
      });
    }
  }

  // Delete a qualification
  static async deleteQualification(req, res) {
    try {
      const userId = req.user.id;
      const qualificationId = req.params.id;

      // Check if qualification exists and belongs to user
      const existingQual = await query(
        'SELECT qualification_id FROM doctor_qualifications WHERE qualification_id = ? AND user_id = ?',
        [qualificationId, userId]
      );

      if (existingQual.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Qualification not found or access denied'
        });
      }

      await query(
        'DELETE FROM doctor_qualifications WHERE qualification_id = ? AND user_id = ?',
        [qualificationId, userId]
      );

      res.json({
        success: true,
        message: 'Qualification deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting qualification:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete qualification'
      });
    }
  }

  // Toggle verification status
  static async toggleVerification(req, res) {
    try {
      const userId = req.user.id;
      const qualificationId = req.params.id;

      // Check if qualification exists and belongs to user
      const existingQual = await query(
        'SELECT qualification_id, is_verified FROM doctor_qualifications WHERE qualification_id = ? AND user_id = ?',
        [qualificationId, userId]
      );

      if (existingQual.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Qualification not found or access denied'
        });
      }

      const newVerificationStatus = !existingQual[0].is_verified;

      await query(
        'UPDATE doctor_qualifications SET is_verified = ? WHERE qualification_id = ? AND user_id = ?',
        [newVerificationStatus, qualificationId, userId]
      );

      res.json({
        success: true,
        message: `Qualification ${newVerificationStatus ? 'verified' : 'marked as pending'}`,
        is_verified: newVerificationStatus
      });
    } catch (error) {
      console.error('Error toggling verification:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update verification status'
      });
    }
  }
}

module.exports = QualificationController;