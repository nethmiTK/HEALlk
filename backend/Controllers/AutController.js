const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'heallk_secret_key_2025';

const validateRegistrationData = (data) => {
  const { full_name, email, password, phone } = data;
  const errors = [];

  if (!full_name?.trim()) errors.push('Full name is required');
  if (!email?.trim()) errors.push('Email is required');
  if (!password) errors.push('Password is required');
  
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (password && password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (phone && phone.length < 10) {
    errors.push('Please enter a valid phone number');
  }
  
  return errors;
};

// Register Controller
const register = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;
    
    const validationErrors = validateRegistrationData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors[0]
      });
    }

    const existingUser = await query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const insertResult = await query(
      'INSERT INTO users (full_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [full_name.trim(), email.toLowerCase().trim(), hashedPassword, phone || null, 'user']
    );

    const [newUser] = await query(
      'SELECT user_id, full_name, email, phone, role, created_at FROM users WHERE user_id = ?',
      [insertResult.insertId]
    );

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to HEALlk',
      user: newUser,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Helper function for token generation
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.user_id, 
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const users = await query(
      'SELECT user_id, full_name, email, password, phone, role, created_at FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    
    if (users.length === 0 || !await bcrypt.compare(password, users[0].password)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.'
      });
    }

    const { password: _, ...user } = users[0];
    const token = generateToken(user);

    res.json({
      success: true,
      message: `Welcome back, ${user.full_name}!`,
      user,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Get Profile Controller
const getProfile = async (req, res) => {
  try {
    const [user] = await query(
      'SELECT user_id, full_name, email, phone, profile_pic, role, created_at FROM users WHERE user_id = ?',
      [req.user.userId]
    );
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update Profile Controller
const updateProfile = async (req, res) => {
  try {
    const { full_name, phone, profile_pic } = req.body;
    const { userId } = req.user;
    
    console.log('Profile update data:', { full_name, phone, profile_pic: profile_pic ? 'Image provided' : 'No image', userId });

    if (phone && phone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number'
      });
    }

    const updateResult = await query(
      'UPDATE users SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone), profile_pic = COALESCE(?, profile_pic) WHERE user_id = ?',
      [full_name?.trim() || null, phone || null, profile_pic || null, userId]
    );
    
    console.log('Update result:', updateResult);

    const [updatedUser] = await query(
      'SELECT user_id, full_name, email, phone, profile_pic, role, created_at FROM users WHERE user_id = ?',
      [userId]
    );
    
    console.log('Updated user data:', updatedUser);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Change Password Controller
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { userId } = req.user;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    const [user] = await query('SELECT password FROM users WHERE user_id = ?', [userId]);
    
    if (!user || !await bcrypt.compare(currentPassword, user.password)) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await query(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE user_id = ?',
      [hashedNewPassword, userId]
    );

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Logout Controller
const logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

// Get All Users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await query(
      'SELECT user_id, full_name, email, phone, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.json({ success: true, users, total: users.length });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  getAllUsers
};