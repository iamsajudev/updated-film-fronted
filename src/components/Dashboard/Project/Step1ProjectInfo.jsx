"use client";

import { useState } from "react";

export default function Step1ProjectInfo({ formData, updateFormData, onNext }) {
    const [errors, setErrors] = useState({});

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

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Project Information</h2>
                <p className="text-gray-600 mt-1">Tell us about your project</p>
            </div>

            <div className="space-y-4">
                {/* Project Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.projectType}
                        onChange={(e) => updateFormData({ projectType: e.target.value })}
                        className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select project type</option>
                        <option value="short_film">Short Film</option>
                        <option value="documentary">Documentary</option>
                        <option value="feature_film">Feature Film</option>
                        <option value="music_video">Music Video</option>
                        <option value="commercial">Commercial</option>
                        <option value="animation">Animation</option>
                        <option value="web_series">Web Series</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.projectType && (
                        <p className="text-red-500 text-sm mt-1">{errors.projectType}</p>
                    )}
                </div>

                {/* Project Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.projectTitle}
                        onChange={(e) => updateFormData({ projectTitle: e.target.value })}
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter project title"
                    />
                    {errors.projectTitle && (
                        <p className="text-red-500 text-sm mt-1">{errors.projectTitle}</p>
                    )}
                </div>

                {/* Brief Synopsis */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brief Synopsis <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.briefSynopsis}
                        onChange={(e) => updateFormData({ briefSynopsis: e.target.value })}
                        rows={5}
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Provide a brief synopsis of your project (50-500 characters)"
                    />
                    <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-500">
                            {formData.briefSynopsis.length} / 500 characters
                        </p>
                        {errors.briefSynopsis && (
                            <p className="text-red-500 text-xs">{errors.briefSynopsis}</p>
                        )}
                    </div>
                </div>

                {/* Non-English Title Section */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="hasNonEnglishTitle"
                        checked={formData.hasNonEnglishTitle}
                        onChange={(e) => updateFormData({ hasNonEnglishTitle: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="hasNonEnglishTitle" className="text-sm font-medium text-gray-700">
                        Project has non-English title
                    </label>
                </div>

                {formData.hasNonEnglishTitle && (
                    <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Original Title (Non-English)
                            </label>
                            <input
                                type="text"
                                value={formData.nonEnglishTitle}
                                onChange={(e) => updateFormData({ nonEnglishTitle: e.target.value })}
                                className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter original title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Original Synopsis (Non-English)
                            </label>
                            <textarea
                                value={formData.nonEnglishSynopsis}
                                onChange={(e) => updateFormData({ nonEnglishSynopsis: e.target.value })}
                                rows={3}
                                className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter original synopsis"
                            />
                        </div>
                    </div>
                )}

                {/* Social Media Links */}
                <div className="space-y-4">
                    <h3 className="text-md font-semibold text-gray-900">Social Media Links (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Website
                            </label>
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => updateFormData({ website: e.target.value })}
                                className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="https://"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Twitter
                            </label>
                            <input
                                type="text"
                                value={formData.twitter}
                                onChange={(e) => updateFormData({ twitter: e.target.value })}
                                className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="@username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Facebook
                            </label>
                            <input
                                type="url"
                                value={formData.facebook}
                                onChange={(e) => updateFormData({ facebook: e.target.value })}
                                className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Facebook URL"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Instagram
                            </label>
                            <input
                                type="text"
                                value={formData.instagram}
                                onChange={(e) => updateFormData({ instagram: e.target.value })}
                                className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="@username"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6">
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