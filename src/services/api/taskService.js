import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.tasks];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const task = this.tasks.find(t => t.Id === id);
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newTask = {
      ...taskData,
      Id: Math.max(...this.tasks.map(t => t.Id)) + 1
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.tasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }
    this.tasks[index] = { ...this.tasks[index], ...updateData };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.tasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }
    this.tasks.splice(index, 1);
    return true;
  }
}

export const taskService = new TaskService();