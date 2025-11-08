const mongoose = require("mongoose");

// Define the Admin schema
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // prevents duplicate usernames
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create and export the Admin model
module.exports = mongoose.model("Admin", adminSchema);
