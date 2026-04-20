"use client";

import React, { useState } from "react";
import Link from "next/link";

const TermsCondition = () => {
    const [activeTab, setActiveTab] = useState("eligibility");
    const [accepted, setAccepted] = useState(false);

    const tabs = [
        { id: "eligibility", label: "Eligibility", icon: "✅" },
        { id: "submission", label: "Submission", icon: "📤" },
        { id: "rights", label: "IP Rights", icon: "©️" },
        { id: "nomination", label: "Nomination", icon: "🏆" },
        { id: "fees", label: "Fees", icon: "💰" },
        { id: "conduct", label: "Conduct", icon: "⚖️" },
    ];

    const content = {
        eligibility: {
            title: "Eligibility Requirements",
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
            items: [
                "Treat all participants with respect",
                "No harassment or discrimination",
                "Promote festival positively",
                "No manipulation of judging process",
                "Professional conduct at all events",
            ]
        },
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
                    <p className="text-gray-600 mt-2">For Film Submission & Nomination</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="border-b border-gray-200 overflow-x-auto">
                        <div className="flex">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-3 text-sm font-medium transition ${
                                        activeTab === tab.id
                                            ? "text-blue-600 border-b-2 border-blue-600"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            {content[activeTab].title}
                        </h2>
                        <ul className="space-y-3">
                            {content[activeTab].items.map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-700">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Acceptance */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="accept"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                            className="mt-1 w-4 h-4 text-blue-600 rounded"
                        />
                        <label htmlFor="accept" className="text-gray-700">
                            I have read and agree to the <span className="font-semibold">Terms and Conditions</span> for film submission.
                        </label>
                    </div>
                    
                    <div className="flex gap-4 mt-6">
                        <Link
                            href="/project/add-project"
                            className={`px-6 py-2 rounded-lg font-semibold text-center transition ${
                                accepted
                                    ? "bg-[#1EB97A] text-white hover:bg-[#189663]"
                                    : "bg-gray-200 text-gray-500 pointer-events-none"
                            }`}
                        >
                            Continue to Submission
                        </Link>
                        <Link href="/dashboard" className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
                            Cancel
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsCondition;