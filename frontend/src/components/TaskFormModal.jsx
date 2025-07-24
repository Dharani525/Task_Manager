import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask } from '../features/tasks/taskSlice';
import axios from '../api/axios';

export default function TaskFormModal({ isOpen, onClose, task }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    assignedTo: '',
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Pre-fill form if editing
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        status: task.status,
        assignedTo: task.assignedTo?._id || '',
      });
    } else {
      setForm({
        title: '',
        description: '',
        status: 'todo',
        assignedTo: '',
      });
    }

    // Fetch users if admin
    if (user?.role === 'admin') {
      axios
        .get('/users', {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setUsers(res.data))
        .catch((err) => console.error('Failed to fetch users:', err));
    }
  }, [task, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task) {
      await dispatch(updateTask({ id: task._id, updatedData: form }));
    } else {
      await dispatch(createTask(form));
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2 sm:p-0">
      <div className="bg-white p-3 sm:p-6 rounded-md w-full max-w-xs sm:max-w-md mx-auto">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">{task ? 'Edit Task' : 'New Task'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full border px-2 sm:px-3 py-2 rounded text-sm sm:text-base"
          />

          <textarea
            name="description"
            placeholder="Description"
            required
            value={form.description}
            onChange={handleChange}
            className="w-full border px-2 sm:px-3 py-2 rounded text-sm sm:text-base"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-2 sm:px-3 py-2 rounded text-sm sm:text-base"
          >
             <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
          </select>

          {user?.role === 'admin' && (
            <select
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              className="w-full border px-2 sm:px-3 py-2 rounded text-sm sm:text-base"
            >
              <option value="">Assign To</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded w-full sm:w-auto">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded w-full sm:w-auto">
              {task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
