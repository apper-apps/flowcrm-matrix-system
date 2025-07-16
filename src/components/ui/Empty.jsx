import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item", 
  icon = "Database",
  action,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      {action && (
        <Button 
          onClick={action.onClick}
          variant="primary"
          className="flex items-center gap-2"
        >
          <ApperIcon name={action.icon || "Plus"} className="w-4 h-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default Empty;