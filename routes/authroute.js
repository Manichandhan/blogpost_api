// authRoutes.js
const express = require('express');
const router = express.Router();

// Registration route (simplified example)
router.post('/register', (req, res,next) => {
  // Handle user registration here
  res.status(200).send('User registered successfully');
});

// Login route
router.post('/login', (req, res,next) => {
  // Handle user login here
  res.status(200).send('User logged in successfully');
});

// Logout route
router.delete('/logout', (req, res,next) => {
  // Handle user logout here
  res.status(200).send('User logged out');
});

module.exports = router;
