const express = require("express");

const likeRoute = express.Router();
const commentRoute = express.Router();

//like a blog post by ID or unlike a post and get all likes
likeRoute.route('/post/:id/getLikes').get((req,res)=>{
    res.send('get all likes')
})
likeRoute.route("/post/:id/like").post((req, res) => {
  res.send("like a post");
});
likeRoute.delete("/post/:id/unlike", (req, res) => {
  res.send("unlike post");
});

// get all comments for a post
commentRoute.get('/post/:id/getAllcomments',(req,res)=>{
res.send('get all comments for a post')
})
// comment a blog post by ID 
commentRoute.post("/post/:id/comment", (req, res) => {
  res.json({ message: "create a comment for post" });
});
//delete a comment of blog post
commentRoute.delete("/post/:id/deleteComment", (req, res) => {
    res.json({ message: "delete a comment for post" });
  });

  module.exports={likeRoute,commentRoute}