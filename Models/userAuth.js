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
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create a User model using the schema
const User = mongoose.model("User", userSchema);

module.exports = User;