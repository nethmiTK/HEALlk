const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'heallk_secret_key_2025';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth middleware - Full header:', authHeader);
    
    const token = authHeader?.split(' ')[1];
    console.log('Auth middleware - Extracted token:', token ? 'Token present' : 'No token');

    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.log('Auth middleware - Token verification failed:', err.message);
        const message = err.name === 'TokenExpiredError' 
          ? 'Token has expired. Please login again.'
          : 'Invalid token';
        return res.status(403).json({ success: false, message });
      }
      
      console.log('Auth middleware - Token verified for user:', user.userId, 'Role:', user.role);
      
      // Set both userId and id for backward compatibility
      req.user = {
        ...user,
        id: user.userId
      };
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Optional authentication middleware
const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      req.user = null;
      return next();
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      req.user = err ? null : user;
      next();
    });
  } catch (error) {
    req.user = null;
    next();
  }
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin
};