"use client";

import Link from 'next/link';
import React, { useState, useEffect, useCallback, useMemo, useRef, startTransition } from 'react';
import { toast } from 'react-hot-toast';

// Optimized UserTable Component
const UserTable = () => {
    // Batch state updates
    const [state, setState] = useState({
        searchTerm: "",
        users: [],
        loading: true,
        error: "",
        selectedRole: "all",
        selectedStatus: "all",
        currentUser: null,
        deletingId: null,
        updatingStatus: null
    });

    // Use refs for non-rendering data
    const abortControllerRef = useRef(null);
    const isMountedRef = useRef(true);
    const usersCacheRef = useRef(null);
    const filterTimeoutRef = useRef(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://server.nybff.us';

    // Batch state update helper
    const updateState = useCallback((updates) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    // Fast token getter
    const getToken = useCallback(() => {
        try {
            return localStorage.getItem('token');
        } catch {
            return null;
        }
    }, []);

    // Get user ID helper
    const getUserId = useCallback((user) => {
        return user._id || user.id;
    }, []);

    // Ultra-fast fetch with streaming
    const fetchUsers = useCallback(async (forceRefresh = false) => {
        const token = getToken();
        if (!token) {
            updateState({ error: "Please login again", loading: false });
            return;
        }

        // Instant cache check
        if (!forceRefresh && usersCacheRef.current) {
            updateState({ users: usersCacheRef.current, loading: false });
            // Fetch in background
            setTimeout(() => fetchUsers(true), 100);
            return;
        }

        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        try {
            updateState({ loading: true, error: "" });

            const response = await fetch(`${API_URL}/api/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` },
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error("Session expired");
                if (response.status === 403) throw new Error("Access denied");
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            // Fast parse
            let usersArray = [];
            if (Array.isArray(data)) usersArray = data;
            else if (data.users?.length) usersArray = data.users;
            else if (data.data?.length) usersArray = data.data;

            if (!usersArray.length) throw new Error("No users found");

            // Cache and update
            usersCacheRef.current = usersArray;

            // Use startTransition for non-blocking update
            startTransition(() => {
                updateState({ users: usersArray, loading: false, error: "" });
            });

        } catch (error) {
            if (error.name === 'AbortError') return;

            // Use cached data if available
            if (usersCacheRef.current) {
                updateState({ users: usersCacheRef.current, loading: false });
                toast.error("Using cached data");
            } else {
                updateState({ error: error.message, loading: false });
            }
        }
    }, [API_URL, getToken, updateState]);

    // Load current user instantly from token
    const loadCurrentUser = useCallback(() => {
        const token = getToken();
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                updateState({ currentUser: payload });
            } catch (error) {
                console.error("Token decode error:", error);
            }
        }
    }, [getToken, updateState]);

    // Initialize
    useEffect(() => {
        isMountedRef.current = true;

        // Load instantly from cache first
        if (usersCacheRef.current) {
            updateState({ users: usersCacheRef.current, loading: false });
        }

        fetchUsers();
        loadCurrentUser();

        // Refresh every 30 seconds in background
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchUsers(true);
            }
        }, 30000);

        return () => {
            isMountedRef.current = false;
            clearInterval(interval);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (filterTimeoutRef.current) {
                clearTimeout(filterTimeoutRef.current);
            }
        };
    }, [fetchUsers, loadCurrentUser, updateState]);

    // Fast delete
    const handleDeleteUser = useCallback(async (userId) => {
        if (!userId || !confirm('Delete this user?')) return;

        updateState({ deletingId: userId });

        try {
            const token = getToken();
            if (!token) throw new Error("No token");

            const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Delete failed");

            // Fast UI update
            const updatedUsers = state.users.filter(u => (u._id || u.id) !== userId);
            usersCacheRef.current = updatedUsers;
            updateState({ users: updatedUsers });
            toast.success("User deleted");

        } catch (error) {
            toast.error(error.message);
        } finally {
            updateState({ deletingId: null });
        }
    }, [API_URL, getToken, state.users, updateState]);

    // Fast status update
    const handleUpdateStatus = useCallback(async (userId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        if (!confirm(`${newStatus} this user?`)) return;

        updateState({ updatingStatus: userId });

        try {
            const token = getToken();
            if (!token) throw new Error("No token");

            const response = await fetch(`${API_URL}/api/admin/users/${userId}/status`, {
                method: "PATCH",
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ isActive: newStatus === 'active' })
            });

            if (!response.ok) throw new Error("Update failed");

            // Optimistic update
            const updatedUsers = state.users.map(user => {
                if ((user._id || user.id) === userId) {
                    return { ...user, isActive: newStatus === 'active', status: newStatus };
                }
                return user;
            });

            usersCacheRef.current = updatedUsers;
            updateState({ users: updatedUsers });
            toast.success(`User ${newStatus}d`);

        } catch (error) {
            toast.error(error.message);
        } finally {
            updateState({ updatingStatus: null });
        }
    }, [API_URL, getToken, state.users, updateState]);

    // Fast role update
    const handleUpdateRole = useCallback(async (userId, newRole) => {
        try {
            const token = getToken();
            if (!token) throw new Error("No token");

            const response = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
                method: "PATCH",
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ role: newRole })
            });

            if (!response.ok) throw new Error("Update failed");

            // Optimistic update
            const updatedUsers = state.users.map(user => {
                if ((user._id || user.id) === userId) {
                    return { ...user, role: newRole };
                }
                return user;
            });

            usersCacheRef.current = updatedUsers;
            updateState({ users: updatedUsers });
            toast.success(`Role updated to ${newRole}`);

        } catch (error) {
            toast.error(error.message);
        }
    }, [API_URL, getToken, state.users, updateState]);

    // Debounced search
    const handleSearch = useCallback((value) => {
        if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current);

        filterTimeoutRef.current = setTimeout(() => {
            updateState({ searchTerm: value });
        }, 300);
    }, [updateState]);

    // Fast filtered users (memoized)
    const displayedUsers = useMemo(() => {
        const { users, searchTerm, selectedRole, selectedStatus } = state;
        if (!users.length) return [];

        // Quick filter with early returns
        let filtered = users;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(user =>
                (user.name || user.fullName || '').toLowerCase().includes(term) ||
                (user.email || '').toLowerCase().includes(term)
            );
        }

        if (selectedRole !== "all") {
            filtered = filtered.filter(user => (user.role || 'user') === selectedRole);
        }

        if (selectedStatus !== "all") {
            filtered = filtered.filter(user => {
                const status = user.isActive !== undefined ? (user.isActive ? 'active' : 'inactive') : 'active';
                return status === selectedStatus;
            });
        }

        return filtered;
    }, [state.users, state.searchTerm, state.selectedRole, state.selectedStatus]);

    // Helper functions
    const getInitials = useCallback((name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }, []);

    // Show loading only on first load
    if (state.loading && !usersCacheRef.current) {
        return <FastLoadingSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header - Minimal */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Users Management</h1>
                        <p className="text-gray-600 text-sm mt-1">Currently users {state.users.length} total</p>
                    </div>
                    <Link
                        href="/admin/all-users/create"
                        className="mt-3 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add User
                    </Link>
                </div>

                {/* Filters - Compact */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                    {/* Search Bar */}
                    <div className="flex-1 min-w-50 relative">
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search users..."
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full text-black pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={state.selectedRole}
                        onChange={(e) => updateState({ selectedRole: e.target.value })}
                        className="px-3 py-2 text-black text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={state.selectedStatus}
                        onChange={(e) => updateState({ selectedStatus: e.target.value })}
                        className="px-3 py-2 text-black text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    {/* Refresh Button */}
                    <button
                        onClick={() => fetchUsers(true)}
                        className="px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition flex items-center gap-1"
                        title="Refresh users"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>

                {/* Users List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {displayedUsers.slice(0, 100).map((user, index) => {
                            const userId = getUserId(user);
                            const serialNumber = index + 1;

                            return (
                                <FastUserRow
                                    key={userId}
                                    user={user}
                                    serialNumber={serialNumber}
                                    currentUser={state.currentUser}
                                    updatingStatus={state.updatingStatus}
                                    deletingId={state.deletingId}
                                    onUpdateRole={handleUpdateRole}
                                    onUpdateStatus={handleUpdateStatus}
                                    onDeleteUser={handleDeleteUser}
                                    getInitials={getInitials}
                                />
                            );
                        })}

                        {displayedUsers.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-sm">No users found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Optimized User Row Component
// Optimized User Row Component with Fixed Avatar
const FastUserRow = React.memo(({
    user, serialNumber, currentUser, updatingStatus, deletingId,
    onUpdateRole, onUpdateStatus, onDeleteUser, getInitials
}) => {
    const [avatarError, setAvatarError] = useState(false);
    const [avatarLoaded, setAvatarLoaded] = useState(false);

    const userId = user._id || user.id;
    const userName = user.name || user.fullName || user.username || 'Unknown';
    const userEmail = user.email || '';
    const userRole = user.role || 'user';
    const userStatus = user.isActive !== undefined ? (user.isActive ? 'active' : 'inactive') : 'active';
    const joinDate = user.createdAt || user.joinDate;
    const isCurrentUser = currentUser && (currentUser.id === userId || currentUser._id === userId);
    const isUpdating = updatingStatus === userId;
    const isDeleting = deletingId === userId;

    // Get avatar URL from multiple possible fields
    const getAvatarUrl = () => {
        if (avatarError) return null;

        // Check all possible avatar fields
        const avatarSource = user.avatar || user.profileImage || user.photo || user.image || user.picture;

        if (!avatarSource) return null;

        // Check if it's a valid URL or base64
        if (avatarSource.startsWith('data:image') ||
            avatarSource.startsWith('http://') ||
            avatarSource.startsWith('https://') ||
            avatarSource.startsWith('/')) {
            return avatarSource;
        }

        return null;
    };

    const avatarUrl = getAvatarUrl();
    const showInitials = !avatarUrl || avatarError;

    return (
        <div className="hover:bg-gray-50 transition">
            <div className="px-4 py-3 flex flex-wrap items-center gap-3">
                {/* Serial Number */}
                <div className="min-w-10 text-center">
                    <span className="text-xs text-gray-400 font-mono">{serialNumber}</span>
                </div>

                {/* Avatar & Name */}
                <div className="flex items-center gap-2 min-w-37.5 flex-1">
                    {/* Avatar with proper image handling */}
                    {avatarUrl && !avatarError ? (
                        <div className="relative w-8 h-8 shrink-0">
                            <img
                                src={avatarUrl}
                                alt={userName}
                                className="w-full h-full rounded-full object-cover border border-gray-200"
                                onLoad={() => setAvatarLoaded(true)}
                                onError={() => {
                                    console.error("Avatar failed to load:", avatarUrl);
                                    setAvatarError(true);
                                }}
                                loading="lazy"
                            />
                            {!avatarLoaded && (
                                <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse" />
                            )}
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0 shadow-sm">
                            {getInitials(userName)}
                        </div>
                    )}

                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                        <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                    </div>
                </div>

                {/* Role */}
                <div className="min-w-25">
                    {isCurrentUser ? (
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                            {userRole}
                        </span>
                    ) : (
                        <select
                            value={userRole}
                            onChange={(e) => onUpdateRole(userId, e.target.value)}
                            className="text-xs px-2 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                        </select>
                    )}
                </div>

                {/* Status */}
                <div className="min-w-20">
                    {isCurrentUser ? (
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${userStatus === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {userStatus}
                        </span>
                    ) : (
                        <button
                            onClick={() => onUpdateStatus(userId, userStatus)}
                            disabled={isUpdating}
                            className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full transition ${userStatus === "active"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                                } ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            {isUpdating ? (
                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                userStatus
                            )}
                        </button>
                    )}
                </div>

                {/* Join Date */}
                <div className="min-w-25 text-xs text-gray-500 hidden sm:block">
                    {joinDate ? new Date(joinDate).toLocaleDateString() : 'N/A'}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 ml-auto">
                    <Link
                        href={`/admin/all-users/edit/${userId}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </Link>
                    <button
                        onClick={() => onDeleteUser(userId)}
                        disabled={isCurrentUser || isDeleting}
                        className={`p-1.5 cursor-pointer text-red-600 hover:bg-red-50 rounded transition ${isCurrentUser || isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
                        title={isCurrentUser ? "Cannot delete yourself" : "Delete"}
                    >
                        {isDeleting ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
});

FastUserRow.displayName = 'FastUserRow';

// Ultra-fast Loading Skeleton
const FastLoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48 mb-6"></div>

                <div className="bg-white rounded-lg shadow-sm p-3 mb-5">
                    <div className="h-10 bg-gray-100 rounded"></div>
                </div>

                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="bg-white rounded-lg p-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded w-48"></div>
                                </div>
                                <div className="w-20 h-6 bg-gray-200 rounded"></div>
                                <div className="w-16 h-6 bg-gray-200 rounded"></div>
                                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default UserTable;