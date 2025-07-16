import { useState, useContext } from "react";
import { useSelector } from 'react-redux';
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import QuickActions from "@/components/molecules/QuickActions";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "../../App";
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
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
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
          
          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.firstName?.[0] || user?.emailAddress?.[0] || 'U'}
                </span>
              </div>
              <span className="text-sm text-gray-700">
                {user?.firstName || user?.emailAddress || 'User'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <ApperIcon name="LogOut" className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;