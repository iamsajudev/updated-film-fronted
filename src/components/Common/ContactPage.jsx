"use client";

import React, { useState } from "react";
import Link from "next/link";
import ContactForms from "../Forms/ContactForms/ContactForms";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        category: "general",
        message: "",
        priority: "normal",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error'

    const categories = [
        { value: "general", label: "General Inquiry", icon: "💬" },
        { value: "submission", label: "Submission Question", icon: "🎬" },
        { value: "technical", label: "Technical Support", icon: "🔧" },
        { value: "partnership", label: "Partnership Opportunity", icon: "🤝" },
        { value: "press", label: "Press & Media", icon: "📰" },
        { value: "complaint", label: "Complaint", icon: "⚠️" },
    ];

    const faqs = [
        {
            question: "How do I submit my film?",
            answer: "You can submit your film by creating an account, navigating to 'Add Project', and following the submission guidelines. Make sure to read our Terms and Conditions first."
        },
        {
            question: "When will I hear back about my submission?",
            answer: "We typically review submissions within 4-6 weeks. You will receive an email notification once a decision has been made."
        },
        {
            question: "Can I submit multiple films?",
            answer: "Yes, you can submit multiple films. Each submission requires a separate entry and fee."
        },
        {
            question: "How do I reset my password?",
            answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your email address."
        },
        {
            question: "Do you offer refunds?",
            answer: "Submission fees are non-refundable as outlined in our Terms and Conditions. Please review them carefully before submitting."
        }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        // Simulate API call
        setTimeout(() => {
            console.log("ContactPage form submitted:", formData);
            setIsSubmitting(false);
            setSubmitStatus("success");
            setFormData({
                name: "",
                email: "",
                subject: "",
                category: "general",
                message: "",
                priority: "normal",
            });

            // Clear success message after 5 seconds
            setTimeout(() => setSubmitStatus(null), 5000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">ContactPage Us</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Have questions? We're here to help. Reach out to us through any of the channels below.
                    </p>
                </div>

                {/* Contact Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                        <p className="text-sm text-gray-600 mb-2">General Inquiries</p>
                        <a href="mailto:info@filmfestival.com" className="text-blue-600 hover:text-blue-700">
                            info@filmfestival.com
                        </a>
                        <p className="text-sm text-gray-600 mt-3">Support</p>
                        <a href="mailto:support@filmfestival.com" className="text-blue-600 hover:text-blue-700">
                            support@filmfestival.com
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                        <p className="text-sm text-gray-600 mb-2">Mon-Fri, 9am-6pm PST</p>
                        <a href="tel:+15551234567" className="text-blue-600 hover:text-blue-700">
                            +1 (555) 123-4567
                        </a>
                        <p className="text-xs text-gray-500 mt-3">Toll-free: +1 (800) 555-6789</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
                        <p className="text-sm text-gray-600">
                            123 Film District Blvd<br />
                            Suite 100<br />
                            Los Angeles, CA 90001
                        </p>
                    </div>
                </div>

                {/* Two Column Layout: Form & FAQ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Contact Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h2>
                        <p className="text-gray-600 mb-6">We'll get back to you within 24-48 hours</p>

                        {/* Success Message */}
                        {submitStatus === "success" && (
                            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-green-800 font-medium">Message sent successfully!</p>
                                        <p className="text-green-700 text-sm">We'll respond to your inquiry shortly.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {submitStatus === "error" && (
                            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-emerald-800">Something went wrong. Please try again.</p>
                                </div>
                            </div>
                        )}

                        <ContactForms isSubmitting={isSubmitting} onFormSubmit={handleSubmit} formData={formData} handleChange={handleChange} categories={categories} />
                    </div>

                    {/* FAQ Section */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
                            </div>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <details key={index} className="group">
                                        <summary className="cursor-pointer font-medium text-gray-900 hover:text-blue-600 transition list-none flex items-center justify-between">
                                            <span>{faq.question}</span>
                                            <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>
                                        <p className="mt-2 text-gray-600 text-sm pl-4">
                                            {faq.answer}
                                        </p>
                                    </details>
                                ))}
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm border border-blue-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Business Hours
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Monday - Friday:</span>
                                    <span className="font-medium text-gray-900">9:00 AM - 6:00 PM PST</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Saturday:</span>
                                    <span className="font-medium text-gray-900">10:00 AM - 2:00 PM PST</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Sunday:</span>
                                    <span className="font-medium text-gray-900">Closed</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-blue-200">
                                <p className="text-xs text-gray-600">
                                    Response time: Within 24-48 hours during business days
                                </p>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Connect With Us
                            </h3>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition">
                                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition">
                                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.257-11.44c0-.214-.005-.428-.015-.64A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition">
                                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition">
                                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Find Us</h3>
                        <p className="text-sm text-gray-600 mb-4">Visit our headquarters in Los Angeles</p>
                    </div>
                    <div className="h-64 bg-gray-200 relative">
                        {/* Replace with actual Google Maps embed */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                <p>Interactive Map Coming Soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;