"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const AnalyticsBar = React.memo(({ label, value, max, color, suffix = "", isPositive = false, icon }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-sm text-gray-600">{label}</span>
        </div>
        <span className={`text-sm font-semibold ${isPositive ? "text-green-600" : "text-gray-900"}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </span>
      </div>
      <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`absolute top-0 left-0 h-full ${color} rounded-full`}
        />
      </div>
    </div>
  );
});

AnalyticsBar.displayName = 'AnalyticsBar';

const PlatformAnalytics = React.memo(({ analytics, stats }) => {
  const activeRate = stats.totalUsers ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0;
  
  const metrics = [
    { label: "Total Views", value: analytics.totalViews, max: 20000, color: "bg-blue-500", icon: "👁️" },
    { label: "Active Users", value: activeRate, max: 100, suffix: "%", color: "bg-green-500", icon: "👥", isPositive: true },
    { label: "Approval Rate", value: analytics.approvalRate, max: 100, suffix: "%", color: "bg-purple-500", icon: "✅" },
    { label: "Growth Rate", value: analytics.monthlyGrowth, max: 100, suffix: "%", color: "bg-indigo-500", icon: "📈", isPositive: true }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span>📊</span>
        Platform Analytics
      </h2>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <AnalyticsBar key={index} {...metric} />
        ))}
      </div>
      
      <Link href="/admin/analytics">
        <motion.div
          whileHover={{ x: 4 }}
          className="mt-6 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          View detailed analytics
          <span>→</span>
        </motion.div>
      </Link>
    </div>
  );
});

PlatformAnalytics.displayName = 'PlatformAnalytics';
export default PlatformAnalytics;