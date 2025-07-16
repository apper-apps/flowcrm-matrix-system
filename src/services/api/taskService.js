class TaskService {
  constructor() {
    this.tableName = "task";
  }

  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "completed" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "assigned_to" } }
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      return response.data || [];
    } catch (error) {
      console.error("Error in taskService.getAll:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "completed" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "assigned_to" } }
        ]
      };
      
      const response = await apperClient.getRecordById(this.tableName, id, params);
      return response.data;
    } catch (error) {
      console.error("Error in taskService.getById:", error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: taskData.Name,
          Tags: taskData.Tags,
          Owner: taskData.Owner,
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.due_date,
          priority: taskData.priority,
          completed: taskData.completed,
          contact_id: taskData.contact_id,
          assigned_to: taskData.assigned_to
        }]
      };
      
      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.results?.[0]?.data;
    } catch (error) {
      console.error("Error in taskService.create:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Id: id,
          Name: updateData.Name,
          Tags: updateData.Tags,
          Owner: updateData.Owner,
          title: updateData.title,
          description: updateData.description,
          due_date: updateData.due_date,
          priority: updateData.priority,
          completed: updateData.completed,
          contact_id: updateData.contact_id,
          assigned_to: updateData.assigned_to
        }]
      };
      
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.results?.[0]?.data;
    } catch (error) {
      console.error("Error in taskService.update:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return true;
    } catch (error) {
      console.error("Error in taskService.delete:", error);
      throw error;
    }
  }
}

export const taskService = new TaskService();