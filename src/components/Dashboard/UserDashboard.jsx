"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken, getUser, clearAuthData, subscribeToUserUpdates, getUserInitials } from '@/utils/auth';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [connectionError, setConnectionError] = useState(false);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        abortControllerRef.current = new AbortController();

        const loadUserData = async () => {
            const token = getToken();
            let userData = getUser();

            console.log('=== Dashboard Debug Info ===');
            console.log('Token:', token ? 'Present' : 'Missing');
            console.log('User Data:', userData);
            console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://server.nybff.us');

            if (!token || !userData) {
                console.log('No auth data, redirecting to login');
                if (isMounted) {
                    router.replace('/login');
                }
                return;
            }

            if (isMounted) {
                setUser(userData);
                setLoading(false);
            }

            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://server.nybff.us';

                const timeoutId = setTimeout(() => {
                    if (abortControllerRef.current && isMounted) {
                        abortControllerRef.current.abort();
                    }
                }, 10000);

                const response = await fetch(`${API_URL}/api/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    signal: abortControllerRef.current.signal
                });

                clearTimeout(timeoutId);

                if (!isMounted) return;

                if (response.ok) {
                    const data = await response.json();
                    const freshUserData = data.data || data.user || data;

                    const updatedUserData = {
                        id: freshUserData.id || freshUserData._id,
                        name: freshUserData.name || freshUserData.fullName,
                        fullName: freshUserData.fullName || freshUserData.name,
                        email: freshUserData.email,
                        role: freshUserData.role,
                        avatar: freshUserData.avatar || freshUserData.profileImage,
                        title: freshUserData.title,
                        bio: freshUserData.bio,
                        location: freshUserData.location,
                        phone: freshUserData.phone,
                        website: freshUserData.website,
                        createdAt: freshUserData.createdAt,
                        stats: freshUserData.stats,
                        socials: freshUserData.socials || freshUserData.socialMedia,
                        skills: freshUserData.skills,
                        experience: freshUserData.experience
                    };

                    localStorage.setItem('user', JSON.stringify(updatedUserData));

                    if (isMounted) {
                        setUser(updatedUserData);
                        setConnectionError(false);
                    }
                    console.log('Fetched fresh user data:', updatedUserData);
                }
            } catch (error) {
                if (!isMounted) return;

                if (error.name === 'AbortError') {
                    console.log('Request was aborted (timeout or cleanup)');
                    return;
                }

                console.error('Error fetching fresh user data:', error);
                if (error.message === 'Failed to fetch') {
                    console.log('Cannot connect to server');
                    setConnectionError(true);
                }
            }
        };

        loadUserData();

        const unsubscribe = subscribeToUserUpdates((updatedUser) => {
            console.log('User profile updated in real-time:', updatedUser);
            if (isMounted) {
                setUser(updatedUser);
            }
        });

        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                console.log('Storage changed, refreshing user data...');
                const freshUser = getUser();
                if (freshUser && isMounted) {
                    setUser(freshUser);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            isMounted = false;
            if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
                try {
                    abortControllerRef.current.abort();
                } catch (e) {
                    console.log('Error aborting fetch:', e);
                }
            }
            abortControllerRef.current = null;
            unsubscribe();
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [router]);

    const handleLogout = async () => {
        console.log('Logging out...');
        try {
            const token = getToken();
            if (token) {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://server.nybff.us';
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                await fetch(`${API_URL}/api/auth/logout`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Logout error:', error);
            }
        } finally {
            clearAuthData();
            console.log('Redirecting to login...');
            router.push('/login');
        }
    };

    const navigationItems = [
        { id: 'overview', name: 'Dashboard Overview', icon: '📊', href: '/dashboard' },
        { id: 'projects', name: 'My Projects', icon: '🎬', href: '/projects' },
        { id: 'settings', name: 'Settings', icon: '⚙️', href: '/settings' },
        { id: 'profile', name: 'Profile', icon: '👤', href: '/profile' }
    ];

    const getGradient = (type) => {
        const gradients = {
            projects: "from-[#1EB97A] to-emerald-600",
            submissions: "from-blue-500 to-cyan-500",
            selections: "from-amber-500 to-orange-500",
            awards: "from-purple-500 to-pink-500"
        };
        return gradients[type] || "from-gray-500 to-gray-600";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black">
                <div className="mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="h-10 w-64 bg-linear-to-r from-gray-800 to-gray-700 rounded-xl animate-pulse mb-3"></div>
                        <div className="h-5 w-96 bg-linear-to-r from-gray-800 to-gray-700 rounded-lg animate-pulse"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-linear-to-br from-gray-800 to-gray-700 rounded-xl animate-pulse"></div>
                                    <div className="w-16 h-6 bg-linear-to-r from-gray-800 to-gray-700 rounded-full animate-pulse"></div>
                                </div>
                                <div className="h-8 w-20 bg-linear-to-r from-gray-800 to-gray-700 rounded-lg animate-pulse mb-2"></div>
                                <div className="h-4 w-32 bg-linear-to-r from-gray-800 to-gray-700 rounded-lg animate-pulse"></div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-linear-to-br from-gray-800 to-gray-700 rounded-full animate-pulse"></div>
                                    <div className="flex-1">
                                        <div className="h-5 w-32 bg-linear-to-r from-gray-800 to-gray-700 rounded-lg animate-pulse mb-2"></div>
                                        <div className="h-4 w-24 bg-linear-to-r from-gray-800 to-gray-700 rounded-lg animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 w-full bg-linear-to-r from-gray-800 to-gray-700 rounded-lg animate-pulse"></div>
                                    <div className="h-4 w-3/4 bg-linear-to-r from-gray-800 to-gray-700 rounded-lg animate-pulse"></div>
                                    <div className="h-4 w-1/2 bg-linear-to-r from-gray-800 to-gray-700 rounded-lg animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                                <div className="h-6 w-40 bg-linear-to-r from-gray-800 to-gray-700 rounded-lg animate-pulse mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-20 bg-linear-to-r from-gray-800 to-gray-700 rounded-xl animate-pulse"></div>
                                    <div className="h-20 bg-linear-to-r from-gray-800 to-gray-700 rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black ">
            {/* Connection Warning Banner */}
            <AnimatePresence>
                {connectionError && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-amber-500/10 border-b border-amber-500/20 backdrop-blur-sm"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-amber-400">
                                        Using cached data. Unable to connect to server.
                                    </span>
                                </div>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="text-sm text-amber-400 hover:text-amber-300 font-medium underline"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto py-8">
                <div className="grid grid-cols-12 gap-8">
                    {/* Left Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="col-span-12 md:col-span-3"
                    >
                        <div className="bg-linear-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 overflow-hidden shadow-xl sticky top-8">
                            {/* Profile Section */}
                            <div className="p-6 text-center bg-linear-to-br from-[#1EB97A]/10 to-emerald-500/10 border-b border-gray-800">
                                <div className="relative inline-block">
                                    <div className="w-24 h-24 mx-auto bg-linear-to-br from-[#1EB97A] to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-gray-800">
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name || 'User'}
                                                className="w-full h-full object-cover rounded-full"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    const parent = e.target.parentElement;
                                                    if (parent) {
                                                        parent.innerHTML = `<span className="text-3xl font-bold">${getUserInitials()}</span>`;
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <span className="text-3xl font-bold">
                                                {getUserInitials()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                                </div>

                                <h3 className="mt-4 text-white font-bold text-lg">
                                    {user?.fullName || user?.name || 'User'}
                                </h3>
                                <p className="text-gray-400 text-sm mt-1">
                                    {user?.title || 'Creative Professional'}
                                </p>
                                <p className="text-gray-500 text-xs mt-1 break-all">
                                    {user?.email || 'user@example.com'}
                                </p>

                                <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-linear-to-r from-[#1EB97A]/20 to-emerald-500/20 text-[#1EB97A] border border-[#1EB97A]/30">
                                    {user?.role === 'admin' ? '👑 Administrator' : (user?.role === 'user' ? '🎬 Filmmaker' : (user?.role || 'User'))}
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <nav className="p-4 space-y-1">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                                            ? 'bg-linear-to-r from-[#1EB97A]/20 to-emerald-500/20 text-[#1EB97A] border border-[#1EB97A]/30'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                            }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="text-sm font-medium flex-1">
                                            {item.name}
                                        </span>
                                        {activeTab === item.id && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="w-1 h-6 bg-linear-to-b from-[#1EB97A] to-emerald-500 rounded-full"
                                            ></motion.div>
                                        )}
                                    </Link>
                                ))}
                            </nav>

                            {/* Logout Button */}
                            <div className="p-4 border-t border-gray-800">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200 w-full group hover:text-emerald-300"
                                >
                                    <span className="text-xl">🚪</span>
                                    <span className="text-sm font-medium flex-1 text-left">
                                        Logout
                                    </span>
                                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content */}
                    <div className="col-span-12 md:col-span-9 space-y-6">
                        {/* Welcome Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="bg-linear-to-r from-[#1EB97A] to-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-[#1EB97A]/20"
                        >
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold mb-1">
                                        Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                                    </h1>
                                    <p className="text-emerald-100 text-sm">
                                        Here's what's happening with your account today.
                                    </p>
                                </div>
                                <Link
                                    href="/projects/submit-film"
                                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    New Project
                                </Link>
                            </div>
                        </motion.div>

                        {/* Stats Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                        >
                            {[
                                { label: 'Projects', value: user?.stats?.projects || 0, icon: '🎬', type: 'projects' },
                                { label: 'Submissions', value: user?.stats?.submissions || 0, icon: '📄', type: 'submissions' },
                                { label: 'Selections', value: user?.stats?.selections || 0, icon: '🏆', type: 'selections' },
                                { label: 'Awards', value: user?.stats?.awards || 0, icon: '⭐', type: 'awards' }
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-linear-to-br from-gray-900 to-gray-950 rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`w-10 h-10 bg-linear-to-br ${getGradient(stat.type)} rounded-xl flex items-center justify-center text-xl shadow-lg`}>
                                            {stat.icon}
                                        </div>
                                        <span className="text-2xl font-bold text-white">{stat.value}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* Quick Actions Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            className="bg-linear-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-800 bg-linear-to-r from-gray-900 to-gray-950">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[#1EB97A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Quick Actions
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => router.push('/profile')}
                                        className="group p-5 bg-linear-to-br from-gray-800 to-gray-900 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-[#1EB97A]/30"
                                    >
                                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👤</div>
                                        <p className="font-semibold text-white">My Profile</p>
                                        <p className="text-xs text-gray-500 mt-1">View and edit your profile</p>
                                    </button>
                                    <button
                                        onClick={() => router.push('/projects')}
                                        className="group p-5 bg-linear-to-br from-gray-800 to-gray-900 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-[#1EB97A]/30"
                                    >
                                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎬</div>
                                        <p className="font-semibold text-white">My Projects</p>
                                        <p className="text-xs text-gray-500 mt-1">Manage your projects</p>
                                    </button>
                                    <button
                                        onClick={() => router.push('/submissions')}
                                        className="group p-5 bg-linear-to-br from-gray-800 to-gray-900 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-[#1EB97A]/30"
                                    >
                                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📄</div>
                                        <p className="font-semibold text-white">Submissions</p>
                                        <p className="text-xs text-gray-500 mt-1">View your submissions</p>
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Account Information Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="bg-linear-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                            <div className="px-6 py-5 border-b border-gray-800 bg-linear-to-r from-gray-900 to-gray-950">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <div className="w-8 h-8 bg-linear-to-br from-[#1EB97A] to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        Account Information
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[#1EB97A] rounded-full animate-pulse"></div>
                                        <span className="text-xs text-gray-500">Active</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* User ID */}
                                    <div className="group">
                                        <div className="flex items-center gap-2 mb-1">
                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                            </svg>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">User ID</label>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700 group-hover:border-[#1EB97A]/30 transition-colors">
                                            <code className="text-sm font-mono text-gray-300">{user?.id?.slice(-12) || 'N/A'}</code>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(user?.id)}
                                                className="ml-2 text-gray-500 hover:text-[#1EB97A] transition-colors"
                                                title="Copy ID"
                                            >
                                                <svg className="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Full Name */}
                                    <div className="group">
                                        <div className="flex items-center gap-2 mb-1">
                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                                            <p className="text-sm font-semibold text-white">{user?.fullName || user?.name || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Professional Title */}
                                    <div className="group">
                                        <div className="flex items-center gap-2 mb-1">
                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Professional Title</label>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                                            <p className="text-sm text-gray-300">{user?.title || 'Not specified'}</p>
                                        </div>
                                    </div>

                                    {/* Email Address */}
                                    <div className="group">
                                        <div className="flex items-center gap-2 mb-1">
                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700 group-hover:border-[#1EB97A]/30 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-300 break-all">{user?.email || 'N/A'}</p>
                                                {user?.email && (
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(user.email)}
                                                        className="text-gray-500 hover:text-[#1EB97A] transition-colors ml-2 shrink-0"
                                                        title="Copy Email"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="group">
                                        <div className="flex items-center gap-2 mb-1">
                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</label>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                                            <p className="text-sm text-gray-300">{user?.location || 'Not specified'}</p>
                                        </div>
                                    </div>

                                    {/* Member Since */}
                                    <div className="group">
                                        <div className="flex items-center gap-2 mb-1">
                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Member Since</label>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-300">
                                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                                                </span>
                                                {user?.createdAt && (
                                                    <span className="text-xs text-[#1EB97A] bg-[#1EB97A]/10 px-2 py-0.5 rounded-full">
                                                        {Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 30))}+ months
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bio Section - Full Width */}
                                {user?.bio && (
                                    <div className="mt-5 pt-4 border-t border-gray-800">
                                        <div className="flex items-center gap-2 mb-3">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                            </svg>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bio / About</label>
                                        </div>
                                        <div className="bg-linear-to-r from-[#1EB97A]/5 to-emerald-500/5 rounded-xl p-4 border border-[#1EB97A]/20">
                                            <p className="text-sm text-gray-300 leading-relaxed">{user.bio}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Verification Badge */}
                                <div className="mt-5 pt-4 border-t border-gray-800">
                                    <div className="flex items-center justify-between flex-wrap gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-[#1EB97A]/20 rounded-full flex items-center justify-center">
                                                <svg className="w-3.5 h-3.5 text-[#1EB97A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-xs text-gray-400">Email Verified</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <span className="text-xs text-gray-400">2FA Optional</span>
                                        </div>
                                        <Link href="/settings" className="text-xs text-[#1EB97A] hover:text-emerald-400 font-medium flex items-center gap-1">
                                            Edit Profile
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}