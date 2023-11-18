const express = require('express');
const multer = require('multer');
const path = require('path');

// Set storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads'); 
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
  
  // Initialize multer middleware
  const upload = multer({ storage: storage }).array('files', 5)
  module.exports=upload