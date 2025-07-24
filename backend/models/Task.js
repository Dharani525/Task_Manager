// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);



// models/Task.js
// const taskSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// });
// module.exports = mongoose.model('Task', taskSchema);
