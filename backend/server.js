const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const clinicRoutes = require('./Routes/clinicRoutes');
const authRoutes = require('./Routes/AuthRoutes');
const reviewRoutes = require('./Routes/ReviewRoutes');
const profileRoutes = require('./Routes/ProfileRoutes');
const servicesRoutes = require('./Routes/ServicesRoutes');
const contactRoutes = require("./Routes/ContactRoutes");
const doctorContactRoutes = require('./Routes/DoctorContactRoutes');
const appointmentsRoutes = require('./Routes/AppointmentsRoutes');
const { testConnection, initializeDatabase } = require('./config/database');
const publicRoutes = require('./Routes/PublicRoutes');
const { query } = require('./config/database');
const productRoutes = require('./Routes/ProductsRoutes');
const blogRoutes = require("./Routes/BlogRoutes");
const qualificationRoutes = require("./Routes/QualificationRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
  ],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/services', servicesRoutes);
app.use("/api/qualifications", qualificationRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use('/api/doctor-contact', doctorContactRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/products', productRoutes);
app.get('/api/public/products/doctor/:doctorId', async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const products = await query(
      'SELECT id, product_name, price, ingredient, description, category FROM products WHERE user_id = ?',
      [doctorId]
    );
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});



app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  if (req.headers.authorization) {
    console.log('Auth header present:', req.headers.authorization.substring(0, 20) + '...');
  } else {
    console.log('No auth header found');
  }
  
  next();
});

 app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`
  });
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const startServer = async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 HEALlk Backend Server running on port ${PORT}`);
      console.log(`📊 Frontend URL: http://localhost:5173`);
     });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
