"use client";

import Footer from "@/components/shared/Footer/Footer";
import Header from "@/components/shared/Header/Header";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://server.nybff.us"}/api/auth/logout`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("rememberMe");

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/login";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            {/* Outer spinner ring - Green */}
            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-[#1EB97A] mx-auto"></div>
            
            {/* Inner gradient dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-[#1EB97A] to-emerald-500 rounded-full animate-pulse shadow-lg shadow-[#1EB97A]/50"></div>
            </div>
            
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full border-2 border-[#1EB97A]/30 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-2 border-[#1EB97A]/15 animate-ping delay-300"></div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 space-y-2"
          >
            <p className="text-gray-400 font-medium">Loading your dashboard...</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-1.5 h-1.5 bg-[#1EB97A] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-[#1EB97A] rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-[#1EB97A] rounded-full animate-bounce delay-200"></div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Animated Background Pattern - Dark Theme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top right glow - green gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#1EB97A]/15 to-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Bottom left glow - blue/purple gradient */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        {/* Center glow - white/gray */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-gradient-to-r from-white/3 to-transparent rounded-full blur-3xl"></div>
        
        {/* Additional accent glows */}
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-[#1EB97A]/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header - Dark theme sticky */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <Header onLogout={handleLogout} user={user} />
      </div>

      {/* Main Content with animation */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
        id="main-content"
      >
        {/* Welcome Banner for Dashboard Home - Dark Theme */}
        {user && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r mt-20 from-[#1EB97A] to-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-[#1EB97A]/20 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/20 rounded-full blur-2xl -ml-20 -mb-20"></div>
              
              <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1 tracking-tight">
                    Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                  </h1>
                  <p className="text-emerald-100 text-sm sm:text-base">
                    Ready to create something amazing today? Let's get started.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/20">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="text-sm font-medium text-white">Active</span>
                </div>
              </div>
              
              {/* Quick stats row */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/20 relative z-10">
                <div className="text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-xs text-emerald-100 opacity-80">Profile Complete</div>
                </div>
                <div className="text-center border-l border-r border-white/20">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-xs text-emerald-100 opacity-80">Support Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">Secure</div>
                  <div className="text-xs text-emerald-100 opacity-80">Encrypted Data</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Page Content - Dark Theme Card Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={typeof window !== 'undefined' ? window.location.pathname : 'default'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="">
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* Footer - Dark Theme */}
      <Footer />
    </div>
  );
}