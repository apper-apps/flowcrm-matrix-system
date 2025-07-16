import contactsData from "@/services/mockData/contacts.json";
class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.contacts];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const contact = this.contacts.find(c => c.Id === id);
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  }

  async create(contactData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newContact = {
      ...contactData,
      Id: Math.max(...this.contacts.map(c => c.Id)) + 1
    };
    this.contacts.push(newContact);
    return { ...newContact };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.contacts.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Contact not found");
    }
    this.contacts[index] = { ...this.contacts[index], ...updateData };
    return { ...this.contacts[index] };
  }

async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.contacts.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Contact not found");
    }
    this.contacts.splice(index, 1);
    return true;
  }
  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const searchTerm = query.toLowerCase();
    
    return this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm) ||
      contact.company.toLowerCase().includes(searchTerm) ||
      contact.position.toLowerCase().includes(searchTerm) ||
      contact.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  async filter(filters) {
    await new Promise(resolve => setTimeout(resolve, 300));
    let filtered = [...this.contacts];

    for (const filter of filters) {
      filtered = this.applyFilter(filtered, filter);
    }

    return filtered;
  }

  applyFilter(contacts, filter) {
    const { field, operator, value, value2 } = filter;

    return contacts.filter(contact => {
      const fieldValue = contact[field];

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
        
        default:
          return true;
}
    });
  }
}

export const contactService = new ContactService();