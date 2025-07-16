import { useState } from "react";
import ActivityFeed from "@/components/organisms/ActivityFeed";
import { cn } from "@/utils/cn";

const Activities = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Activity Timeline</h1>
        <p className="text-primary-100">
          Track all interactions and activities across your customer relationships.
        </p>
      </div>

      <ActivityFeed />
    </div>
  );
};

export default Activities;