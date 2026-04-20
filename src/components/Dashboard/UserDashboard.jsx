"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken, getUser, clearAuthData, subscribeToUserUpdates, getUserInitials } from '@/utils/auth';
import Image from 'next/image';

export default function UserDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [connectionError, setConnectionError] = useState(false);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        // Create abort controller for this effect
        abortControllerRef.current = new AbortController();

        const loadUserData = async () => {
            const token = getToken();
            let userData = getUser();

            console.log('=== Dashboard Debug Info ===');
            console.log('Token:', token ? 'Present' : 'Missing');
            console.log('User Data:', userData);
            console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

            if (!token || !userData) {
                console.log('No auth data, redirecting to login');
                if (isMounted) {
                    router.replace('/login');
                }
                return;
            }

            // Set user data from localStorage first
            if (isMounted) {
                setUser(userData);
                setLoading(false);
            }

            // Try to fetch fresh user data from API (non-blocking)
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

                // Add timeout to fetch
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

                    // Update localStorage
                    localStorage.setItem('user', JSON.stringify(updatedUserData));

                    if (isMounted) {
                        setUser(updatedUserData);
                        setConnectionError(false);
                    }
                    console.log('Fetched fresh user data:', updatedUserData);
                }
            } catch (error) {
                if (!isMounted) return;

                // Don't log abort errors as they're expected
                if (error.name === 'AbortError') {
                    console.log('Request was aborted (timeout or cleanup)');
                    return;
                }

                console.error('Error fetching fresh user data:', error);
                if (error.message === 'Failed to fetch') {
                    console.log('Cannot connect to server');
                    setConnectionError(true);
                }
                // Don't redirect - keep using cached user data
            }
        };

        loadUserData();

        // Subscribe to user profile updates
        const unsubscribe = subscribeToUserUpdates((updatedUser) => {
            console.log('User profile updated in real-time:', updatedUser);
            if (isMounted) {
                setUser(updatedUser);
            }
        });

        // Listen for storage events
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

        // Cleanup function
        return () => {
            isMounted = false;
            // Only abort if controller exists and hasn't been aborted already
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
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                // Use a shorter timeout for logout
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
            // Ignore abort errors for logout
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
        { id: 'submissions', name: 'Submissions', icon: '📄', href: '/submissions' },
        { id: 'profile', name: 'Profile', icon: '⚙️', href: '/profile' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Header Skeleton */}
                    <div className="mb-8">
                        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                        <div className="h-4 w-96 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Stats Cards Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                                    <div className="w-16 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                                <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                                <div className="h-4 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="flex-1">
                                        <div className="h-5 w-32 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                                        <div className="h-4 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                                    <div className="h-4 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
                                    <div className="h-4 w-1/2 bg-gray-200 rounded-lg animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                                    <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Connection Warning Banner */}
            {connectionError && (
                <div className="bg-yellow-50 border-b border-yellow-200">
                    <div className="container mx-auto px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="text-sm text-yellow-700">
                                    Using cached data. Unable to connect to server.
                                </span>
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="text-sm text-yellow-700 hover:text-yellow-900 underline"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Sidebar */}
                    <div className="col-span-12 md:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-8">
                            {/* Profile Section */}
                            <div className="p-6 text-center border-b border-gray-100">
                                <div className="relative inline-block">
                                    <div className="w-24 h-24 mx-auto bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name || 'User'}
                                                className="w-full h-full object-cover"
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
                                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                                </div>

                                <h3 className="mt-4 text-gray-900 font-semibold text-lg">
                                    {user?.fullName || user?.name || 'User'}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    {user?.title || 'Creative Professional'}
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                    {user?.email || 'user@example.com'}
                                </p>

                                <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {user?.role === 'admin' ? 'Administrator' : (user?.role || 'User')}
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <nav className="p-4 space-y-1">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${activeTab === item.id
                                                ? 'bg-blue-50 text-blue-700 shadow-sm'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                            }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="text-sm font-medium flex-1">
                                            {item.name}
                                        </span>
                                        {activeTab === item.id && (
                                            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                                        )}
                                    </Link>
                                ))}
                            </nav>

                            {/* Logout Button */}
                            <div className="p-4 border-t border-gray-200">
                                <button
                                    onClick={handleLogout}
                                    className="flex cursor-pointer items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 w-full group"
                                >
                                    <span className="text-xl">🚪</span>
                                    <span className="text-sm font-medium flex-1 text-left">
                                        Logout
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="col-span-12 md:col-span-9">
                        {/* Welcome Header */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Here's what's happening with your account today.
                                    </p>
                                </div>
                                <div>
                                    {/* {user?.avatar && (
                                        <div className="w-16 h-16 rounded-full overflow-hidden hidden md:block">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )} */}
                                    <div>
                                        <Link
                                            href="/projects/drop-project"
                                            className="bg-[#1EB97A] hover:bg-[#189663] text-white px-6 py-2.5 rounded-md font-semibold flex items-center gap-2 transition-all shadow-sm w-fit"
                                        >
                                            <span className="text-xl">+</span> Add New Project
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Account Information
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">User ID</label>
                                        <p className="text-sm text-gray-900 mt-1 font-mono">{user?.id || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Full Name</label>
                                        <p className="text-sm text-gray-900 mt-1 font-semibold">{user?.fullName || user?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Professional Title</label>
                                        <p className="text-sm text-gray-900 mt-1">{user?.title || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Role</label>
                                        <p className="text-sm text-gray-900 mt-1">
                                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {user?.role === 'admin' ? 'Administrator' : (user?.role || 'User')}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                                        <p className="text-sm text-gray-900 mt-1 break-all">{user?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Location</label>
                                        <p className="text-sm text-gray-900 mt-1">{user?.location || 'Not specified'}</p>
                                    </div>
                                    {user?.bio && (
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-medium text-gray-500 uppercase">Bio</label>
                                            <p className="text-sm text-gray-900 mt-1">{user.bio}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Quick Actions
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => router.push('/profile')}
                                        className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition group"
                                    >
                                        <div className="text-3xl mb-2">👤</div>
                                        <p className="font-medium text-gray-900">My Profile</p>
                                        <p className="text-xs text-gray-600 mt-1">View and edit your profile</p>
                                    </button>
                                    <button
                                        onClick={() => router.push('/projects')}
                                        className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition group"
                                    >
                                        <div className="text-3xl mb-2">🎬</div>
                                        <p className="font-medium text-gray-900">My Projects</p>
                                        <p className="text-xs text-gray-600 mt-1">Manage your projects</p>
                                    </button>
                                    <button
                                        onClick={() => router.push('/submissions')}
                                        className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition group"
                                    >
                                        <div className="text-3xl mb-2">📄</div>
                                        <p className="font-medium text-gray-900">Submissions</p>
                                        <p className="text-xs text-gray-600 mt-1">View your submissions</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}