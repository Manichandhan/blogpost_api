const express = require("express");

const blogrouter = express.Router();

//import CustomError-handler & tryCatch

const { tryCatch } = require("../Utils/tryCatch");

//upload files middleware
const upload = require("../Middlewares/uploadfiles");
//import blogpost controllers
const {
  getAllPosts,
  CreatePost,
  DeletePost,
  getOnePost,
} = require("../Controller/blogPostControl");
// get All Posts
blogrouter.route("/blogposts/getAll").get(tryCatch(getAllPosts));

//create A Post
blogrouter.route("/blogposts/createPost").post(upload, tryCatch(CreatePost));

// Delete a blog post by ID and get a post by id
blogrouter
  .route("/blogposts/:id")
  .delete(tryCatch(DeletePost))
  .get(tryCatch(getOnePost));
module.exports = blogrouter;
