"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AvatarDropdown from "./AvatarDropdown";

// Local auth functions
const getLocalUser = () => {
  if (typeof window !== "undefined") {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
  return null;
};

const isLocalAuthenticated = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    const user = getLocalUser();
    return !!(token && user);
  }
  return false;
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userInitials, setUserInitials] = useState("U");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const menuRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  // Handle scroll effect for glass morphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = getLocalUser();
        const authenticated = isLocalAuthenticated();

        setIsLoggedIn(authenticated);

        if (userData && authenticated) {
          const role = userData.role || userData.userType || 'user';
          const name = userData.fullName || userData.name || '';
          const avatar = userData.avatar || userData.profileImage || '';

          let initials = 'U';
          if (name) {
            const parts = name.trim().split(' ');
            if (parts.length >= 2) {
              initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            } else {
              initials = name.substring(0, 2).toUpperCase();
            }
          }

          setUserRole(role);
          setUserName(name);
          setUserAvatar(avatar);
          setUserInitials(initials);
        } else {
          setUserRole(null);
          setUserName("");
          setUserAvatar("");
          setUserInitials("U");
        }
      } catch (error) {
        setUserRole(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();

    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        loadUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChanged', loadUserData);
    window.addEventListener('authCleared', loadUserData);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChanged', loadUserData);
      window.removeEventListener('authCleared', loadUserData);
    };
  }, []);

  const handleNavigation = (e, href) => {
    const publicRoutes = ['/', '/projects', '/projects/submit-film'];
    const isPublicRoute = publicRoutes.some(route => href.startsWith(route));

    if (!isPublicRoute && !isLoggedIn) {
      e.preventDefault();
      router.push(`/login?redirect=${encodeURIComponent(href)}`);
      return;
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getNavLinks = () => {
    const links = [
      { name: "All Projects", href: "/projects", public: true }
    ];

    if (isLoggedIn) {
      const isAdmin = userRole === 'admin' || userRole === 'Administrator';

      if (isAdmin) {
        links.push(
          { name: "Dashboard", href: "/admin/dashboard", public: false, icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
          { name: "Users", href: "/admin/all-users", public: false, icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
          { name: "Submissions", href: "/admin/all-submissions", public: false, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
          { name: "Visit NYBFF", href: "https://nybff.us/", public: false, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }
        );
      } else {
        links.push(
          { name: "Dashboard", href: "/dashboard", public: false, icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
          { name: "Visit NYBFF", href: "https://nybff.us/", public: false, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }
        );
      }
    }
    return links;
  };

  const navLinks = getNavLinks();

  if (isLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="w-36 h-10 bg-white/5 rounded-xl animate-pulse" />
            <div className="flex items-center gap-4">
              <div className="w-20 h-8 bg-white/5 rounded-lg animate-pulse" />
              <div className="w-8 h-8 bg-white/5 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${isScrolled
            ? "bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            : "bg-black/80 backdrop-blur-md border-b border-white/5"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link
              href="http://nybff.us"
              className="group relative flex items-center gap-2"
              aria-label="Home"
            >
              <div className="relative">
                <Image
                  src="/assets/logo-white.webp"
                  alt="NYBFF"
                  width={140}
                  height={40}
                  className="w-32 lg:w-36 transition-all duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="hidden lg:block h-6 w-px bg-white/20 mx-2" />
              <span className="hidden lg:block text-xs text-white/40 font-mono tracking-wider">EST. 2024</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                const isClickable = link.public || isLoggedIn;

                if (!isClickable) {
                  return (
                    <button
                      key={link.name}
                      onClick={(e) => handleNavigation(e, link.href)}
                      className={`
                        relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200
                        text-gray-300 hover:text-white hover:bg-white/5
                      `}
                    >
                      {link.name}
                    </button>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      if (!link.public && !isLoggedIn) {
                        handleNavigation(e, link.href);
                      }
                    }}
                    className={`
                      relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200
                      ${isActive
                        ? "text-white bg-linear-to-r from-[#1EB97A]/20 to-emerald-500/20 border border-[#1EB97A]/30"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-linear-to-r from-[#1EB97A] to-emerald-500 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Welcome Text - Desktop */}
              {isLoggedIn && userName && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden lg:block text-sm"
                >
                  <span className="text-gray-400">Welcome back,</span>
                  <span className="text-white font-semibold ml-1 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {userName.split(' ')[0]}
                  </span>
                </motion.div>
              )}

              {/* Admin Badge - Desktop */}
              {isLoggedIn && (userRole === 'admin' || userRole === 'Administrator') && (
                <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-linear-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  <span className="text-sm">👑</span>
                  <span className="text-xs font-medium text-purple-300">Admin</span>
                </div>
              )}

              {/* Avatar or Auth Buttons */}
              {isLoggedIn ? (
                <AvatarDropdown
                  userAvatar={userAvatar}
                  userName={userName}
                  userInitials={userInitials}
                />
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 text-sm font-semibold bg-linear-to-r from-[#1EB97A] to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-[#1EB97A]/25 transition-all duration-300 hover:scale-105"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-white/10"
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                <div className="relative w-5 h-5">
                  <span className={`
                    absolute h-0.5 bg-white rounded-full transition-all duration-300 ease-out
                    ${isMenuOpen ? 'rotate-45 top-2' : 'rotate-0 top-0'}
                  `} style={{ width: '20px', left: 0 }} />
                  <span className={`
                    absolute h-0.5 bg-white rounded-full transition-all duration-300 ease-out top-2
                    ${isMenuOpen ? 'opacity-0' : 'opacity-100'}
                  `} style={{ width: '20px', left: 0 }} />
                  <span className={`
                    absolute h-0.5 bg-white rounded-full transition-all duration-300 ease-out
                    ${isMenuOpen ? '-rotate-45 top-2' : 'rotate-0 top-4'}
                  `} style={{ width: '20px', left: 0 }} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
              onClick={toggleMenu}
            />

            <motion.div
              ref={menuRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] max-w-[85vw] bg-linear-to-b from-gray-900 to-black z-50 shadow-2xl lg:hidden"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <Image src="/assets/logo-white.webp" alt="NYBFF" width={100} height={28} className="w-24" />
                <button
                  onClick={toggleMenu}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Profile Preview */}
              {isLoggedIn && (
                <div className="p-5 border-b border-white/10 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#1EB97A] to-emerald-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg overflow-hidden">
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{userInitials}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{userName || 'User'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {userRole === 'admin' ? 'Administrator' : 'Member'}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex-1 py-4 overflow-y-auto">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                  const isClickable = link.public || isLoggedIn;

                  if (!isClickable) {
                    return (
                      <button
                        key={link.name}
                        onClick={(e) => handleNavigation(e, link.href)}
                        className="w-full text-left px-5 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span className="text-sm font-medium">{link.name}</span>
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-5 py-3 transition-all duration-200
                        ${isActive
                          ? "bg-linear-to-r from-[#1EB97A]/10 to-transparent border-l-2 border-[#1EB97A] text-white"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                        }
                      `}
                    >
                      {link.icon && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                        </svg>
                      )}
                      <span className="text-sm font-medium">{link.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Admin Quick Actions */}
              {isLoggedIn && (userRole === 'admin' || userRole === 'Administrator') && (
                <div className="p-5 border-t border-white/10">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</p>
                  <div className="space-y-2">
                    <Link
                      href="/admin/all-users/create"
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#1EB97A] py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create New User
                    </Link>
                    <Link
                      href="/admin/festivals/create"
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#1EB97A] py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Festival
                    </Link>
                  </div>
                </div>
              )}

              {/* Auth Links for Mobile */}
              {!isLoggedIn && (
                <div className="p-5 border-t border-white/10">
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="block text-center py-2.5 text-sm font-medium text-white bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="block text-center py-2.5 text-sm font-semibold bg-linear-to-r from-[#1EB97A] to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
            <div className="h-16 lg:h-20" />
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content hiding under fixed header */}
    </>
  );
};

export default Header;