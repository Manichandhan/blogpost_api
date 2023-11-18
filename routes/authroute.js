// authRoutes.js
const express = require("express");
const router = express.Router();
const { tryCatch } = require("../Utils/tryCatch");
const { generateOtp } = require("../Middlewares/emailValidation");


require("dotenv").config();
const {
  userRegister,
  login,
  logout,
} = require("../Controller/UserRegisteration");
const jwt = require("jsonwebtoken");
// Registration route (simplified example)
router.post("/register", generateOtp, tryCatch(userRegister));

// Login route
router.post("/login", tryCatch(login));

// Logout route
router.delete("/logout", tryCatch(logout));

module.exports = router;
