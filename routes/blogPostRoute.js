const express = require("express");

const blogrouter = express.Router();

// get All Posts
blogrouter.route("/blogposts/getAll").get((req, res) => {
  res.send("get all posts");
});

//create A Post
blogrouter.route("/blogposts/createPost").post((req, res) => {
  res.send("create post");
});

// Delete a blog post by ID and get a post by id
blogrouter
  .route("/blogposts/:id")
  .delete((req, res) => {
    res.json({ message: "Blog post deleted" });
  })
  .get((req, res) => {
    res.json({ message: "get a post" });
  });
module.exports = blogrouter;
