"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import CountrySelect from "../../Common/CountrySelect";

export default function Step5Screenings({ formData, updateFormData, onNext, onPrev }) {
    const [newScreening, setNewScreening] = useState({
        festivalName: "",
        date: "",
        venue: "",
        city: "",
        country: "",
        status: "pending"
    });

    const [newDistributor, setNewDistributor] = useState({
        company: "",
        contactName: "",
        email: "",
        phone: "",
        territory: ""
    });

    const addScreening = () => {
        if (newScreening.festivalName && newScreening.date) {
            updateFormData({
                screenings: [...formData.screenings, { ...newScreening, id: Date.now() }]
            });
            setNewScreening({
                festivalName: "",
                date: "",
                venue: "",
                city: "",
                country: "",
                status: "pending"
            });
        }
    };

    const removeScreening = (index) => {
        const updated = [...formData.screenings];
        updated.splice(index, 1);
        updateFormData({ screenings: updated });
    };

    const addDistributor = () => {
        if (newDistributor.company && newDistributor.contactName) {
            updateFormData({
                distributors: [...formData.distributors, { ...newDistributor, id: Date.now() }]
            });
            setNewDistributor({
                company: "",
                contactName: "",
                email: "",
                phone: "",
                territory: ""
            });
        }
    };

    const removeDistributor = (index) => {
        const updated = [...formData.distributors];
        updated.splice(index, 1);
        updateFormData({ distributors: updated });
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "selected":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "screened":
                return "bg-blue-100 text-blue-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Screenings & Distribution</h2>
                <p className="text-gray-600 mt-1">Tell us about past/future screenings and distribution</p>
            </div>

            <div className="space-y-6">
                {/* Screenings Section */}
                <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Festival Screenings</h3>
                    
                    {/* Existing Screenings */}
                    {formData.screenings.length > 0 && (
                        <div className="space-y-3 mb-4">
                            {formData.screenings.map((screening, index) => (
                                <div key={screening.id} className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-semibold text-gray-900">{screening.festivalName}</h4>
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(screening.status)}`}>
                                                    {screening.status.charAt(0).toUpperCase() + screening.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Date:</span> {screening.date}
                                            </p>
                                            {screening.venue && (
                                                <p className="text-sm text-gray-500">
                                                    <span className="font-medium">Venue:</span> {screening.venue}
                                                </p>
                                            )}
                                            {(screening.city || screening.country) && (
                                                <p className="text-sm text-gray-500">
                                                    <span className="font-medium">Location:</span> {[screening.city, screening.country].filter(Boolean).join(", ")}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeScreening(index)}
                                            className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
                                            aria-label="Remove screening"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add New Screening */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Add New Screening</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Festival Name *"
                                value={newScreening.festivalName}
                                onChange={(e) => setNewScreening({ ...newScreening, festivalName: e.target.value })}
                                className="text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="date"
                                placeholder="Date *"
                                value={newScreening.date}
                                onChange={(e) => setNewScreening({ ...newScreening, date: e.target.value })}
                                className="text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Venue"
                                value={newScreening.venue}
                                onChange={(e) => setNewScreening({ ...newScreening, venue: e.target.value })}
                                className="text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {/* <input
                                type="text"
                                placeholder="City"
                                value={newScreening.city}
                                onChange={(e) => setNewScreening({ ...newScreening, city: e.target.value })}
                                className="text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            /> */}
                            <select
                                value={newScreening.status}
                                onChange={(e) => setNewScreening({ ...newScreening, status: e.target.value })}
                                className="text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="pending">Pending</option>
                                <option value="selected">Selected</option>
                                <option value="screened">Screened</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            {/* Country Field - Updated to CountrySelect */}
                            <div className="md:col-span-1">
                                <CountrySelect
                                    value={newScreening.country}
                                    onChange={(country) => setNewScreening({ ...newScreening, country: country })}
                                    placeholder="Select country"
                                    required={false}
                                />
                            </div>
                            
                        </div>
                        <button
                            type="button"
                            onClick={addScreening}
                            disabled={!newScreening.festivalName || !newScreening.date}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Screening
                        </button>
                        <p className="text-xs text-gray-500 mt-1">* Festival Name and Date are required</p>
                    </div>
                </div>

                {/* Distributors Section */}
                <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Distributors</h3>
                    
                    {/* Existing Distributors */}
                    {formData.distributors.length > 0 && (
                        <div className="space-y-3 mb-4">
                            {formData.distributors.map((distributor, index) => (
                                <div key={distributor.id} className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{distributor.company}</h4>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Contact:</span> {distributor.contactName}
                                            </p>
                                            <div className="flex flex-wrap gap-3 mt-1">
                                                {distributor.email && (
                                                    <p className="text-sm text-gray-500">
                                                        <span className="font-medium">Email:</span> {distributor.email}
                                                    </p>
                                                )}
                                                {distributor.phone && (
                                                    <p className="text-sm text-gray-500">
                                                        <span className="font-medium">Phone:</span> {distributor.phone}
                                                    </p>
                                                )}
                                            </div>
                                            {distributor.territory && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    <span className="font-medium">Territory:</span> {distributor.territory}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeDistributor(index)}
                                            className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
                                            aria-label="Remove distributor"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add New Distributor */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Add New Distributor</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Company Name *"
                                value={newDistributor.company}
                                onChange={(e) => setNewDistributor({ ...newDistributor, company: e.target.value })}
                                className="text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Contact Name *"
                                value={newDistributor.contactName}
                                onChange={(e) => setNewDistributor({ ...newDistributor, contactName: e.target.value })}
                                className="text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newDistributor.email}
                                onChange={(e) => setNewDistributor({ ...newDistributor, email: e.target.value })}
                                className="text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="tel"
                                placeholder="Phone"
                                value={newDistributor.phone}
                                onChange={(e) => setNewDistributor({ ...newDistributor, phone: e.target.value })}
                                className="text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Territory (e.g., North America, Worldwide)"
                                value={newDistributor.territory}
                                onChange={(e) => setNewDistributor({ ...newDistributor, territory: e.target.value })}
                                className="md:col-span-2 text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={addDistributor}
                            disabled={!newDistributor.company || !newDistributor.contactName}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Distributor
                        </button>
                        <p className="text-xs text-gray-500 mt-1">* Company Name and Contact Name are required</p>
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
                    onClick={onNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition"
                >
                    Next Step →
                </button>
            </div>
        </div>
    );
}