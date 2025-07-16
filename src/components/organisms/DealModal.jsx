import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { cn } from "@/utils/cn";

const DealModal = ({ deal, onClose, onSave, type = "add" }) => {
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    stage: "prospect",
    contactId: "",
    probability: 50,
    expectedCloseDate: ""
  });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const stages = [
    { value: "prospect", label: "Prospect" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closed-won", label: "Closed Won" },
    { value: "closed-lost", label: "Closed Lost" }
  ];

  useEffect(() => {
    loadContacts();
    if (deal && type !== "add") {
      setFormData({
        title: deal.title || "",
        value: deal.value || "",
        stage: deal.stage || "prospect",
        contactId: deal.contactId || "",
        probability: deal.probability || 50,
        expectedCloseDate: deal.expectedCloseDate ? 
          new Date(deal.expectedCloseDate).toISOString().split("T")[0] : ""
      });
    }
  }, [deal, type]);

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
      let savedDeal;
      
      if (type === "add") {
        savedDeal = await dealService.create({
          ...formData,
          value: parseFloat(formData.value),
          createdAt: new Date().toISOString()
        });
        toast.success("Deal created successfully!");
      } else {
        savedDeal = await dealService.update(deal.Id, {
          ...formData,
          value: parseFloat(formData.value)
        });
        toast.success("Deal updated successfully!");
      }
      
      onSave(savedDeal);
      onClose();
    } catch (error) {
      toast.error("Failed to save deal");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      try {
        await dealService.delete(deal.Id);
        toast.success("Deal deleted successfully!");
        onSave(null);
        onClose();
      } catch (error) {
        toast.error("Failed to delete deal");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {type === "add" ? "Add New Deal" : 
               type === "edit" ? "Edit Deal" : "Deal Details"}
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
            label="Deal Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter deal title"
            required
          />

          <FormField
            label="Value"
            type="number"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            placeholder="Enter deal value"
            required
          />

          <FormField
            label="Stage"
            type="select"
            value={formData.stage}
            onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
            options={stages}
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Probability: {formData.probability}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.probability}
              onChange={(e) => setFormData(prev => ({ ...prev, probability: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <FormField
            label="Expected Close Date"
            type="date"
            value={formData.expectedCloseDate}
            onChange={(e) => setFormData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Saving..." : type === "add" ? "Add Deal" : "Update Deal"}
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

export default DealModal;