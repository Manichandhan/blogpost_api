const mongoose = require('mongoose');
// env variable for db connection string
require('dotenv').config()
// Your MongoDB connection string. Replace 'your-db-uri' with your actual MongoDB URI.
const dbURI = process.env.DBstring;

// Connect to the MongoDB database
mongoose.connect(dbURI);

// Listen for the MongoDB connection event and log the status
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => { 
    console.error('connection error',err);
   
  
});

mongoose.connection.on('disconnected', () => { 
  console.log('MongoDB disconnected');
});

// Export the MongoDB connection for use in other parts of your application
module.exports = mongoose;
