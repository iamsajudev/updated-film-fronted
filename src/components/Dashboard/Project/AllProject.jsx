"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/utils/auth';

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
    const [currentUserId, setCurrentUserId] = useState(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://server.nybff.us';

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        filterProjects();
    }, [searchTerm, projects]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const token = getToken();

            if (!token) {
                router.push('/login');
                return;
            }

            // ✅ FIRST: Get current user's profile to get their ID
            const profileResponse = await fetch(`${API_URL}/api/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const profileData = await profileResponse.json();
            if (profileData.success && profileData.user) {
                const userId = profileData.user.id;
                setCurrentUserId(userId);
                console.log('✅ Current User ID:', userId);

                // ✅ SECOND: Fetch all projects and filter by userId
                const projectsResponse = await fetch(`${API_URL}/api/projects`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const projectsData = await projectsResponse.json();

                if (projectsData.success) {
                    const allProjects = projectsData.projects || [];

                    // ✅ FILTER: Only show projects where userId matches current user
                    const userProjects = allProjects.filter(project =>
                        project.userId === userId ||
                        project.userId?._id === userId ||
                        project.submittedBy?._id === userId ||
                        project.submittedBy === userId
                    );

                    console.log('📊 Total projects:', allProjects.length);
                    console.log('👤 User projects:', userProjects.length);
                    console.log('🎯 Current User ID:', userId);

                    setProjects(userProjects);
                    setFilteredProjects(userProjects);

                    if (userProjects.length === 0 && allProjects.length > 0) {
                        console.log('⚠️ No projects found for this user. Showing 0 of', allProjects.length, 'total projects');
                    }
                } else {
                    setError(projectsData.message || 'Failed to fetch projects');
                }
            } else {
                setError('Failed to get user profile');
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
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1EB97A] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your projects...</p>
                </div>
            </div>
        );
    }

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
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white font-bold">
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
            {/* View Project Modal - Complete Version with ALL Fields */}
            {viewModalOpen && selectedProject && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">
                                Project Details
                            </h2>
                            <button
                                onClick={() => setViewModalOpen(false)}
                                className="text-white hover:text-gray-200 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Project Title & Basic Info */}
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {selectedProject.projectTitle || selectedProject.title || 'Untitled'}
                                </h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                                        ID: {selectedProject._id?.slice(-8)}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs">
                                        Submitted: {formatDate(selectedProject.submittedAt || selectedProject.createdAt)}
                                    </span>
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${selectedProject.submissionStatus === 'approved' || selectedProject.status === 'approved'
                                            ? 'bg-green-100 text-green-800'
                                            : selectedProject.submissionStatus === 'rejected' || selectedProject.status === 'rejected'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        Status: {selectedProject.submissionStatus || selectedProject.status || 'pending'}
                                    </span>
                                </div>
                            </div>

                            {/* Project Information */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Project Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Project Type</label>
                                        <p className="text-gray-900 mt-1 font-medium">
                                            {selectedProject.projectType || selectedProject.category || 'Not specified'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Director</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.director || 'Not specified'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Synopsis / Description</label>
                                        <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                                            {selectedProject.briefSynopsis || selectedProject.description || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Non-English Title Info */}
                            {(selectedProject.hasNonEnglishTitle || selectedProject.nonEnglishTitle) && (
                                <div className="bg-yellow-50 rounded-lg p-5">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                        </svg>
                                        International Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedProject.nonEnglishTitle && (
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase">Original Title</label>
                                                <p className="text-gray-900 mt-1">{selectedProject.nonEnglishTitle}</p>
                                            </div>
                                        )}
                                        {selectedProject.nonEnglishSynopsis && (
                                            <div className="md:col-span-2">
                                                <label className="text-xs font-medium text-gray-500 uppercase">Original Synopsis</label>
                                                <p className="text-gray-700 text-sm mt-1">{selectedProject.nonEnglishSynopsis}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Credits Section */}
                            {(selectedProject.directors?.length > 0 || selectedProject.writers?.length > 0 ||
                                selectedProject.producers?.length > 0 || selectedProject.keyCast?.length > 0) && (
                                    <div className="bg-gray-50 rounded-lg p-5">
                                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            Credits
                                        </h4>
                                        <div className="space-y-4">
                                            {selectedProject.directors?.length > 0 && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 uppercase">Directors</label>
                                                    <div className="mt-1 space-y-1">
                                                        {selectedProject.directors.map((d, idx) => (
                                                            <p key={idx} className="text-gray-900 text-sm">
                                                                {`${d.firstName || ''} ${d.middleName || ''} ${d.lastName || ''}`.trim() || 'N/A'}
                                                                {d.priorCredits && <span className="text-gray-500 text-xs ml-2">({d.priorCredits})</span>}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {selectedProject.writers?.length > 0 && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 uppercase">Writers</label>
                                                    <div className="mt-1 space-y-1">
                                                        {selectedProject.writers.map((w, idx) => (
                                                            <p key={idx} className="text-gray-900 text-sm">
                                                                {`${w.firstName || ''} ${w.middleName || ''} ${w.lastName || ''}`.trim() || 'N/A'}
                                                                {w.priorCredits && <span className="text-gray-500 text-xs ml-2">({w.priorCredits})</span>}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {selectedProject.producers?.length > 0 && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 uppercase">Producers</label>
                                                    <div className="mt-1 space-y-1">
                                                        {selectedProject.producers.map((p, idx) => (
                                                            <p key={idx} className="text-gray-900 text-sm">
                                                                {`${p.firstName || ''} ${p.middleName || ''} ${p.lastName || ''}`.trim() || 'N/A'}
                                                                {p.priorCredits && <span className="text-gray-500 text-xs ml-2">({p.priorCredits})</span>}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {selectedProject.keyCast?.length > 0 && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 uppercase">Key Cast</label>
                                                    <div className="mt-1 space-y-1">
                                                        {selectedProject.keyCast.map((c, idx) => (
                                                            <p key={idx} className="text-gray-900 text-sm">
                                                                {`${c.firstName || ''} ${c.middleName || ''} ${c.lastName || ''}`.trim() || 'N/A'}
                                                                {c.role && <span className="text-gray-500 text-xs ml-2">as {c.role}</span>}
                                                                {c.priorCredits && <span className="text-gray-500 text-xs ml-2">({c.priorCredits})</span>}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* Technical Specifications */}
                            <div className="bg-gray-50 rounded-lg p-5">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    Technical Specifications
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Runtime</label>
                                        <p className="text-gray-900 mt-1">{formatRuntime(selectedProject)}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Genres</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.genres || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Language</label>
                                        <p className="text-gray-900 mt-1">{getLanguageName(selectedProject.language)}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Shooting Format</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.shootingFormat || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Aspect Ratio</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.aspectRatio || '16:9'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Film Color</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.filmColor || 'Color'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Student Project</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.studentProject || 'No'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">First Time Filmmaker</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.firstTimeFilmmaker || 'No'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Completion Date</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.completionDate ? formatDate(selectedProject.completionDate) : 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Production Budget</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.productionBudget ? `$${selectedProject.productionBudget}` : 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Country of Origin</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.countryOfOrigin || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Country of Filming</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.countryOfFilming || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submitter Information */}
                            <div className="bg-gray-50 rounded-lg p-5">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Submitter Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.email || selectedProject.submitterEmail || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Phone</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.phone || selectedProject.submitterPhone || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Gender</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.gender || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Pronouns</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.pronouns || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Birth Date</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.birthDate ? formatDate(selectedProject.birthDate) : 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Country</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.country || selectedProject.submitterCountry || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">City</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.city || selectedProject.submitterCity || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">State/Province</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.stateProvince || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Postal Code</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.postalCode || 'Not provided'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Address</label>
                                        <p className="text-gray-900 mt-1">{selectedProject.address || selectedProject.submitterAddress || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            {(selectedProject.website || selectedProject.twitter || selectedProject.facebook || selectedProject.instagram) && (
                                <div className="bg-gray-50 rounded-lg p-5">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                        Social Links & Website
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedProject.website && (
                                            <a href={selectedProject.website} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition">
                                                🌐 Website
                                            </a>
                                        )}
                                        {selectedProject.twitter && (
                                            <a href={selectedProject.twitter} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-sky-100 text-sky-700 rounded-md text-sm hover:bg-sky-200 transition">
                                                🐦 Twitter
                                            </a>
                                        )}
                                        {selectedProject.facebook && (
                                            <a href={selectedProject.facebook} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition">
                                                📘 Facebook
                                            </a>
                                        )}
                                        {selectedProject.instagram && (
                                            <a href={selectedProject.instagram} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 rounded-md text-sm hover:bg-pink-200 transition">
                                                📷 Instagram
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Admin Notes (if any) */}
                            {selectedProject.adminNotes && (
                                <div className="bg-red-50 rounded-lg p-5">
                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Admin Notes
                                    </h4>
                                    <p className="text-gray-700 text-sm">{selectedProject.adminNotes}</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setViewModalOpen(false)}
                                className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllProject;