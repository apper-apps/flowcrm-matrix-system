import dealsData from "@/services/mockData/deals.json";

class DealService {
  constructor() {
    this.deals = [...dealsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.deals];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const deal = this.deals.find(d => d.Id === id);
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  }

  async create(dealData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newDeal = {
      ...dealData,
      Id: Math.max(...this.deals.map(d => d.Id)) + 1
    };
    this.deals.push(newDeal);
    return { ...newDeal };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.deals.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Deal not found");
    }
    this.deals[index] = { ...this.deals[index], ...updateData };
    return { ...this.deals[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
const index = this.deals.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Deal not found");
    }
    this.deals.splice(index, 1);
    return true;
  }
  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const searchTerm = query.toLowerCase();
    
    return this.deals.filter(deal =>
      deal.title.toLowerCase().includes(searchTerm) ||
      deal.stage.toLowerCase().includes(searchTerm)
    );
  }

  async filter(filters) {
    await new Promise(resolve => setTimeout(resolve, 300));
    let filtered = [...this.deals];

    for (const filter of filters) {
      filtered = this.applyFilter(filtered, filter);
    }

    return filtered;
  }

  applyFilter(deals, filter) {
    const { field, operator, value, value2 } = filter;

    return deals.filter(deal => {
      const fieldValue = deal[field];

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
          if (field === "value" || field === "probability") {
            const numValue = Number(fieldValue);
            return numValue >= Number(value) && numValue <= Number(value2);
          } else {
            const date = new Date(fieldValue);
            return date >= new Date(value) && date <= new Date(value2);
          }
        
        case "greaterThan":
          return Number(fieldValue) > Number(value);
        
        case "lessThan":
          return Number(fieldValue) < Number(value);
        
        case "in":
          return String(fieldValue) === String(value);
        
        default:
          return true;
      }
});
  }
}

export const dealService = new DealService();