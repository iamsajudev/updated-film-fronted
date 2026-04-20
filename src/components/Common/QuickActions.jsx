"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const QuickActions = React.memo(({ stats }) => {
  const actions = [
    { href: "/admin/projects", label: "Review Projects", count: stats.pendingProjects, icon: "📋", color: "blue" },
    { href: "/admin/users", label: "Manage Users", count: stats.totalUsers, icon: "👥", color: "green" },
    { href: "/admin/submissions", label: "Pending Submissions", count: stats.pendingSubmissions, icon: "📝", color: "purple" },
    { href: "/admin/films", label: "Film Submissions", count: stats.pendingFilms, icon: "🎬", color: "orange" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span>⚡</span>
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href={action.href}>
              <button className={`w-full bg-${action.color}-50 text-${action.color}-700 p-3 rounded-lg hover:bg-${action.color}-100 transition-all duration-200 text-sm font-medium flex items-center justify-between group`}>
                <span className="flex items-center gap-2">
                  <span className="text-lg">{action.icon}</span>
                  <span className="hidden sm:inline">{action.label}</span>
                </span>
                {action.count > 0 && (
                  <span className={`px-2 py-0.5 bg-${action.color}-200 rounded-full text-xs font-bold`}>
                    {action.count}
                  </span>
                )}
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

QuickActions.displayName = 'QuickActions';
export default QuickActions;