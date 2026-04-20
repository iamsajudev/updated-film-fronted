"use client";

import React from "react";
import { motion } from "framer-motion";

const StatusRow = React.memo(({ label, value, isGood, icon }) => {
    const getStatusColor = () => {
        if (isGood === undefined) return "text-gray-900";
        return isGood ? "text-green-600" : "text-red-600";
    };

    const getStatusDot = () => {
        if (isGood === undefined) return null;
        return (
            <motion.span
                animate={{ scale: isGood ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 2, repeat: isGood ? Infinity : 0 }}
                className={`inline-block w-2 h-2 rounded-full mr-2 ${isGood ? 'bg-green-500' : 'bg-red-500'}`}
            />
        );
    };

    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
                <span className="text-sm">{icon}</span>
                <span className="text-sm text-gray-600">{label}</span>
            </div>
            <div className={`text-sm font-medium ${getStatusColor()} flex items-center`}>
                {getStatusDot()}
                {value}
            </div>
        </div>
    );
});

StatusRow.displayName = 'StatusRow';

const SystemStatus = React.memo(({ status }) => {
    const statuses = [
        { label: "API Status", value: status.apiStatus, isGood: status.apiStatus === "operational", icon: "🔌" },
        { label: "Database", value: status.database, isGood: status.database === "connected", icon: "🗄️" },
        { label: "Server Uptime", value: status.uptime, icon: "⏱️" },
        { label: "Memory Usage", value: status.memory, icon: "💾" },
        { label: "Last Backup", value: status.lastBackup, icon: "💿" }
    ];

    const allGood = statuses.every(s => s.isGood !== false);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span>🖥️</span>
                    System Status
                </h2>
                {allGood && (
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"
                    >
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        All Systems Operational
                    </motion.div>
                )}
            </div>

            <div className="space-y-1">
                {statuses.map((s, index) => (
                    <StatusRow key={index} {...s} />
                ))}
            </div>
        </div>
    );
});

SystemStatus.displayName = 'SystemStatus';
export default SystemStatus;