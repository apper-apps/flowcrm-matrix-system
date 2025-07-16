import { useState } from "react";
import TaskList from "@/components/organisms/TaskList";
import TaskModal from "@/components/organisms/TaskModal";
import { cn } from "@/utils/cn";

const Tasks = () => {
  const [taskModal, setTaskModal] = useState({ open: false, data: null, type: "add" });

  const handleTaskAction = (action) => {
    setTaskModal({
      open: true,
      data: action.task || null,
      type: action.type
    });
  };

  const handleModalClose = () => {
    setTaskModal({ open: false, data: null, type: "add" });
  };

  const handleDataSave = () => {
    // Refresh data would happen here
    handleModalClose();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Tasks</h1>
        <p className="text-primary-100">
          Stay organized and never miss a follow-up with your task management.
        </p>
      </div>

      <TaskList onTaskSelect={handleTaskAction} />

      {/* Task Modal */}
      {taskModal.open && (
        <TaskModal
          task={taskModal.data}
          type={taskModal.type}
          onClose={handleModalClose}
          onSave={handleDataSave}
        />
      )}
    </div>
  );
};

export default Tasks;