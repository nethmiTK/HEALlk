const { query, execute } = require('../config/database');

class ServicesController {
  static async getAllPublicServices(req, res) {
    try {
      const services = await query(
        `SELECT s.id, s.title, s.description, s.duration, s.price, s.category, 
                s.media_urls, s.created_at, s.updated_at,
                u.full_name as doctor_name, u.user_id as doctor_id
         FROM services s
         INNER JOIN users u ON s.doctor_id = u.user_id
         WHERE s.is_active = TRUE AND u.role IN ('doctor', 'admin')
         ORDER BY s.created_at DESC`
      );

       const servicesWithMedia = services.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category: service.category,
        mediaUrls: service.media_urls ? JSON.parse(service.media_urls) : [],
        doctorName: service.doctor_name,
        doctorId: service.doctor_id,
        createdAt: service.created_at,
        updatedAt: service.updated_at
      }));

      res.json({
        success: true,
        services: servicesWithMedia,
        total: servicesWithMedia.length
      });
    } catch (error) {
      console.error('Error fetching public services:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch services'
      });
    }
  }

   static async getServicesByDoctorId(req, res) {
    try {
      const doctorId = req.params.doctorId;
      
      const services = await query(
        `SELECT s.id, s.title, s.description, s.duration, s.price, s.category, 
                s.media_urls, s.created_at, s.updated_at,
                u.full_name as doctor_name, u.user_id as doctor_id
         FROM services s
         INNER JOIN users u ON s.doctor_id = u.user_id
         WHERE s.is_active = TRUE AND s.doctor_id = ? AND u.role IN ('doctor', 'admin')
         ORDER BY s.created_at DESC`,
        [doctorId]
      );

       const servicesWithMedia = services.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category: service.category,
        mediaUrls: service.media_urls ? JSON.parse(service.media_urls) : [],
        doctorName: service.doctor_name,
        doctorId: service.doctor_id,
        createdAt: service.created_at,
        updatedAt: service.updated_at
      }));

      res.json({
        success: true,
        services: servicesWithMedia,
        total: servicesWithMedia.length
      });
    } catch (error) {
      console.error('Error fetching doctor services:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch doctor services'
      });
    }
  }

   static async getPublicServiceById(req, res) {
    try {
      const serviceId = req.params.id;

      const service = await query(
        `SELECT s.id, s.title, s.description, s.duration, s.price, s.category, 
                s.media_urls, s.created_at, s.updated_at,
                u.full_name as doctor_name, u.user_id as doctor_id, u.email as doctor_email, u.phone as doctor_phone
         FROM services s
         INNER JOIN users u ON s.doctor_id = u.user_id
         WHERE s.id = ? AND s.is_active = TRUE AND u.role IN ('doctor', 'admin')`,
        [serviceId]
      );

      if (service.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Service not found or not available'
        });
      }

       const serviceWithMedia = {
        id: service[0].id,
        title: service[0].title,
        description: service[0].description,
        duration: service[0].duration,
        price: service[0].price,
        category: service[0].category,
        mediaUrls: service[0].media_urls ? JSON.parse(service[0].media_urls) : [],
        doctorName: service[0].doctor_name,
        doctorId: service[0].doctor_id,
        doctorEmail: service[0].doctor_email,
        doctorPhone: service[0].doctor_phone,
        createdAt: service[0].created_at,
        updatedAt: service[0].updated_at
      };

      res.json({
        success: true,
        service: serviceWithMedia
      });
    } catch (error) {
      console.error('Error fetching public service:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch service'
      });
    }
  }

   static async getServices(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }
      
      const doctorId = req.user.userId;
      
      const services = await query(
        `SELECT id, title, description, duration, price, category, 
                media_urls, is_active, created_at, updated_at
         FROM services 
         WHERE doctor_id = ?
         ORDER BY created_at DESC`,
        [doctorId]
      );

       const servicesWithMedia = services.map(service => {
        let mediaUrls = [];
        try {
          if (service.media_urls && service.media_urls.trim() !== '') {
            mediaUrls = JSON.parse(service.media_urls);
          }
        } catch (e) {
          console.log('Invalid JSON in media_urls for service:', service.id, service.media_urls);
          mediaUrls = [];
        }
        
        return {
          ...service,
          mediaUrls: mediaUrls,
          isActive: Boolean(service.is_active) // Convert tinyint to boolean for frontend
        };
      });

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

   static async addService(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }
      
      const doctorId = req.user.userId;
      const { title, description, duration, price, category, mediaUrls, isActive } = req.body;

       if (!title || !description || !duration || !price || !category) {
        return res.status(400).json({
          success: false,
          message: 'All required fields must be provided'
        });
      }

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

   static async updateService(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }
      
      const doctorId = req.user.userId;
      const serviceId = req.params.id;
      const { title, description, duration, price, category, mediaUrls, isActive } = req.body;

      // Validation
      if (!title || !description || !duration || !price || !category) {
        return res.status(400).json({
          success: false,
          message: 'All required fields must be provided'
        });
      }

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

   static async deleteService(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }
      
      const doctorId = req.user.userId;
      const serviceId = req.params.id;

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

   static async toggleServiceStatus(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }
      
      const doctorId = req.user.userId;
      const serviceId = req.params.id;

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

  // Get a specific service by ID
  static async getServiceById(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }
      
      const doctorId = req.user.userId;
      const serviceId = req.params.id;

      const service = await query(
        `SELECT id, title, description, duration, price, category, 
                media_urls, is_active, created_at, updated_at
         FROM services 
         WHERE id = ? AND doctor_id = ?`,
        [serviceId, doctorId]
      );

      if (service.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Service not found or access denied'
        });
      }

      // Format response with mediaUrls
      const serviceWithMedia = {
        ...service[0],
        mediaUrls: service[0].media_urls ? JSON.parse(service[0].media_urls) : [],
        isActive: Boolean(service[0].is_active)
      };

      res.json({
        success: true,
        service: serviceWithMedia
      });
    } catch (error) {
      console.error('Error fetching service:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch service'
      });
    }
  }

  // Get service statistics for dashboard
  static async getServiceStats(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }
      
      const doctorId = req.user.userId;

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