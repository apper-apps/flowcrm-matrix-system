import { useState } from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FilterBar = ({ 
  filters = [], 
  savedView = null,
  onFilterRemove, 
  onClearAll,
  onSavedViewClear,
  className 
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const formatFilterDisplay = (filter) => {
    const operatorMap = {
      contains: "contains",
      equals: "=",
      startsWith: "starts with",
      before: "before",
      after: "after",
      between: "between",
      greaterThan: ">",
      lessThan: "<",
      in: "in"
    };

    const fieldMap = {
      name: "Name",
      email: "Email",
      company: "Company",
      position: "Position",
      tags: "Tags",
      lastActivity: "Last Activity",
      createdAt: "Created",
      title: "Title",
      value: "Value",
      stage: "Stage",
      probability: "Probability",
      expectedCloseDate: "Expected Close"
    };

    const field = fieldMap[filter.field] || filter.field;
    const operator = operatorMap[filter.operator] || filter.operator;
    let value = filter.value;

    if (filter.operator === "between") {
      value = `${filter.value} - ${filter.value2}`;
    }

    if (filter.field === "value" && filter.value) {
      value = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(filter.value);
    }

    return `${field} ${operator} ${value}`;
  };

  const activeFiltersCount = filters.length + (savedView ? 1 : 0);

  if (activeFiltersCount === 0) {
    return null;
  }

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ApperIcon name="Filter" className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Active Filters ({activeFiltersCount})
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ApperIcon 
              name={collapsed ? "ChevronDown" : "ChevronUp"} 
              className="w-4 h-4" 
            />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onClearAll();
              if (savedView) {
                onSavedViewClear();
              }
            }}
          >
            <ApperIcon name="X" className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      </div>

      {!collapsed && (
        <div className="space-y-3">
          {/* Saved View */}
          {savedView && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" size="sm" className="flex items-center gap-1">
                <ApperIcon name="Star" className="w-3 h-3" />
                View: {savedView.name}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSavedViewClear}
                  className="p-0 h-auto ml-1"
                >
                  <ApperIcon name="X" className="w-3 h-3" />
                </Button>
              </Badge>
            </div>
          )}

          {/* Individual Filters */}
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <div key={filter.id} className="flex items-center gap-1">
                  {index > 0 && filter.logic && (
                    <span className="text-xs text-gray-500 font-medium px-2">
                      {filter.logic}
                    </span>
                  )}
                  
                  <Badge 
                    variant="primary" 
                    size="sm" 
                    className="flex items-center gap-1"
                  >
                    {formatFilterDisplay(filter)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onFilterRemove(filter.id)}
                      className="p-0 h-auto ml-1"
                    >
                      <ApperIcon name="X" className="w-3 h-3" />
                    </Button>
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">Quick actions:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Clear only individual filters, keep saved view
                onClearAll();
              }}
              className="text-xs"
            >
              Clear Filters
            </Button>
            
            {savedView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSavedViewClear}
                className="text-xs"
              >
                Clear Saved View
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;