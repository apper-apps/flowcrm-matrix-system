import React, { useState } from "react";
import FilterBuilder from "@/components/organisms/FilterBuilder";
import FilterBar from "@/components/organisms/FilterBar";
import { cn } from "@/utils/cn";
import ContactModal from "@/components/organisms/ContactModal";
import ContactList from "@/components/organisms/ContactList";

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contactModal, setContactModal] = useState({ open: false, data: null, type: "add" });
  const [filters, setFilters] = useState([]);
  const [savedView, setSavedView] = useState(null);

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

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSavedViewSelect = (view) => {
    setSavedView(view);
  };

  const handleFilterRemove = (filterId) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };

  const handleClearAllFilters = () => {
    setFilters([]);
  };

  const handleSavedViewClear = () => {
    setSavedView(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Contacts</h1>
        <p className="text-primary-100">
          Manage your customer relationships and contact information.
        </p>
      </div>

      <FilterBuilder
        type="contacts"
        onFiltersChange={handleFiltersChange}
        onSavedViewSelect={handleSavedViewSelect}
      />

      <FilterBar
        filters={filters}
        savedView={savedView}
        onFilterRemove={handleFilterRemove}
        onClearAll={handleClearAllFilters}
        onSavedViewClear={handleSavedViewClear}
      />

<ContactList 
        searchTerm={searchTerm}
        filters={filters}
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