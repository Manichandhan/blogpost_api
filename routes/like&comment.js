const express = require("express");

const likeRoute = express.Router();
const commentRoute = express.Router();
//like and comments controls
const {
  likepost,
  getAllLikes,
  unlikepost,
  comment,
  deleteComment,
  getAllcomments,
} = require("../Controller/like&commentControl");

const { tryCatch } = require("../Utils/tryCatch");
const {verifytoken}=require('../Middlewares/verifytoken')
//like a blog post by ID or unlike a post and get all likes
likeRoute.route("/post/:id/getLikes").get(tryCatch(verifytoken),tryCatch(getAllLikes));
likeRoute.route("/post/:id/like").post(tryCatch(verifytoken),tryCatch(likepost));
likeRoute.delete("/post/:id/unlike", tryCatch(verifytoken),tryCatch(unlikepost));

// get all comments for a post
commentRoute.get("/post/:id/getAllcomments",tryCatch(verifytoken), tryCatch(getAllcomments));
// comment a blog post by ID
commentRoute.post("/post/:id/comment",tryCatch(verifytoken), tryCatch(comment));
//delete a comment of blog post
commentRoute.delete("/post/:id/deleteComment",tryCatch(verifytoken), tryCatch(deleteComment));

module.exports = { likeRoute, commentRoute };
