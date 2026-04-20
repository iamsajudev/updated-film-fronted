"use client";

import { useState } from "react";
import CountrySelect from "../../Common/CountrySelect";

export default function Step4Specifications({ formData, updateFormData, onNext, onPrev }) {
    const [errors, setErrors] = useState({});

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

    // Language options with ISO codes
    const languageOptions = [
        { code: "en", name: "English" },
        { code: "es", name: "Spanish" },
        { code: "fr", name: "French" },
        { code: "de", name: "German" },
        { code: "it", name: "Italian" },
        { code: "pt", name: "Portuguese" },
        { code: "zh", name: "Chinese" },
        { code: "ja", name: "Japanese" },
        { code: "ko", name: "Korean" },
        { code: "hi", name: "Hindi" },
        { code: "bn", name: "Bengali" },
        { code: "ar", name: "Arabic" },
        { code: "ru", name: "Russian" },
        { code: "tr", name: "Turkish" },
        { code: "nl", name: "Dutch" },
        { code: "pl", name: "Polish" },
        { code: "sv", name: "Swedish" },
        { code: "da", name: "Danish" },
        { code: "no", name: "Norwegian" },
        { code: "fi", name: "Finnish" },
        { code: "el", name: "Greek" },
        { code: "cs", name: "Czech" },
        { code: "hu", name: "Hungarian" },
        { code: "ro", name: "Romanian" },
        { code: "vi", name: "Vietnamese" },
        { code: "th", name: "Thai" },
        { code: "id", name: "Indonesian" },
        { code: "ms", name: "Malay" },
        { code: "he", name: "Hebrew" },
        { code: "other", name: "Other" }
    ];

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

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Technical Specifications</h2>
                <p className="text-gray-600 mt-1">Provide detailed technical information</p>
            </div>

            <div className="space-y-6">
                {/* Project Types (Multiple Select) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Type(s) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {projectTypeOptions.map((type) => (
                            <label key={type} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.projectTypes.includes(type)}
                                    onChange={() => handleProjectTypeToggle(type)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{type}</span>
                            </label>
                        ))}
                    </div>
                    {errors.projectTypes && (
                        <p className="text-red-500 text-sm mt-1">{errors.projectTypes}</p>
                    )}
                </div>

                {/* Genres */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Genres <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.genres}
                        onChange={(e) => {
                            updateFormData({ genres: e.target.value });
                            if (errors.genres) setErrors({ ...errors, genres: null });
                        }}
                        className={`w-full px-4 py-2 border text-black rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.genres ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >
                        <option value="">Select primary genre</option>
                        {genreOptions.map((genre) => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                    {errors.genres && (
                        <p className="text-red-500 text-sm mt-1">{errors.genres}</p>
                    )}
                </div>

                {/* Runtime */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Runtime
                    </label>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Hours</label>
                            <select
                                value={formData.runtimeHours}
                                onChange={(e) => handleRuntimeChange('runtimeHours', e.target.value)}
                                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                {Array.from({ length: 24 }, (_, i) => (
                                    <option key={i} value={i.toString().padStart(2, '0')}>
                                        {i.toString().padStart(2, '0')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Minutes</label>
                            <select
                                value={formData.runtimeMinutes}
                                onChange={(e) => handleRuntimeChange('runtimeMinutes', e.target.value)}
                                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                {Array.from({ length: 60 }, (_, i) => (
                                    <option key={i} value={i.toString().padStart(2, '0')}>
                                        {i.toString().padStart(2, '0')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Seconds</label>
                            <select
                                value={formData.runtimeSeconds}
                                onChange={(e) => handleRuntimeChange('runtimeSeconds', e.target.value)}
                                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

                {/* Completion Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Completion Date
                    </label>
                    <input
                        type="date"
                        value={formData.completionDate}
                        onChange={(e) => updateFormData({ completionDate: e.target.value })}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Production Budget
                        </label>
                        <input
                            type="text"
                            value={formData.productionBudget}
                            onChange={(e) => updateFormData({ productionBudget: e.target.value })}
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., $50,000"
                        />
                    </div>

                    {/* Country of Origin - Updated to CountrySelect */}
                    <div>
                        <CountrySelect
                            value={formData.countryOfOrigin}
                            onChange={(country) => updateFormData({ countryOfOrigin: country })}
                            placeholder="Select country of origin"
                            required={false}
                        />
                        <p className="text-xs text-gray-500 mt-1">Where was this film produced?</p>
                    </div>

                    {/* Country of Filming - Updated to CountrySelect */}
                    <div>
                        <CountrySelect
                            value={formData.countryOfFilming}
                            onChange={(country) => updateFormData({ countryOfFilming: country })}
                            placeholder="Select country of filming"
                            required={false}
                        />
                        <p className="text-xs text-gray-500 mt-1">Where was this film shot?</p>
                    </div>

                    {/* Primary Language */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Primary Language <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.language}
                            onChange={(e) => {
                                updateFormData({ language: e.target.value });
                                if (errors.language) setErrors({ ...errors, language: null });
                            }}
                            className={`w-full px-4 py-2 text-black border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.language ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Select primary language</option>
                            {languageOptions.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                        {errors.language && (
                            <p className="text-red-500 text-sm mt-1">{errors.language}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Select the primary language of your film
                        </p>
                    </div>

                    {/* Shooting Format */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Shooting Format
                        </label>
                        <select
                            value={formData.shootingFormat}
                            onChange={(e) => updateFormData({ shootingFormat: e.target.value })}
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select format</option>
                            {formatOptions.map((format) => (
                                <option key={format} value={format}>{format}</option>
                            ))}
                        </select>
                    </div>

                    {/* Aspect Ratio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Aspect Ratio
                        </label>
                        <select
                            value={formData.aspectRatio}
                            onChange={(e) => updateFormData({ aspectRatio: e.target.value })}
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            {aspectRatios.map((ratio) => (
                                <option key={ratio} value={ratio}>{ratio}</option>
                            ))}
                        </select>
                    </div>

                    {/* Film Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Film Color
                        </label>
                        <select
                            value={formData.filmColor}
                            onChange={(e) => updateFormData({ filmColor: e.target.value })}
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Color">Color</option>
                            <option value="Black and White">Black and White</option>
                            <option value="Mixed">Mixed</option>
                        </select>
                    </div>

                    {/* Student Project */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Student Project?
                        </label>
                        <select
                            value={formData.studentProject}
                            onChange={(e) => updateFormData({ studentProject: e.target.value })}
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>

                    {/* First Time Filmmaker */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Time Filmmaker?
                        </label>
                        <select
                            value={formData.firstTimeFilmmaker}
                            onChange={(e) => updateFormData({ firstTimeFilmmaker: e.target.value })}
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-6">
                <button
                    onClick={onPrev}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                    ← Previous
                </button>
                <button
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition"
                >
                    Next Step →
                </button>
            </div>
        </div>
    );
}