import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { filterManager } from "@/services/api/filterManager";
import { toast } from "react-toastify";

const FilterBuilder = ({ 
  type, // 'contacts' or 'deals'
  onFiltersChange, 
  onSavedViewSelect,
  className 
}) => {
  const [filters, setFilters] = useState([]);
  const [savedViews, setSavedViews] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [saveViewModal, setSaveViewModal] = useState(false);
  const [viewName, setViewName] = useState("");
  const [viewDescription, setViewDescription] = useState("");

  // Field configurations for different types
  const fieldConfigs = {
    contacts: {
      name: { label: "Name", operators: ["contains", "equals", "startsWith"] },
      email: { label: "Email", operators: ["contains", "equals", "startsWith"] },
      company: { label: "Company", operators: ["contains", "equals", "startsWith"] },
      position: { label: "Position", operators: ["contains", "equals", "startsWith"] },
      tags: { label: "Tags", operators: ["contains", "equals"] },
      lastActivity: { label: "Last Activity", operators: ["before", "after", "between"] },
      createdAt: { label: "Created Date", operators: ["before", "after", "between"] }
    },
    deals: {
      title: { label: "Title", operators: ["contains", "equals", "startsWith"] },
      value: { label: "Value", operators: ["equals", "greaterThan", "lessThan", "between"] },
      stage: { label: "Stage", operators: ["equals", "in"] },
      probability: { label: "Probability", operators: ["equals", "greaterThan", "lessThan", "between"] },
      expectedCloseDate: { label: "Expected Close", operators: ["before", "after", "between"] },
      createdAt: { label: "Created Date", operators: ["before", "after", "between"] }
    }
  };

  const operators = {
    contains: "Contains",
    equals: "Equals",
    startsWith: "Starts with",
    before: "Before",
    after: "After",
    between: "Between",
    greaterThan: "Greater than",
    lessThan: "Less than",
    in: "In"
  };

  const stageOptions = [
    { value: "prospect", label: "Prospect" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closed-won", label: "Closed Won" },
    { value: "closed-lost", label: "Closed Lost" }
  ];

  useEffect(() => {
    loadSavedViews();
  }, [type]);

  const loadSavedViews = async () => {
    try {
      const views = await filterManager.getSavedViews(type);
      setSavedViews(views);
    } catch (error) {
      console.error("Failed to load saved views:", error);
    }
  };

  const addFilter = () => {
    const newFilter = {
      id: Date.now(),
      field: Object.keys(fieldConfigs[type])[0],
      operator: fieldConfigs[type][Object.keys(fieldConfigs[type])[0]].operators[0],
      value: "",
      value2: "", // For between operator
      logic: filters.length > 0 ? "AND" : null
    };
    setFilters([...filters, newFilter]);
  };

  const updateFilter = (id, updates) => {
    setFilters(filters.map(filter => 
      filter.id === id ? { ...filter, ...updates } : filter
    ));
  };

  const removeFilter = (id) => {
    const newFilters = filters.filter(filter => filter.id !== id);
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(filters);
    setShowBuilder(false);
    toast.success("Filters applied successfully");
  };

  const clearFilters = () => {
    setFilters([]);
    onFiltersChange([]);
    toast.info("All filters cleared");
  };

  const saveView = async () => {
    if (!viewName.trim()) {
      toast.error("Please enter a view name");
      return;
    }

    try {
      await filterManager.saveView({
        name: viewName,
        description: viewDescription,
        type,
        filters
      });
      
      setViewName("");
      setViewDescription("");
      setSaveViewModal(false);
      loadSavedViews();
      toast.success("View saved successfully");
    } catch (error) {
      toast.error("Failed to save view");
    }
  };

  const loadView = async (viewId) => {
    try {
      const view = await filterManager.getView(viewId);
      setFilters(view.filters);
      onFiltersChange(view.filters);
      onSavedViewSelect(view);
      toast.success(`Loaded view: ${view.name}`);
    } catch (error) {
      toast.error("Failed to load view");
    }
  };

  const deleteView = async (viewId) => {
    if (!confirm("Are you sure you want to delete this view?")) return;

    try {
      await filterManager.deleteView(viewId);
      loadSavedViews();
      toast.success("View deleted successfully");
    } catch (error) {
      toast.error("Failed to delete view");
    }
  };

  const renderFilterValue = (filter) => {
    const fieldConfig = fieldConfigs[type][filter.field];
    
    if (filter.field === "stage" && filter.operator === "in") {
      return (
        <Select
          value={filter.value}
          onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
          className="flex-1"
        >
          <option value="">Select stage</option>
          {stageOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    }

    if (filter.operator === "between") {
      return (
        <div className="flex gap-2 flex-1">
          <Input
            type={filter.field.includes("Date") ? "date" : "text"}
            value={filter.value}
            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
            placeholder="From"
            className="flex-1"
          />
          <Input
            type={filter.field.includes("Date") ? "date" : "text"}
            value={filter.value2}
            onChange={(e) => updateFilter(filter.id, { value2: e.target.value })}
            placeholder="To"
            className="flex-1"
          />
        </div>
      );
    }

    return (
      <Input
        type={filter.field.includes("Date") ? "date" : filter.field === "value" || filter.field === "probability" ? "number" : "text"}
        value={filter.value}
        onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
        placeholder="Enter value"
        className="flex-1"
      />
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBuilder(!showBuilder)}
          >
            <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
          
          {filters.length > 0 && (
            <Badge variant="primary" size="sm">
              {filters.length} filter{filters.length !== 1 ? "s" : ""} active
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {filters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              Clear All
            </Button>
          )}
          
          <Select
            value=""
            onChange={(e) => e.target.value && loadView(parseInt(e.target.value))}
            className="w-40"
          >
            <option value="">Saved Views</option>
            {savedViews.map(view => (
              <option key={view.Id} value={view.Id}>
                {view.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Filter Builder */}
      {showBuilder && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filter Builder</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={addFilter}
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Filter
              </Button>
            </div>

            {filters.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Filter" className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No filters added yet</p>
                <p className="text-sm">Click "Add Filter" to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filters.map((filter, index) => (
                  <div key={filter.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {index > 0 && (
                      <Select
                        value={filter.logic}
                        onChange={(e) => updateFilter(filter.id, { logic: e.target.value })}
                        className="w-20"
                      >
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                      </Select>
                    )}

                    <Select
                      value={filter.field}
                      onChange={(e) => updateFilter(filter.id, { 
                        field: e.target.value,
                        operator: fieldConfigs[type][e.target.value].operators[0]
                      })}
                      className="w-40"
                    >
                      {Object.entries(fieldConfigs[type]).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                      ))}
                    </Select>

                    <Select
                      value={filter.operator}
                      onChange={(e) => updateFilter(filter.id, { operator: e.target.value })}
                      className="w-32"
                    >
                      {fieldConfigs[type][filter.field].operators.map(op => (
                        <option key={op} value={op}>{operators[op]}</option>
                      ))}
                    </Select>

                    {renderFilterValue(filter)}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFilter(filter.id)}
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {filters.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSaveViewModal(true)}
                >
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                  Save View
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowBuilder(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Save View Modal */}
      {saveViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Save Filter View</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="viewName">View Name</Label>
                <Input
                  id="viewName"
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  placeholder="Enter view name"
                />
              </div>
              
              <div>
                <Label htmlFor="viewDescription">Description (optional)</Label>
                <Input
                  id="viewDescription"
                  value={viewDescription}
                  onChange={(e) => setViewDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setSaveViewModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={saveView}
                className="flex-1"
              >
                Save View
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Saved Views Management */}
      {savedViews.length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium mb-3">Saved Views</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedViews.map(view => (
              <div key={view.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h5 className="font-medium text-sm">{view.name}</h5>
                  {view.description && (
                    <p className="text-xs text-gray-600">{view.description}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {view.filters.length} filter{view.filters.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadView(view.Id)}
                  >
                    <ApperIcon name="Play" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteView(view.Id)}
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default FilterBuilder;