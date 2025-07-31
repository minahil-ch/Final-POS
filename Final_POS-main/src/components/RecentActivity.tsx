"use client";

import { Clock, User, ShoppingCart, CheckCircle } from "lucide-react";

const activities = [
  {
    icon: <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
    text: "New customer registered: John Doe",
    time: "2 minutes ago",
  },
  {
    icon: <ShoppingCart className="w-4 h-4 text-green-600 dark:text-green-400" />,
    text: "Sale completed: Order #23456",
    time: "10 minutes ago",
  },
  {
    icon: <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    text: "Inventory updated: 5 items restocked",
    time: "1 hour ago",
  },
  {
    icon: <User className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />,
    text: "User 'admin' logged in",
    time: "2 hours ago",
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl shadow-md p-4 w-full h-full">


      <h2 className="text-lg font-semibold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
        Recent Activity
      </h2>
      
      <div className="flex flex-col gap-4 text-sm">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <span className="mt-1">{activity.icon}</span>
            <div>
              <p className="text-gray-800 dark:text-white">{activity.text}</p>
              <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
