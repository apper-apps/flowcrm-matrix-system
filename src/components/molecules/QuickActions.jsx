import { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const QuickActions = ({ onAddContact, onAddDeal, onAddTask, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { 
      label: "Add Contact", 
      icon: "UserPlus", 
      onClick: onAddContact,
      variant: "primary"
    },
    { 
      label: "Add Deal", 
      icon: "DollarSign", 
      onClick: onAddDeal,
      variant: "secondary"
    },
    { 
      label: "Add Task", 
      icon: "Plus", 
      onClick: onAddTask,
      variant: "accent"
    }
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {actions.map((action) => (
        <Button
          key={action.label}
          variant={action.variant}
          size="sm"
          onClick={action.onClick}
          className="flex items-center gap-2"
        >
          <ApperIcon name={action.icon} className="w-4 h-4" />
          <span className="hidden sm:inline">{action.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;