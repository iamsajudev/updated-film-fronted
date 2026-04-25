"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Calendar, MapPin, Building, Mail, Phone, Globe, Award, Ticket, Film } from "lucide-react";
import CountrySelect from "../../Common/CountrySelect";

export default function Step5Screenings({ formData, updateFormData, onNext, onPrev }) {
    const [newScreening, setNewScreening] = useState({
        festivalName: "",
        date: "",
        venue: "",
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

    const [focusedField, setFocusedField] = useState(null);
    const [activeTab, setActiveTab] = useState("screenings");

    const addScreening = () => {
        // Check if required fields are filled
        if (newScreening.festivalName && newScreening.date) {
            updateFormData({
                screenings: [...formData.screenings, { 
                    ...newScreening, 
                    id: Date.now(),
                    city: newScreening.city || "" // Add city if needed
                }]
            });
            // Reset form
            setNewScreening({
                festivalName: "",
                date: "",
                venue: "",
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
                return "bg-linear-to-r from-green-100 to-emerald-100 text-green-700 border-green-200";
            case "pending":
                return "bg-linear-to-r from-yellow-100 to-amber-100 text-yellow-700 border-yellow-200";
            case "screened":
                return "bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200";
            case "rejected":
                return "bg-linear-to-r from-red-100 to-rose-100 text-red-700 border-red-200";
            default:
                return "bg-linear-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "selected": return <Award className="w-3 h-3" />;
            case "screened": return <Film className="w-3 h-3" />;
            case "rejected": return <Trash2 className="w-3 h-3" />;
            default: return <Calendar className="w-3 h-3" />;
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-4">
                    <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
                    Step 5 of 6
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Ticket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Screenings & Distribution
                        </h2>
                    </div>
                </div>
                <p className="text-gray-500 mt-2 max-w-2xl">
                    Tell us about past/future screenings and distribution partners.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("screenings")}
                    className={`px-6 py-3 rounded-t-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                        activeTab === "screenings"
                            ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                            : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                    }`}
                >
                    <Calendar className="w-4 h-4" />
                    Festival Screenings
                    {formData.screenings.length > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                            {formData.screenings.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("distributors")}
                    className={`px-6 py-3 rounded-t-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                        activeTab === "distributors"
                            ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                            : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                    }`}
                >
                    <Building className="w-4 h-4" />
                    Distributors
                    {formData.distributors.length > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                            {formData.distributors.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Screenings Section */}
            <AnimatePresence mode="wait">
                {activeTab === "screenings" && (
                    <motion.div
                        key="screenings"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="px-6 py-4 bg-linear-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Festival Screenings</h3>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Existing Screenings */}
                            {formData.screenings.length > 0 && (
                                <div className="space-y-3 mb-6">
                                    <h4 className="text-sm font-medium text-gray-700">Added Screenings</h4>
                                    <AnimatePresence>
                                        {formData.screenings.map((screening, index) => (
                                            <motion.div
                                                key={screening.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-linear-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                                <Award className="w-4 h-4 text-purple-500" />
                                                                {screening.festivalName}
                                                            </h4>
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(screening.status)}`}>
                                                                {getStatusIcon(screening.status)}
                                                                {screening.status.charAt(0).toUpperCase() + screening.status.slice(1)}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                                                <Calendar className="w-3 h-3 text-gray-400" />
                                                                <span className="font-medium">Date:</span> {screening.date}
                                                            </p>
                                                            {screening.venue && (
                                                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                                                    <MapPin className="w-3 h-3 text-gray-400" />
                                                                    <span className="font-medium">Venue:</span> {screening.venue}
                                                                </p>
                                                            )}
                                                            {screening.country && (
                                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                                    <Globe className="w-3 h-3 text-gray-400" />
                                                                    <span className="font-medium">Location:</span> {screening.country}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => removeScreening(index)}
                                                        className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50"
                                                        aria-label="Remove screening"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Add New Screening */}
                            <div className="space-y-4">
                                {/* <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Plus className="w-4 h-4 text-purple-500" />
                                    Add New Screening
                                </h4> */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Award className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Festival Name *"
                                            value={newScreening.festivalName}
                                            onChange={(e) => setNewScreening({ ...newScreening, festivalName: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="date"
                                            value={newScreening.date}
                                            onChange={(e) => setNewScreening({ ...newScreening, date: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Venue"
                                            value={newScreening.venue}
                                            onChange={(e) => setNewScreening({ ...newScreening, venue: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            🏷️
                                        </div>
                                        <select
                                            value={newScreening.status}
                                            onChange={(e) => setNewScreening({ ...newScreening, status: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="selected">Selected</option>
                                            <option value="screened">Screened</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <CountrySelect
                                            value={newScreening.country}
                                            onChange={(country) => setNewScreening({ ...newScreening, country: country })}
                                            placeholder="Select country"
                                            required={false}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <p className="text-xs text-gray-500">* Festival Name and Date are required</p>
                                    <button
                                        type="button"
                                        onClick={addScreening}
                                        disabled={!newScreening.festivalName || !newScreening.date}
                                        className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Screening
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Distributors Section */}
                {activeTab === "distributors" && (
                    <motion.div
                        key="distributors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="px-6 py-4 bg-linear-to-r from-blue-50 to-cyan-50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <Building className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Distributors</h3>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Existing Distributors */}
                            {formData.distributors.length > 0 && (
                                <div className="space-y-3 mb-6">
                                    <h4 className="text-sm font-medium text-gray-700">Added Distributors</h4>
                                    <AnimatePresence>
                                        {formData.distributors.map((distributor, index) => (
                                            <motion.div
                                                key={distributor.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-linear-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                            <Building className="w-4 h-4 text-blue-500" />
                                                            {distributor.company}
                                                        </h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                                <span className="font-medium">Contact:</span> {distributor.contactName}
                                                            </p>
                                                            {distributor.email && (
                                                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                                                    <Mail className="w-3 h-3 text-gray-400" />
                                                                    <span className="font-medium">Email:</span> {distributor.email}
                                                                </p>
                                                            )}
                                                            {distributor.phone && (
                                                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                                                    <Phone className="w-3 h-3 text-gray-400" />
                                                                    <span className="font-medium">Phone:</span> {distributor.phone}
                                                                </p>
                                                            )}
                                                            {distributor.territory && (
                                                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                                                    <Globe className="w-3 h-3 text-gray-400" />
                                                                    <span className="font-medium">Territory:</span> {distributor.territory}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => removeDistributor(index)}
                                                        className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50"
                                                        aria-label="Remove distributor"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Add New Distributor */}
                            <div className="space-y-4">
                                {/* <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Plus className="w-4 h-4 text-blue-500" />
                                    Add New Distributor
                                </h4> */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Building className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Company Name *"
                                            value={newDistributor.company}
                                            onChange={(e) => setNewDistributor({ ...newDistributor, company: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Contact Name *"
                                            value={newDistributor.contactName}
                                            onChange={(e) => setNewDistributor({ ...newDistributor, contactName: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={newDistributor.email}
                                            onChange={(e) => setNewDistributor({ ...newDistributor, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="Phone"
                                            value={newDistributor.phone}
                                            onChange={(e) => setNewDistributor({ ...newDistributor, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                    </div>

                                    <div className="md:col-span-2 relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Territory (e.g., North America, Worldwide)"
                                            value={newDistributor.territory}
                                            onChange={(e) => setNewDistributor({ ...newDistributor, territory: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <p className="text-xs text-gray-500">* Company Name and Contact Name are required</p>
                                    <button
                                        type="button"
                                        onClick={addDistributor}
                                        disabled={!newDistributor.company || !newDistributor.contactName}
                                        className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Distributor
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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
                    onClick={onNext}
                    className="group relative px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all duration-300 overflow-hidden"
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