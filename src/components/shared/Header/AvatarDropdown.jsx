"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Settings,
    LogOut,
    Shield,
    Award,
    Film,
    Heart,
    ChevronDown,
    Calendar,
    Mail,
    UserCheck
} from "lucide-react";
import { clearAuthData, getUser, subscribeToUserUpdates } from "@/utils/auth";

const AvatarDropdown = ({ userAvatar, userName, userInitials }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const dropdownRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const loadUser = () => {
            const userData = getUser();
            setUser(userData);
        };

        loadUser();

        const unsubscribe = subscribeToUserUpdates((updatedUser) => {
            setUser(updatedUser);
        });

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
                await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://server.nybff.us'}/api/auth/logout`, {
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
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#1EB97A] to-emerald-600 flex items-center justify-center text-white font-semibold overflow-hidden shadow-md transition-all duration-200 group-hover:shadow-lg group-hover:scale-105">
                        {getAvatarContent()}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                </div>
                
                {/* Dropdown arrow indicator */}
                <ChevronDown 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu - Dark Theme */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-80 bg-linear-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 overflow-hidden z-50 shadow-2xl"
                    >
                        {/* User Info Header - Dark Theme */}
                        <div className="p-4 bg-linear-to-r from-[#1EB97A]/10 to-emerald-500/10 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#1EB97A] to-emerald-600 flex items-center justify-center text-white font-semibold text-lg overflow-hidden shadow-lg">
                                    {userAvatar ? (
                                        <img src={userAvatar} alt={getDisplayName()} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{userInitials || 'U'}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-white">{getDisplayName()}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <Mail className="w-3 h-3 text-gray-500" />
                                        <p className="text-xs text-gray-400 break-all">{getDisplayEmail()}</p>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1.5">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#1EB97A]/20 text-[#1EB97A] border border-[#1EB97A]/30">
                                            {getRoleIcon()}
                                            <span>{user?.role === 'admin' ? 'Administrator' : 'Member'}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {getMemberSince() && (
                                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-800">
                                    <Calendar className="w-3 h-3 text-gray-500" />
                                    <p className="text-xs text-gray-500">
                                        Member since {getMemberSince()}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Menu Items - Dark Theme */}
                        <div className="py-2">
                            <Link
                                href="/profile"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors group"
                                onClick={() => setIsOpen(false)}
                            >
                                <User className="w-4 h-4 text-gray-500 group-hover:text-[#1EB97A] transition-colors" />
                                <span className="group-hover:text-white">Your Profile</span>
                            </Link>

                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors group"
                                onClick={() => setIsOpen(false)}
                            >
                                <Film className="w-4 h-4 text-gray-500 group-hover:text-[#1EB97A] transition-colors" />
                                <span className="group-hover:text-white">Dashboard</span>
                            </Link>

                            <Link
                                href="/projects"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors group"
                                onClick={() => setIsOpen(false)}
                            >
                                <Award className="w-4 h-4 text-gray-500 group-hover:text-[#1EB97A] transition-colors" />
                                <span className="group-hover:text-white">My Submissions</span>
                            </Link>

                            <Link
                                href="/settings"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors group"
                                onClick={() => setIsOpen(false)}
                            >
                                <Settings className="w-4 h-4 text-gray-500 group-hover:text-[#1EB97A] transition-colors" />
                                <span className="group-hover:text-white">Settings</span>
                            </Link>
                        </div>

                        {/* Admin Section (if admin) - Dark Theme */}
                        {user?.role === 'admin' && (
                            <div className="border-t border-gray-800 py-2">
                                <div className="px-4 py-1">
                                    <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                                        <Shield className="w-3 h-3" />
                                        Admin Panel
                                    </p>
                                </div>
                                <Link
                                    href="/admin/dashboard"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors group"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Shield className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                                    <span className="group-hover:text-white">Admin Dashboard</span>
                                </Link>
                                <Link
                                    href="/admin/all-users"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors group"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <UsersIcon className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                                    <span className="group-hover:text-white">Manage Users</span>
                                </Link>
                                <Link
                                    href="/admin/all-submissions"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors group"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Film className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                                    <span className="group-hover:text-white">All Submissions</span>
                                </Link>
                            </div>
                        )}

                        {/* Logout Button - Dark Theme */}
                        <div className="border-t border-gray-800 py-2">
                            <button
                                onClick={handleLogout}
                                className="w-full flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-emerald-400 hover:bg-emerald-500/10 transition-colors group"
                            >
                                <LogOut className="w-4 h-4 group-hover:text-emerald-300" />
                                <span className="group-hover:text-emerald-300">Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
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