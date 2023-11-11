const express = require("express");
const app = express();
const mongoose = require("./config/DBconnection");
require("dotenv").config();

const Port = process.env.PORT || 6000;

//bodyparsers
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//import auth routes
const authRoutes = require("./routes/authroute");
app.use("/auth", authRoutes);

//import post routes
const postRoutes = require("./routes/blogPostRoute");
app.use("/api/v1", postRoutes);

//import Like and comment Route
const {likeRoute,commentRoute} = require("./routes/like&comment");
app.use("/api/v1/like",likeRoute);
app.use("/api/v1/comment",commentRoute)

//error handling
const{errorHandler}=require('./Error-handler/errorhandling')
app.use(errorHandler)
app.listen(Port, () => {
  console.log("running on Port " + Port);
});
