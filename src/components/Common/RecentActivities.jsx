"use client";

import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RecentActivities = React.memo(({ activities }) => {
  const [showAll, setShowAll] = useState(false);
  const displayActivities = showAll ? activities : activities.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span>📊</span>
          Recent Activity
          {activities.length > 0 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {activities.length} new
            </span>
          )}
        </h2>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-125 overflow-y-auto">
        <AnimatePresence mode="wait">
          {displayActivities.length > 0 ? (
            displayActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm shrink-0 ${
                  activity.type === "submission" ? "bg-green-100" :
                  activity.type === "user" ? "bg-blue-100" : 
                  activity.type === "project" ? "bg-purple-100" : "bg-gray-100"
                }`}>
                  {activity.type === "submission" ? "📄" : 
                   activity.type === "user" ? "👤" : 
                   activity.type === "project" ? "🎬" : "📝"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{activity.user}</span>
                    <span className="text-gray-600"> {activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <span>🕒</span>
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-500 text-sm">No recent activities</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {activities.length > 5 && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center"
          >
            {showAll ? "Show less ↑" : `View all ${activities.length} activities ↓`}
          </button>
        </div>
      )}
    </div>
  );
});

RecentActivities.displayName = 'RecentActivities';
export default RecentActivities;