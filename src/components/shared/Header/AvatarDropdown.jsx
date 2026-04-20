"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    User,
    Settings,
    LogOut,
    Shield,
    Award,
    Film,
    Heart,
    ChevronDown
} from "lucide-react";
import { clearAuthData, getUser, subscribeToUserUpdates } from "@/utils/auth";

const AvatarDropdown = ({ userAvatar, userName, userInitials }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const dropdownRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        // Load user data
        const loadUser = () => {
            const userData = getUser();
            setUser(userData);
        };

        loadUser();

        // Subscribe to user updates
        const unsubscribe = subscribeToUserUpdates((updatedUser) => {
            setUser(updatedUser);
        });

        // Handle click outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            unsubscribe();
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        setIsOpen(false);
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://server.nybff.us'}/api/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuthData();
            router.push('/login');
        }
    };

    const getRoleIcon = () => {
        if (user?.role === 'admin') {
            return <Shield className="w-4 h-4" />;
        }
        return <User className="w-4 h-4" />;
    };

    const getAvatarContent = () => {
        if (userAvatar) {
            return (
                <img
                    src={userAvatar}
                    alt={userName || 'User'}
                    className="w-full h-full object-cover rounded-full"
                />
            );
        }
        return <span className="text-sm font-semibold">{userInitials || 'U'}</span>;
    };

    const getDisplayName = () => {
        return user?.fullName || user?.name || userName || 'User';
    };

    const getDisplayEmail = () => {
        return user?.email || '';
    };

    const getMemberSince = () => {
        if (user?.createdAt) {
            return new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
        return null;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button with Dropdown Indicator */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 focus:outline-none group"
                aria-label="User menu"
                aria-expanded={isOpen}
            >
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden shadow-md transition-all duration-200 group-hover:shadow-lg group-hover:scale-105">
                        {getAvatarContent()}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                {/* Dropdown arrow indicator */}
                <ChevronDown 
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                    {/* User Info Header */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg overflow-hidden shadow-md">
                                {userAvatar ? (
                                    <img src={userAvatar} alt={getDisplayName()} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{userInitials || 'U'}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">{getDisplayName()}</p>
                                <p className="text-xs text-gray-500 break-all">{getDisplayEmail()}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                        {getRoleIcon()}
                                        <span>{user?.role === 'admin' ? 'Administrator' : 'Member'}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        {getMemberSince() && (
                            <p className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200">
                                Member since {getMemberSince()}
                            </p>
                        )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <User className="w-4 h-4 text-gray-400" />
                            <span>Your Profile</span>
                        </Link>

                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Film className="w-4 h-4 text-gray-400" />
                            <span>Dashboard</span>
                        </Link>

                        <Link
                            href="/projects"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Award className="w-4 h-4 text-gray-400" />
                            <span>My Submissions</span>
                        </Link>

                        {/* <Link
                            href="/submissions"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Heart className="w-4 h-4 text-gray-400" />
                            <span>Submissions</span>
                        </Link> */}

                        <Link
                            href="/settings"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Settings className="w-4 h-4 text-gray-400" />
                            <span>Settings</span>
                        </Link>
                    </div>

                    {/* Admin Section (if admin) */}
                    {user?.role === 'admin' && (
                        <div className="border-t border-gray-100 py-2">
                            <div className="px-4 py-1">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin</p>
                            </div>
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Shield className="w-4 h-4 text-purple-500" />
                                <span>Admin Dashboard</span>
                            </Link>
                            <Link
                                href="/admin/all-users"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <UsersIcon className="w-4 h-4 text-purple-500" />
                                <span>Manage Users</span>
                            </Link>
                        </div>
                    )}

                    {/* Logout Button */}
                    <div className="border-t border-gray-100 py-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Users icon component
const UsersIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

export default AvatarDropdown;