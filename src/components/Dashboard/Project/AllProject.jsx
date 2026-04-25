"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, isAuthenticated } from '@/utils/auth';
import ClipLoader from "react-spinners/ClipLoader";
import { motion, AnimatePresence } from "framer-motion";

const AllProject = () => {
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        checkAuthAndFetch();
    }, []);

    useEffect(() => {
        filterProjects();
    }, [searchTerm, projects]);

    const checkAuthAndFetch = async () => {
        const token = getToken();
        const authenticated = !!token && isAuthenticated();

        setIsLoggedIn(authenticated);

        if (authenticated) {
            await fetchUserProjects();
        } else {
            setLoading(false);
        }
    };

    const fetchUserProjects = async () => {
        try {
            setLoading(true);
            setError('');

            const token = getToken();

            if (!token) {
                setLoading(false);
                return;
            }

            // ✅ USE THIS ENDPOINT - It's designed for user's own projects
            const projectsResponse = await fetch(`${API_URL}/api/projects/user/list`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const projectsData = await projectsResponse.json();
            console.log('Projects response:', projectsData);

            if (projectsData.success) {
                let userProjects = [];

                // Handle different response structures
                if (projectsData.data && Array.isArray(projectsData.data)) {
                    userProjects = projectsData.data;
                } else if (projectsData.projects && Array.isArray(projectsData.projects)) {
                    userProjects = projectsData.projects;
                }

                console.log('User projects found:', userProjects.length);
                setProjects(userProjects);
                setFilteredProjects(userProjects);

                if (userProjects.length === 0) {
                    setError('No projects found. Submit your first project!');
                }
            } else {
                setError(projectsData.message || 'Failed to fetch projects');
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filterProjects = () => {
        if (!searchTerm) {
            setFilteredProjects(projects);
        } else {
            const filtered = projects.filter(project =>
                (project.projectTitle || project.title)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (project.projectType || project.category)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.director?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProjects(filtered);
        }
        setCurrentPage(1);
    };

    const handleView = (project) => {
        setSelectedProject(project);
        setViewModalOpen(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatRuntime = (project) => {
        const hours = parseInt(project.runtimeHours) || 0;
        const minutes = parseInt(project.runtimeMinutes) || 0;
        const seconds = parseInt(project.runtimeSeconds) || 0;

        if (hours === 0 && minutes === 0 && seconds === 0) return 'Not specified';

        const parts = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds > 0) parts.push(`${seconds}s`);

        return parts.join(' ');
    };

    const getLanguageName = (code) => {
        const languages = {
            'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
            'it': 'Italian', 'pt': 'Portuguese', 'zh': 'Chinese', 'ja': 'Japanese',
            'ko': 'Korean', 'hi': 'Hindi', 'bn': 'Bengali', 'ar': 'Arabic',
            'ru': 'Russian', 'tr': 'Turkish', 'nl': 'Dutch', 'other': 'Other'
        };
        return languages[code] || code || 'Not specified';
    };

    const getProjectTypeBadgeColor = (type) => {
        const colors = {
            'Feature Film': 'bg-blue-50 text-blue-600 border-blue-100',
            'Short Film': 'bg-purple-50 text-purple-600 border-purple-100',
            'Documentary': 'bg-green-50 text-green-600 border-green-100',
            'Music Video': 'bg-pink-50 text-pink-600 border-pink-100',
            'Commercial': 'bg-yellow-50 text-yellow-600 border-yellow-100',
            'Web Series': 'bg-indigo-50 text-indigo-600 border-indigo-100',
            'other': 'bg-gray-50 text-gray-600 border-gray-100'
        };
        return colors[type] || 'bg-gray-50 text-gray-600 border-gray-100';
    };

    // Pagination calculations
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredProjects.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredProjects.length / entriesPerPage);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <ClipLoader color="#1EB97A" size={50} />
            </div>
        );
    }

    // Show login prompt for non-authenticated users
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="max-w-4xl w-full">
                    {/* Main Card */}
                    <div className="bg-white rounded-3xl  overflow-hidden">
                        <div className="relative">
                            {/* Decorative Top Bar */}
                            <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-[#1EB97A] via-blue-500 to-purple-600"></div>

                            <div className="p-8 md:p-12">
                                {/* Icon with animated background */}
                                <div className="flex justify-center mb-8">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-linear-to-r from-[#1EB97A] to-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                        <div className="relative w-28 h-28 bg-linear-to-br from-[#1EB97A] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                                            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Title Section */}
                                <div className="text-center mb-8">
                                    <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                                        No Submissions Yet
                                    </h2>
                                    <div className="w-24 h-1 bg-linear-to-r from-[#1EB97A] to-blue-500 mx-auto rounded-full mb-6"></div>
                                    <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                        Ready to showcase your work? Start your journey by submitting your first project to our platform.
                                    </p>
                                </div>

                                {/* Feature Cards */}
                                <div className="grid md:grid-cols-3 gap-6 mb-12">
                                    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-5 text-center hover:shadow-lg transition-shadow duration-300">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-gray-800 mb-2">Easy Submission</h3>
                                        <p className="text-sm text-gray-600">Simple step-by-step process to submit your project</p>
                                    </div>

                                    <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-5 text-center hover:shadow-lg transition-shadow duration-300">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-gray-800 mb-2">Get Exposure</h3>
                                        <p className="text-sm text-gray-600">Showcase your work to a wider audience</p>
                                    </div>

                                    <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 text-center hover:shadow-lg transition-shadow duration-300">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-gray-800 mb-2">Track Progress</h3>
                                        <p className="text-sm text-gray-600">Monitor your submission status in real-time</p>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                    <Link
                                        href="/projects/drop-project"
                                        className="group relative inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#1EB97A] to-[#189663] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-[#189663] to-[#1EB97A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <span className="relative flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Create New Submission
                                        </span>
                                    </Link>

                                    <Link
                                        href="/login"
                                        className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:border-[#1EB97A] hover:text-[#1EB97A] hover:shadow-lg"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        Sign In to Account
                                    </Link>
                                </div>

                                {/* Trust Badge */}
                                <div className="text-center pt-6 border-t border-gray-100">
                                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            <span>Secure Submission</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Fast Review Process</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                            </svg>
                                            <span>Free to Submit</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Decorative Elements */}
                    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-r from-[#1EB97A]/10 to-blue-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Show projects table for authenticated users
    return (
        <div className="p-6 min-h-screen font-sans max-w-7xl mx-auto">
            {/* Error Message */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-600 text-sm">{error}</p>
                        <button
                            onClick={() => setError('')}
                            className="ml-auto text-red-600 hover:text-red-800"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Total Projects: {projects.length} | Manage your film submissions
                    </p>
                </div>
                <Link
                    href="/projects/drop-project"
                    className="bg-[#1EB97A] hover:bg-[#189663] text-white px-6 py-2.5 rounded-md font-semibold flex items-center gap-2 transition-all shadow-sm w-fit"
                >
                    <span className="text-xl">+</span> Add New Project
                </Link>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Table Controls */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Show</span>
                        <select
                            value={entriesPerPage}
                            onChange={(e) => {
                                setEntriesPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                        <span>entries</span>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search by title, type, or director..."
                            className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* The Table */}
                {currentEntries.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className="text-gray-500 text-lg">No projects found</p>
                        <p className="text-gray-400 text-sm mt-1">Get started by creating your first project</p>
                        <Link href="/projects/drop-project" className="inline-block mt-4 bg-[#1EB97A] text-white px-6 py-2 rounded-md">
                            Create Project
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F6F7F9] text-gray-600 uppercase text-[11px] font-bold tracking-wider">
                                    <th className="px-6 py-4">Project Details</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date Created</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentEntries.map((project) => (
                                    <tr key={project._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white font-bold">
                                                    {getInitials(project.projectTitle || project.title)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">
                                                        {project.projectTitle || project.title || 'Untitled'}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Director: {project.director || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getProjectTypeBadgeColor(project.projectType || project.category)}`}>
                                                {project.projectType || project.category || 'Not specified'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.submissionStatus === 'approved' || project.status === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : project.submissionStatus === 'rejected' || project.status === 'rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {project.submissionStatus || project.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(project.createdAt || project.submittedAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleView(project)}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                                                    title="View Project"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Footer */}
                {filteredProjects.length > 0 && (
                    <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
                        <p className="text-sm text-gray-500">
                            Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredProjects.length)} of {filteredProjects.length} entries
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`px-3 py-1 rounded text-sm font-medium transition ${currentPage === index + 1
                                        ? 'bg-[#1EB97A] text-white'
                                        : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* View Project Modal - Keep your existing modal code */}
            {viewModalOpen && selectedProject && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setViewModalOpen(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header - Modern Gradient */}
                        <div className="sticky top-0 z-10 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-5 flex justify-between items-center ">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Project Details</h2>
                                    <p className="text-white/70 text-xs">View complete project information</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewModalOpen(false)}
                                className="w-8 h-8 bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200"
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body - Modern Design */}
                        <div className="p-8 space-y-8 bg-gray-50">
                            {/* Hero Section */}
                            <div className="border-b border-gray-200 pb-6">
                                <div className="flex items-start justify-between flex-wrap gap-4">
                                    <div>
                                        <h3 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                            {selectedProject.projectTitle || selectedProject.title || 'Untitled'}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                </svg>
                                                ID: {selectedProject._id?.slice(-8)}
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {formatDate(selectedProject.submittedAt || selectedProject.createdAt)}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${selectedProject.submissionStatus === 'approved' || selectedProject.status === 'approved'
                                                    ? 'bg-green-100 text-green-700'
                                                    : selectedProject.submissionStatus === 'rejected' || selectedProject.status === 'rejected'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${selectedProject.submissionStatus === 'approved' || selectedProject.status === 'approved'
                                                        ? 'bg-green-500'
                                                        : selectedProject.submissionStatus === 'rejected' || selectedProject.status === 'rejected'
                                                            ? 'bg-red-500'
                                                            : 'bg-amber-500'
                                                    }`} />
                                                {selectedProject.submissionStatus || selectedProject.status || 'pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Project Information Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-gray-900">Project Information</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Project Type</label>
                                        <p className="text-gray-900 font-medium">{selectedProject.projectType || selectedProject.category || 'Not specified'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Director</label>
                                        <p className="text-gray-900">{selectedProject.director || 'Not specified'}</p>
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Synopsis</label>
                                        <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl">
                                            {selectedProject.briefSynopsis || selectedProject.description || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* International Info Card */}
                            {(selectedProject.hasNonEnglishTitle || selectedProject.nonEnglishTitle) && (
                                <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-2xl p-6 shadow-sm border border-amber-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10" />
                                            </svg>
                                        </div>
                                        <h4 className="font-semibold text-gray-900">International Information</h4>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {selectedProject.nonEnglishTitle && (
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Original Title</label>
                                                <p className="text-gray-900 font-medium">{selectedProject.nonEnglishTitle}</p>
                                            </div>
                                        )}
                                        {selectedProject.nonEnglishSynopsis && (
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Original Synopsis</label>
                                                <p className="text-gray-700 text-sm bg-white/50 p-3 rounded-xl">{selectedProject.nonEnglishSynopsis}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Credits Section - Grid Layout */}
                            {(selectedProject.directors?.length > 0 || selectedProject.writers?.length > 0 ||
                                selectedProject.producers?.length > 0 || selectedProject.keyCast?.length > 0) && (
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </div>
                                            <h4 className="font-semibold text-gray-900">Credits</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {selectedProject.directors?.length > 0 && (
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Directors</label>
                                                    <div className="space-y-1">
                                                        {selectedProject.directors.map((d, idx) => (
                                                            <div key={idx} className="bg-gray-50 p-2 rounded-lg">
                                                                <p className="text-gray-900 text-sm font-medium">
                                                                    {`${d.firstName || ''} ${d.middleName || ''} ${d.lastName || ''}`.trim() || 'N/A'}
                                                                </p>
                                                                {d.priorCredits && <p className="text-xs text-gray-500 mt-1">{d.priorCredits}</p>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {selectedProject.writers?.length > 0 && (
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Writers</label>
                                                    <div className="space-y-1">
                                                        {selectedProject.writers.map((w, idx) => (
                                                            <div key={idx} className="bg-gray-50 p-2 rounded-lg">
                                                                <p className="text-gray-900 text-sm font-medium">
                                                                    {`${w.firstName || ''} ${w.middleName || ''} ${w.lastName || ''}`.trim() || 'N/A'}
                                                                </p>
                                                                {w.priorCredits && <p className="text-xs text-gray-500 mt-1">{w.priorCredits}</p>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {selectedProject.producers?.length > 0 && (
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Producers</label>
                                                    <div className="space-y-1">
                                                        {selectedProject.producers.map((p, idx) => (
                                                            <div key={idx} className="bg-gray-50 p-2 rounded-lg">
                                                                <p className="text-gray-900 text-sm font-medium">
                                                                    {`${p.firstName || ''} ${p.middleName || ''} ${p.lastName || ''}`.trim() || 'N/A'}
                                                                </p>
                                                                {p.priorCredits && <p className="text-xs text-gray-500 mt-1">{p.priorCredits}</p>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {selectedProject.keyCast?.length > 0 && (
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Key Cast</label>
                                                    <div className="space-y-1">
                                                        {selectedProject.keyCast.map((c, idx) => (
                                                            <div key={idx} className="bg-gray-50 p-2 rounded-lg">
                                                                <p className="text-gray-900 text-sm font-medium">
                                                                    {`${c.firstName || ''} ${c.middleName || ''} ${c.lastName || ''}`.trim() || 'N/A'}
                                                                    {c.role && <span className="text-purple-600 text-xs ml-1">as {c.role}</span>}
                                                                </p>
                                                                {c.priorCredits && <p className="text-xs text-gray-500 mt-1">{c.priorCredits}</p>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* Technical Specs - Compact Grid */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-gray-900">Technical Specifications</h4>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Runtime</label>
                                        <p className="text-gray-900 font-medium">{formatRuntime(selectedProject)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Genres</label>
                                        <p className="text-gray-900">{selectedProject.genres || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Language</label>
                                        <p className="text-gray-900">{getLanguageName(selectedProject.language)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Shooting Format</label>
                                        <p className="text-gray-900">{selectedProject.shootingFormat || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Aspect Ratio</label>
                                        <p className="text-gray-900">{selectedProject.aspectRatio || '16:9'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Film Color</label>
                                        <p className="text-gray-900">{selectedProject.filmColor || 'Color'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Student Project</label>
                                        <p className="text-gray-900">{selectedProject.studentProject || 'No'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">First Time Filmmaker</label>
                                        <p className="text-gray-900">{selectedProject.firstTimeFilmmaker || 'No'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submitter Info - Two Column */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-linear-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-gray-900">Submitter Information</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Email</label>
                                        <p className="text-gray-900 break-all">{selectedProject.email || selectedProject.submitterEmail || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Phone</label>
                                        <p className="text-gray-900">{selectedProject.phone || selectedProject.submitterPhone || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Location</label>
                                        <p className="text-gray-900">
                                            {[selectedProject.city, selectedProject.stateProvince, selectedProject.country].filter(Boolean).join(', ') || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Gender / Pronouns</label>
                                        <p className="text-gray-900">{selectedProject.gender || 'N/A'} {selectedProject.pronouns ? `(${selectedProject.pronouns})` : ''}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            {(selectedProject.website || selectedProject.twitter || selectedProject.facebook || selectedProject.instagram) && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9m-9 9a9 9 0 019-9" />
                                            </svg>
                                        </div>
                                        <h4 className="font-semibold text-gray-900">Connect</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedProject.website && (
                                            <a href={selectedProject.website} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-700 transition">
                                                🌐 Website
                                            </a>
                                        )}
                                        {selectedProject.twitter && (
                                            <a href={selectedProject.twitter} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-2 bg-black/5 hover:bg-black/10 rounded-xl text-sm text-gray-700 transition">
                                                🐦 Twitter
                                            </a>
                                        )}
                                        {selectedProject.facebook && (
                                            <a href={selectedProject.facebook} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl text-sm text-blue-700 transition">
                                                📘 Facebook
                                            </a>
                                        )}
                                        {selectedProject.instagram && (
                                            <a href={selectedProject.instagram} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-2 bg-pink-50 hover:bg-pink-100 rounded-xl text-sm text-pink-700 transition">
                                                📷 Instagram
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Admin Notes */}
                            {selectedProject.adminNotes && (
                                <div className="bg-linear-to-r from-red-50 to-rose-50 rounded-2xl p-5 border border-red-100">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-red-800">Admin Notes</h4>
                                            <p className="text-red-700 text-sm mt-1">{selectedProject.adminNotes}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AllProject;