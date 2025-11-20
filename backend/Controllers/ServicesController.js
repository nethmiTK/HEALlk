const { query, execute } = require('../config/database');

class ServicesController {
  // Get all services for the current doctor
  static async getServices(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }
      
      const doctorId = req.user.id;
      
      const services = await query(
        `SELECT id, title, description, duration, price, category, 
                media_urls, is_active, created_at, updated_at
         FROM services 
         WHERE doctor_id = ?
         ORDER BY created_at DESC`,
        [doctorId]
      );

      // Convert media_urls JSON string back to array
      const servicesWithMedia = services.map(service => ({
        ...service,
        mediaUrls: service.media_urls ? JSON.parse(service.media_urls) : []
      }));

      res.json({
        success: true,
        services: servicesWithMedia
      });
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch services'
      });
    }
  }

  // Add a new service
  static async addService(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }
      
      const doctorId = req.user.id;
      const { title, description, duration, price, category, mediaUrls, isActive } = req.body;

      // Validation
      if (!title || !description || !duration || !price || !category) {
        return res.status(400).json({
          success: false,
          message: 'All required fields must be provided'
        });
      }

      // Convert mediaUrls array to JSON string
      const mediaUrlsJson = JSON.stringify(mediaUrls || []);

      const result = await execute(
        `INSERT INTO services (doctor_id, title, description, duration, price, category, media_urls, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [doctorId, title, description, duration, parseFloat(price), category, mediaUrlsJson, isActive !== false]
      );

      res.status(201).json({
        success: true,
        message: 'Service added successfully',
        serviceId: result.insertId
      });
    } catch (error) {
      console.error('Error adding service:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add service'
      });
    }
  }

  // Update an existing service
  static async updateService(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }
      
      const doctorId = req.user.id;
      const serviceId = req.params.id;
      const { title, description, duration, price, category, mediaUrls, isActive } = req.body;

      // Validation
      if (!title || !description || !duration || !price || !category) {
        return res.status(400).json({
          success: false,
          message: 'All required fields must be provided'
        });
      }

      // Check if service exists and belongs to the doctor
      const existingService = await query(
        'SELECT id FROM services WHERE id = ? AND doctor_id = ?',
        [serviceId, doctorId]
      );

      if (existingService.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Service not found or access denied'
        });
      }

      // Convert mediaUrls array to JSON string
      const mediaUrlsJson = JSON.stringify(mediaUrls || []);

      await execute(
        `UPDATE services 
         SET title = ?, description = ?, duration = ?, price = ?, category = ?, 
             media_urls = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND doctor_id = ?`,
        [title, description, duration, parseFloat(price), category, mediaUrlsJson, 
         isActive !== false, serviceId, doctorId]
      );

      res.json({
        success: true,
        message: 'Service updated successfully'
      });
    } catch (error) {
      console.error('Error updating service:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update service'
      });
    }
  }

  // Delete a service
  static async deleteService(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }
      
      const doctorId = req.user.id;
      const serviceId = req.params.id;

      // Check if service exists and belongs to the doctor
      const existingService = await query(
        'SELECT id FROM services WHERE id = ? AND doctor_id = ?',
        [serviceId, doctorId]
      );

      if (existingService.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Service not found or access denied'
        });
      }

      await execute(
        'DELETE FROM services WHERE id = ? AND doctor_id = ?',
        [serviceId, doctorId]
      );

      res.json({
        success: true,
        message: 'Service deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete service'
      });
    }
  }

  // Toggle service active status
  static async toggleServiceStatus(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }
      
      const doctorId = req.user.id;
      const serviceId = req.params.id;

      // Check if service exists and belongs to the doctor
      const existingService = await query(
        'SELECT id, is_active FROM services WHERE id = ? AND doctor_id = ?',
        [serviceId, doctorId]
      );

      if (existingService.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Service not found or access denied'
        });
      }

      const newStatus = !existingService[0].is_active;

      await execute(
        'UPDATE services SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND doctor_id = ?',
        [newStatus, serviceId, doctorId]
      );

      res.json({
        success: true,
        message: `Service ${newStatus ? 'activated' : 'deactivated'} successfully`,
        isActive: newStatus
      });
    } catch (error) {
      console.error('Error toggling service status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle service status'
      });
    }
  }

  // Get service categories
  static async getServiceCategories(req, res) {
    try {
      const categories = await query(
        'SELECT name, description FROM service_categories WHERE is_active = TRUE ORDER BY name'
      );

      res.json({
        success: true,
        categories: categories.map(cat => cat.name)
      });
    } catch (error) {
      console.error('Error fetching service categories:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch service categories',
        categories: [
          'General Consultation',
          'Specialist Consultation',
          'Diagnostic Services',
          'Treatment Services',
          'Emergency Care',
          'Preventive Care'
        ]
      });
    }
  }

  // Get service statistics for dashboard
  static async getServiceStats(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }
      
      const doctorId = req.user.id;

      const stats = await query(
        `SELECT 
           COUNT(*) as total_services,
           COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_services,
           COUNT(DISTINCT category) as total_categories
         FROM services 
         WHERE doctor_id = ?`,
        [doctorId]
      );

      res.json({
        success: true,
        stats: stats[0]
      });
    } catch (error) {
      console.error('Error fetching service stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch service statistics'
      });
    }
  }
}

module.exports = ServicesController;