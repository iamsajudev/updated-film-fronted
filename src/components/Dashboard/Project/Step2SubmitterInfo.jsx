"use client";

import { useState } from "react";
import CountrySelect from "../../Common/CountrySelect";

export default function Step2SubmitterInfo({ formData, updateFormData, onNext, onPrev }) {
    const [errors, setErrors] = useState({});

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
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Submitter Information</h2>
                <p className="text-gray-600 mt-1">Tell us about yourself</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateFormData({ email: e.target.value })}
                            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateFormData({ phone: e.target.value })}
                            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+1 234 567 8900"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => updateFormData({ address: e.target.value })}
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Street address"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => updateFormData({ city: e.target.value })}
                            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="City"
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            State/Province
                        </label>
                        <input
                            type="text"
                            value={formData.stateProvince}
                            onChange={(e) => updateFormData({ stateProvince: e.target.value })}
                            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="State/Province"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Postal Code
                        </label>
                        <input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => updateFormData({ postalCode: e.target.value })}
                            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Postal code"
                        />
                    </div>

                    <div>
                        <CountrySelect
                            value={formData.country}
                            onChange={(country) => updateFormData({ country })}
                            required={true}
                            placeholder="Select a country"
                        />
                        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Birth Date
                        </label>
                        <input
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => updateFormData({ birthDate: e.target.value })}
                            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                        </label>
                        <select
                            value={formData.gender}
                            onChange={(e) => updateFormData({ gender: e.target.value })}
                            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="non-binary">Non-binary</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pronouns
                        </label>
                        <input
                            type="text"
                            value={formData.pronouns}
                            onChange={(e) => updateFormData({ pronouns: e.target.value })}
                            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., He/Him, She/Her, They/Them"
                        />
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