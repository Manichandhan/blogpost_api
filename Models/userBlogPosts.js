const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { User } = require("../Models/userAuth");
const fs = require("fs");
const { reject } = require("lodash");

// Define Post Schema

const postSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
    alias: "post_id",
  },
  username: { type: String, required: true },
  description: {
    type: String,
  },
  likes: {
    type: Number,
    default:0
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
postSchema.pre("save", async function (next) {
  const found = await User.findOne({ username: this.username });
  console.log(found);
  if (found) {
    const promises = this.photos.map((filepath) => {
      return new Promise((resolve) => {
        fs.access(filepath, (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log("success " + filepath);
          }
          resolve(); // Resolve the promise, indicating that the operation is complete
        });
      });
    });
    Promise.all(promises)
      .then((data) => {
        console.log("All file checks completed" + data);
        next();
      })
      .catch((error) => {
        console.error("Error during file checks:", error);
        next(error);
      });
  } else {
    next({ message: "username not found" });
  }
});
const postModel = mongoose.model("posts", postSchema);
module.exports = { postModel };
