import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../features/users/usersSlice";
import { fetchTasks, deleteTask } from "../../features/tasks/taskSlice";
import TaskFormModal from "../../components/TaskFormModal";
import TaskDetailModal from "../../components/TaskDetailModal";

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const users = useSelector((state) => state.users.all); // For admin user filtering

  const isAdmin = user?.role === "admin";
  // const isAdmin = useSelector((state) => state.auth.user?.role === "admin"); // Update if needed

  const [statusFilter, setStatusFilter] = useState("");
  const [filterUserId, setFilterUserId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [viewTask, setViewTask] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
    if (isAdmin) {
      dispatch(fetchUsers());
    }
  }, [dispatch, isAdmin]);

  // Admin sees all tasks, others only their own
  let visibleTasks = isAdmin
    ? tasks
    : tasks.filter((t) => t.assignedTo?._id === user?.id);

  // Optional: Admin filters by user
  if (isAdmin && filterUserId) {
    visibleTasks = visibleTasks.filter(
      (t) => t.assignedTo?._id === filterUserId
    );
  }

  const groupedTasks = {
    todo: [],
    "in-progress": [],
    done: [],
  };
  const statusMap = {
    TODO: "todo",
    IN_PROGRESS: "in-progress",
    DONE: "done",
  };

  visibleTasks.forEach((task) => {
    const mappedStatus = statusMap[task.status];
    if (!statusFilter || mappedStatus === statusFilter) {
      groupedTasks[mappedStatus].push(task);
    }
  });

  // Better status handling
  const statusStyles = {
    TODO: { bg: "bg-yellow-200/80", text: "text-yellow-800", ring: "ring-2 ring-yellow-400/60" },
    IN_PROGRESS: { bg: "bg-blue-200/80", text: "text-blue-800", ring: "ring-2 ring-blue-400/60" },
    DONE: { bg: "bg-emerald-200/80", text: "text-emerald-800", ring: "ring-2 ring-emerald-400/60" },
  };
  // console.log("users data", typeof users);

  const handleDeleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(id))
        .unwrap()
        .catch((err) => {
          console.error("Failed to delete task:", err);
          // Optionally show a toast/notification
        });
    }
  };
  return (
    <div className="p-2 sm:p-4 max-w-7xl mx-auto w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center sm:text-left bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow">
        {isAdmin ? "Admin Tasks List" : "My Tasks"}
      </h2>

      {/* Filters and Create Task */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 w-full items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto">
            <label className="mr-0 sm:mr-2 font-semibold mb-1 sm:mb-0">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-2 py-1 rounded w-full sm:w-auto"
            >
              <option value="">All</option>
              <option value="todo">TODO</option>
              <option value="in-progress">In-Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          {isAdmin && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto">
              <label className="mr-0 sm:mr-2 font-semibold mb-1 sm:mb-0">Filter by User:</label>
              <select
                value={filterUserId}
                onChange={(e) => setFilterUserId(e.target.value)}
                className="border px-2 py-1 rounded w-full sm:w-auto"
              >
                <option value="">All Users</option>
                {Array.isArray(users) &&
                  users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
        <button
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2 rounded-full font-bold shadow transition w-full sm:w-auto"
          onClick={() => {
            setEditTask(null);
            setOpenModal(true);
          }}
        >
          + New Task
        </button>
      </div>

      {/* Loading/Error */}
      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Task Columns */}
      <div className="overflow-x-auto rounded-2xl shadow-xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <table className="min-w-full text-xs sm:text-sm">
          <thead className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100">
            <tr>
              <th className="py-3 px-2 sm:px-4 font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200">Si.no</th>
              <th className="py-3 px-2 sm:px-4 font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200">Title</th>
              <th className="py-3 px-2 sm:px-4 font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200">Status</th>
              <th className="py-3 px-2 sm:px-4 font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200">Assigned To</th>
              <th className="py-3 px-2 sm:px-4 font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(statusFilter ? groupedTasks[statusFilter] : visibleTasks).length > 0 ? (
              (statusFilter ? groupedTasks[statusFilter] : visibleTasks).map(
                (task, index) => (
                  <tr key={task._id} className="transition group hover:scale-[1.01] hover:shadow-lg hover:z-10 bg-white/80 hover:bg-blue-50/80 rounded-xl overflow-hidden">
                    <td className="py-3 px-2 sm:px-4 border-b border-blue-100 text-center font-semibold text-blue-900 align-middle">{index + 1}</td>
                    <td className="py-3 px-2 sm:px-4 border-b border-blue-100 break-words max-w-xs font-medium text-indigo-900 align-middle">{task.title}</td>
                    <td className="py-3 px-2 sm:px-4 border-b border-blue-100 align-middle">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-bold rounded-full shadow-sm ${statusStyles[task.status].bg} ${statusStyles[task.status].text} ${statusStyles[task.status].ring} transition`}
                      >
                        {task.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-2 sm:px-4 border-b border-blue-100 font-medium text-emerald-700 align-middle">
                      {task.assignedTo?.name || <span className="italic text-gray-400">Unassigned</span>}
                    </td>
                    <td className="py-3 px-2 sm:px-4 border-b border-blue-100 align-middle">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center">
                        <button
                          onClick={() => setViewTask(task)}
                          className="flex items-center gap-1 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold px-3 py-1 rounded-full shadow-sm text-xs sm:text-sm transition"
                          title="View"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                          <span className="hidden sm:inline">View</span>
                        </button>
                        {(task.createdBy === user?.id || isAdmin) && (
                          <>
                            <button
                              onClick={() => {
                                setEditTask(task);
                                setOpenModal(true);
                              }}
                              className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-3 py-1 rounded-full shadow-sm text-xs sm:text-sm transition"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z"/></svg>
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteTask(task._id);
                              }}
                              className="flex items-center gap-1 bg-rose-100 hover:bg-rose-200 text-rose-700 font-semibold px-3 py-1 rounded-full shadow-sm text-xs sm:text-sm transition"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-400 text-lg font-semibold">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <TaskFormModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        task={editTask}
      />
      {viewTask && (
        <TaskDetailModal task={viewTask} onClose={() => setViewTask(null)} />
      )}
    </div>
  );
};

export default Tasks;
