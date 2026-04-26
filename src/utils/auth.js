// utils/auth.js

// Helper function for conditional logging
const log = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

// Set token in localStorage
export const setToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    log("Token stored:", token);
  }
};

// Get token from localStorage
export const getToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (process.env.NODE_ENV === 'development') {
      log("Token retrieved:", token ? `${token.substring(0, 20)}...` : "No token");
    }
    return token;
  }
  return null;
};

// Remove token and user data from localStorage
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");
    log("Token and user data removed");
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('authCleared'));
  }
};

// Set user in localStorage
export const setUser = (user) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
    log("User stored:", user);
    
    // Dispatch event for profile updates
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: user }));
  }
};

// Get user from localStorage
export const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  const isAuth = !!(token && user);
  
  if (process.env.NODE_ENV === 'development') {
    log("Is authenticated:", isAuth);
  }
  
  return isAuth;
};

// Set both token and user at once
export const setAuthData = (token, user, rememberMe = false) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
    }

    log("Auth data stored successfully");
    log("User role:", user.role);
    
    // Dispatch event for auth changes
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { token, user } }));
  }
};

// Clear all auth data
export const clearAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");
    log("All auth data cleared");
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('authCleared'));
  }
};

// Update user profile data in localStorage
export const updateUserProfile = (updatedData) => {
  if (typeof window !== "undefined") {
    const currentUser = getUser();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        ...updatedData,
        // Ensure nested objects are properly merged
        stats: { ...currentUser.stats, ...updatedData.stats },
        socials: { ...currentUser.socials, ...updatedData.socials }
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      log("User profile updated in storage:", updatedUser);
      
      // Dispatch event for real-time updates
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedUser }));
      
      return updatedUser;
    }
  }
  return null;
};

// Get specific user data by key
export const getUserData = (key) => {
  const user = getUser();
  if (user && key) {
    return user[key];
  }
  return user;
};

// Update specific user field
export const updateUserField = (field, value) => {
  if (typeof window !== "undefined") {
    const currentUser = getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, [field]: value };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
      return updatedUser;
    }
  }
  return null;
};

// Subscribe to user updates (for React components)
export const subscribeToUserUpdates = (callback) => {
  if (typeof window !== "undefined") {
    const handleUserUpdate = (event) => {
      callback(event.detail);
    };
    
    window.addEventListener('userUpdated', handleUserUpdate);
    window.addEventListener('profileUpdated', handleUserUpdate);
    window.addEventListener('authChanged', handleUserUpdate);
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
      window.removeEventListener('profileUpdated', handleUserUpdate);
      window.removeEventListener('authChanged', handleUserUpdate);
    };
  }
  return () => {};
};

// Subscribe to auth cleared events
export const subscribeToAuthCleared = (callback) => {
  if (typeof window !== "undefined") {
    const handleAuthCleared = () => {
      callback();
    };
    
    window.addEventListener('authCleared', handleAuthCleared);
    
    return () => {
      window.removeEventListener('authCleared', handleAuthCleared);
    };
  }
  return () => {};
};

// Get user avatar with fallback
export const getUserAvatar = () => {
  const user = getUser();
  if (user?.avatar && user.avatar !== '') {
    return user.avatar;
  }
  if (user?.profileImage && user.profileImage !== '') {
    return user.profileImage;
  }
  return null;
};

// Get user display name
export const getUserDisplayName = () => {
  const user = getUser();
  return user?.fullName || user?.name || user?.username || 'User';
};

// Get user initials for avatar fallback
export const getUserInitials = () => {
  const name = getUserDisplayName();
  if (!name || name === 'User') return 'U';
  
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Get user role
export const getUserRole = () => {
  const user = getUser();
  return user?.role || user?.userType || 'user';
};

// Check if user is admin
export const isAdmin = () => {
  const role = getUserRole();
  return role === 'admin' || role === 'Administrator';
};

// Get auth headers for API calls
export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Refresh user data from server
export const refreshUserData = async () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://server.nybff.us';
    const response = await fetch(`${API_URL}/api/users/profile`, {
      headers: getAuthHeaders()
    });
    
    const data = await response.json();
    if (data.success && data.user) {
      setUser(data.user);
      return data.user;
    }
    return null;
  } catch (error) {
    console.error('Error refreshing user data:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
    return expirationTime < Date.now();
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Validate token and refresh if needed
export const validateAndRefreshToken = async () => {
  if (isTokenExpired()) {
    clearAuthData();
    return false;
  }
  return true;
};