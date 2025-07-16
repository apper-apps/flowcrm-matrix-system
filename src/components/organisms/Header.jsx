import { useState } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import QuickActions from "@/components/molecules/QuickActions";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ 
  title, 
  onMenuClick, 
  onSearch, 
  onAddContact, 
  onAddDeal, 
  onAddTask,
  className 
}) => {
  return (
    <header className={cn("bg-white border-b border-gray-200 px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <SearchBar
            placeholder="Search contacts, deals, tasks..."
            onSearch={onSearch}
            className="hidden md:block w-80"
          />
          <QuickActions
            onAddContact={onAddContact}
            onAddDeal={onAddDeal}
            onAddTask={onAddTask}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;