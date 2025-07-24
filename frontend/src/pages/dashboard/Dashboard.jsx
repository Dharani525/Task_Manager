import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../features/users/usersSlice";
import {
  fetchTasks,
  updateTaskStatus, // You need this action in your taskSlice
} from "../../features/tasks/taskSlice";
import TaskFormModal from "../../components/TaskFormModal";
import TaskDetailModal from "../../components/TaskDetailModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const users = useSelector((state) => state.users.all);

  const isAdmin = user?.role === "admin";

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

  if (isAdmin && filterUserId) {
    visibleTasks = visibleTasks.filter(
      (t) => t.assignedTo?._id === filterUserId
    );
  }

  const statusMap = {
    TODO: "todo",
    IN_PROGRESS: "in-progress",
    DONE: "done",
  };

  const groupedTasks = {
    todo: [],
    "in-progress": [],
    done: [],
  };

  visibleTasks.forEach((task) => {
    const mappedStatus = statusMap[task.status];
    if (!statusFilter || mappedStatus === statusFilter) {
      if (groupedTasks[mappedStatus]) {
        groupedTasks[mappedStatus].push(task);
      }
    }
  });

  const statusStyles = {
    TODO: { bg: "bg-yellow-100/80", text: "text-yellow-800", ring: "ring-2 ring-yellow-400/60" },
    IN_PROGRESS: { bg: "bg-blue-100/80", text: "text-blue-800", ring: "ring-2 ring-blue-400/60" },
    DONE: { bg: "bg-emerald-100/80", text: "text-emerald-800", ring: "ring-2 ring-emerald-400/60" },
  };

  const reverseStatusMap = {
    todo: "TODO",
    "in-progress": "IN_PROGRESS",
    done: "DONE",
  };

  const onDragEnd = (result) => {
  const { source, destination, draggableId } = result;
  if (!destination || source.droppableId === destination.droppableId) return;

  const task = tasks.find((t) => t._id === draggableId);
  const newStatus = reverseStatusMap[destination.droppableId];

  dispatch(updateTaskStatus({ id: task._id, status: newStatus }))
    .unwrap()
    .then((updatedTask) => {
      console.log("Status updated:", updatedTask);
    })
    .catch((err) => {
      console.error("Failed to update status", err);
    });
};

  return (
    <div className="p-2 sm:p-4 max-w-7xl mx-auto w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center sm:text-left bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow">
        {isAdmin ? "Admin Dashboard" : "My Tasks"}
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

      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Task Columns with DragDrop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["todo", "in-progress", "done"].map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-2xl shadow-xl p-4 min-h-[320px] bg-gradient-to-br ${
                    status === "todo"
                      ? "from-yellow-50 via-white to-yellow-100"
                      : status === "in-progress"
                      ? "from-blue-50 via-white to-blue-100"
                      : "from-emerald-50 via-white to-emerald-100"
                  } border-t-4 ${
                    status === "todo"
                      ? "border-yellow-400"
                      : status === "in-progress"
                      ? "border-blue-400"
                      : "border-emerald-400"
                  }`}
                >
                  <h3 className={`font-extrabold text-lg mb-4 capitalize tracking-wide flex items-center gap-2 ${
                    status === "todo"
                      ? "text-yellow-700"
                      : status === "in-progress"
                      ? "text-blue-700"
                      : "text-emerald-700"
                  }`}>
                    {status.replace("-", " ")}
                  </h3>

                  {groupedTasks[status].length > 0 ? (
                    groupedTasks[status].map((task, index) => (
                      <Draggable
                        draggableId={task._id}
                        index={index}
                        key={task._id}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-4 last:mb-0 rounded-xl bg-white/90 shadow border border-blue-100 hover:shadow-lg transition p-4 flex flex-col gap-2 relative overflow-hidden`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-indigo-900 text-base flex-1 truncate">{task.title}</h4>
                              <span
                                className={`inline-block px-3 py-1 text-xs font-bold rounded-full shadow-sm ${statusStyles[task.status].bg} ${statusStyles[task.status].text} ${statusStyles[task.status].ring} transition`}
                              >
                                {task.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-1 line-clamp-2">{task.description}</p>
                            {task.assignedTo && (
                              <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full px-2 py-0.5 mb-1">
                                <span className="font-bold">{task.assignedTo.name}</span>
                              </span>
                            )}
                            <div className="flex gap-2 mt-1">
                              <button
                                onClick={() => setViewTask(task)}
                                className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold px-3 py-1 rounded-full shadow-sm text-xs sm:text-sm transition"
                              >
                                View
                              </button>
                              {(task.createdBy === user?.id || isAdmin) && (
                                <button
                                  onClick={() => {
                                    setEditTask(task);
                                    setOpenModal(true);
                                  }}
                                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-3 py-1 rounded-full shadow-sm text-xs sm:text-sm transition"
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">No tasks</p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

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
}
