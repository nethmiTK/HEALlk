const { query } = require('../config/database');

// Add a new review
const addReview = async (req, res) => {
  try {
    const { patient_name, rating, comment, doctor_id = 1 } = req.body;

    // Validation
    if (!patient_name?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Patient name is required'
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    if (!comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Review comment is required'
      });
    }

    const insertResult = await query(
      'INSERT INTO reviews (doctor_id, rating, comment, status) VALUES (?, ?, ?, ?)',
      [doctor_id, rating, comment.trim(), 'pending']
    );

    const [newReview] = await query(
      'SELECT * FROM reviews WHERE review_id = ?',
      [insertResult.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: newReview
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'created_at', order = 'DESC' } = req.query;
    
    // Get doctor_id from authenticated user if available
    const doctorId = req.user?.userId;
    
    console.log('🔍 getAllReviews - Authenticated user:', req.user);
    console.log('🔍 getAllReviews - Doctor ID to filter:', doctorId);
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    
    // Validate sort column to prevent SQL injection
    const allowedSortColumns = ['created_at', 'rating'];
    const sortColumn = allowedSortColumns.includes(sort) ? sort : 'created_at';
    const orderDirection = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    // Build WHERE clause based on doctor_id
    const whereClause = doctorId ? 'WHERE doctor_id = ?' : '';
    const queryParams = doctorId ? [doctorId] : [];
    
    console.log('🔍 SQL WHERE clause:', whereClause);
    console.log('🔍 SQL params:', queryParams);
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM reviews ${whereClause}`;
    const [countResult] = await query(countQuery, queryParams);
    const totalReviews = countResult.total;

    console.log('🔍 Total reviews found for doctor', doctorId, ':', totalReviews);

    // Get reviews with pagination
    console.log('Pagination params:', { limitNum, offset, pageNum, doctorId });
    const reviewsQuery = `SELECT * FROM reviews ${whereClause} ORDER BY ${sortColumn} ${orderDirection} LIMIT ${limitNum} OFFSET ${offset}`;
    const reviews = await query(reviewsQuery, queryParams);
    
    console.log('🔍 Reviews returned:', reviews.length);

    // Calculate statistics for this doctor
    const statsQuery = `
      SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as total_reviews,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM reviews
      ${whereClause}
    `;
    const [statsResult] = await query(statsQuery, queryParams);

    res.json({
      success: true,
      reviews,
      pagination: {
        current_page: pageNum,
        total_pages: Math.ceil(totalReviews / limitNum),
        total_reviews: totalReviews,
        per_page: limitNum
      },
      statistics: statsResult
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single review by ID
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const [review] = await query(
      'SELECT * FROM reviews WHERE review_id = ?',
      [id]
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      review
    });

  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, status } = req.body;

    // Check if review exists
    const [existingReview] = await query(
      'SELECT * FROM reviews WHERE review_id = ?',
      [id]
    );

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be pending, approved, or rejected'
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (rating) {
      updates.push('rating = ?');
      values.push(rating);
    }
    if (comment) {
      updates.push('comment = ?');
      values.push(comment.trim());
    }
    if (status) {
      updates.push('status = ?');
      values.push(status);
    }

    values.push(id);

    if (updates.length === 0) { // No updates
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    await query(
      `UPDATE reviews SET ${updates.join(', ')} WHERE review_id = ?`,
      values
    );

    const [updatedReview] = await query(
      'SELECT * FROM reviews WHERE review_id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Review updated successfully',
      review: updatedReview
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingReview] = await query(
      'SELECT * FROM reviews WHERE review_id = ?',
      [id]
    );

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await query('DELETE FROM reviews WHERE review_id = ?', [id]);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get reviews statistics
const getReviewsStatistics = async (req, res) => {
  try {
    // Get doctor_id from authenticated user if available
    const doctorId = req.user?.userId;
    
    console.log('📊 getReviewsStatistics - Authenticated user:', req.user);
    console.log('📊 getReviewsStatistics - Doctor ID to filter:', doctorId);
    
    // Build WHERE clause based on doctor_id
    const whereClause = doctorId ? 'WHERE doctor_id = ?' : '';
    const queryParams = doctorId ? [doctorId] : [];
    
    console.log('📊 SQL WHERE clause:', whereClause);
    console.log('📊 SQL params:', queryParams);
    
    const statsQuery = `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_reviews,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_reviews,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_reviews
      FROM reviews
      ${whereClause}
    `;
    const [stats] = await query(statsQuery, queryParams);

    // Get recent reviews (last 7 days) for this doctor
    const recentQuery = `
      SELECT COUNT(*) as recent_count 
      FROM reviews 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ${doctorId ? 'AND doctor_id = ?' : ''}
    `;
    const recentReviews = await query(recentQuery, queryParams);

    res.json({
      success: true,
      statistics: {
        ...stats,
        recent_reviews: recentReviews[0].recent_count,
        rating_distribution: {
          5: stats.five_star,
          4: stats.four_star,
          3: stats.three_star,
          2: stats.two_star,
          1: stats.one_star
        }
      }
    });

  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update review status (approve/reject)
const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be pending, approved, or rejected'
      });
    }

    const [existingReview] = await query(
      'SELECT * FROM reviews WHERE review_id = ?',
      [id]
    );

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await query(
      'UPDATE reviews SET status = ? WHERE review_id = ?',
      [status, id]
    );

    const [updatedReview] = await query(
      'SELECT * FROM reviews WHERE review_id = ?',
      [id]
    );

    res.json({
      success: true,
      message: `Review ${status} successfully`,
      review: updatedReview
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get public reviews (filtered by doctor_id from query params)
const getPublicReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'created_at', order = 'DESC', doctor_id } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    
    // Validate sort column to prevent SQL injection
    const allowedSortColumns = ['created_at', 'rating'];
    const sortColumn = allowedSortColumns.includes(sort) ? sort : 'created_at';
    const orderDirection = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    // Build WHERE clause - filter by doctor_id and only show approved reviews for public
    let whereClause = "WHERE status = 'approved'";
    let queryParams = [];
    
    if (doctor_id) {
      whereClause += " AND doctor_id = ?";
      queryParams.push(parseInt(doctor_id));
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM reviews ${whereClause}`;
    const [countResult] = await query(countQuery, queryParams);
    const totalReviews = countResult.total;

    // Get reviews with pagination
    const reviewsQuery = `SELECT * FROM reviews ${whereClause} ORDER BY ${sortColumn} ${orderDirection} LIMIT ${limitNum} OFFSET ${offset}`;
    const reviews = await query(reviewsQuery, queryParams);

    // Calculate statistics (only for approved reviews)
    const statsQuery = `
      SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as total_reviews,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM reviews
      ${whereClause}
    `;
    const [statsResult] = await query(statsQuery, queryParams);

    res.json({
      success: true,
      reviews,
      pagination: {
        current_page: pageNum,
        total_pages: Math.ceil(totalReviews / limitNum),
        total_reviews: totalReviews,
        per_page: limitNum
      },
      statistics: statsResult
    });

  } catch (error) {
    console.error('Get public reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  addReview,
  getAllReviews,
  getPublicReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsStatistics,
  updateReviewStatus
};
