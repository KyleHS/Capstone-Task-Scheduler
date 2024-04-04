const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Task Schema
const taskSchema = new Schema({
  taskname: {
    type: String,
    required: true,
    unique: false
  },
  taskdescription: {
    type: String,
    required: false
  },
  time: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User' // Reference to the User model
  }
});

// Create Task Model
const Task = mongoose.model('Task', taskSchema);

// Export Task Model
module.exports = Task;
