"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const PendingTasks = React.memo(({ tasks }) => {
  const priorityColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-green-100 text-green-700 border-green-200"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span>⏰</span>
        Pending Tasks
        {tasks.length > 0 && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full animate-pulse">
            {tasks.length}
          </span>
        )}
      </h2>
      
      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.slice(0, 5).map((task, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, x: 4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link href={task.link}>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.task}</p>
                    <p className="text-xs text-gray-500 mt-1">{task.count} items pending</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ml-3 ${priorityColors[task.priority] || priorityColors.medium}`}>
                    {task.priority}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-3"
            >
              ✅
            </motion.div>
            <p className="text-gray-500 text-sm">All caught up! No pending tasks.</p>
          </div>
        )}
      </div>
    </div>
  );
});

PendingTasks.displayName = 'PendingTasks';
export default PendingTasks;