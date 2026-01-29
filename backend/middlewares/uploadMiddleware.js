const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads and uploads subdirectories if they don't exist
const uploadsDir = path.join(__dirname, '../uploads');
const productUploadDir = path.join(__dirname, '../uploads/products');
const serviceUploadDir = path.join(__dirname, '../uploads/service');
const blogUploadDir = path.join(__dirname, '../uploads/blog');

try {
  // Create main uploads directory
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✓ Created /uploads directory');
  }
  
  // Create subdirectories
  if (!fs.existsSync(productUploadDir)) {
    fs.mkdirSync(productUploadDir, { recursive: true });
    console.log('✓ Created /uploads/products directory');
  }
  
  if (!fs.existsSync(serviceUploadDir)) {
    fs.mkdirSync(serviceUploadDir, { recursive: true });
    console.log('✓ Created /uploads/service directory');
  }

  if (!fs.existsSync(blogUploadDir)) {
    fs.mkdirSync(blogUploadDir, { recursive: true });
    console.log('✓ Created /uploads/blog directory');
  }
} catch (error) {
  console.error('✗ Error creating upload directories:', error);
}

// Configure multer for product image uploads
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(productUploadDir)) {
      fs.mkdirSync(productUploadDir, { recursive: true });
    }
    cb(null, productUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const productUpload = multer({
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Configure multer for service image uploads
const serviceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(serviceUploadDir)) {
      fs.mkdirSync(serviceUploadDir, { recursive: true });
    }
    cb(null, serviceUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const uploadService = multer({
  storage: serviceStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

module.exports = { productUpload, uploadService };
