import { useState, useEffect } from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { cn } from "@/utils/cn";

const DealPipeline = ({ onDealSelect, className }) => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stages = [
    { id: "prospect", name: "Prospect", color: "bg-gray-500" },
    { id: "qualified", name: "Qualified", color: "bg-blue-500" },
    { id: "proposal", name: "Proposal", color: "bg-yellow-500" },
    { id: "negotiation", name: "Negotiation", color: "bg-orange-500" },
    { id: "closed-won", name: "Closed Won", color: "bg-green-500" },
    { id: "closed-lost", name: "Closed Lost", color: "bg-red-500" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.name : "Unknown Contact";
  };

  const getDealsByStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  const getStageTotal = (stageId) => {
    const stageDeals = getDealsByStage(stageId);
    return stageDeals.reduce((sum, deal) => sum + deal.value, 0);
  };

  if (loading) {
    return <Loading type="pipeline" className={className} />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadData}
        className={className}
      />
    );
  }

  if (deals.length === 0) {
    return (
      <Empty
        title="No deals in pipeline"
        description="Start tracking your sales opportunities by adding your first deal"
        icon="DollarSign"
        action={{
          label: "Add Deal",
          onClick: () => onDealSelect({ type: "add" }),
          icon: "Plus"
        }}
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Pipeline</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stages.map((stage) => {
            const stageDeals = getDealsByStage(stage.id);
            const stageTotal = getStageTotal(stage.id);
            
            return (
              <div key={stage.id} className="bg-gray-50 rounded-lg p-4 min-h-[400px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", stage.color)} />
                    <h3 className="font-medium text-gray-900">{stage.name}</h3>
                  </div>
                  <Badge variant="default" size="sm">
                    {stageDeals.length}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(stageTotal)}
                  </p>
                </div>
                
                <div className="space-y-3">
                  {stageDeals.map((deal) => (
                    <Card 
                      key={deal.Id}
                      className="p-3 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                      onClick={() => onDealSelect({ type: "view", deal })}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                          {deal.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDealSelect({ type: "edit", deal });
                          }}
                          className="p-1 h-auto"
                        >
                          <ApperIcon name="Edit" className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <ApperIcon name="DollarSign" className="w-3 h-3" />
                          <span className="font-medium text-gray-900">
                            {formatCurrency(deal.value)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <ApperIcon name="User" className="w-3 h-3" />
                          <span>{getContactName(deal.contactId)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Calendar" className="w-3 h-3" />
                          <span>{format(new Date(deal.expectedCloseDate), "MMM d")}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <ApperIcon name="TrendingUp" className="w-3 h-3" />
                          <span>{deal.probability}% probability</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DealPipeline;