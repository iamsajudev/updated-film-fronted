"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { getToken } from '@/utils/auth';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://server.nybff.us';

    // Hide header and footer
    useEffect(() => {
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        const originalHeaderDisplay = header ? header.style.display : '';
        const originalFooterDisplay = footer ? footer.style.display : '';
        if (header) header.style.display = 'none';
        if (footer) footer.style.display = 'none';
        return () => {
            if (header) header.style.display = originalHeaderDisplay || '';
            if (footer) footer.style.display = originalFooterDisplay || '';
        };
    }, []);

    useEffect(() => {
        const token = getToken();
        if (token) {
            router.push('/dashboard');
        }
    }, [router]);

    // Password strength checker
    useEffect(() => {
        const password = formData.password;
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        setPasswordStrength(Math.min(strength, 4));
    }, [formData.password]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (!formData.acceptTerms) {
            setError('Please accept the Terms and Conditions');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLoading) return;

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.toLowerCase().trim(),
                    password: formData.password
                })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                router.push('/dashboard');
            } else {
                setError(data.message || 'Registration failed. Please try again.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('Network error. Please check your connection and try again.');
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
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 120, damping: 15 }
        }
    };

    const imageVariants = {
        hidden: { x: -100, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.3 }
        }
    };

    // Password strength color
    const getStrengthColor = () => {
        const colors = ['bg-emerald-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
        return colors[passwordStrength - 1] || 'bg-gray-500';
    };

    const getStrengthText = () => {
        const texts = ['Weak', 'Fair', 'Good', 'Strong'];
        return texts[passwordStrength - 1] || 'Very Weak';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-indigo-950 to-purple-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-6xl w-full relative z-10"
            >
                <div className="grid lg:grid-cols-2 gap-0 bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
                    {/* Left Side - Hero Section */}
                    <motion.div
                        variants={imageVariants}
                        className="hidden lg:block relative bg-linear-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm"
                    >
                        <div className="relative h-full flex flex-col items-center justify-center p-8">
                            {/* Logo */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                                className="mb-8"
                            >
                                <Link href="/">
                                    <Image
                                        src="/assets/logo-white.webp"
                                        alt="NYBFF Logo"
                                        width={220}
                                        height={110}
                                        className="transform hover:scale-105 transition-transform duration-500"
                                    />
                                </Link>
                            </motion.div>

                            {/* Illustration */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                                <Image
                                    src="/assets/register.png"
                                    alt="Registration Illustration"
                                    width={500}
                                    height={350}
                                    className="relative transform hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Quote or Tagline */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-center"
                            >
                                <p className="text-white/80 text-lg italic">
                                    "Join our creative community"
                                </p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Be part of the largest Bengali film festival in North America
                                </p>
                            </motion.div>

                            {/* Feature Badges */}
                            <div className="mt-8 w-full">
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { icon: "🎬", text: "Film Submissions" },
                                        { icon: "🏆", text: "Awards" },
                                        { icon: "🎭", text: "Screenings" }
                                    ].map((feature, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 + idx * 0.1 }}
                                            className="text-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                                        >
                                            <div className="text-2xl mb-1">{feature.icon}</div>
                                            <p className="text-white/80 text-xs font-medium">{feature.text}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Registration Form */}
                    <motion.div
                        variants={itemVariants}
                        className="p-8 md:p-10 lg:p-12"
                    >
                        <motion.div variants={itemVariants} className="mb-8 text-center lg:text-left">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                                className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto lg:mx-0 mb-6 flex items-center justify-center shadow-lg shadow-purple-500/30"
                            >
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a5 5 0 0110 0v1H3v-1z" />
                                </svg>
                            </motion.div>
                            <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                                Create Account
                            </h1>
                            <p className="text-gray-400 text-sm">
                                Join us today and start your creative journey
                            </p>
                        </motion.div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    className="mb-6 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="shrink-0">
                                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-emerald-400 text-sm flex-1">{error}</p>
                                        <button onClick={() => setError('')} className="text-emerald-400 hover:text-emerald-300">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name Field */}
                            <motion.div variants={itemVariants}>
                                <label className="text-gray-300 text-sm font-semibold mb-2 block">
                                    Full Name <span className="text-emerald-400">*</span>
                                </label>
                                <div className="relative group">
                                    <div className={`absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${focusedField === 'name' ? 'opacity-100' : ''}`} />
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full text-white text-sm bg-white/5 border border-white/10 pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder:text-gray-500"
                                        placeholder="John Doe"
                                        disabled={isLoading}
                                    />
                                    <svg className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${focusedField === 'name' ? 'text-blue-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </motion.div>

                            {/* Email Field */}
                            <motion.div variants={itemVariants}>
                                <label className="text-gray-300 text-sm font-semibold mb-2 block">
                                    Email Address <span className="text-emerald-400">*</span>
                                </label>
                                <div className="relative group">
                                    <div className={`absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${focusedField === 'email' ? 'opacity-100' : ''}`} />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full text-white text-sm bg-white/5 border border-white/10 pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder:text-gray-500"
                                        placeholder="you@example.com"
                                        disabled={isLoading}
                                    />
                                    <svg className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-blue-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </motion.div>

                            {/* Password Field */}
                            <motion.div variants={itemVariants}>
                                <label className="text-gray-300 text-sm font-semibold mb-2 block">
                                    Password <span className="text-emerald-400">*</span>
                                </label>
                                <div className="relative group">
                                    <div className={`absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${focusedField === 'password' ? 'opacity-100' : ''}`} />
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full text-white text-sm bg-white/5 border border-white/10 pl-12 pr-12 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder:text-gray-500"
                                        placeholder="Create a password (min. 6 characters)"
                                        disabled={isLoading}
                                    />
                                    <svg className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-blue-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none transition-colors duration-200"
                                    >
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
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
                                </div>

                                {/* Password Strength Meter */}
                                {formData.password && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-3 space-y-1"
                                    >
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength ? getStrengthColor() : 'bg-gray-600'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            Password strength: <span className={passwordStrength > 0 ? getStrengthColor().replace('bg-', 'text-') : 'text-gray-400'}>
                                                {getStrengthText()}
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-500">Must be at least 6 characters</p>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Confirm Password Field */}
                            <motion.div variants={itemVariants}>
                                <label className="text-gray-300 text-sm font-semibold mb-2 block">
                                    Confirm Password <span className="text-emerald-400">*</span>
                                </label>
                                <div className="relative group">
                                    <div className={`absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${focusedField === 'confirmPassword' ? 'opacity-100' : ''}`} />
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        autoComplete="new-password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('confirmPassword')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full text-white text-sm bg-white/5 border border-white/10 pl-12 pr-12 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder:text-gray-500"
                                        placeholder="Confirm your password"
                                        disabled={isLoading}
                                    />
                                    <svg className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-blue-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none transition-colors duration-200"
                                    >
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                            {showConfirmPassword ? (
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
                                </div>
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-xs text-emerald-400 mt-1"
                                    >
                                        Passwords do not match
                                    </motion.p>
                                )}
                            </motion.div>

                            {/* Terms and Conditions */}
                            <motion.div variants={itemVariants} className="flex items-center gap-3">
                                <div className="relative">
                                    <input
                                        id="acceptTerms"
                                        name="acceptTerms"
                                        type="checkbox"
                                        checked={formData.acceptTerms}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-5 h-5 border-2 border-white/30 rounded-md bg-white/5 peer-checked:bg-linear-to-r peer-checked:from-blue-500 peer-checked:to-purple-600 peer-checked:border-transparent transition-all duration-200 flex items-center justify-center">
                                        {formData.acceptTerms && (
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <label htmlFor="acceptTerms" className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors duration-200">
                                    I agree to the{' '}
                                    <Link href="/terms" className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors duration-200">
                                        Terms of Service
                                    </Link>
                                    {' '}and{' '}
                                    <Link href="/privacy" className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors duration-200">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="relative w-full py-3.5 px-4 text-sm font-semibold rounded-xl text-white bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-purple-500/25 overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : (
                                    'Create Account'
                                )}
                            </motion.button>

                            {/* Login Link */}
                            <motion.p variants={itemVariants} className="text-center text-sm text-gray-400 mt-6">
                                Already have an account?{' '}
                                <Link href="/login" className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors duration-200">
                                    Sign in
                                </Link>
                                <span className="mx-2">•</span>
                                <Link href="/projects/submit-film" className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline transition-colors duration-200">
                                    Submit as Guest
                                </Link>
                            </motion.p>
                        </form>
                    </motion.div>
                </div>
            </motion.div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animate-float { animation: float linear infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
            `}</style>
        </div>
    );
};

export default Register;