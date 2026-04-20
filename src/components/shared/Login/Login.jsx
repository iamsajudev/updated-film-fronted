"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { getToken, getUser, clearAuthData } from '@/utils/auth';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://server.nybff.us';

    // Check if user is already logged in
    useEffect(() => {
        const token = getToken();
        const user = getUser();

        if (token && user) {
            try {
                const redirectUrl = (user.role === 'admin' || user.role === 'Administrator')
                    ? '/admin'
                    : '/dashboard';

                console.log('Already logged in, redirecting to:', redirectUrl);
                router.replace(redirectUrl);
            } catch (error) {
                console.error('Error checking auth:', error);
                clearAuthData();
            }
        }
    }, [router]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (isLoading) return;

        if (!formData.email.trim()) {
            setError('Please enter your email address');
            return;
        }
        if (!formData.password) {
            setError('Please enter your password');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            console.log('Sending login request to:', `${API_URL}/api/auth/login`);

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password
                })
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (data.success) {
                // Store auth data in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                if (formData.rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }

                console.log('Login successful! User role:', data.user.role);

                const redirectUrl = (data.user.role === 'admin' || data.user.role === 'Administrator')
                    ? '/admin'
                    : '/dashboard';

                console.log('Redirecting to:', redirectUrl);

                // Use router.push for navigation
                router.push(redirectUrl);
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Unable to connect to server. Please check your internet connection.');
            setIsLoading(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const imageVariants = {
        hidden: { x: 50, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 15,
                delay: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-6xl w-full relative z-10"
            >
                <div className="grid lg:grid-cols-2 items-center gap-0 bg-white/10 backdrop-blur-xl rounded-3xl">
                    <motion.div
                        variants={itemVariants}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md mx-auto w-full border border-white/20"
                    >
                        <motion.div variants={itemVariants} className="mb-8 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                                className="w-20 h-20 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
                            >
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </motion.div>
                            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
                            <p className="text-gray-300 text-sm">
                                Sign in to your account to continue
                            </p>
                        </motion.div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-6 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-red-400 text-sm">{error}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <motion.div variants={itemVariants}>
                                <label className="text-gray-300 text-sm font-semibold mb-2 block">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full text-white text-sm bg-white/10 border border-white/20 pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder:text-gray-400"
                                        placeholder="Enter your email"
                                        disabled={isLoading}
                                        autoComplete="email"
                                    />
                                    <svg className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-blue-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <motion.div
                                        className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                        initial={false}
                                        animate={{ opacity: focusedField === 'email' ? 1 : 0 }}
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label className="text-gray-300 text-sm font-semibold mb-2 block">
                                    Password
                                </label>
                                <div className="relative group">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full text-white text-sm bg-white/10 border border-white/20 pl-11 pr-11 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder:text-gray-400"
                                        placeholder="Enter your password"
                                        disabled={isLoading}
                                        autoComplete="current-password"
                                    />
                                    <svg className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-blue-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none transition-colors duration-200"
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </motion.div>
                                    </button>
                                    <motion.div
                                        className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                        initial={false}
                                        animate={{ opacity: focusedField === 'password' ? 1 : 0 }}
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        id="remember-me"
                                        name="rememberMe"
                                        type="checkbox"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 rounded bg-white/10"
                                    />
                                    <span className="ml-2 text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
                                        Remember me
                                    </span>
                                </label>
                            </motion.div>

                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 text-sm font-semibold rounded-xl text-white bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg mt-6"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </motion.button>

                            <motion.p variants={itemVariants} className="text-center text-sm text-gray-300 mt-4">
                                Don't have an account?{' '}
                                <Link href="/register" className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors duration-200">
                                    Create an account
                                </Link>
                            </motion.p>
                        </form>
                    </motion.div>

                    <motion.div
                        variants={imageVariants}
                        className="hidden lg:block"
                    >
                        <div className="relative group">
                            {/* Animated gradient background */}
                            <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

                            <div className="relative overflow-hidden  flex flex-col items-center bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl">
                                {/* Logo Section */}
                                <div className="text-center pt-8 pb-4 px-6">
                                    <div className="flex justify-center mb-4">
                                        <Image
                                            src="/assets/logo-white.webp"
                                            alt="Logo"
                                            width={200}
                                            height={100}
                                            className="transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <h3 className="text-white text-xl font-bold mb-2">Welcome Back!</h3>
                                    <p className="text-gray-300 text-sm">Sign in to continue your creative journey</p>
                                </div>

                                {/* Main Image */}
                                <div className="relative w-full">
                                    <Image
                                        src="/assets/login.png"
                                        alt="Login Illustration"
                                        width={600}
                                        height={400}
                                        className="transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                                </div>

                                {/* Tips & Info Section */}
                                <div className="w-full p-6 space-y-4 bg-black/20 backdrop-blur-sm flex">
                                    {/* Security Tip */}
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">Secure Login</p>
                                            <p className="text-gray-400 text-xs">Your credentials are encrypted and protected</p>
                                        </div>
                                    </div>

                                    {/* Feature Tip */}
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">Quick Access</p>
                                            <p className="text-gray-400 text-xs">Save time with social login options below</p>
                                        </div>
                                    </div>

                                    {/* Support Tip */}
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636L9.172 14.828M12 9l3 3m-3 3l3-3m6 3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">Need Help?</p>
                                            <p className="text-gray-400 text-xs">Contact support at <span className="text-blue-400">support@example.com</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Animated border gradient */}
                                <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/10 group-hover:border-white/20 transition-all duration-300"></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default Login;