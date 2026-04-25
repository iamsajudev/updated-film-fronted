"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Step1ProjectInfo({ formData, updateFormData, onNext }) {
    const [errors, setErrors] = useState({});
    const [focusedField, setFocusedField] = useState(null);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.projectType) newErrors.projectType = "Project type is required";
        if (!formData.projectTitle) newErrors.projectTitle = "Project title is required";
        if (!formData.briefSynopsis) newErrors.briefSynopsis = "Brief synopsis is required";
        if (formData.briefSynopsis.length < 50) newErrors.briefSynopsis = "Synopsis must be at least 50 characters";
        if (formData.briefSynopsis.length > 500) newErrors.briefSynopsis = "Synopsis must not exceed 500 characters";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateForm()) {
            onNext();
        }
    };

    const projectTypes = [
        { value: "", label: "Select project type", icon: "📋" },
        { value: "short_film", label: "Short Film", icon: "🎬" },
        { value: "documentary", label: "Documentary", icon: "📹" },
        { value: "feature_film", label: "Feature Film", icon: "🎥" },
        { value: "music_video", label: "Music Video", icon: "🎵" },
        { value: "commercial", label: "Commercial", icon: "📺" },
        { value: "animation", label: "Animation", icon: "🎨" },
        { value: "web_series", label: "Web Series", icon: "📱" },
        { value: "other", label: "Other", icon: "🎭" }
    ];

    const inputVariants = {
        focused: { scale: 1.02, transition: { duration: 0.2 } },
        blurred: { scale: 1, transition: { duration: 0.2 } }
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-4">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                    Step 1 of 6
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Project Information
                </h2>
                <p className="text-gray-500 mt-2 max-w-2xl">
                    Tell us about your project. This information will be used for festival consideration.
                </p>
            </div>

            <div className="space-y-6">
                {/* Project Type */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="group"
                >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Project Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            value={formData.projectType}
                            onChange={(e) => updateFormData({ projectType: e.target.value })}
                            onFocus={() => setFocusedField('projectType')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full px-5 py-3 text-gray-900 bg-white border-2 rounded-xl focus:outline-none transition-all duration-300 appearance-none cursor-pointer ${
                                focusedField === 'projectType'
                                    ? 'border-blue-500 shadow-lg shadow-blue-100'
                                    : 'border-gray-200 hover:border-gray-300'
                            } ${errors.projectType ? 'border-red-500 bg-red-50' : ''}`}
                        >
                            {projectTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.icon} {type.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    <AnimatePresence>
                        {errors.projectType && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-500 text-sm mt-1 flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.projectType}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Project Title */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="group"
                >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Project Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={formData.projectTitle}
                            onChange={(e) => updateFormData({ projectTitle: e.target.value })}
                            onFocus={() => setFocusedField('projectTitle')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full px-12 py-3 text-gray-900 bg-white border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                                focusedField === 'projectTitle'
                                    ? 'border-blue-500 shadow-lg shadow-blue-100'
                                    : 'border-gray-200 hover:border-gray-300'
                            } ${errors.projectTitle ? 'border-red-500 bg-red-50' : ''}`}
                            placeholder="Enter your project title"
                        />
                    </div>
                    <AnimatePresence>
                        {errors.projectTitle && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-500 text-sm mt-1 flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.projectTitle}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Brief Synopsis */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="group"
                >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Brief Synopsis <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <textarea
                            value={formData.briefSynopsis}
                            onChange={(e) => updateFormData({ briefSynopsis: e.target.value })}
                            onFocus={() => setFocusedField('briefSynopsis')}
                            onBlur={() => setFocusedField(null)}
                            rows={5}
                            className={`w-full px-5 py-3 text-gray-900 bg-white border-2 rounded-xl focus:outline-none transition-all duration-300 resize-none ${
                                focusedField === 'briefSynopsis'
                                    ? 'border-blue-500 shadow-lg shadow-blue-100'
                                    : 'border-gray-200 hover:border-gray-300'
                            } ${errors.briefSynopsis ? 'border-red-500 bg-red-50' : ''}`}
                            placeholder="Provide a brief synopsis of your project (50-500 characters)..."
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
                            {formData.briefSynopsis.length} / 500
                        </div>
                    </div>
                    <div className="flex justify-between mt-1">
                        <div className="flex gap-2">
                            {[0, 25, 50, 75, 100].map((percent) => (
                                <div
                                    key={percent}
                                    className={`h-1 w-12 rounded-full transition-all ${
                                        formData.briefSynopsis.length >= (percent === 0 ? 0 : percent === 25 ? 125 : percent === 50 ? 250 : percent === 75 ? 375 : 500)
                                            ? 'bg-green-500'
                                            : 'bg-gray-200'
                                    }`}
                                />
                            ))}
                        </div>
                        <AnimatePresence>
                            {errors.briefSynopsis && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-red-500 text-xs"
                                >
                                    {errors.briefSynopsis}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Non-English Title Toggle */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex items-center gap-3 p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl"
                >
                    <div className="relative">
                        <input
                            type="checkbox"
                            id="hasNonEnglishTitle"
                            checked={formData.hasNonEnglishTitle}
                            onChange={(e) => updateFormData({ hasNonEnglishTitle: e.target.checked })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-linear-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 transition-all duration-300 cursor-pointer"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                    </div>
                    <label htmlFor="hasNonEnglishTitle" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Project has non-English title
                    </label>
                </motion.div>

                {/* Non-English Fields (Conditional) */}
                <AnimatePresence>
                    {formData.hasNonEnglishTitle && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 pl-6 border-l-2 border-gradient-to-b from-blue-500 to-purple-500 overflow-hidden"
                        >
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Original Title (Non-English)
                                </label>
                                <input
                                    type="text"
                                    value={formData.nonEnglishTitle}
                                    onChange={(e) => updateFormData({ nonEnglishTitle: e.target.value })}
                                    className="w-full px-5 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-100 transition-all duration-300"
                                    placeholder="Enter original title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Original Synopsis (Non-English)
                                </label>
                                <textarea
                                    value={formData.nonEnglishSynopsis}
                                    onChange={(e) => updateFormData({ nonEnglishSynopsis: e.target.value })}
                                    rows={3}
                                    className="w-full px-5 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-100 transition-all duration-300 resize-none"
                                    placeholder="Enter original synopsis"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Social Media Links */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-purple-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
                        <span className="text-xs text-gray-400">(Optional)</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🌐</div>
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => updateFormData({ website: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 transition-all duration-300"
                                placeholder="Website URL"
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🐦</div>
                            <input
                                type="text"
                                value={formData.twitter}
                                onChange={(e) => updateFormData({ twitter: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 transition-all duration-300"
                                placeholder="@username"
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">📘</div>
                            <input
                                type="url"
                                value={formData.facebook}
                                onChange={(e) => updateFormData({ facebook: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 transition-all duration-300"
                                placeholder="Facebook URL"
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">📷</div>
                            <input
                                type="text"
                                value={formData.instagram}
                                onChange={(e) => updateFormData({ instagram: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 transition-all duration-300"
                                placeholder="@username"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Next Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex justify-end pt-6 border-t border-gray-100"
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="group relative px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
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