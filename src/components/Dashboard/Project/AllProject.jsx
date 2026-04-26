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

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://server.nybff.us';

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

            const projectsResponse = await fetch(`${API_URL}/api/projects/user/list`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const projectsData = await projectsResponse.json();

            if (projectsData.success) {
                let userProjects = [];

                if (projectsData.data && Array.isArray(projectsData.data)) {
                    userProjects = projectsData.data;
                } else if (projectsData.projects && Array.isArray(projectsData.projects)) {
                    userProjects = projectsData.projects;
                }

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
            'Feature Film': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'Short Film': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            'Documentary': 'bg-green-500/20 text-green-400 border-green-500/30',
            'Music Video': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
            'Commercial': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            'Web Series': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
            'other': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        };
        return colors[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };

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
            <div className="flex items-center justify-center min-h-[60vh] bg-black">
                <ClipLoader color="#1EB97A" size={50} />
            </div>
        );
    }

    // Show login prompt for non-authenticated users
    if (!isLoggedIn) {
        return (
            <>
                <div className="min-h-screen bg-black flex items-center justify-center p-6">
                    <div className="max-w-4xl w-full">
                        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
                            <div className="relative">
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1EB97A] via-emerald-500 to-teal-600"></div>

                                <div className="p-8 md:p-12">
                                    <div className="flex justify-center mb-8">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#1EB97A] to-emerald-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                                            <div className="relative w-28 h-28 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300 border border-gray-700">
                                                <svg className="w-14 h-14 text-[#1EB97A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center mb-8">
                                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
                                            No Submissions Yet
                                        </h2>
                                        <div className="w-24 h-1 bg-gradient-to-r from-[#1EB97A] to-emerald-500 mx-auto rounded-full mb-6"></div>
                                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                            Ready to showcase your work? Start your journey by submitting your first project to our platform.
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 text-center hover:bg-gray-800 transition-all duration-300 border border-gray-700 hover:border-[#1EB97A]/30">
                                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-semibold text-white mb-2">Easy Submission</h3>
                                            <p className="text-sm text-gray-400">Simple step-by-step process to submit your project</p>
                                        </div>

                                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 text-center hover:bg-gray-800 transition-all duration-300 border border-gray-700 hover:border-[#1EB97A]/30">
                                            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-semibold text-white mb-2">Get Exposure</h3>
                                            <p className="text-sm text-gray-400">Showcase your work to a wider audience</p>
                                        </div>

                                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 text-center hover:bg-gray-800 transition-all duration-300 border border-gray-700 hover:border-[#1EB97A]/30">
                                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-semibold text-white mb-2">Track Progress</h3>
                                            <p className="text-sm text-gray-400">Monitor your submission status in real-time</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                        <Link
                                            href="/projects/drop-project"
                                            className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#1EB97A] to-[#189663] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-[#1EB97A]/20 hover:scale-105 overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#189663] to-[#1EB97A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <span className="relative flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Create New Submission
                                            </span>
                                        </Link>

                                        <Link
                                            href="/login"
                                            className="inline-flex items-center justify-center gap-2 bg-gray-800 border-2 border-gray-700 text-gray-300 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:border-[#1EB97A] hover:text-[#1EB97A] hover:shadow-lg"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Sign In to Account
                                        </Link>
                                    </div>

                                    <div className="text-center pt-6 border-t border-gray-800">
                                        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-[#1EB97A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                <span>Secure Submission</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-[#1EB97A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Fast Review Process</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-[#1EB97A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                                </svg>
                                                <span>Free to Submit</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#1EB97A]/20 to-emerald-500/20 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Show projects table for authenticated users
    return (
        <>
            <div className=" bg-black font-sans max-w-7xl mx-auto">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-emerald-400 text-sm">{error}</p>
                            <button
                                onClick={() => setError('')}
                                className="ml-auto text-emerald-400 hover:text-emerald-300"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">My Projects</h1>
                        <p className="text-gray-500 mt-1">
                            Total Projects: <span className="text-[#1EB97A] font-semibold">{projects.length}</span> | Manage your film submissions
                        </p>
                    </div>
                    <Link
                        href="/projects/drop-project"
                        className="bg-gradient-to-r from-[#1EB97A] to-[#189663] hover:from-[#189663] hover:to-[#1EB97A] text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-[#1EB97A]/20 w-fit"
                    >
                        <span className="text-xl">+</span> Add New Project
                    </Link>
                </div>

                {/* Table Container */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
                    {/* Table Controls */}
                    <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-900/50">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>Show</span>
                            <select
                                value={entriesPerPage}
                                onChange={(e) => {
                                    setEntriesPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1EB97A] text-white"
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
                                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1EB97A]/50 focus:border-[#1EB97A]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* The Table */}
                    {currentEntries.length === 0 ? (
                        <div className="text-center py-16">
                            <svg className="w-20 h-20 mx-auto text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="text-gray-400 text-lg">No projects found</p>
                            <p className="text-gray-600 text-sm mt-1">Get started by creating your first project</p>
                            <Link href="/projects/drop-project" className="inline-block mt-4 bg-gradient-to-r from-[#1EB97A] to-[#189663] text-white px-6 py-2 rounded-xl">
                                Create Project
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-800/80 text-gray-400 uppercase text-[11px] font-bold tracking-wider border-b border-gray-800">
                                        <th className="px-6 py-4">Project Details</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Date Created</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {currentEntries.map((project) => (
                                        <tr key={project._id} className="hover:bg-gray-800/50 transition-all duration-200 group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-[#1EB97A] to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                                        {getInitials(project.projectTitle || project.title)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-white group-hover:text-[#1EB97A] transition-colors">
                                                            {project.projectTitle || project.title || 'Untitled'}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Director: {project.director || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getProjectTypeBadgeColor(project.projectType || project.category)}`}>
                                                    {project.projectType || project.category || 'Not specified'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.submissionStatus === 'approved' || project.status === 'approved'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : project.submissionStatus === 'rejected' || project.status === 'rejected'
                                                        ? 'bg-emerald-500/20 text-emerald-400'
                                                        : 'bg-yellow-500/20 text-yellow-400'
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
                                                        className="p-2 text-gray-400 hover:text-[#1EB97A] hover:bg-gray-800 rounded-xl transition-all duration-200"
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
                        <div className="p-4 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-900/30">
                            <p className="text-sm text-gray-500">
                                Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredProjects.length)} of {filteredProjects.length} entries
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-700 rounded-lg text-sm text-gray-400 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Previous
                                </button>
                                {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                                    let pageNum = index + 1;
                                    if (totalPages > 5 && currentPage > 3) {
                                        pageNum = currentPage - 2 + index;
                                        if (pageNum > totalPages) return null;
                                    }
                                    if (pageNum > totalPages) return null;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition ${currentPage === pageNum
                                                ? 'bg-gradient-to-r from-[#1EB97A] to-[#189663] text-white shadow-lg'
                                                : 'text-gray-400 hover:bg-gray-800'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-gray-700 rounded-lg text-sm text-gray-400 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* View Project Modal - Dark Version */}
                {viewModalOpen && selectedProject && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setViewModalOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-gradient-to-br from-gray-900 to-black shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-800"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header - Modern Dark Gradient */}
                            <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-800 via-gray-900 to-black px-8 py-5 flex justify-between items-center border-b border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#1EB97A] to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Project Details</h2>
                                        <p className="text-gray-500 text-xs">View complete project information</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setViewModalOpen(false)}
                                    className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-all duration-200"
                                >
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body - Dark Edition */}
                            <div className="p-8 space-y-8">
                                {/* Hero Section */}
                                <div className="border-b border-gray-800 pb-6">
                                    <div className="flex items-start justify-between flex-wrap gap-4">
                                        <div>
                                            <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                                {selectedProject.projectTitle || selectedProject.title || 'Untitled'}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 text-gray-400 rounded-lg text-xs font-medium">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                    </svg>
                                                    ID: {selectedProject._id?.slice(-8)}
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 text-gray-400 rounded-lg text-xs font-medium">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {formatDate(selectedProject.submittedAt || selectedProject.createdAt)}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${selectedProject.submissionStatus === 'approved' || selectedProject.status === 'approved'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : selectedProject.submissionStatus === 'rejected' || selectedProject.status === 'rejected'
                                                        ? 'bg-emerald-500/20 text-emerald-400'
                                                        : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${selectedProject.submissionStatus === 'approved' || selectedProject.status === 'approved'
                                                        ? 'bg-green-500'
                                                        : selectedProject.submissionStatus === 'rejected' || selectedProject.status === 'rejected'
                                                            ? 'bg-emerald-500'
                                                            : 'bg-yellow-500'
                                                        }`} />
                                                    {selectedProject.submissionStatus || selectedProject.status || 'pending'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Information Card */}
                                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h4 className="font-semibold text-white">Project Information</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Project Type</label>
                                            <p className="text-gray-300 font-medium">{selectedProject.projectType || selectedProject.category || 'Not specified'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Director</label>
                                            <p className="text-gray-300">{selectedProject.director || 'Not specified'}</p>
                                        </div>
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Synopsis</label>
                                            <p className="text-gray-400 text-sm leading-relaxed bg-gray-900 p-3 rounded-xl">
                                                {selectedProject.briefSynopsis || selectedProject.description || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Media Section */}
                                {!selectedProject.mediaLink && !selectedProject.uploadedImage && (
                                    <div className="border-t border-gray-800 pt-4 mt-2">
                                        <div className="text-center py-6">
                                            <div className="w-16 h-16 mx-auto bg-gray-800/50 rounded-full flex items-center justify-center mb-3">
                                                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="ournd" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-400 text-sm">No media available</p>
                                            <p className="text-gray-500 text-xs mt-1">No trailer link or poster image uploaded for this project</p>
                                        </div>
                                    </div>
                                )}
                                {(selectedProject.mediaLink || selectedProject.uploadedImage) && (
                                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 bg-gradient-to-br from-[#1EB97A] to-emerald-500 rounded-xl flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h4 className="font-semibold text-white">Media & Visuals</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {selectedProject.mediaLink && (
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        </svg>
                                                        Trailer / Media Link
                                                    </label>
                                                    <div className="bg-gray-900 rounded-xl p-3 border border-gray-700">
                                                        <a href={selectedProject.mediaLink} target="_blank" rel="noopener noreferrer" className="text-[#1EB97A] hover:text-emerald-400 text-sm break-all flex items-center gap-2 group">
                                                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                            {selectedProject.mediaLink.length > 50 ? selectedProject.mediaLink.substring(0, 50) + '...' : selectedProject.mediaLink}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                            {selectedProject.uploadedImage && (
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        Poster / Thumbnail
                                                    </label>
                                                    <div className="relative group">
                                                        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                                                            <img src={selectedProject.uploadedImage} alt="Project poster" className="w-full max-h-48 object-contain bg-gray-900" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* International Info Card */}
                                {(selectedProject.hasNonEnglishTitle || selectedProject.nonEnglishTitle) && (
                                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10" />
                                                </svg>
                                            </div>
                                            <h4 className="font-semibold text-white">International Information</h4>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {selectedProject.nonEnglishTitle && (
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Original Title</label>
                                                    <p className="text-gray-300 font-medium">{selectedProject.nonEnglishTitle}</p>
                                                </div>
                                            )}
                                            {selectedProject.nonEnglishSynopsis && (
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Original Synopsis</label>
                                                    <p className="text-gray-400 text-sm bg-gray-900/50 p-3 rounded-xl">{selectedProject.nonEnglishSynopsis}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Credits Section */}
                                {(selectedProject.directors?.length > 0 || selectedProject.writers?.length > 0 ||
                                    selectedProject.producers?.length > 0 || selectedProject.keyCast?.length > 0) && (
                                        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                </div>
                                                <h4 className="font-semibold text-white">Credits</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {selectedProject.directors?.length > 0 && (
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Directors</label>
                                                        <div className="space-y-1">
                                                            {selectedProject.directors.map((d, idx) => (
                                                                <div key={idx} className="bg-gray-900 p-2 rounded-lg">
                                                                    <p className="text-gray-300 text-sm font-medium">
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
                                                                <div key={idx} className="bg-gray-900 p-2 rounded-lg">
                                                                    <p className="text-gray-300 text-sm font-medium">
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
                                                                <div key={idx} className="bg-gray-900 p-2 rounded-lg">
                                                                    <p className="text-gray-300 text-sm font-medium">
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
                                                                <div key={idx} className="bg-gray-900 p-2 rounded-lg">
                                                                    <p className="text-gray-300 text-sm font-medium">
                                                                        {`${c.firstName || ''} ${c.middleName || ''} ${c.lastName || ''}`.trim() || 'N/A'}
                                                                        {c.role && <span className="text-purple-400 text-xs ml-1">as {c.role}</span>}
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

                                {/* Technical Specifications */}
                                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <h4 className="font-semibold text-white">Technical Specifications</h4>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-500">Runtime</label>
                                            <p className="text-gray-300 font-medium">{formatRuntime(selectedProject)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-500">Genres</label>
                                            <p className="text-gray-300">{selectedProject.genres || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-500">Language</label>
                                            <p className="text-gray-300">{getLanguageName(selectedProject.language)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-500">Shooting Format</label>
                                            <p className="text-gray-300">{selectedProject.shootingFormat || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-500">Aspect Ratio</label>
                                            <p className="text-gray-300">{selectedProject.aspectRatio || '16:9'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-500">Film Color</label>
                                            <p className="text-gray-300">{selectedProject.filmColor || 'Color'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-500">Student Project</label>
                                            <p className="text-gray-300">{selectedProject.studentProject || 'No'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-500">First Time Filmmaker</label>
                                            <p className="text-gray-300">{selectedProject.firstTimeFilmmaker || 'No'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Submitter Information */}
                                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h4 className="font-semibold text-white">Submitter Information</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-500">Email</label>
                                            <p className="text-gray-300 break-all">{selectedProject.email || selectedProject.submitterEmail || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-500">Phone</label>
                                            <p className="text-gray-300">{selectedProject.phone || selectedProject.submitterPhone || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-500">Location</label>
                                            <p className="text-gray-300">
                                                {[selectedProject.city, selectedProject.stateProvince, selectedProject.country].filter(Boolean).join(', ') || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-500">Gender / Pronouns</label>
                                            <p className="text-gray-300">{selectedProject.gender || 'N/A'} {selectedProject.pronouns ? `(${selectedProject.pronouns})` : ''}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                {(selectedProject.website || selectedProject.twitter || selectedProject.facebook || selectedProject.instagram) && (
                                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9m-9 9a9 9 0 019-9" />
                                                </svg>
                                            </div>
                                            <h4 className="font-semibold text-white">Connect</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {selectedProject.website && (
                                                <a href={selectedProject.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 rounded-xl text-sm text-gray-400 transition">
                                                    🌐 Website
                                                </a>
                                            )}
                                            {selectedProject.twitter && (
                                                <a href={selectedProject.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 rounded-xl text-sm text-gray-400 transition">
                                                    🐦 Twitter
                                                </a>
                                            )}
                                            {selectedProject.facebook && (
                                                <a href={selectedProject.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 rounded-xl text-sm text-gray-400 transition">
                                                    📘 Facebook
                                                </a>
                                            )}
                                            {selectedProject.instagram && (
                                                <a href={selectedProject.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 rounded-xl text-sm text-gray-400 transition">
                                                    📷 Instagram
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Admin Notes */}
                                {selectedProject.adminNotes && (
                                    <div className="bg-gradient-to-r from-emerald-500/10 to-rose-500/10 rounded-2xl p-5 border border-emerald-500/20">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-emerald-400">Admin Notes</h4>
                                                <p className="text-emerald-300 text-sm mt-1">{selectedProject.adminNotes}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </div >
        </>
    );
};



export default AllProject;