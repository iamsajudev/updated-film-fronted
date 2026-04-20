// utils/auth.js

export const setToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    console.log("Token stored:", token);
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    console.log(
      "Token retrieved:",
      token ? `${token.substring(0, 20)}...` : "No token",
    );
    return token;
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");
    console.log("Token and user data removed");
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('authCleared'));
  }
};

export const setUser = (user) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
    console.log("User stored:", user);
    
    // Dispatch event for profile updates
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: user }));
  }
};

export const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const isAuthenticated = () => {
  const token = getToken();
  const isAuth = !!token;
  console.log("Is authenticated:", isAuth);
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

    console.log("Auth data stored successfully");
    console.log("User role:", user.role);
    
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
    console.log("All auth data cleared");
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('authCleared'));
  }
};

// NEW: Update user profile data in localStorage
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
      console.log("User profile updated in storage:", updatedUser);
      
      // Dispatch event for real-time updates
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedUser }));
      
      return updatedUser;
    }
  }
  return null;
};

// NEW: Get specific user data
export const getUserData = (key) => {
  const user = getUser();
  if (user && key) {
    return user[key];
  }
  return user;
};

// NEW: Update specific user field
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

// NEW: Hook for listening to user updates (for React components)
export const subscribeToUserUpdates = (callback) => {
  if (typeof window !== "undefined") {
    const handleUserUpdate = (event) => {
      callback(event.detail);
    };
    
    window.addEventListener('userUpdated', handleUserUpdate);
    window.addEventListener('profileUpdated', handleUserUpdate);
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
      window.removeEventListener('profileUpdated', handleUserUpdate);
    };
  }
  return () => {};
};

// NEW: Get user avatar with fallback
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

// NEW: Get user display name
export const getUserDisplayName = () => {
  const user = getUser();
  return user?.fullName || user?.name || 'User';
};

// NEW: Get user initials for avatar fallback
export const getUserInitials = () => {
  const name = getUserDisplayName();
  if (!name || name === 'User') return 'U';
  
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};