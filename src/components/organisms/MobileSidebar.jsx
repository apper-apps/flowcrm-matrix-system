import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MobileSidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Deals", href: "/deals", icon: "DollarSign" },
    { name: "Tasks", href: "/tasks", icon: "CheckSquare" },
    { name: "Activities", href: "/activities", icon: "Activity" },
  ];

  // Handle escape key and prevent body scroll when open
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ease-in-out"
          onClick={onClose}
          onTouchStart={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden shadow-xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                FlowCRM
              </h1>
            </div>
<button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close navigation menu"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <nav className="space-y-2">
{navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation min-h-[44px]",
                    isActive
                      ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border-l-4 border-primary-500"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100"
                  )
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5 flex-shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;