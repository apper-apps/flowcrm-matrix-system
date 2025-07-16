import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Header from "@/components/organisms/Header";
import { cn } from "@/utils/cn";

const Layout = ({ 
  title, 
  onSearch, 
  onAddContact, 
  onAddDeal, 
  onAddTask,
  filterState,
  onFilterChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:block" />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
        <Header
          title={title}
          onMenuClick={() => setMobileMenuOpen(true)}
          onSearch={onSearch}
          onAddContact={onAddContact}
          onAddDeal={onAddDeal}
          onAddTask={onAddTask}
          filterState={filterState}
          onFilterChange={onFilterChange}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;