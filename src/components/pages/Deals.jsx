import { useState } from "react";
import DealPipeline from "@/components/organisms/DealPipeline";
import DealModal from "@/components/organisms/DealModal";
import { cn } from "@/utils/cn";

const Deals = () => {
  const [dealModal, setDealModal] = useState({ open: false, data: null, type: "add" });

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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Sales Pipeline</h1>
        <p className="text-primary-100">
          Track your deals through every stage of the sales process.
        </p>
      </div>

      <DealPipeline onDealSelect={handleDealAction} />

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