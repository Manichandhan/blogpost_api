const mongoose = require("mongoose");


// Define Post Schema

const postSchema = new mongoose.Schema({
  description: {
    type: String,
  }, 
  likes: {
    type: Number,
  },
  photos: [
    {
      type: String,
      required: true,
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time when a post is created
  },
});
const postModel=mongoose.model('posts',postSchema)
module.exports = postModel;
