"use client";

import React, { useEffect, useState, useCallback, useMemo, lazy, Suspense, startTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Cache duration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cachedData = null;
let lastFetch = 0;

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalAdmins: 0,
    totalProjects: 0,
    pendingProjects: 0,
    approvedProjects: 0,
    rejectedProjects: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    totalFilms: 0,
    pendingFilms: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    apiStatus: "checking",
    database: "checking",
    lastBackup: "Today, 02:00 AM",
    uptime: "99.9%",
    memory: "45%"
  });
  const [analytics, setAnalytics] = useState({
    totalViews: 12450,
    monthlyGrowth: 12.5,
    approvalRate: 68,
    completionRate: 75
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Get auth token with error handling
  const getToken = useCallback(() => {
    try {
      return localStorage.getItem("token") || sessionStorage.getItem("token");
    } catch (error) {
      console.error("Error accessing storage:", error);
      return null;
    }
  }, []);

  // Fast parallel data fetching
  const fetchDashboardData = useCallback(async (token, useCache = true) => {
    // Check cache first for instant load
    if (useCache && cachedData && (Date.now() - lastFetch) < CACHE_DURATION) {
      return cachedData;
    }

    // Fetch all endpoints in parallel for maximum speed
    const endpoints = [
      fetch(`${API_URL}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      }),
      fetch(`${API_URL}/api/admin/stats`, {
        headers: { "Authorization": `Bearer ${token}` }
      }),
      fetch(`${API_URL}/api/admin/recent-activities`, {
        headers: { "Authorization": `Bearer ${token}` }
      }),
      fetch(`${API_URL}/api/admin/pending-tasks`, {
        headers: { "Authorization": `Bearer ${token}` }
      }),
      fetch(`${API_URL}/api/admin/analytics`, {
        headers: { "Authorization": `Bearer ${token}` }
      }),
      fetch(`${API_URL}/health`).catch(() => null)
    ];

    const [profileRes, statsRes, activitiesRes, tasksRes, analyticsRes, healthRes] = await Promise.allSettled(endpoints);

    const data = {};

    // Process profile
    if (profileRes.status === 'fulfilled' && profileRes.value.ok) {
      const profileData = await profileRes.value.json();
      data.user = profileData.user;
    }

    // Process stats
    if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
      const statsData = await statsRes.value.json();
      if (statsData.success) {
        data.stats = statsData.stats;
      }
    }

    // Process activities
    if (activitiesRes.status === 'fulfilled' && activitiesRes.value.ok) {
      const activitiesData = await activitiesRes.value.json();
      if (activitiesData.success) {
        data.activities = activitiesData.activities;
      }
    }

    // Process tasks
    if (tasksRes.status === 'fulfilled' && tasksRes.value.ok) {
      const tasksData = await tasksRes.value.json();
      if (tasksData.success) {
        data.tasks = tasksData.tasks;
      }
    }

    // Process analytics
    if (analyticsRes.status === 'fulfilled' && analyticsRes.value.ok) {
      const analyticsData = await analyticsRes.value.json();
      if (analyticsData.success) {
        data.analytics = analyticsData.data;
      }
    }

    // Process health
    if (healthRes.status === 'fulfilled' && healthRes.value) {
      const healthData = await healthRes.value.json();
      data.systemStatus = {
        apiStatus: "operational",
        database: healthData.mongodb?.status === "connected" ? "connected" : "disconnected",
        lastBackup: "Today, 02:00 AM",
        uptime: "99.9%",
        memory: "45%"
      };
    }

    // Cache the data
    cachedData = data;
    lastFetch = Date.now();

    return data;
  }, [API_URL]);

  // Load dashboard with optimistic UI
  const loadDashboard = useCallback(async (showRefresh = false) => {
    const token = getToken();

    if (!token) {
      toast.error("Please login to access admin panel");
      router.push("/admin/login");
      return;
    }

    if (showRefresh) {
      setIsRefreshing(true);
    }

    try {
      setError(null);

      // Fetch data
      const data = await fetchDashboardData(token, !showRefresh);

      // Validate admin role
      if (data.user?.role !== "admin") {
        toast.error("Access denied. Admin only.");
        router.push("/");
        return;
      }

      // Batch all state updates for better performance
      startTransition(() => {
        setAdminData(data.user);
        
        if (data.stats) {
          setDashboardStats({
            totalUsers: data.stats.totalUsers || 0,
            activeUsers: data.stats.activeUsers || 0,
            inactiveUsers: (data.stats.totalUsers || 0) - (data.stats.activeUsers || 0),
            totalAdmins: data.stats.totalAdmins || 0,
            totalProjects: data.stats.totalProjects || 0,
            pendingProjects: data.stats.pendingProjects || 0,
            approvedProjects: data.stats.approvedProjects || 0,
            rejectedProjects: data.stats.rejectedProjects || 0,
            totalSubmissions: data.stats.totalSubmissions || 0,
            pendingSubmissions: data.stats.pendingSubmissions || 0,
            totalFilms: data.stats.totalFilms || 0,
            pendingFilms: data.stats.pendingFilms || 0
          });
        }

        if (data.activities) {
          setRecentActivities(data.activities);
        }

        if (data.tasks) {
          setPendingTasks(data.tasks);
        }

        if (data.analytics) {
          setAnalytics({
            totalViews: data.analytics.totalViews || 12450,
            monthlyGrowth: data.analytics.monthlyGrowth || 12.5,
            approvalRate: data.analytics.approvalRate || 68,
            completionRate: data.analytics.completionRate || 75
          });
        }

        if (data.systemStatus) {
          setSystemStatus(data.systemStatus);
        }
      });

      // Prefetch next pages in background
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        requestIdleCallback(() => {
          const pagesToPrefetch = ['/admin/projects', '/admin/users', '/admin/submissions', '/admin/films'];
          pagesToPrefetch.forEach(page => {
            router.prefetch(page);
          });
        });
      }

    } catch (error) {
      console.error("Error loading dashboard:", error);
      setError(error.message);

      // Show cached data if available
      if (cachedData && !showRefresh) {
        toast.error("Using cached data. Some info may be outdated.");
        startTransition(() => {
          if (cachedData.user) setAdminData(cachedData.user);
          if (cachedData.stats) setDashboardStats(prev => ({ ...prev, ...cachedData.stats }));
          if (cachedData.activities) setRecentActivities(cachedData.activities);
          if (cachedData.tasks) setPendingTasks(cachedData.tasks);
        });
      } else {
        toast.error("Failed to load dashboard. Please refresh.");
      }
    } finally {
      if (showRefresh) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
      setLoading(false);
    }
  }, [router, getToken, fetchDashboardData]);

  // Initial load
  useEffect(() => {
    loadDashboard();

    // Prefetch common routes
    router.prefetch('/admin/projects');
    router.prefetch('/admin/users');
    router.prefetch('/admin/submissions');

    // Set up visibility API for background refresh
    let refreshInterval;

    if (typeof document !== 'undefined') {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          loadDashboard(true);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Refresh every 2 minutes in background
      refreshInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          loadDashboard(true);
        }
      }, 120000);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (refreshInterval) clearInterval(refreshInterval);
      };
    }
  }, [loadDashboard]);

  // Memoize calculations for performance
  const activeUserPercentage = useMemo(() => {
    if (!dashboardStats.totalUsers) return 0;
    return Math.round((dashboardStats.activeUsers / dashboardStats.totalUsers) * 100);
  }, [dashboardStats.activeUsers, dashboardStats.totalUsers]);

  const approvalRate = useMemo(() => {
    if (!dashboardStats.totalProjects) return 0;
    return Math.round((dashboardStats.approvedProjects / dashboardStats.totalProjects) * 100);
  }, [dashboardStats.approvedProjects, dashboardStats.totalProjects]);

  // Stats cards data
  const adminStats = useMemo(() => [
    { 
      label: "Total Users", 
      value: dashboardStats.totalUsers.toLocaleString(), 
      icon: "👥", 
      color: "blue", 
      change: `${activeUserPercentage}% active`,
      changeType: dashboardStats.activeUsers > dashboardStats.totalUsers / 2 ? "positive" : "neutral"
    },
    { 
      label: "Active Users", 
      value: dashboardStats.activeUsers.toLocaleString(), 
      icon: "✅", 
      color: "green", 
      change: `${activeUserPercentage}% of total`,
      changeType: "positive"
    },
    { 
      label: "Total Projects", 
      value: dashboardStats.totalProjects.toLocaleString(), 
      icon: "🎬", 
      color: "purple", 
      change: `+${dashboardStats.pendingProjects} pending`,
      changeType: dashboardStats.pendingProjects < 50 ? "positive" : "neutral"
    },
    { 
      label: "Pending Reviews", 
      value: dashboardStats.pendingProjects.toLocaleString(), 
      icon: "⏳", 
      color: "yellow", 
      change: `${approvalRate}% approved`,
      changeType: approvalRate > 70 ? "positive" : "negative"
    },
  ], [dashboardStats, activeUserPercentage, approvalRate]);

  // Quick refresh handler
  const handleRefresh = useCallback(() => {
    loadDashboard(true);
  }, [loadDashboard]);

  if (loading && !cachedData) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        
        {/* Header Section */}
        <DashboardHeader 
          adminData={adminData} 
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          lastUpdated={lastFetch}
        />

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <div className="text-red-500">⚠️</div>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={handleRefresh}
                className="ml-auto text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {adminStats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <QuickActions stats={dashboardStats} />
            
            {/* Recent Activity */}
            <RecentActivities activities={recentActivities} />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Pending Tasks */}
            <PendingTasks tasks={pendingTasks} />
            
            {/* Platform Analytics */}
            <PlatformAnalytics analytics={analytics} stats={dashboardStats} />
            
            {/* System Status */}
            <SystemStatus status={systemStatus} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== COMPONENTS ====================

// Dashboard Header Component
const DashboardHeader = React.memo(({ adminData, onRefresh, isRefreshing, lastUpdated }) => (
  <div className="mb-6 md:mb-8">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 text-sm md:text-base mt-1 flex items-center gap-2">
          Welcome back, {adminData?.name || "Admin"}!
          {adminData?.role === "admin" && (
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
              Admin
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {lastUpdated > 0 && (
          <div className="hidden md:block text-xs text-gray-400">
            Updated {Math.floor((Date.now() - lastUpdated) / 1000)}s ago
          </div>
        )}

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="relative px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
    </div>
  </div>
));

DashboardHeader.displayName = 'DashboardHeader';

// Stat Card Component
const StatCard = React.memo(({ stat, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const gradients = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    yellow: "from-yellow-500 to-yellow-600"
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50",
      green: "bg-green-50",
      purple: "bg-purple-50",
      yellow: "bg-yellow-50"
    };
    return colors[color] || "bg-gray-50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br opacity-5 rounded-full -mr-16 -mt-16" />
      
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 md:w-12 md:h-12 bg-linear-to-br ${gradients[stat.color]} rounded-lg flex items-center justify-center text-xl md:text-2xl shadow-lg`}>
            {stat.icon}
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            stat.changeType === "positive" ? "bg-green-100 text-green-700" : 
            stat.changeType === "negative" ? "bg-red-100 text-red-700" : 
            "bg-gray-100 text-gray-600"
          }`}>
            {stat.change}
          </div>
        </div>
        
        <div>
          <p className="text-gray-500 text-xs md:text-sm mb-1">{stat.label}</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? '100%' : '0%' }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

// Quick Actions Component
const QuickActions = React.memo(({ stats }) => {
  const actions = [
    { href: "/projects", label: "Review Projects", count: stats.pendingProjects, icon: "📋", color: "blue" },
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
          <Link key={index} href={action.href} prefetch={true}>
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
        ))}
      </div>
    </div>
  );
});

QuickActions.displayName = 'QuickActions';

// Recent Activities Component
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
              {activities.length} total
            </span>
          )}
        </h2>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-125 overflow-y-auto">
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
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500 text-sm">No recent activities</p>
          </div>
        )}
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

// Pending Tasks Component
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
            <Link key={index} href={task.link}>
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
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-gray-500 text-sm">All caught up! No pending tasks.</p>
          </div>
        )}
      </div>
    </div>
  );
});

PendingTasks.displayName = 'PendingTasks';

// Platform Analytics Component
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
        <div className="mt-6 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer">
          View detailed analytics
          <span>→</span>
        </div>
      </Link>
    </div>
  );
});

PlatformAnalytics.displayName = 'PlatformAnalytics';

// System Status Component
const StatusRow = React.memo(({ label, value, isGood, icon }) => {
  const getStatusColor = () => {
    if (isGood === undefined) return "text-gray-900";
    return isGood ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className={`text-sm font-medium ${getStatusColor()} flex items-center gap-1`}>
        <span className={`inline-block w-2 h-2 rounded-full ${isGood ? 'bg-green-500' : isGood === false ? 'bg-red-500' : 'bg-gray-400'}`} />
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
          <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            All Systems Operational
          </div>
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

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      {/* Header Skeleton */}
      <div className="mb-6 md:mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-4"></div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);