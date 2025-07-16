import { useState } from "react";
import DashboardStats from "@/components/organisms/DashboardStats";
import DealPipeline from "@/components/organisms/DealPipeline";
import TaskList from "@/components/organisms/TaskList";
import ActivityFeed from "@/components/organisms/ActivityFeed";
import ContactModal from "@/components/organisms/ContactModal";
import DealModal from "@/components/organisms/DealModal";
import TaskModal from "@/components/organisms/TaskModal";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const Dashboard = () => {
  const [contactModal, setContactModal] = useState({ open: false, data: null, type: "add" });
  const [dealModal, setDealModal] = useState({ open: false, data: null, type: "add" });
  const [taskModal, setTaskModal] = useState({ open: false, data: null, type: "add" });

  const handleContactAction = (action) => {
    setContactModal({
      open: true,
      data: action.contact || null,
      type: action.type
    });
  };

  const handleDealAction = (action) => {
    setDealModal({
      open: true,
      data: action.deal || null,
      type: action.type
    });
  };

  const handleTaskAction = (action) => {
    setTaskModal({
      open: true,
      data: action.task || null,
      type: action.type
    });
  };

  const handleModalClose = () => {
    setContactModal({ open: false, data: null, type: "add" });
    setDealModal({ open: false, data: null, type: "add" });
    setTaskModal({ open: false, data: null, type: "add" });
  };

  const handleDataSave = () => {
    // Refresh data would happen here
    handleModalClose();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-primary-100">
          Here's what's happening with your sales pipeline today.
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DealPipeline onDealSelect={handleDealAction} />
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h3>
            <TaskList 
              onTaskSelect={handleTaskAction}
              className="space-y-0"
            />
          </Card>
        </div>
      </div>

      <ActivityFeed />

      {/* Modals */}
      {contactModal.open && (
        <ContactModal
          contact={contactModal.data}
          type={contactModal.type}
          onClose={handleModalClose}
          onSave={handleDataSave}
        />
      )}

      {dealModal.open && (
        <DealModal
          deal={dealModal.data}
          type={dealModal.type}
          onClose={handleModalClose}
          onSave={handleDataSave}
        />
      )}

      {taskModal.open && (
        <TaskModal
          task={taskModal.data}
          type={taskModal.type}
          onClose={handleModalClose}
          onSave={handleDataSave}
        />
      )}
    </div>
  );
};

export default Dashboard;