class ActivityService {
  constructor() {
    this.tableName = "app_Activity";
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
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "metadata" } },
          { field: { Name: "contact_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      return response.data || [];
    } catch (error) {
      console.error("Error in activityService.getAll:", error);
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
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "metadata" } },
          { field: { Name: "contact_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById(this.tableName, id, params);
      return response.data;
    } catch (error) {
      console.error("Error in activityService.getById:", error);
      throw error;
    }
  }

  async create(activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: activityData.Name,
          Tags: activityData.Tags,
          Owner: activityData.Owner,
          type: activityData.type,
          description: activityData.description,
          timestamp: activityData.timestamp,
          metadata: activityData.metadata,
          contact_id: activityData.contact_id
        }]
      };
      
      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.results?.[0]?.data;
    } catch (error) {
      console.error("Error in activityService.create:", error);
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
          type: updateData.type,
          description: updateData.description,
          timestamp: updateData.timestamp,
          metadata: updateData.metadata,
          contact_id: updateData.contact_id
        }]
      };
      
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.results?.[0]?.data;
    } catch (error) {
      console.error("Error in activityService.update:", error);
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
      console.error("Error in activityService.delete:", error);
      throw error;
    }
  }
}

export const activityService = new ActivityService();