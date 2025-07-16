import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { cn } from "@/utils/cn";
const DashboardStats = ({ className }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const [contactsRes, dealsRes, tasksRes, activitiesRes] = await Promise.all([
        apperClient.fetchRecords("app_contact", { fields: [{ field: { Name: "Name" } }] }),
        apperClient.fetchRecords("deal", { fields: [{ field: { Name: "value" } }, { field: { Name: "stage" } }] }),
        apperClient.fetchRecords("task", { fields: [{ field: { Name: "completed" } }] }),
        apperClient.fetchRecords("app_Activity", { fields: [{ field: { Name: "timestamp" } }] })
      ]);
      
      const contacts = contactsRes.data || [];
      const deals = dealsRes.data || [];
      const tasks = tasksRes.data || [];
      const activities = activitiesRes.data || [];

      const totalDealValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      const wonDeals = deals.filter(deal => deal.stage === "closed-won");
      const wonDealValue = wonDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      const pendingTasks = tasks.filter(task => !task.completed);
      const todayActivities = activities.filter(activity => {
        const today = new Date();
        const activityDate = new Date(activity.timestamp);
        return activityDate.toDateString() === today.toDateString();
      });

      setStats({
        totalContacts: contacts.length,
        totalDeals: deals.length,
        totalDealValue,
        wonDealValue,
        pendingTasks: pendingTasks.length,
        todayActivities: todayActivities.length,
        conversionRate: deals.length > 0 ? ((wonDeals.length / deals.length) * 100).toFixed(1) : 0
      });
} catch (err) {
      console.error("Error loading stats:", err);
      setError(err.message);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <Loading type="cards" className={className} />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadStats}
        className={className}
      />
    );
  }

  const statCards = [
    {
      title: "Total Contacts",
      value: stats.totalContacts,
      icon: "Users",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      title: "Active Deals",
      value: stats.totalDeals,
      icon: "DollarSign",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      title: "Pipeline Value",
      value: formatCurrency(stats.totalDealValue),
      icon: "TrendingUp",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    },
    {
      title: "Won Deals",
      value: formatCurrency(stats.wonDealValue),
      icon: "Trophy",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100"
    },
    {
      title: "Pending Tasks",
      value: stats.pendingTasks,
      icon: "CheckSquare",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100"
    },
    {
      title: "Today's Activities",
      value: stats.todayActivities,
      icon: "Activity",
      color: "from-pink-500 to-pink-600",
      bgColor: "from-pink-50 to-pink-100"
    }
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {statCards.map((stat, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
          <div className={cn("bg-gradient-to-r rounded-lg p-4 mb-4", stat.bgColor)}>
            <div className="flex items-center justify-between">
              <div className={cn(
                "p-3 rounded-lg bg-gradient-to-r text-white shadow-lg",
                stat.color
              )}>
                <ApperIcon name={stat.icon} className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {stat.title}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;