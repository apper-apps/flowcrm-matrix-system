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
}

export const dealService = new DealService();