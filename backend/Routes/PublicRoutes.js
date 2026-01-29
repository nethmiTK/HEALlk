const express = require('express');
const router = express.Router();
const { getVerifiedDoctors, getDoctorProfile, getDoctorByName, getDoctorBasicByName, getUserPhone } = require('../Controllers/PublicController');
const { getServicesByDoctor } = require('../Controllers/SimpleServicesController');
const { getProductsByDoctor } = require('../Controllers/SimpleProductsController');
const { getBlogsByDoctor, toggleLike, checkLikeStatus } = require('../Controllers/BlogController');

// Public routes - no authentication required
router.get('/doctors', getVerifiedDoctors);
router.get('/doctors/by-name/:name', getDoctorBasicByName); // Simple endpoint - must be before /:id
router.get('/doctors/:id', getDoctorProfile);
router.get('/doctors/name/:name', getDoctorByName); // Full profile endpoint
router.get('/user/:id', getUserPhone);
router.get('/services/doctor/:doctorId', getServicesByDoctor);
router.get('/products/doctor/:doctorId', getProductsByDoctor);
router.get('/blogs/doctor/:doctorId', getBlogsByDoctor);
router.post('/blogs/:id/like', toggleLike);
router.get('/blogs/:id/like-status', checkLikeStatus);

module.exports = router;