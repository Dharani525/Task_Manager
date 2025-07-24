// routes/commentRoutes.js code:
const express = require('express');
const router = express.Router({ mergeParams: true }); // important!

const {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

const { protect } = require('../middleware/authMiddleware');

// Nested route expects `req.params.taskId`
router.get('/', protect, getComments);       // /api/tasks/:taskId/comments
router.post('/', protect, addComment);       // /api/tasks/:taskId/comments
router.put('/:commentId', protect, updateComment);    // /api/tasks/:taskId/comments/:commentId
router.delete('/:commentId', protect, deleteComment); // /api/tasks/:taskId/comments/:commentId

module.exports = router;
