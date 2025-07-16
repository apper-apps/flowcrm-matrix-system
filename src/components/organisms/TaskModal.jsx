import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { contactService } from "@/services/api/contactService";
import { cn } from "@/utils/cn";

const TaskModal = ({ task, onClose, onSave, type = "add" }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    contactId: "",
    assignedTo: "John Doe",
    completed: false
  });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const priorities = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
  ];

  const assignees = [
    { value: "John Doe", label: "John Doe" },
    { value: "Jane Smith", label: "Jane Smith" },
    { value: "Mike Johnson", label: "Mike Johnson" }
  ];

  useEffect(() => {
    loadContacts();
    if (task && type !== "add") {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? 
          new Date(task.dueDate).toISOString().split("T")[0] : "",
        priority: task.priority || "medium",
        contactId: task.contactId || "",
        assignedTo: task.assignedTo || "John Doe",
        completed: task.completed || false
      });
    }
  }, [task, type]);

  const loadContacts = async () => {
    try {
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (error) {
      toast.error("Failed to load contacts");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let savedTask;
      
      if (type === "add") {
        savedTask = await taskService.create({
          ...formData,
          dueDate: new Date(formData.dueDate).toISOString()
        });
        toast.success("Task created successfully!");
      } else {
        savedTask = await taskService.update(task.Id, {
          ...formData,
          dueDate: new Date(formData.dueDate).toISOString()
        });
        toast.success("Task updated successfully!");
      }
      
      onSave(savedTask);
      onClose();
    } catch (error) {
      toast.error("Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(task.Id);
        toast.success("Task deleted successfully!");
        onSave(null);
        onClose();
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {type === "add" ? "Add New Task" : 
               type === "edit" ? "Edit Task" : "Task Details"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormField
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter task title"
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <FormField
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            required
          />

          <FormField
            label="Priority"
            type="select"
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
            options={priorities}
            required
          />

          <FormField
            label="Contact"
            type="select"
            value={formData.contactId}
            onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
            options={contacts.map(contact => ({
              value: contact.Id,
              label: contact.name
            }))}
            placeholder="Select a contact"
            required
          />

          <FormField
            label="Assigned To"
            type="select"
            value={formData.assignedTo}
            onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
            options={assignees}
            required
          />

          {type === "edit" && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="completed"
                checked={formData.completed}
                onChange={(e) => setFormData(prev => ({ ...prev, completed: e.target.checked }))}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="completed" className="text-sm font-medium text-gray-700">
                Mark as completed
              </label>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Saving..." : type === "add" ? "Add Task" : "Update Task"}
            </Button>
            
            {type === "edit" && (
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                className="px-4"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;