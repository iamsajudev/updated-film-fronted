"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountrySelect from "../../Common/CountrySelect";

export default function Step2SubmitterInfo({ formData, updateFormData, onNext, onPrev }) {
    const [errors, setErrors] = useState({});
    const [focusedField, setFocusedField] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in and get email from localStorage
    useEffect(() => {
        const checkUserAndSetEmail = () => {
            try {
                const token = localStorage.getItem('token');
                const userData = localStorage.getItem('user');
                
                if (token && userData) {
                    const user = JSON.parse(userData);
                    if (user && user.email) {
                        setIsLoggedIn(true);
                        // Auto-fill email if not already set
                        if (!formData.email) {
                            updateFormData({ email: user.email });
                        }
                    }
                }
            } catch (error) {
                console.error('Error checking user data:', error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };
        
        checkUserAndSetEmail();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = "Email is required";
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.phone) newErrors.phone = "Phone number is required";
        if (!formData.address) newErrors.address = "Address is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.country) newErrors.country = "Country is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateForm()) {
            onNext();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            {/* Header Section */}
            <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#1EB97A]/20 to-emerald-500/20 border border-[#1EB97A]/30 text-[#1EB97A] text-xs font-semibold mb-4">
                    <span className="w-2 h-2 bg-[#1EB97A] rounded-full animate-pulse"></span>
                    Step 2 of 7
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Submitter Information
                </h2>
                <p className="text-gray-400 mt-2 max-w-2xl">
                    Tell us about yourself. This information helps us contact you about your submission.
                </p>
            </div>

            <div className="space-y-6">
                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="group"
                    >
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Email Address <span className="text-[#1EB97A]">*</span>
                            {isLoggedIn && (
                                <span className="ml-2 text-xs text-[#1EB97A] bg-[#1EB97A]/10 px-2 py-0.5 rounded-full">
                                    Auto-filled from account
                                </span>
                            )}
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateFormData({ email: e.target.value })}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                disabled={isLoggedIn}
                                className={`w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300 ${
                                    isLoggedIn 
                                        ? 'bg-gray-800/50 border-gray-700 text-gray-400 cursor-not-allowed' 
                                        : 'bg-gray-800 border-2 focus:outline-none text-white placeholder-gray-500'
                                } ${
                                    focusedField === 'email' && !isLoggedIn
                                        ? 'border-[#1EB97A] shadow-lg shadow-[#1EB97A]/20'
                                        : 'border-gray-700 hover:border-gray-600'
                                } ${errors.email ? 'border-red-500 bg-red-500/10' : ''}`}
                                placeholder="you@example.com"
                            />
                            {isLoggedIn && (
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#1EB97A]">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <AnimatePresence>
                            {errors.email && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.email}
                                </motion.p>
                            )}
                        </AnimatePresence>
                        {isLoggedIn && !errors.email && (
                            <p className="text-xs text-[#1EB97A] mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Email verified from your account
                            </p>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="group"
                    >
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Phone Number <span className="text-[#1EB97A]">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => updateFormData({ phone: e.target.value })}
                                onFocus={() => setFocusedField('phone')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full pl-12 pr-4 py-3 bg-gray-800 border-2 rounded-xl focus:outline-none transition-all duration-300 text-white placeholder-gray-500 ${
                                    focusedField === 'phone'
                                        ? 'border-[#1EB97A] shadow-lg shadow-[#1EB97A]/20'
                                        : 'border-gray-700 hover:border-gray-600'
                                } ${errors.phone ? 'border-red-500 bg-red-500/10' : ''}`}
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                        <AnimatePresence>
                            {errors.phone && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.phone}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Address */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="group"
                >
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Street Address <span className="text-[#1EB97A]">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => updateFormData({ address: e.target.value })}
                            onFocus={() => setFocusedField('address')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full pl-12 pr-4 py-3 bg-gray-800 border-2 rounded-xl focus:outline-none transition-all duration-300 text-white placeholder-gray-500 ${
                                focusedField === 'address'
                                    ? 'border-[#1EB97A] shadow-lg shadow-[#1EB97A]/20'
                                    : 'border-gray-700 hover:border-gray-600'
                            } ${errors.address ? 'border-red-500 bg-red-500/10' : ''}`}
                            placeholder="Street address"
                        />
                    </div>
                    <AnimatePresence>
                        {errors.address && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-400 text-sm mt-1 flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.address}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* City and State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        className="group"
                    >
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            City <span className="text-[#1EB97A]">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => updateFormData({ city: e.target.value })}
                                onFocus={() => setFocusedField('city')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full pl-12 pr-4 py-3 bg-gray-800 border-2 rounded-xl focus:outline-none transition-all duration-300 text-white placeholder-gray-500 ${
                                    focusedField === 'city'
                                        ? 'border-[#1EB97A] shadow-lg shadow-[#1EB97A]/20'
                                        : 'border-gray-700 hover:border-gray-600'
                                } ${errors.city ? 'border-red-500 bg-red-500/10' : ''}`}
                                placeholder="City"
                            />
                        </div>
                        <AnimatePresence>
                            {errors.city && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.city}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="group"
                    >
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            State/Province
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={formData.stateProvince}
                                onChange={(e) => updateFormData({ stateProvince: e.target.value })}
                                onFocus={() => setFocusedField('stateProvince')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-[#1EB97A] focus:shadow-lg focus:shadow-[#1EB97A]/20 transition-all duration-300 text-white placeholder-gray-500 hover:border-gray-600"
                                placeholder="State/Province"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Postal Code and Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                        className="group"
                    >
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Postal Code
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={formData.postalCode}
                                onChange={(e) => updateFormData({ postalCode: e.target.value })}
                                onFocus={() => setFocusedField('postalCode')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-[#1EB97A] focus:shadow-lg focus:shadow-[#1EB97A]/20 transition-all duration-300 text-white placeholder-gray-500 hover:border-gray-600"
                                placeholder="Postal code"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="group"
                    >
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Country <span className="text-[#1EB97A]">*</span>
                        </label>
                        <CountrySelect
                            value={formData.country}
                            onChange={(country) => updateFormData({ country })}
                            required={true}
                            placeholder="Select a country"
                            className={`w-full bg-gray-800 border-gray-700 text-white ${errors.country ? 'border-red-500' : ''}`}
                        />
                        <AnimatePresence>
                            {errors.country && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.country}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Birth Date, Gender, Pronouns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 }}
                        className="group"
                    >
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Birth Date
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="date"
                                value={formData.birthDate}
                                onChange={(e) => updateFormData({ birthDate: e.target.value })}
                                onFocus={() => setFocusedField('birthDate')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-[#1EB97A] focus:shadow-lg focus:shadow-[#1EB97A]/20 transition-all duration-300 text-white placeholder-gray-500 hover:border-gray-600 [color-scheme:dark]"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="group"
                    >
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Gender
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <select
                                value={formData.gender}
                                onChange={(e) => updateFormData({ gender: e.target.value })}
                                onFocus={() => setFocusedField('gender')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full pl-12 pr-10 py-3 bg-gray-800 border-2 rounded-xl focus:outline-none transition-all duration-300 appearance-none cursor-pointer text-white ${
                                    focusedField === 'gender'
                                        ? 'border-[#1EB97A] shadow-lg shadow-[#1EB97A]/20'
                                        : 'border-gray-700 hover:border-gray-600'
                                }`}
                            >
                                <option value="" className="bg-gray-800">Select gender</option>
                                <option value="male" className="bg-gray-800">Male</option>
                                <option value="female" className="bg-gray-800">Female</option>
                                <option value="non-binary" className="bg-gray-800">Non-binary</option>
                                <option value="prefer-not-to-say" className="bg-gray-800">Prefer not to say</option>
                                <option value="other" className="bg-gray-800">Other</option>
                            </select>
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 }}
                        className="group"
                    >
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Pronouns
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={formData.pronouns}
                                onChange={(e) => updateFormData({ pronouns: e.target.value })}
                                onFocus={() => setFocusedField('pronouns')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-[#1EB97A] focus:shadow-lg focus:shadow-[#1EB97A]/20 transition-all duration-300 text-white placeholder-gray-500 hover:border-gray-600"
                                placeholder="e.g., He/Him, She/Her, They/Them"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-between pt-6 border-t border-gray-800"
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onPrev}
                    className="group relative px-8 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl font-semibold hover:border-gray-600 hover:bg-gray-700 transition-all duration-300 overflow-hidden"
                >
                    <span className="relative flex items-center gap-2">
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>
                        Previous
                    </span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="group relative px-8 py-3 bg-gradient-to-r from-[#1EB97A] to-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-[#1EB97A]/25 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative flex items-center gap-2">
                        Next Step
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                </motion.button>
            </motion.div>
        </motion.div>
    );
}