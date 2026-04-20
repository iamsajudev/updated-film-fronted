"use client";

import React, { useState } from "react";
import Link from "next/link";

const PrivacyPolicyPage = () => {
    const [lastUpdated] = useState("March 31, 2026");
    const [showCookieConsent, setShowCookieConsent] = useState(true);

    const handleAcceptCookies = () => {
        setShowCookieConsent(false);
        localStorage.setItem("cookiesAccepted", "true");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                
                {/* Cookie Consent Banner */}
                {showCookieConsent && (
                    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg">
                        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm">
                                We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAcceptCookies}
                                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                                >
                                    Accept
                                </button>
                                <Link href="/privacy#cookies" className="text-gray-300 hover:text-white text-sm">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                    <p className="text-lg text-gray-600">Your privacy matters to us</p>
                    <p className="text-sm text-gray-500 mt-2">Last Updated: {lastUpdated}</p>
                </div>

                {/* Quick Navigation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Quick Navigation:</p>
                    <div className="flex flex-wrap gap-2">
                        {["information", "usage", "cookies", "sharing", "rights", "security", "children", "contact"].map((section) => (
                            <a
                                key={section}
                                href={`#${section}`}
                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition"
                            >
                                {section.charAt(0).toUpperCase() + section.slice(1)}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Privacy Policy Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="p-6 md:p-8 space-y-8">
                        
                        {/* Introduction */}
                        <section id="introduction">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Introduction</h2>
                            <p className="text-gray-700 mb-3">
                                Welcome to Film Festival Platform ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our film submission platform.
                            </p>
                            <p className="text-gray-700">
                                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
                            </p>
                        </section>

                        {/* Information We Collect */}
                        <section id="information">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Information You Provide</h3>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                                        <li>Name, email address, phone number, and mailing address</li>
                                        <li>Professional credentials and filmmaking experience</li>
                                        <li>Payment information (processed securely through third-party providers)</li>
                                        <li>Film submissions, including trailers, posters, and synopses</li>
                                        <li>Communication preferences and feedback</li>
                                        <li>Account login credentials</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Information Automatically Collected</h3>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                                        <li>IP address and device information</li>
                                        <li>Browser type and version</li>
                                        <li>Pages visited and time spent on our platform</li>
                                        <li>Referring website addresses</li>
                                        <li>Cookies and similar tracking technologies</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* How We Use Your Information */}
                        <section id="usage">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
                            <p className="text-gray-700 mb-3">We use the information we collect for various purposes, including:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>Process and evaluate film submissions for festivals and awards</li>
                                <li>Communicate with you about submission status, deadlines, and festival updates</li>
                                <li>Personalize your experience and recommend relevant opportunities</li>
                                <li>Improve our platform, services, and user experience</li>
                                <li>Process payments and prevent fraudulent transactions</li>
                                <li>Comply with legal obligations and enforce our terms</li>
                                <li>Send you marketing communications (with your consent)</li>
                                <li>Analyze usage patterns and optimize our website performance</li>
                            </ul>
                        </section>

                        {/* Cookies & Tracking */}
                        <section id="cookies">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Cookies & Tracking Technologies</h2>
                            <p className="text-gray-700 mb-3">
                                We use cookies and similar tracking technologies to track activity on our platform and store certain information. Cookies are files with small amounts of data that may include an anonymous unique identifier.
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 mt-3">
                                <h3 className="font-semibold text-gray-800 mb-2">Types of Cookies We Use:</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li><span className="font-medium">Essential Cookies:</span> Required for basic platform functionality</li>
                                    <li><span className="font-medium">Preference Cookies:</span> Remember your settings and preferences</li>
                                    <li><span className="font-medium">Analytics Cookies:</span> Help us understand how users interact with our platform</li>
                                    <li><span className="font-medium">Marketing Cookies:</span> Used to deliver relevant advertisements</li>
                                </ul>
                            </div>
                            <p className="text-gray-700 mt-3">
                                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.
                            </p>
                        </section>

                        {/* Information Sharing */}
                        <section id="sharing">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. How We Share Your Information</h2>
                            <p className="text-gray-700 mb-3">We may share your information in the following situations:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li><span className="font-medium">With Festival Partners:</span> Your submission materials may be shared with festival judges and selection committees</li>
                                <li><span className="font-medium">Service Providers:</span> Third-party vendors who assist with payment processing, hosting, and analytics</li>
                                <li><span className="font-medium">Legal Requirements:</span> When required by law or to protect our rights</li>
                                <li><span className="font-medium">Business Transfers:</span> In connection with a merger, acquisition, or sale of assets</li>
                                <li><span className="font-medium">With Your Consent:</span> When you have given us explicit permission to share your information</li>
                            </ul>
                            <div className="bg-blue-50 rounded-lg p-4 mt-4">
                                <p className="text-sm text-blue-800">
                                    <span className="font-semibold">Important:</span> We never sell your personal information to third parties for marketing purposes.
                                </p>
                            </div>
                        </section>

                        {/* Your Rights */}
                        <section id="rights">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Your Privacy Rights</h2>
                            <p className="text-gray-700 mb-3">Depending on your location, you may have the following rights:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="border border-gray-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="font-semibold">Right to Access</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Request a copy of your personal data</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        <span className="font-semibold">Right to Rectification</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Correct inaccurate or incomplete data</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span className="font-semibold">Right to Deletion</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Request deletion of your personal data</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-semibold">Right to Data Portability</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Receive your data in a structured format</p>
                                </div>
                            </div>
                            <p className="text-gray-700">
                                To exercise any of these rights, please contact us at <a href="mailto:privacy@filmfestival.com" className="text-blue-600 hover:underline">privacy@filmfestival.com</a>
                            </p>
                        </section>

                        {/* Data Security */}
                        <section id="security">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Data Security</h2>
                            <p className="text-gray-700 mb-3">
                                We implement appropriate technical and organizational security measures to protect your personal information. These include:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                                <li>SSL/TLS encryption for data transmission</li>
                                <li>Secure servers with firewall protection</li>
                                <li>Regular security audits and vulnerability assessments</li>
                                <li>Access controls and authentication protocols</li>
                                <li>Employee training on data protection practices</li>
                            </ul>
                            <p className="text-gray-700 mt-3">
                                While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                            </p>
                        </section>

                        {/* Children's Privacy */}
                        <section id="children">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Children's Privacy</h2>
                            <p className="text-gray-700">
                                Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                            </p>
                        </section>

                        {/* International Data Transfers */}
                        <section id="international">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">8. International Data Transfers</h2>
                            <p className="text-gray-700">
                                Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By submitting your information, you consent to this transfer.
                            </p>
                        </section>

                        {/* Data Retention */}
                        <section id="retention">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Data Retention</h2>
                            <p className="text-gray-700">
                                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Submission materials may be retained for archival and historical purposes.
                            </p>
                        </section>

                        {/* Third-Party Links */}
                        <section id="thirdparty">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Third-Party Links</h2>
                            <p className="text-gray-700">
                                Our platform may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
                            </p>
                        </section>

                        {/* Updates to This Policy */}
                        <section id="updates">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Updates to This Policy</h2>
                            <p className="text-gray-700">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                            </p>
                        </section>

                        {/* Contact Us */}
                        <section id="contact">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Contact Us</h2>
                            <p className="text-gray-700 mb-3">
                                If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700">
                                    <span className="font-semibold">Email:</span> privacy@filmfestival.com<br />
                                    <span className="font-semibold">Phone:</span> +1 (555) 123-4567<br />
                                    <span className="font-semibold">Address:</span> 123 Film District, Los Angeles, CA 90001<br />
                                    <span className="font-semibold">Data Protection Officer:</span> dpo@filmfestival.com
                                </p>
                            </div>
                        </section>

                        {/* Summary Box */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Privacy Policy Summary
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>✓ We collect only necessary information for film submissions</li>
                                <li>✓ Your personal data is never sold to third parties</li>
                                <li>✓ You have control over your personal information</li>
                                <li>✓ We use industry-standard security measures</li>
                                <li>✓ You can request data deletion at any time</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Acceptance Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky bottom-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="acceptPrivacy"
                                className="mt-1 w-4 h-4 text-blue-600 rounded"
                            />
                            <label htmlFor="acceptPrivacy" className="text-gray-700">
                                I have read and understand the <span className="font-semibold">Privacy Policy</span>
                            </label>
                        </div>
                        <Link
                            href="/project/drop-project"
                            className="bg-[#1EB97A] hover:bg-[#189663] text-white px-6 py-2 rounded-lg font-semibold text-center transition whitespace-nowrap"
                        >
                            Continue to Submission
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        This Privacy Policy is compliant with GDPR, CCPA, and other applicable privacy regulations.
                    </p>
                    <div className="flex justify-center gap-4 mt-3">
                        <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-700">Terms of Service</Link>
                        <span className="text-gray-300">|</span>
                        <Link href="/cookies" className="text-xs text-gray-500 hover:text-gray-700">Cookie Policy</Link>
                        <span className="text-gray-300">|</span>
                        <Link href="/gdpr" className="text-xs text-gray-500 hover:text-gray-700">GDPR Compliance</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;