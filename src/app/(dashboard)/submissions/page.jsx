"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getToken } from '@/utils/auth';

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setError('Please login to view submissions');
        setLoading(false);
        return;
      }

      // Fetch projects from your API
      const response = await fetch(`${API_URL}/api/projects/my-projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Fetched projects:', data); // Debug log

      if (data.success && data.data && data.data.length > 0) {
        // Transform projects into submissions format
        const transformedSubmissions = data.data.map(project => ({
          id: project._id,
          projectName: project.projectTitle || 'Untitled',
          festival: project.festivalName || 'Film Submission', // Default value
          category: project.genres || project.projectType || 'Not specified',
          date: formatDate(project.submittedAt || project.createdAt),
          status: getStatusFromProject(project),
          fee: project.paymentIntentId ? '$45.00' : 'Free',
          projectData: project
        }));
        setSubmissions(transformedSubmissions);
        console.log('Transformed submissions:', transformedSubmissions); // Debug log
      } else {
        setSubmissions([]);
        if (data.data && data.data.length === 0) {
          setError('No projects found. Submit your first project!');
        } else {
          setError(data.message || 'Failed to fetch submissions');
        }
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getStatusFromProject = (project) => {
    const status = project.submissionStatus;
    if (status === 'approved') return 'Accepted';
    if (status === 'rejected') return 'Rejected';
    if (status === 'submitted') return 'Under Review';
    return 'Pending';
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted": return "bg-green-100 text-green-700 border-green-200";
      case "Rejected": return "bg-red-100 text-red-700 border-red-200";
      case "Under Review": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setViewModalOpen(true);
  };

  const formatRuntime = (project) => {
    const hours = parseInt(project?.runtimeHours) || 0;
    const minutes = parseInt(project?.runtimeMinutes) || 0;
    const seconds = parseInt(project?.runtimeSeconds) || 0;
    
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
      'ru': 'Russian', 'tr': 'Turkish', 'other': 'Other'
    };
    return languages[code] || code || 'Not specified';
  };

  // Calculate stats
  const acceptedCount = submissions.filter(s => s.status === 'Accepted').length;
  const pendingCount = submissions.filter(s => s.status === 'Pending' || s.status === 'Under Review').length;
  const rejectedCount = submissions.filter(s => s.status === 'Rejected').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1EB97A] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">My Submissions</h1>
            <p className="text-sm text-gray-500 mt-1">Track all your film project submissions.</p>
          </div>
          <Link href="/projects/drop-project">
            <button className="bg-[#1EB97A] hover:bg-[#189663] text-white px-5 py-2.5 rounded-md font-semibold text-sm transition-all shadow-sm">
              + New Submission
            </button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase">Total Submissions</p>
            <p className="text-2xl font-bold text-gray-800">{submissions.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase">Accepted</p>
            <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase">Under Review</p>
            <p className="text-2xl font-bold text-amber-500">{pendingCount}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-amber-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Submissions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Project Details</th>
                  <th className="px-6 py-4">Type/Category</th>
                  <th className="px-6 py-4">Submission Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Fee</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm">{sub.projectName}</span>
                        <span className="text-xs text-gray-500 mt-0.5">ID: {sub.id.slice(-8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">
                      {sub.category}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500">
                      {sub.date}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusStyle(sub.status)} uppercase`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-700">
                      {sub.fee}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => handleViewDetails(sub)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="View Details"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State */}
          {submissions.length === 0 && !loading && (
            <div className="p-20 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500 text-lg">No submissions found</p>
              <p className="text-gray-400 text-sm mt-1">Start by submitting your first project!</p>
              <Link href="/projects/drop-project" className="inline-block mt-4 bg-[#1EB97A] text-white px-6 py-2 rounded-md">
                Submit Your First Project
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {viewModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                Submission Details
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
              {/* Project Title */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedSubmission.projectName}</h3>
                <p className="text-sm text-gray-500 mt-1">Submission ID: {selectedSubmission.id}</p>
              </div>

              {/* Status Badge */}
              <div className="inline-block">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(selectedSubmission.status)} uppercase`}>
                  {selectedSubmission.status}
                </span>
              </div>

              {/* Submission Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Submission Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Submission Date</label>
                    <p className="text-gray-900">{selectedSubmission.date}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Submission Fee</label>
                    <p className="text-gray-900">{selectedSubmission.fee}</p>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              {selectedSubmission.projectData && (
                <>
                  {/* Project Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Project Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500">Project Type</label>
                        <p className="text-gray-900">{selectedSubmission.projectData.projectType || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Runtime</label>
                        <p className="text-gray-900">{formatRuntime(selectedSubmission.projectData)}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-gray-500">Brief Synopsis</label>
                        <p className="text-gray-900 text-sm mt-1">{selectedSubmission.projectData.briefSynopsis || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Submitter Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Submitter Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500">Name</label>
                        <p className="text-gray-900">{selectedSubmission.projectData.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Email</label>
                        <p className="text-gray-900">{selectedSubmission.projectData.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Phone</label>
                        <p className="text-gray-900">{selectedSubmission.projectData.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Country</label>
                        <p className="text-gray-900">{selectedSubmission.projectData.country || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Technical Specifications */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Technical Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500">Genre</label>
                        <p className="text-gray-900">{selectedSubmission.projectData.genres || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Language</label>
                        <p className="text-gray-900">{getLanguageName(selectedSubmission.projectData.language)}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Aspect Ratio</label>
                        <p className="text-gray-900">{selectedSubmission.projectData.aspectRatio || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Shooting Format</label>
                        <p className="text-gray-900">{selectedSubmission.projectData.shootingFormat || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Payment Information */}
              {selectedSubmission.projectData?.paymentIntentId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Information</h4>
                  <div>
                    <label className="text-xs text-gray-500">Payment Intent ID</label>
                    <p className="text-gray-900 text-sm font-mono break-all">{selectedSubmission.projectData.paymentIntentId}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <Link href={`/projects/${selectedSubmission.id}`}>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                  View Full Project
                </button>
              </Link>
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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

export default SubmissionsPage;