"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountrySelect from "../../Common/CountrySelect";

export default function Step4Specifications({ formData, updateFormData, onNext, onPrev }) {
    const [errors, setErrors] = useState({});
    const [focusedField, setFocusedField] = useState(null);

    const projectTypeOptions = [
        "Short Film", "Documentary", "Feature Film", "Music Video",
        "Commercial", "Animation", "Web Series", "Experimental", "Other"
    ];

    const genreOptions = [
        "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
        "Drama", "Family", "Fantasy", "Horror", "Musical", "Mystery",
        "Romance", "Sci-Fi", "Thriller", "War", "Western", "Other"
    ];

    const formatOptions = [
        "Digital 4K", "Digital 2K", "HD", "Super 16mm", "35mm", "IMAX",
        "Virtual Reality", "Mobile", "Other"
    ];

    const aspectRatios = ["16:9", "4:3", "2.35:1", "1.85:1", "1.33:1", "Other"];

    const languageOptions = [
        { code: "en", name: "English" }, { code: "es", name: "Spanish" },
        { code: "fr", name: "French" }, { code: "de", name: "German" },
        { code: "it", name: "Italian" }, { code: "pt", name: "Portuguese" },
        { code: "zh", name: "Chinese" }, { code: "ja", name: "Japanese" },
        { code: "ko", name: "Korean" }, { code: "hi", name: "Hindi" },
        { code: "bn", name: "Bengali" }, { code: "ar", name: "Arabic" },
        { code: "ru", name: "Russian" }, { code: "tr", name: "Turkish" },
        { code: "nl", name: "Dutch" }, { code: "other", name: "Other" }
    ];

    // Set default language to English on component mount
    useEffect(() => {
        if (!formData.language) {
            updateFormData({ language: "en" });
        }
    }, []);

    const handleProjectTypeToggle = (type) => {
        const current = [...formData.projectTypes];
        if (current.includes(type)) {
            const index = current.indexOf(type);
            current.splice(index, 1);
        } else {
            current.push(type);
        }
        updateFormData({ projectTypes: current });
        if (errors.projectTypes) {
            setErrors({ ...errors, projectTypes: null });
        }
    };

    const handleRuntimeChange = (field, value) => {
        if (field === 'runtimeHours' && (parseInt(value) > 23 || parseInt(value) < 0)) return;
        if (field === 'runtimeMinutes' && (parseInt(value) > 59 || parseInt(value) < 0)) return;
        if (field === 'runtimeSeconds' && (parseInt(value) > 59 || parseInt(value) < 0)) return;
        updateFormData({ [field]: value.padStart(2, '0') });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.projectTypes || formData.projectTypes.length === 0) {
            newErrors.projectTypes = "Please select at least one project type";
        }
        if (!formData.genres) {
            newErrors.genres = "Please select a genre";
        }
        if (!formData.language) {
            newErrors.language = "Please select a language";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateForm()) {
            onNext();
        }
    };

    // Get language display name
    const getLanguageDisplay = (code) => {
        const lang = languageOptions.find(l => l.code === code);
        return lang ? lang.name : code;
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold mb-4">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></span>
                    Step 4 of 6
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-linear-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Technical Specifications
                        </h2>
                    </div>
                </div>
                <p className="text-gray-500 mt-2 max-w-2xl">
                    Provide detailed technical information about your project.
                </p>
            </div>

            <div className="space-y-6">
                {/* Project Types Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="px-6 py-4 bg-linear-to-r from-yellow-50 to-orange-50 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-linear-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Project Type(s)</h3>
                            <span className="text-red-500 text-sm">*</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {projectTypeOptions.map((type, idx) => (
                                <motion.label
                                    key={type}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                        formData.projectTypes.includes(type)
                                            ? 'bg-linear-to-r from-yellow-50 to-orange-50 border border-yellow-300 shadow-sm'
                                            : 'hover:bg-gray-50 border border-transparent'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.projectTypes.includes(type)}
                                        onChange={() => handleProjectTypeToggle(type)}
                                        className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                                    />
                                    <span className="text-sm text-gray-700">{type}</span>
                                </motion.label>
                            ))}
                        </div>
                        <AnimatePresence>
                            {errors.projectTypes && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-red-500 text-sm mt-3 flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.projectTypes}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Genres and Runtime Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Genres */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="px-6 py-4 bg-linear-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-linear-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Genre</h3>
                                <span className="text-red-500 text-sm">*</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <select
                                value={formData.genres}
                                onChange={(e) => {
                                    updateFormData({ genres: e.target.value });
                                    if (errors.genres) setErrors({ ...errors, genres: null });
                                }}
                                onFocus={() => setFocusedField('genres')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full px-4 py-2.5 text-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                                    focusedField === 'genres'
                                        ? 'border-green-500 ring-2 ring-green-100 shadow-md'
                                        : errors.genres ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <option value="">Select primary genre</option>
                                {genreOptions.map((genre) => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                            <AnimatePresence>
                                {errors.genres && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-500 text-sm mt-2 flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.genres}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Runtime */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="px-6 py-4 bg-linear-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Runtime</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Hours</label>
                                    <select
                                        value={formData.runtimeHours}
                                        onChange={(e) => handleRuntimeChange('runtimeHours', e.target.value)}
                                        className="w-full px-3 py-2 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                    >
                                        {Array.from({ length: 24 }, (_, i) => (
                                            <option key={i} value={i.toString().padStart(2, '0')}>
                                                {i.toString().padStart(2, '0')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Minutes</label>
                                    <select
                                        value={formData.runtimeMinutes}
                                        onChange={(e) => handleRuntimeChange('runtimeMinutes', e.target.value)}
                                        className="w-full px-3 py-2 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                    >
                                        {Array.from({ length: 60 }, (_, i) => (
                                            <option key={i} value={i.toString().padStart(2, '0')}>
                                                {i.toString().padStart(2, '0')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Seconds</label>
                                    <select
                                        value={formData.runtimeSeconds}
                                        onChange={(e) => handleRuntimeChange('runtimeSeconds', e.target.value)}
                                        className="w-full px-3 py-2 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                    >
                                        {Array.from({ length: 60 }, (_, i) => (
                                            <option key={i} value={i.toString().padStart(2, '0')}>
                                                {i.toString().padStart(2, '0')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Production Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Completion Date */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="px-6 py-4 bg-linear-to-r from-blue-50 to-cyan-50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Completion Date</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <input
                                type="date"
                                value={formData.completionDate}
                                onChange={(e) => updateFormData({ completionDate: e.target.value })}
                                className="w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>
                    </motion.div>

                    {/* Production Budget */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="px-6 py-4 bg-linear-to-r from-emerald-50 to-teal-50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Production Budget</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <input
                                type="text"
                                value={formData.productionBudget}
                                onChange={(e) => updateFormData({ productionBudget: e.target.value })}
                                className="w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                                placeholder="$50,000"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Countries Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Country of Origin
                        </label>
                        <CountrySelect
                            value={formData.countryOfOrigin}
                            onChange={(country) => updateFormData({ countryOfOrigin: country })}
                            placeholder="Select country of origin"
                            required={false}
                            className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-2">Where was this film produced?</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Country of Filming
                        </label>
                        <CountrySelect
                            value={formData.countryOfFilming}
                            onChange={(country) => updateFormData({ countryOfFilming: country })}
                            placeholder="Select country of filming"
                            required={false}
                            className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-2">Where was this film shot?</p>
                    </div>
                </div>

                {/* Technical Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Language */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="px-6 py-4 bg-linear-to-r from-amber-50 to-yellow-50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-linear-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Primary Language</h3>
                                <span className="text-red-500 text-sm">*</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <select
                                value={formData.language}
                                onChange={(e) => {
                                    updateFormData({ language: e.target.value });
                                    if (errors.language) setErrors({ ...errors, language: null });
                                }}
                                onFocus={() => setFocusedField('language')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full px-4 py-2.5 text-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                                    focusedField === 'language'
                                        ? 'border-amber-500 ring-2 ring-amber-100 shadow-md'
                                        : errors.language ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <option value="">Select primary language</option>
                                {languageOptions.map((lang) => (
                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                            <AnimatePresence>
                                {errors.language && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-500 text-sm mt-2 flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.language}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                            <p className="text-xs text-gray-500 mt-2">
                                Selected: <span className="font-medium text-gray-700">{getLanguageDisplay(formData.language)}</span>
                            </p>
                        </div>
                    </motion.div>

                    {/* Shooting Format */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="px-6 py-4 bg-linear-to-r from-slate-50 to-gray-50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-linear-to-br from-slate-500 to-gray-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Shooting Format</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <select
                                value={formData.shootingFormat}
                                onChange={(e) => updateFormData({ shootingFormat: e.target.value })}
                                onFocus={() => setFocusedField('shootingFormat')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full px-4 py-2.5 text-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                                    focusedField === 'shootingFormat'
                                        ? 'border-slate-500 ring-2 ring-slate-100 shadow-md'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <option value="">Select format</option>
                                {formatOptions.map((format) => (
                                    <option key={format} value={format}>{format}</option>
                                ))}
                            </select>
                        </div>
                    </motion.div>
                </div>

                {/* Additional Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="px-6 py-4 bg-linear-to-r from-cyan-50 to-sky-50 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Aspect Ratio</h3>
                        </div>
                        <div className="p-6">
                            <select
                                value={formData.aspectRatio}
                                onChange={(e) => updateFormData({ aspectRatio: e.target.value })}
                                className="w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
                            >
                                {aspectRatios.map((ratio) => (
                                    <option key={ratio} value={ratio}>{ratio}</option>
                                ))}
                            </select>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="px-6 py-4 bg-linear-to-r from-pink-50 to-rose-50 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Film Color</h3>
                        </div>
                        <div className="p-6">
                            <select
                                value={formData.filmColor}
                                onChange={(e) => updateFormData({ filmColor: e.target.value })}
                                className="w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all"
                            >
                                <option value="Color">Color</option>
                                <option value="Black and White">Black and White</option>
                                <option value="Mixed">Mixed</option>
                            </select>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 }}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="px-6 py-4 bg-linear-to-r from-teal-50 to-emerald-50 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Student Project?</h3>
                        </div>
                        <div className="p-6">
                            <select
                                value={formData.studentProject}
                                onChange={(e) => updateFormData({ studentProject: e.target.value })}
                                className="w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                            >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </div>
                    </motion.div>
                </div>

                {/* First Time Filmmaker */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-linear-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100"
                >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">First Time Filmmaker?</h3>
                                <p className="text-sm text-gray-500">Is this your first film project?</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => updateFormData({ firstTimeFilmmaker: "No" })}
                                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                                    formData.firstTimeFilmmaker === "No"
                                        ? 'bg-linear-to-r from-gray-600 to-gray-700 text-white shadow-md'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                No
                            </button>
                            <button
                                type="button"
                                onClick={() => updateFormData({ firstTimeFilmmaker: "Yes" })}
                                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                                    formData.firstTimeFilmmaker === "Yes"
                                        ? 'bg-linear-to-r from-orange-600 to-red-600 text-white shadow-md'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Navigation Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
                className="flex justify-between pt-6 border-t border-gray-100"
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onPrev}
                    className="group relative px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:shadow-md transition-all duration-300 overflow-hidden"
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
                    className="group relative px-8 py-3 bg-linear-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-yellow-500/25 hover:shadow-xl transition-all duration-300 overflow-hidden"
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