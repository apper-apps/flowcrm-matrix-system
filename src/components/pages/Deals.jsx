import { useState } from "react";
import DealPipeline from "@/components/organisms/DealPipeline";
import DealModal from "@/components/organisms/DealModal";
import FilterBuilder from "@/components/organisms/FilterBuilder";
import FilterBar from "@/components/organisms/FilterBar";
import { cn } from "@/utils/cn";

const Deals = () => {
  const [dealModal, setDealModal] = useState({ open: false, data: null, type: "add" });
  const [filters, setFilters] = useState([]);
  const [savedView, setSavedView] = useState(null);

  const handleDealAction = (action) => {
    setDealModal({
      open: true,
      data: action.deal || null,
      type: action.type
    });
  };

  const handleModalClose = () => {
    setDealModal({ open: false, data: null, type: "add" });
  };

  const handleDataSave = () => {
    // Refresh data would happen here
    handleModalClose();
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
        <h1 className="text-3xl font-bold mb-2">Sales Pipeline</h1>
        <p className="text-primary-100">
          Track your deals through every stage of the sales process.
        </p>
      </div>

      <FilterBuilder
        type="deals"
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

      <DealPipeline 
        filters={filters}
        onDealSelect={handleDealAction} 
      />

      {/* Deal Modal */}
      {dealModal.open && (
        <DealModal
          deal={dealModal.data}
          type={dealModal.type}
          onClose={handleModalClose}
          onSave={handleDataSave}
        />
      )}
    </div>
  );
};

export default Deals;