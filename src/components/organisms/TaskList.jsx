import { useState, useEffect } from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { contactService } from "@/services/api/contactService";
import { cn } from "@/utils/cn";

const TaskList = ({ onTaskSelect, className }) => {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, contactsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll()
      ]);
      setTasks(tasksData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.Name : "Unknown Contact";
  };

const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      const updatedTask = await taskService.update(taskId, {
        ...task,
        completed: !task.completed
      });
      setTasks(tasks.map(t => t.Id === taskId ? updatedTask : t));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "default";
    }
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case "pending":
        return tasks.filter(task => !task.completed);
      case "completed":
        return tasks.filter(task => task.completed);
case "overdue":
        return tasks.filter(task => 
          !task.completed && new Date(task.due_date) < new Date()
        );
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  if (loading) {
    return <Loading type="table" className={className} />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadData}
        className={className}
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <Empty
        title="No tasks yet"
        description="Stay organized by adding your first task"
        icon="CheckSquare"
        action={{
          label: "Add Task",
          onClick: () => onTaskSelect({ type: "add" }),
          icon: "Plus"
        }}
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-40"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </Select>
        </div>

        {filteredTasks.length === 0 ? (
          <Empty
            title="No tasks found"
            description="No tasks match your current filter"
            icon="Filter"
            className="py-8"
          />
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.Id}
                className={cn(
                  "p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors",
                  task.completed ? "bg-gray-50" : "bg-white"
                )}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleComplete(task.Id)}
                    className={cn(
                      "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                      task.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-gray-400"
                    )}
                  >
                    {task.completed && (
                      <ApperIcon name="Check" className="w-3 h-3" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={cn(
                        "text-sm font-medium",
                        task.completed ? "text-gray-500 line-through" : "text-gray-900"
                      )}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(task.priority)} size="sm">
                          {task.priority}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onTaskSelect({ type: "edit", task })}
                          className="p-1 h-auto"
                        >
                          <ApperIcon name="Edit" className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {task.description && (
                      <p className={cn(
                        "text-sm mb-2",
                        task.completed ? "text-gray-400" : "text-gray-600"
                      )}>
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
<ApperIcon name="Calendar" className="w-3 h-3" />
                        <span>Due: {format(new Date(task.due_date), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1">
<ApperIcon name="User" className="w-3 h-3" />
                        <span>{getContactName(task.contact_id)}</span>
                      </div>
                      <div className="flex items-center gap-1">
<ApperIcon name="UserCheck" className="w-3 h-3" />
                        <span>{task.assigned_to}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default TaskList;