import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ContactModal = ({ contact, onClose, onSave, type = "add" }) => {
  const [formData, setFormData] = useState({
    Name: "",
    email: "",
    phone: "",
company: "",
    position: "",
    Tags: ""
  });
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
if (contact && type !== "add") {
      setFormData({
        Name: contact.Name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        position: contact.position || "",
        Tags: contact.Tags || ""
      });
    }
  }, [contact, type]);

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const recordData = {
        Name: formData.Name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        position: formData.position,
        Tags: formData.Tags,
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString()
      };
      
      let response;
      if (type === "add") {
        response = await apperClient.createRecord("app_contact", {
          records: [recordData]
        });
      } else {
        response = await apperClient.updateRecord("app_contact", {
          records: [{
            Id: contact.Id,
            ...recordData
          }]
        });
      }
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to ${type} ${failedRecords.length} contacts:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success(`Contact ${type === "add" ? "created" : "updated"} successfully!`);
          onSave(successfulRecords[0].data);
          onClose();
        }
      }
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Failed to save contact");
    } finally {
      setLoading(false);
    }
  };

const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        const { ApperClient } = window.ApperSDK;
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        
        const response = await apperClient.deleteRecord("app_contact", {
          RecordIds: [contact.Id]
        });
        
        if (!response.success) {
          console.error(response.message);
          toast.error(response.message);
          return;
        }
        
        toast.success("Contact deleted successfully!");
        onSave(null);
        onClose();
      } catch (error) {
        console.error("Error deleting contact:", error);
        toast.error("Failed to delete contact");
      }
    }
  };

const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = formData.Tags ? formData.Tags.split(',') : [];
      if (!currentTags.includes(tagInput.trim())) {
        const newTags = [...currentTags, tagInput.trim()];
        setFormData(prev => ({
          ...prev,
          Tags: newTags.join(',')
        }));
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentTags = formData.Tags ? formData.Tags.split(',') : [];
    const newTags = currentTags.filter(tag => tag !== tagToRemove);
    setFormData(prev => ({
      ...prev,
      Tags: newTags.join(',')
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {type === "add" ? "Add New Contact" : 
               type === "edit" ? "Edit Contact" : "Contact Details"}
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
            label="Name"
            value={formData.Name}
            onChange={(e) => setFormData(prev => ({ ...prev, Name: e.target.value }))}
            placeholder="Enter contact name"
            required
          />
          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter email address"
            required
          />

          <FormField
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Enter phone number"
          />

          <FormField
            label="Company"
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            placeholder="Enter company name"
          />

          <FormField
            label="Position"
            value={formData.position}
            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
            placeholder="Enter job title"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                className="px-3"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
              </Button>
            </div>
<div className="flex flex-wrap gap-2 mt-2">
              {formData.Tags?.split(',').filter(tag => tag.trim()).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <ApperIcon name="X" className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Saving..." : type === "add" ? "Add Contact" : "Update Contact"}
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

export default ContactModal;