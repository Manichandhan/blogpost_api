const express = require("express");
const app = express();
const mongoose=require('./config/DBconnection')
require("dotenv").config();

const Port = process.env.PORT || 6000;
app.listen(Port, () => {
  console.log("running on Port " + Port);
});
