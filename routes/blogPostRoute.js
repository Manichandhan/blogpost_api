const express = require("express");

const blogrouter = express.Router();

//import CustomError-handler & tryCatch

const { tryCatch } = require("../Utils/tryCatch");
const {verifytoken}=require('../Middlewares/verifytoken')
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
blogrouter.route("/blogposts/getAll").get(tryCatch(verifytoken),tryCatch(getAllPosts));

//create A Post
blogrouter.route("/blogposts/createPost").post(tryCatch(verifytoken),upload, tryCatch(CreatePost));

// Delete a blog post by ID and get a post by id
blogrouter
  .route("/blogposts/:id")
  .delete(tryCatch(verifytoken),tryCatch(DeletePost))
  .get(tryCatch(verifytoken),tryCatch(getOnePost));
module.exports = blogrouter;
