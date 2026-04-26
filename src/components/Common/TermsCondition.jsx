"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, FileText, Calendar, DollarSign, Shield, Trophy, Send, X } from "lucide-react";

const TermsCondition = () => {
    const [activeTab, setActiveTab] = useState("eligibility");
    const [accepted, setAccepted] = useState(false);

    const tabs = [
        { id: "eligibility", label: "Eligibility", icon: <CheckCircle className="w-4 h-4" /> },
        { id: "submission", label: "Submission", icon: <Send className="w-4 h-4" /> },
        { id: "rights", label: "IP Rights", icon: <FileText className="w-4 h-4" /> },
        { id: "nomination", label: "Nomination", icon: <Trophy className="w-4 h-4" /> },
        { id: "fees", label: "Fees", icon: <DollarSign className="w-4 h-4" /> },
        { id: "conduct", label: "Conduct", icon: <Shield className="w-4 h-4" /> },
    ];

    const content = {
        eligibility: {
            title: "Eligibility Requirements",
            icon: <CheckCircle className="w-5 h-5 text-[#1EB97A]" />,
            gradient: "from-[#1EB97A]/10 to-emerald-500/10",
            items: [
                "Film must be completed within the last 2 years",
                "All genres welcome (narrative, documentary, animation, experimental)",
                "Films must be in English or have English subtitles",
                "Short films: under 40 minutes | Feature films: 40+ minutes",
                "Submitter must hold all necessary rights and permissions",
            ]
        },
        submission: {
            title: "Submission Guidelines",
            icon: <Send className="w-5 h-5 text-blue-400" />,
            gradient: "from-blue-500/10 to-cyan-500/10",
            items: [
                "Submit through our online platform only",
                "Accepted formats: MP4, MOV, AVI, or streaming links",
                "Max file size: 10GB (features) / 5GB (shorts)",
                "Include synopsis, poster, and trailer (optional)",
                "Multiple entries allowed with separate fees",
            ]
        },
        rights: {
            title: "Intellectual Property Rights",
            icon: <FileText className="w-5 h-5 text-purple-400" />,
            gradient: "from-purple-500/10 to-pink-500/10",
            items: [
                "Filmmakers retain full ownership of their work",
                "Non-exclusive license for festival screening",
                "Festival may use clips for promotional purposes",
                "Credit always given to original creators",
                "No distribution or sale to third parties without permission",
            ]
        },
        nomination: {
            title: "Nomination Process",
            icon: <Trophy className="w-5 h-5 text-amber-400" />,
            gradient: "from-amber-500/10 to-orange-500/10",
            items: [
                "Preliminary review by selection committee",
                "Notification within 4-6 weeks of submission",
                "Jury decisions are final and binding",
                "Nominees must be available for events",
                "Winners announced at awards ceremony",
            ]
        },
        fees: {
            title: "Fees & Payments",
            icon: <DollarSign className="w-5 h-5 text-green-400" />,
            gradient: "from-green-500/10 to-emerald-500/10",
            items: [
                "Submission fees are non-refundable",
                "Early Bird (30 days): $25",
                "Regular (31-60 days): $35",
                "Late (61-90 days): $45",
                "Fee waivers available for students",
            ]
        },
        conduct: {
            title: "Code of Conduct",
            icon: <Shield className="w-5 h-5 text-emerald-400" />,
            gradient: "from-emerald-500/10 to-rose-500/10",
            items: [
                "Treat all participants with respect",
                "No harassment or discrimination",
                "Promote festival positively",
                "No manipulation of judging process",
                "Professional conduct at all events",
            ]
        },
    };

    const currentContent = content[activeTab];

    return (
        <div className="min-h-screen bg-black py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#1EB97A]/20 to-emerald-500/20 border border-[#1EB97A]/30 text-[#1EB97A] text-xs font-semibold mb-4">
                        <Shield className="w-3 h-3" />
                        Legal Agreement
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Terms and Conditions
                    </h1>
                    <p className="text-gray-400 mt-3 text-sm md:text-base">
                        For Film Submission & Nomination
                    </p>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 shadow-xl overflow-hidden mb-6"
                >
                    <div className="border-b border-gray-800 overflow-x-auto">
                        <div className="flex">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-5 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? "text-[#1EB97A] border-b-2 border-[#1EB97A] bg-[#1EB97A]/5"
                                            : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className={`p-6 bg-gradient-to-br ${currentContent.gradient}`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-gray-800 rounded-xl">
                                    {currentContent.icon}
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    {currentContent.title}
                                </h2>
                            </div>
                            
                            <ul className="space-y-3">
                                {currentContent.items.map((item, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-start gap-3 text-gray-300 group"
                                    >
                                        <span className="text-[#1EB97A] mt-1 text-sm">▹</span>
                                        <span className="text-sm leading-relaxed">{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Acceptance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 shadow-xl p-6"
                >
                    <div className="flex items-start gap-3">
                        <div className="relative">
                            <input
                                type="checkbox"
                                id="accept"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-[#1EB97A] focus:ring-[#1EB97A] focus:ring-offset-0 focus:ring-2 cursor-pointer"
                            />
                        </div>
                        <label htmlFor="accept" className="text-gray-300 text-sm leading-relaxed cursor-pointer">
                            I have read and agree to the <span className="font-semibold text-[#1EB97A]">Terms and Conditions</span> for film submission.
                        </label>
                    </div>
                    
                    <div className="flex gap-4 mt-6 pt-4 border-t border-gray-800">
                        <Link
                            href="/project/add-project"
                            onClick={(e) => {
                                if (!accepted) {
                                    e.preventDefault();
                                    const checkbox = document.getElementById('accept');
                                    checkbox?.scrollIntoView({ behavior: 'smooth' });
                                    checkbox?.classList.add('ring-2', 'ring-emerald-500');
                                    setTimeout(() => {
                                        checkbox?.classList.remove('ring-2', 'ring-emerald-500');
                                    }, 1000);
                                }
                            }}
                            className={`px-6 py-2.5 rounded-xl font-semibold text-center transition-all duration-200 ${
                                accepted
                                    ? "bg-gradient-to-r from-[#1EB97A] to-emerald-600 text-white hover:from-[#189663] hover:to-emerald-700 shadow-lg shadow-[#1EB97A]/20 hover:shadow-xl transform hover:scale-105"
                                    : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                {accepted ? (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Continue to Submission
                                    </>
                                ) : (
                                    "Accept Terms to Continue"
                                )}
                            </span>
                        </Link>
                        <Link
                            href="/dashboard"
                            className="px-6 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                        >
                            <span className="flex items-center gap-2">
                                <X className="w-4 h-4" />
                                Cancel
                            </span>
                        </Link>
                    </div>
                    
                    {!accepted && (
                        <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Please accept the terms to continue with your submission
                        </p>
                    )}
                </motion.div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center mt-8"
                >
                    <p className="text-xs text-gray-500">
                        Last updated: January 2024. NYBFF reserves the right to modify these terms at any time.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsCondition;