import { useState, useEffect } from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { activityService } from "@/services/api/activityService";
import { contactService } from "@/services/api/contactService";
import { cn } from "@/utils/cn";

const ActivityFeed = ({ contactId, className }) => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [activitiesData, contactsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll()
      ]);
      setActivities(activitiesData);
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
    return contact ? contact.Name : "Unknown Contact";
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "call":
        return { icon: "Phone", color: "text-blue-500" };
      case "email":
        return { icon: "Mail", color: "text-green-500" };
      case "meeting":
        return { icon: "Calendar", color: "text-purple-500" };
      case "note":
        return { icon: "FileText", color: "text-gray-500" };
      case "task":
        return { icon: "CheckSquare", color: "text-orange-500" };
      default:
        return { icon: "Activity", color: "text-gray-500" };
    }
  };

  const getActivityTypeColor = (type) => {
    switch (type) {
      case "call":
        return "info";
      case "email":
        return "success";
      case "meeting":
        return "secondary";
      case "note":
        return "default";
      case "task":
        return "warning";
      default:
        return "default";
    }
  };

const filteredActivities = contactId 
    ? activities.filter(activity => activity.contact_id === contactId)
    : activities;

  const sortedActivities = [...filteredActivities].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  if (loading) {
    return <Loading type="table" className={className} />;
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

  if (sortedActivities.length === 0) {
    return (
      <Empty
        title="No activities yet"
        description="Activities will appear here as you interact with contacts"
        icon="Activity"
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Activity Timeline
        </h2>
        
        <div className="space-y-4">
          {sortedActivities.map((activity) => {
            const { icon, color } = getActivityIcon(activity.type);
            
            return (
              <div key={activity.Id} className="relative">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center",
                    "bg-gradient-to-r from-gray-50 to-gray-100"
                  )}>
                    <ApperIcon name={icon} className={cn("w-4 h-4", color)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={getActivityTypeColor(activity.type)} size="sm">
                          {activity.type}
                        </Badge>
<span className="text-sm font-medium text-gray-900">
                          {getContactName(activity.contact_id)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {activity.description}
                    </p>
                    
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                        {Object.entries(activity.metadata).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="font-medium">{key}:</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Timeline line */}
                <div className="absolute left-5 top-12 w-0.5 h-4 bg-gray-200 last:hidden" />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ActivityFeed;