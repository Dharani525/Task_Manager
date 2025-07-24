// module.exports = (role) => {
//   return (req, res, next) => {
//     if (req.user.role !== role)
//       return res.status(403).json({ message: 'Access denied' });
//     next();
//   };
// };



// roleMiddleware.js
const Task = require('../models/Task');

exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
};

exports.isTaskOwnerOrAdmin = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id); // ✅ use `req.params.id` based on route
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};
