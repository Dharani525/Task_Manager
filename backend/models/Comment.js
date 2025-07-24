// models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
