const mongoose = require("mongoose");

//
const likeSchema = new mongoose.Schema({
  postid: {
    type: String,
    required: true,
  },
  likedBy: {
    type: String,
    required: true,
  },
});
const likeModel = mongoose.model("likes", likeSchema);

// define schema for comments
const commentSchema = new mongoose.Schema({
  postid: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  commentedBy: {
    type: String,
    required: true,
  },
});

const commentModel = mongoose.model("comments", commentSchema);
module.exports = { likeModel, commentModel };
