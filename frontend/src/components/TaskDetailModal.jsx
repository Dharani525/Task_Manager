import CommentSection from './CommentSection';

export default function TaskDetailModal({ task, onClose }) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-2 sm:p-0">
      <div className="bg-white p-3 sm:p-6 rounded shadow-lg w-full max-w-xs sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Task Details</h2>
          <button onClick={onClose} className="text-gray-600 text-lg">✖</button>
        </div>

        <div className="space-y-2 text-sm sm:text-base">
          <p><strong>Title:</strong> {task.title}</p>
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Status:</strong> {task.status}</p>
          <p><strong>Assigned To:</strong> {task.assignedTo?.name || 'Unassigned'}</p>
        </div>

        <div className="mt-4">
          <CommentSection taskId={task._id} />
        </div>
      </div>
    </div>
  );
}
