const mongoose = require("mongoose");

// Define the User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures that each email is unique
  },
  username: {
    type: String,
    unique:[true,'username must be unique'],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create a User model using the schema
const User=mongoose.model('users',userSchema)
module.exports = {User};
