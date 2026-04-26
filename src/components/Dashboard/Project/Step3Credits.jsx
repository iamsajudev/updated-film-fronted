"use client";

import { Plus, Trash2, UserPlus, Users, Star, Film, Award } from "lucide-react";
import { useCallback, memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// PersonForm component with modern black styling
const PersonForm = memo(({ category, title, icon: Icon, persons, updateFormData, color }) => {
    const [isAdding, setIsAdding] = useState(false);

    const fields = {
        directors: [
            { name: "firstName", label: "First Name", placeholder: "First name", icon: "👤", colSpan: "col-span-4" },
            { name: "middleName", label: "Middle Name", placeholder: "Middle name", icon: "📝", colSpan: "col-span-4" },
            { name: "lastName", label: "Last Name", placeholder: "Last name", icon: "👤", colSpan: "col-span-4" },
            { name: "priorCredits", label: "Prior Credits", type: "textarea", placeholder: "Notable prior works", icon: "🏆", colSpan: "col-span-12" }
        ],
        writers: [
            { name: "firstName", label: "First Name", placeholder: "First name", icon: "👤", colSpan: "col-span-4" },
            { name: "middleName", label: "Middle Name", placeholder: "Middle name", icon: "📝", colSpan: "col-span-4" },
            { name: "lastName", label: "Last Name", placeholder: "Last name", icon: "👤", colSpan: "col-span-4" },
            { name: "priorCredits", label: "Prior Credits", type: "textarea", placeholder: "Notable prior works", icon: "📚", colSpan: "col-span-12" }
        ],
        producers: [
            { name: "firstName", label: "First Name", placeholder: "First name", icon: "👤", colSpan: "col-span-4" },
            { name: "middleName", label: "Middle Name", placeholder: "Middle name", icon: "📝", colSpan: "col-span-4" },
            { name: "lastName", label: "Last Name", placeholder: "Last name", icon: "👤", colSpan: "col-span-4" },
            { name: "priorCredits", label: "Prior Credits", type: "textarea", placeholder: "Notable prior works", icon: "💰", colSpan: "col-span-12" }
        ],
        keyCast: [
            { name: "firstName", label: "First Name", placeholder: "First name", icon: "👤", colSpan: "col-span-4" },
            { name: "middleName", label: "Middle Name", placeholder: "Middle name", icon: "📝", colSpan: "col-span-4" },
            { name: "lastName", label: "Last Name", placeholder: "Last name", icon: "👤", colSpan: "col-span-4" },
            { name: "role", label: "Role", placeholder: "Character name", icon: "🎭", colSpan: "col-span-12" },
            { name: "priorCredits", label: "Prior Credits", type: "textarea", placeholder: "Notable prior works", icon: "⭐", colSpan: "col-span-12" }
        ]
    };

    const currentFields = fields[category] || [];
    const [focusedField, setFocusedField] = useState(null);

    const addPerson = useCallback(() => {
        const newPerson = {};
        currentFields.forEach(field => { newPerson[field.name] = ""; });
        updateFormData({
            [category]: [...persons, newPerson]
        });
        setIsAdding(true);
        setTimeout(() => setIsAdding(false), 300);
    }, [category, currentFields, persons, updateFormData]);

    const removePerson = useCallback((index) => {
        const updated = [...persons];
        updated.splice(index, 1);
        updateFormData({ [category]: updated });
    }, [category, persons, updateFormData]);

    const updatePerson = useCallback((index, field, value) => {
        const updated = [...persons];
        updated[index] = { ...updated[index], [field]: value };
        updateFormData({ [category]: updated });
    }, [category, persons, updateFormData]);

    const getGradient = () => {
        switch(category) {
            case 'directors': return 'from-[#1EB97A] to-emerald-600';
            case 'writers': return 'from-blue-500 to-cyan-500';
            case 'producers': return 'from-purple-500 to-pink-500';
            case 'keyCast': return 'from-orange-500 to-emerald-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getBorderColor = () => {
        switch(category) {
            case 'directors': return 'border-[#1EB97A]/30 focus:border-[#1EB97A]';
            case 'writers': return 'border-blue-500/30 focus:border-blue-500';
            case 'producers': return 'border-purple-500/30 focus:border-purple-500';
            case 'keyCast': return 'border-orange-500/30 focus:border-orange-500';
            default: return 'border-gray-600';
        }
    };

    const getRingColor = () => {
        switch(category) {
            case 'directors': return 'ring-[#1EB97A]/20';
            case 'writers': return 'ring-blue-500/20';
            case 'producers': return 'ring-purple-500/20';
            case 'keyCast': return 'ring-orange-500/20';
            default: return 'ring-gray-500/20';
        }
    };

    const getTextColor = () => {
        switch(category) {
            case 'directors': return 'text-[#1EB97A]';
            case 'writers': return 'text-blue-400';
            case 'producers': return 'text-purple-400';
            case 'keyCast': return 'text-orange-400';
            default: return 'text-gray-400';
        }
    };

    const borderColorClass = getBorderColor();
    const ringColorClass = getRingColor();
    const textColorClass = getTextColor();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
        >
            {/* Header */}
            <div className={`px-6 py-4 bg-gradient-to-r ${getGradient()} bg-opacity-10 border-b border-gray-800`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getGradient()} rounded-xl flex items-center justify-center shadow-lg`}>
                            {Icon && <Icon className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{title}</h3>
                            <p className="text-sm text-gray-400">
                                {persons.length} {persons.length === 1 ? 'person' : 'people'} added
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 bg-gray-800 rounded-full text-xs ${textColorClass}`}>
                            {persons.length} / 10
                        </div>
                    </div>
                </div>
            </div>

            {/* Persons List */}
            <div className="p-6 space-y-4">
                <AnimatePresence>
                    {persons.map((person, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 bg-gradient-to-br ${getGradient()} rounded-lg flex items-center justify-center`}>
                                        <span className="text-white text-xs font-bold">{index + 1}</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-300">
                                        {title.slice(0, -1)} #{index + 1}
                                    </h4>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => removePerson(index)}
                                    className="text-emerald-400 hover:text-emerald-300 transition-colors p-1 rounded-lg hover:bg-emerald-500/10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </motion.button>
                            </div>
                            
                            <div className="grid grid-cols-12 gap-4">
                                {currentFields.map((field) => (
                                    <div key={field.name} className={field.colSpan || "col-span-12"}>
                                        <label className="flex items-center gap-1 text-xs font-medium text-gray-400 mb-1">
                                            <span>{field.icon}</span>
                                            {field.label}
                                        </label>
                                        {field.type === "textarea" ? (
                                            <textarea
                                                value={person[field.name] || ""}
                                                onChange={(e) => updatePerson(index, field.name, e.target.value)}
                                                onFocus={() => setFocusedField(field.name)}
                                                onBlur={() => setFocusedField(null)}
                                                rows={3}
                                                className={`w-full px-3 py-2 text-white bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none placeholder-gray-500 ${
                                                    focusedField === field.name
                                                        ? `${borderColorClass} ring-2 ${ringColorClass}`
                                                        : 'border-gray-700 hover:border-gray-600'
                                                }`}
                                                placeholder={field.placeholder}
                                            />
                                        ) : (
                                            <input
                                                type={field.type || "text"}
                                                value={person[field.name] || ""}
                                                onChange={(e) => updatePerson(index, field.name, e.target.value)}
                                                onFocus={() => setFocusedField(field.name)}
                                                onBlur={() => setFocusedField(null)}
                                                className={`w-full px-3 py-2 text-white bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder-gray-500 ${
                                                    focusedField === field.name
                                                        ? `${borderColorClass} ring-2 ${ringColorClass}`
                                                        : 'border-gray-700 hover:border-gray-600'
                                                }`}
                                                placeholder={field.placeholder}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Add Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={addPerson}
                    className={`w-full py-3 mt-2 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group ${
                        isAdding ? 'scale-95' : ''
                    } border-gray-700 hover:border-[#1EB97A] bg-gray-800/30 hover:bg-gray-800/50 transition-all`}
                >
                    <Plus className={`w-5 h-5 ${textColorClass} group-hover:scale-110 transition-transform`} />
                    <span className={`font-medium ${textColorClass}`}>
                        Add {title.slice(0, -1)}
                    </span>
                </motion.button>
            </div>
        </motion.div>
    );
});

PersonForm.displayName = 'PersonForm';

export default function Step3Credits({ formData, updateFormData, onNext, onPrev }) {
    const [focusedButton, setFocusedButton] = useState(null);

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
                    Step 3 of 7
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1EB97A] to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-[#1EB97A]/20">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Credits
                        </h2>
                    </div>
                </div>
                <p className="text-gray-400 mt-2 max-w-2xl">
                    Add key personnel for your project. This helps us properly credit everyone involved.
                </p>
            </div>

            {/* Info Banner */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-[#1EB97A]/10 to-emerald-500/10 rounded-xl p-4 border border-[#1EB97A]/20"
            >
                <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-[#1EB97A] mt-0.5" />
                    <div>
                        <p className="text-sm text-[#1EB97A] font-medium">Credit Information</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Add at least one director for your project. All other credits are optional but recommended.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Credit Sections */}
            <div className="space-y-6">
                <PersonForm
                    category="directors"
                    title="Directors"
                    icon={Film}
                    persons={formData.directors || []}
                    updateFormData={updateFormData}
                />

                <PersonForm
                    category="writers"
                    title="Writers"
                    icon={Users}
                    persons={formData.writers || []}
                    updateFormData={updateFormData}
                />

                <PersonForm
                    category="producers"
                    title="Producers"
                    icon={Award}
                    persons={formData.producers || []}
                    updateFormData={updateFormData}
                />

                <PersonForm
                    category="keyCast"
                    title="Key Cast"
                    icon={Star}
                    persons={formData.keyCast || []}
                    updateFormData={updateFormData}
                />
            </div>

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
                    onMouseEnter={() => setFocusedButton('prev')}
                    onMouseLeave={() => setFocusedButton(null)}
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
                    onMouseEnter={() => setFocusedButton('next')}
                    onMouseLeave={() => setFocusedButton(null)}
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