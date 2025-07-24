// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const { protect } = require('../middleware/authMiddleware'); // ✅ your JWT middleware

// Protect all routes
router.get('/', protect, getTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;


// routes/taskRoutes.js
// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/authMiddleware');
// const { isTaskOwnerOrAdmin } = require('../middleware/roleMiddleware');
// const {
//   getTasks,
//   createTask,
//   updateTask,
//   deleteTask
// } = require('../controllers/taskController');

// // ✅ Protect all routes
// router.get('/', protect, getTasks);
// router.post('/', protect, createTask);

// // ✅ Update & delete with owner or admin permission
// router.put('/:id', protect, isTaskOwnerOrAdmin, updateTask);
// router.delete('/:id', protect, isTaskOwnerOrAdmin, deleteTask);

// module.exports = router;

