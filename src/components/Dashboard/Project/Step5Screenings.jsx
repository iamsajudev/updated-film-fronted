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
        if (newScreening.festivalName && newScreening.date) {
            updateFormData({
                screenings: [...formData.screenings, { 
                    ...newScreening, 
                    id: Date.now(),
                    city: newScreening.city || ""
                }]
            });
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
                return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30";
            case "pending":
                return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30";
            case "screened":
                return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30";
            case "rejected":
                return "bg-gradient-to-r from-emerald-500/20 to-rose-500/20 text-emerald-400 border-emerald-500/30";
            default:
                return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30";
        }
    };

    const getGradient = (section) => {
        const gradients = {
            screenings: "from-purple-500 to-pink-500",
            distributors: "from-blue-500 to-cyan-500"
        };
        return gradients[section] || "from-gray-500 to-gray-600";
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
                    Step 6 of 7
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getGradient("screenings")} rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20`}>
                        <Ticket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Screenings & Distribution
                        </h2>
                    </div>
                </div>
                <p className="text-gray-400 mt-2 max-w-2xl">
                    Tell us about past/future screenings and distribution partners.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-gray-800">
                <button
                    onClick={() => setActiveTab("screenings")}
                    className={`px-6 py-3 rounded-t-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                        activeTab === "screenings"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                            : "text-gray-400 hover:text-purple-400 hover:bg-gray-800"
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
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                            : "text-gray-400 hover:text-blue-400 hover:bg-gray-800"
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
                        className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        <div className={`px-6 py-4 bg-gradient-to-r ${getGradient("screenings")} bg-opacity-10 border-b border-gray-800`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 bg-gradient-to-br ${getGradient("screenings")} rounded-lg flex items-center justify-center`}>
                                    <Calendar className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Festival Screenings</h3>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Existing Screenings */}
                            {formData.screenings.length > 0 && (
                                <div className="space-y-3 mb-6">
                                    <h4 className="text-sm font-medium text-gray-400">Added Screenings</h4>
                                    <AnimatePresence>
                                        {formData.screenings.map((screening, index) => (
                                            <motion.div
                                                key={screening.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                            <h4 className="font-semibold text-white flex items-center gap-2">
                                                                <Award className="w-4 h-4 text-purple-400" />
                                                                {screening.festivalName}
                                                            </h4>
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(screening.status)}`}>
                                                                {screening.status.charAt(0).toUpperCase() + screening.status.slice(1)}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                                                <Calendar className="w-3 h-3 text-gray-500" />
                                                                <span className="font-medium text-gray-300">Date:</span> {screening.date}
                                                            </p>
                                                            {screening.venue && (
                                                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                                                    <MapPin className="w-3 h-3 text-gray-500" />
                                                                    <span className="font-medium text-gray-300">Venue:</span> {screening.venue}
                                                                </p>
                                                            )}
                                                            {screening.country && (
                                                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                                                    <Globe className="w-3 h-3 text-gray-500" />
                                                                    <span className="font-medium text-gray-300">Location:</span> {screening.country}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => removeScreening(index)}
                                                        className="text-emerald-400 hover:text-emerald-300 transition-colors p-1 rounded-lg hover:bg-emerald-500/10"
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            <Award className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Festival Name *"
                                            value={newScreening.festivalName}
                                            onChange={(e) => setNewScreening({ ...newScreening, festivalName: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-white placeholder-gray-500"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="date"
                                            value={newScreening.date}
                                            onChange={(e) => setNewScreening({ ...newScreening, date: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-white [color-scheme:dark]"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Venue"
                                            value={newScreening.venue}
                                            onChange={(e) => setNewScreening({ ...newScreening, venue: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-white placeholder-gray-500"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            🏷️
                                        </div>
                                        <select
                                            value={newScreening.status}
                                            onChange={(e) => setNewScreening({ ...newScreening, status: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer text-white"
                                        >
                                            <option value="pending" className="bg-gray-800">Pending</option>
                                            <option value="selected" className="bg-gray-800">Selected</option>
                                            <option value="screened" className="bg-gray-800">Screened</option>
                                            <option value="rejected" className="bg-gray-800">Rejected</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                            className="w-full bg-gray-800 border-gray-700 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <p className="text-xs text-gray-500">* Festival Name and Date are required</p>
                                    <button
                                        type="button"
                                        onClick={addScreening}
                                        disabled={!newScreening.festivalName || !newScreening.date}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
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
                        className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        <div className={`px-6 py-4 bg-gradient-to-r ${getGradient("distributors")} bg-opacity-10 border-b border-gray-800`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 bg-gradient-to-br ${getGradient("distributors")} rounded-lg flex items-center justify-center`}>
                                    <Building className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Distributors</h3>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Existing Distributors */}
                            {formData.distributors.length > 0 && (
                                <div className="space-y-3 mb-6">
                                    <h4 className="text-sm font-medium text-gray-400">Added Distributors</h4>
                                    <AnimatePresence>
                                        {formData.distributors.map((distributor, index) => (
                                            <motion.div
                                                key={distributor.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-white flex items-center gap-2">
                                                            <Building className="w-4 h-4 text-blue-400" />
                                                            {distributor.company}
                                                        </h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                                                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                                <span className="font-medium text-gray-300">Contact:</span> {distributor.contactName}
                                                            </p>
                                                            {distributor.email && (
                                                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                                                    <Mail className="w-3 h-3 text-gray-500" />
                                                                    <span className="font-medium text-gray-300">Email:</span> {distributor.email}
                                                                </p>
                                                            )}
                                                            {distributor.phone && (
                                                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                                                    <Phone className="w-3 h-3 text-gray-500" />
                                                                    <span className="font-medium text-gray-300">Phone:</span> {distributor.phone}
                                                                </p>
                                                            )}
                                                            {distributor.territory && (
                                                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                                                    <Globe className="w-3 h-3 text-gray-500" />
                                                                    <span className="font-medium text-gray-300">Territory:</span> {distributor.territory}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => removeDistributor(index)}
                                                        className="text-emerald-400 hover:text-emerald-300 transition-colors p-1 rounded-lg hover:bg-emerald-500/10"
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            <Building className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Company Name *"
                                            value={newDistributor.company}
                                            onChange={(e) => setNewDistributor({ ...newDistributor, company: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-gray-500"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Contact Name *"
                                            value={newDistributor.contactName}
                                            onChange={(e) => setNewDistributor({ ...newDistributor, contactName: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-gray-500"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={newDistributor.email}
                                            onChange={(e) => setNewDistributor({ ...newDistributor, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-gray-500"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="Phone"
                                            value={newDistributor.phone}
                                            onChange={(e) => setNewDistributor({ ...newDistributor, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-gray-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2 relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Territory (e.g., North America, Worldwide)"
                                            value={newDistributor.territory}
                                            onChange={(e) => setNewDistributor({ ...newDistributor, territory: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-gray-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <p className="text-xs text-gray-500">* Company Name and Contact Name are required</p>
                                    <button
                                        type="button"
                                        onClick={addDistributor}
                                        disabled={!newDistributor.company || !newDistributor.contactName}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
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
                    onClick={onNext}
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