class DealService {
  constructor() {
    this.tableName = "deal";
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
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "probability" } },
          { field: { Name: "expected_close_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "contact_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      return response.data || [];
    } catch (error) {
      console.error("Error in dealService.getAll:", error);
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
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "probability" } },
          { field: { Name: "expected_close_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "contact_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById(this.tableName, id, params);
      return response.data;
    } catch (error) {
      console.error("Error in dealService.getById:", error);
      throw error;
    }
  }

  async create(dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: dealData.Name,
          Tags: dealData.Tags,
          Owner: dealData.Owner,
          title: dealData.title,
          value: dealData.value,
          stage: dealData.stage,
          probability: dealData.probability,
          expected_close_date: dealData.expected_close_date,
          created_at: new Date().toISOString(),
          contact_id: dealData.contact_id
        }]
      };
      
      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.results?.[0]?.data;
    } catch (error) {
      console.error("Error in dealService.create:", error);
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
          value: updateData.value,
          stage: updateData.stage,
          probability: updateData.probability,
          expected_close_date: updateData.expected_close_date,
          contact_id: updateData.contact_id
        }]
      };
      
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.results?.[0]?.data;
    } catch (error) {
      console.error("Error in dealService.update:", error);
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
      console.error("Error in dealService.delete:", error);
      throw error;
    }
  }
}

export const dealService = new DealService();