import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ContactModal from "@/components/organisms/ContactModal";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import DealModal from "@/components/organisms/DealModal";
import Header from "@/components/organisms/Header";
import TaskModal from "@/components/organisms/TaskModal";
import Sidebar from "@/components/organisms/Sidebar";
import { cn } from "@/utils/cn";
function Layout({ title, onSearch }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddContact = () => {
    setIsContactModalOpen(true);
  };

  const handleAddDeal = () => {
    setIsDealModalOpen(true);
  };

  const handleAddTask = () => {
    setIsTaskModalOpen(true);
  };

  const handleModalSave = () => {
    setRefreshTrigger(prev => prev + 1);
  };

return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={title}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onSearch={onSearch}
          onAddContact={handleAddContact}
          onAddDeal={handleAddDeal}
          onAddTask={handleAddTask}
        />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Modals */}
      {isContactModalOpen && (
        <ContactModal
          onClose={() => setIsContactModalOpen(false)}
          onSave={handleModalSave}
          type="add"
        />
      )}

      {isDealModalOpen && (
        <DealModal
          onClose={() => setIsDealModalOpen(false)}
          onSave={handleModalSave}
          type="add"
        />
      )}

      {isTaskModalOpen && (
        <TaskModal
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleModalSave}
          type="add"
        />
      )}
    </div>
  );
};

export default Layout;