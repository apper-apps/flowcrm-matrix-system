class FilterManager {
  constructor() {
    this.storageKey = "flowcrm_saved_filters";
    this.views = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load saved filters:", error);
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.views));
    } catch (error) {
      console.error("Failed to save filters:", error);
    }
  }

  async getSavedViews(type) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.views.filter(view => view.type === type);
  }

  async getView(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const view = this.views.find(v => v.Id === id);
    if (!view) {
      throw new Error("View not found");
    }
    return { ...view };
  }

  async saveView(viewData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newView = {
      ...viewData,
      Id: Math.max(...this.views.map(v => v.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.views.push(newView);
    this.saveToStorage();
    return { ...newView };
  }

  async updateView(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.views.findIndex(v => v.Id === id);
    if (index === -1) {
      throw new Error("View not found");
    }

    this.views[index] = {
      ...this.views[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    this.saveToStorage();
    return { ...this.views[index] };
  }

  async deleteView(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const index = this.views.findIndex(v => v.Id === id);
    if (index === -1) {
      throw new Error("View not found");
    }

    this.views.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Apply filters to data
  applyFilters(data, filters) {
    if (!filters || filters.length === 0) {
      return data;
    }

    return data.filter(item => {
      let result = true;
      let currentLogic = null;

      for (const filter of filters) {
        const fieldValue = item[filter.field];
        const filterResult = this.evaluateFilter(fieldValue, filter);

        if (currentLogic === null) {
          result = filterResult;
        } else if (currentLogic === "AND") {
          result = result && filterResult;
        } else if (currentLogic === "OR") {
          result = result || filterResult;
        }

        currentLogic = filter.logic;
      }

      return result;
    });
  }

  evaluateFilter(fieldValue, filter) {
    const { operator, value, value2 } = filter;

    if (fieldValue === null || fieldValue === undefined) {
      return false;
    }

    switch (operator) {
      case "contains":
        return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
      
      case "equals":
        return String(fieldValue).toLowerCase() === String(value).toLowerCase();
      
      case "startsWith":
        return String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase());
      
      case "before":
        return new Date(fieldValue) < new Date(value);
      
      case "after":
        return new Date(fieldValue) > new Date(value);
      
      case "between":
        const date = new Date(fieldValue);
        return date >= new Date(value) && date <= new Date(value2);
      
      case "greaterThan":
        return Number(fieldValue) > Number(value);
      
      case "lessThan":
        return Number(fieldValue) < Number(value);
      
      case "in":
        return String(fieldValue) === String(value);
      
      default:
        return false;
    }
  }
}

export const filterManager = new FilterManager();