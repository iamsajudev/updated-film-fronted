"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    Lock,
    Cookie,
    Eye,
    Trash2,
    Download,
    Mail,
    Phone,
    MapPin,
    CheckCircle,
    AlertCircle,
    X,
    ExternalLink,
    FileText,
    Users,
    Database,
    Server,
    Globe,
    Clock
} from "lucide-react";

const PrivacyPolicyPage = () => {
    const [lastUpdated] = useState("March 31, 2026");
    const [showCookieConsent, setShowCookieConsent] = useState(true);
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        const cookiesAccepted = localStorage.getItem("cookiesAccepted");
        if (cookiesAccepted === "true") {
            setShowCookieConsent(false);
        }
    }, []);

    const handleAcceptCookies = () => {
        setShowCookieConsent(false);
        localStorage.setItem("cookiesAccepted", "true");
    };

    const sections = [
        { id: "introduction", label: "Introduction", icon: <FileText className="w-3 h-3" /> },
        { id: "information", label: "Information", icon: <Database className="w-3 h-3" /> },
        { id: "usage", label: "Usage", icon: <Users className="w-3 h-3" /> },
        { id: "cookies", label: "Cookies", icon: <Cookie className="w-3 h-3" /> },
        { id: "sharing", label: "Sharing", icon: <Globe className="w-3 h-3" /> },
        { id: "rights", label: "Your Rights", icon: <Shield className="w-3 h-3" /> },
        { id: "security", label: "Security", icon: <Lock className="w-3 h-3" /> },
        { id: "contact", label: "Contact", icon: <Mail className="w-3 h-3" /> },
    ];

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            {/* Cookie Consent Banner - Dark Theme */}
            <AnimatePresence>
                {showCookieConsent && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-gray-950 border-t border-gray-800 shadow-2xl"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#1EB97A]/20 rounded-xl">
                                    <Cookie className="w-5 h-5 text-[#1EB97A]" />
                                </div>
                                <p className="text-sm text-gray-300">
                                    We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAcceptCookies}
                                    className="bg-gradient-to-r from-[#1EB97A] to-emerald-600 hover:from-[#189663] hover:to-emerald-700 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-[#1EB97A]/20"
                                >
                                    Accept
                                </button>
                                <Link href="#cookies" className="text-gray-400 hover:text-white text-sm transition-colors px-3 py-2">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#1EB97A]/20 to-emerald-500/20 border border-[#1EB97A]/30 text-[#1EB97A] text-xs font-semibold mb-4">
                        <Shield className="w-3 h-3" />
                        Privacy & Security
                    </div>
                    {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1EB97A] to-emerald-600 rounded-2xl mb-4 shadow-lg shadow-[#1EB97A]/20">
                        <Lock className="w-8 h-8 text-white" />
                    </div> */}
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-400 text-base">Your privacy matters to us</p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <p className="text-xs text-gray-500">Last Updated: {lastUpdated}</p>
                    </div>
                </motion.div>

                {/* Quick Navigation - Dark Theme */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-5 mb-6 shadow-xl"
                >
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Globe className="w-3 h-3" />
                        Quick Navigation
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="inline-flex items-center gap-1.5 text-xs bg-gray-800 hover:bg-[#1EB97A]/20 text-gray-300 hover:text-[#1EB97A] px-3 py-1.5 rounded-full transition-all duration-200"
                            >
                                {section.icon}
                                {section.label}
                            </a>
                        ))}
                    </div>
                </motion.div>

                {/* Privacy Policy Content - Dark Theme */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 shadow-xl overflow-hidden mb-8"
                >
                    <div className="p-6 md:p-8 space-y-8">
                        
                        {/* Introduction */}
                        <section id="introduction" className="scroll-mt-20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-[#1EB97A]/20 rounded-xl">
                                    <FileText className="w-5 h-5 text-[#1EB97A]" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Introduction</h2>
                            </div>
                            <p className="text-gray-400 mb-3 leading-relaxed">
                                Welcome to NYBFF ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our film submission platform.
                            </p>
                            <p className="text-gray-400 leading-relaxed">
                                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
                            </p>
                        </section>

                        {/* Information We Collect */}
                        <section id="information" className="scroll-mt-20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-500/20 rounded-xl">
                                    <Database className="w-5 h-5 text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Personal Information You Provide</h3>
                                    <ul className="space-y-1 text-gray-400 ml-4">
                                        <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Name, email address, phone number, and mailing address</li>
                                        <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Professional credentials and filmmaking experience</li>
                                        <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Payment information (processed securely through third-party providers)</li>
                                        <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Film submissions, including trailers, posters, and synopses</li>
                                        <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Communication preferences and feedback</li>
                                        <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Account login credentials</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Information Automatically Collected</h3>
                                    <ul className="space-y-1 text-gray-400 ml-4">
                                        <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> IP address and device information</li>
                                        <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Browser type and version</li>
                                        <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Pages visited and time spent on our platform</li>
                                        <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Referring website addresses</li>
                                        <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Cookies and similar tracking technologies</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* How We Use Your Information */}
                        <section id="usage" className="scroll-mt-20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-500/20 rounded-xl">
                                    <Users className="w-5 h-5 text-purple-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
                            </div>
                            <p className="text-gray-400 mb-3">We use the information we collect for various purposes, including:</p>
                            <ul className="space-y-2 text-gray-400 ml-4">
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Process and evaluate film submissions for festivals and awards</li>
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Communicate with you about submission status, deadlines, and festival updates</li>
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Personalize your experience and recommend relevant opportunities</li>
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Improve our platform, services, and user experience</li>
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Process payments and prevent fraudulent transactions</li>
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Comply with legal obligations and enforce our terms</li>
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Send you marketing communications (with your consent)</li>
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Analyze usage patterns and optimize our website performance</li>
                            </ul>
                        </section>

                        {/* Cookies & Tracking */}
                        <section id="cookies" className="scroll-mt-20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-amber-500/20 rounded-xl">
                                    <Cookie className="w-5 h-5 text-amber-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">3. Cookies & Tracking Technologies</h2>
                            </div>
                            <p className="text-gray-400 mb-3 leading-relaxed">
                                We use cookies and similar tracking technologies to track activity on our platform and store certain information. Cookies are files with small amounts of data that may include an anonymous unique identifier.
                            </p>
                            <div className="bg-gray-800/50 rounded-xl p-4 mt-3 border border-gray-700">
                                <h3 className="font-semibold text-gray-300 mb-2">Types of Cookies We Use:</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-start gap-2"><span className="text-[#1EB97A]">▹</span> <span className="font-medium">Essential Cookies:</span> Required for basic platform functionality</li>
                                    <li className="flex items-start gap-2"><span className="text-[#1EB97A]">▹</span> <span className="font-medium">Preference Cookies:</span> Remember your settings and preferences</li>
                                    <li className="flex items-start gap-2"><span className="text-[#1EB97A]">▹</span> <span className="font-medium">Analytics Cookies:</span> Help us understand how users interact with our platform</li>
                                    <li className="flex items-start gap-2"><span className="text-[#1EB97A]">▹</span> <span className="font-medium">Marketing Cookies:</span> Used to deliver relevant advertisements</li>
                                </ul>
                            </div>
                            <p className="text-gray-400 mt-3 leading-relaxed">
                                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.
                            </p>
                        </section>

                        {/* Information Sharing */}
                        <section id="sharing" className="scroll-mt-20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-emerald-500/20 rounded-xl">
                                    <Globe className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">4. How We Share Your Information</h2>
                            </div>
                            <p className="text-gray-400 mb-3">We may share your information in the following situations:</p>
                            <ul className="space-y-2 text-gray-400 ml-4">
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> <span className="font-medium">With Festival Partners:</span> Your submission materials may be shared with festival judges and selection committees</li>
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> <span className="font-medium">Service Providers:</span> Third-party vendors who assist with payment processing, hosting, and analytics</li>
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> <span className="font-medium">Legal Requirements:</span> When required by law or to protect our rights</li>
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> <span className="font-medium">Business Transfers:</span> In connection with a merger, acquisition, or sale of assets</li>
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> <span className="font-medium">With Your Consent:</span> When you have given us explicit permission to share your information</li>
                            </ul>
                            <div className="bg-[#1EB97A]/10 rounded-xl p-4 mt-4 border border-[#1EB97A]/20">
                                <p className="text-sm text-[#1EB97A] flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    <span className="font-semibold">Important:</span> We never sell your personal information to third parties for marketing purposes.
                                </p>
                            </div>
                        </section>

                        {/* Your Rights */}
                        <section id="rights" className="scroll-mt-20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-500/20 rounded-xl">
                                    <Shield className="w-5 h-5 text-green-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">5. Your Privacy Rights</h2>
                            </div>
                            <p className="text-gray-400 mb-3">Depending on your location, you may have the following rights:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Eye className="w-4 h-4 text-[#1EB97A]" />
                                        <span className="font-semibold text-white">Right to Access</span>
                                    </div>
                                    <p className="text-sm text-gray-400">Request a copy of your personal data</p>
                                </div>
                                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-4 h-4 text-[#1EB97A]" />
                                        <span className="font-semibold text-white">Right to Rectification</span>
                                    </div>
                                    <p className="text-sm text-gray-400">Correct inaccurate or incomplete data</p>
                                </div>
                                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Trash2 className="w-4 h-4 text-emerald-400" />
                                        <span className="font-semibold text-white">Right to Deletion</span>
                                    </div>
                                    <p className="text-sm text-gray-400">Request deletion of your personal data</p>
                                </div>
                                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Download className="w-4 h-4 text-[#1EB97A]" />
                                        <span className="font-semibold text-white">Right to Data Portability</span>
                                    </div>
                                    <p className="text-sm text-gray-400">Receive your data in a structured format</p>
                                </div>
                            </div>
                            <p className="text-gray-400">
                                To exercise any of these rights, please contact us at <a href="mailto:privacy@nybff.com" className="text-[#1EB97A] hover:text-emerald-400 transition-colors">privacy@nybff.com</a>
                            </p>
                        </section>

                        {/* Data Security */}
                        <section id="security" className="scroll-mt-20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-cyan-500/20 rounded-xl">
                                    <Lock className="w-5 h-5 text-cyan-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">6. Data Security</h2>
                            </div>
                            <p className="text-gray-400 mb-3 leading-relaxed">
                                We implement appropriate technical and organizational security measures to protect your personal information. These include:
                            </p>
                            <ul className="space-y-1 text-gray-400 ml-4">
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> SSL/TLS encryption for data transmission</li>
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Secure servers with firewall protection</li>
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Regular security audits and vulnerability assessments</li>
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Access controls and authentication protocols</li>
                                <li className="flex items-start gap-2"><span className="text-[#1EB97A]">•</span> Employee training on data protection practices</li>
                            </ul>
                            <p className="text-gray-400 mt-3 leading-relaxed">
                                While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                            </p>
                        </section>

                        {/* Contact Us */}
                        <section id="contact" className="scroll-mt-20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-500/20 rounded-xl">
                                    <Mail className="w-5 h-5 text-orange-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">7. Contact Us</h2>
                            </div>
                            <p className="text-gray-400 mb-3 leading-relaxed">
                                If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
                            </p>
                            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                                <div className="space-y-2">
                                    <p className="text-gray-300 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-[#1EB97A]" />
                                        <span className="font-medium">Email:</span> privacy@nybff.com
                                    </p>
                                    <p className="text-gray-300 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-[#1EB97A]" />
                                        <span className="font-medium">Phone:</span> +1 (555) 123-4567
                                    </p>
                                    <p className="text-gray-300 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#1EB97A]" />
                                        <span className="font-medium">Address:</span> 123 Film District, Los Angeles, CA 90001
                                    </p>
                                    <p className="text-gray-300 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-[#1EB97A]" />
                                        <span className="font-medium">Data Protection Officer:</span> dpo@nybff.com
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Summary Box */}
                        <div className="bg-gradient-to-r from-[#1EB97A]/10 to-emerald-500/10 rounded-xl p-6 border border-[#1EB97A]/20">
                            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-[#1EB97A]" />
                                Privacy Policy Summary
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#1EB97A]" /> We collect only necessary information for film submissions</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#1EB97A]" /> Your personal data is never sold to third parties</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#1EB97A]" /> You have control over your personal information</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#1EB97A]" /> We use industry-standard security measures</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#1EB97A]" /> You can request data deletion at any time</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Acceptance Section - Dark Theme */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 shadow-xl p-6 sticky bottom-4 backdrop-blur-sm"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="acceptPrivacy"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-[#1EB97A] focus:ring-[#1EB97A] focus:ring-offset-0 cursor-pointer"
                            />
                            <label htmlFor="acceptPrivacy" className="text-gray-300 text-sm cursor-pointer">
                                I have read and understand the <span className="font-semibold text-[#1EB97A]">Privacy Policy</span>
                            </label>
                        </div>
                        <Link
                            href="/projects/drop-project"
                            onClick={(e) => {
                                if (!accepted) {
                                    e.preventDefault();
                                    const checkbox = document.getElementById('acceptPrivacy');
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
                            Continue to Submission
                        </Link>
                    </div>
                    {!accepted && (
                        <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Please accept the Privacy Policy to continue
                        </p>
                    )}
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center mt-8 pt-6 border-t border-gray-800"
                >
                    <p className="text-xs text-gray-500">
                        This Privacy Policy is compliant with GDPR, CCPA, and other applicable privacy regulations.
                    </p>
                    <div className="flex justify-center gap-4 mt-3">
                        <Link href="/terms" className="text-xs text-gray-500 hover:text-[#1EB97A] transition-colors">Terms of Service</Link>
                        <span className="text-gray-600">|</span>
                        <Link href="#cookies" className="text-xs text-gray-500 hover:text-[#1EB97A] transition-colors">Cookie Policy</Link>
                        <span className="text-gray-600">|</span>
                        <Link href="/gdpr" className="text-xs text-gray-500 hover:text-[#1EB97A] transition-colors">GDPR Compliance</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;