import { useState } from "react";
import ContactList from "@/components/organisms/ContactList";
import ContactModal from "@/components/organisms/ContactModal";
import { cn } from "@/utils/cn";

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contactModal, setContactModal] = useState({ open: false, data: null, type: "add" });

  const handleContactAction = (action) => {
    setContactModal({
      open: true,
      data: action.contact || null,
      type: action.type
    });
  };

  const handleModalClose = () => {
    setContactModal({ open: false, data: null, type: "add" });
  };

  const handleDataSave = () => {
    // Refresh data would happen here
    handleModalClose();
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Contacts</h1>
        <p className="text-primary-100">
          Manage your customer relationships and contact information.
        </p>
      </div>

      <ContactList 
        searchTerm={searchTerm}
        onContactSelect={handleContactAction}
      />

      {/* Contact Modal */}
      {contactModal.open && (
        <ContactModal
          contact={contactModal.data}
          type={contactModal.type}
          onClose={handleModalClose}
          onSave={handleDataSave}
        />
      )}
    </div>
  );
};

export default Contacts;