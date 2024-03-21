const mongoose = require('mongoose');

// Define Task Schema
const taskSchema = new mongoose.Schema({
  taskname: {
    type: String,
    required: true,
    unique: false
  },
  taskdescription: {
    type: String,
    required: false
  },
  taskid: {
    type: int,
    required: true,
    unique: true
  },
  time: {
    type: Date,
    default: Date.now
  }
});

// Create User Model
const User = mongoose.model('Task', taskSchema);

// Export User Model
module.exports = User;
