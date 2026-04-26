"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    inReview: 0
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://server.nybff.us";

  // Get auth token
  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Fetch all submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/api/admin/submissions`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        if (response.status === 403) {
          throw new Error("Access denied. Admin only.");
        }
        throw new Error(`Failed to fetch submissions: ${response.status}`);
      }

      const data = await response.json();
      
      let submissionsArray = [];
      if (Array.isArray(data)) {
        submissionsArray = data;
      } else if (data.submissions && Array.isArray(data.submissions)) {
        submissionsArray = data.submissions;
      } else if (data.data && Array.isArray(data.data)) {
        submissionsArray = data.data;
      } else {
        throw new Error("Invalid data format received");
      }

      setSubmissions(submissionsArray);
      
      // Calculate stats
      const total = submissionsArray.length;
      const pending = submissionsArray.filter(s => s.submissionStatus === 'pending' || s.status === 'pending').length;
      const approved = submissionsArray.filter(s => s.submissionStatus === 'approved' || s.status === 'approved').length;
      const rejected = submissionsArray.filter(s => s.submissionStatus === 'rejected' || s.status === 'rejected').length;
      const inReview = submissionsArray.filter(s => s.submissionStatus === 'in-review' || s.status === 'in-review').length;
      
      setStats({ total, pending, approved, rejected, inReview });

    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Update submission status
  const updateSubmissionStatus = async (submissionId, newStatus, notes = null) => {
    try {
      setUpdatingId(submissionId);

      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/api/admin/submissions/${submissionId}/status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          status: newStatus,
          adminNotes: notes || adminNotes 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      // Update local state
      setSubmissions(prev => prev.map(sub => 
        sub._id === submissionId 
          ? { ...sub, submissionStatus: newStatus, status: newStatus, adminNotes: notes || sub.adminNotes }
          : sub
      ));

      toast.success(`Submission ${newStatus} successfully`);
      
      if (showModal) {
        setShowModal(false);
        setAdminNotes("");
        setSelectedSubmission(null);
      }
      
      // Refresh stats
      fetchSubmissions();

    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete submission
  const handleDelete = async (submissionId) => {
    if (!confirm("Are you sure you want to delete this submission? This action cannot be undone.")) {
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/api/admin/submissions/${submissionId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete submission");
      }

      setSubmissions(prev => prev.filter(sub => sub._id !== submissionId));
      toast.success("Submission deleted successfully");
      fetchSubmissions();

    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error(error.message);
    }
  };

  // View submission details
  const viewSubmissionDetails = (submission) => {
    setSelectedSubmission(submission);
    setAdminNotes(submission.adminNotes || "");
    setShowModal(true);
  };

  // Edit submission
  const handleEdit = (submission) => {
    // Navigate to edit page or open edit modal
    window.location.href = `/admin/submissions/edit/${submission._id}`;
  };

  // Filter submissions
  const getFilteredSubmissions = () => {
    let filtered = [...submissions];

    if (selectedStatus !== "all") {
      filtered = filtered.filter(sub => 
        (sub.submissionStatus || sub.status) === selectedStatus
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(sub => 
        sub.projectTitle?.toLowerCase().includes(term) ||
        sub.title?.toLowerCase().includes(term) ||
        sub.email?.toLowerCase().includes(term) ||
        sub.userId?.name?.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-emerald-100 text-emerald-700",
      "in-review": "bg-blue-100 text-blue-700"
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading submissions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredSubmissions = getFilteredSubmissions();

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Film Submissions</h1>
            <p className="text-gray-600 mt-1">Review and manage all film project submissions</p>
          </div>
          <button
            onClick={fetchSubmissions}
            className="mt-4 md:mt-0 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Rejected</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.rejected}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by project title, email, or submitter name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-review">In Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sl No</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Submitter</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className=" px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.map((submission, index) => {
                  const status = submission.submissionStatus || submission.status || "pending";
                  const isUpdating = updatingId === submission._id;
                  
                  return (
                    <tr key={submission._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{submission.projectTitle || submission.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {submission.projectTypes?.slice(0, 2).join(", ") || submission.type || "Film"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">{submission.userId?.name || submission.submitterName || "Unknown"}</p>
                          <p className="text-xs text-gray-500">{submission.email || submission.submitterEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                          {submission.projectType || submission.type || "Short Film"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(submission.submittedAt || submission.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={status}
                          onChange={(e) => updateSubmissionStatus(submission._id, e.target.value)}
                          disabled={isUpdating}
                          className={`px-3 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-offset-2 cursor-pointer ${getStatusBadge(status)} ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <option value="pending" className="bg-yellow-100 text-yellow-700">Pending</option>
                          <option value="in-review" className="bg-blue-100 text-blue-700">In Review</option>
                          <option value="approved" className="bg-green-100 text-green-700">Approved</option>
                          <option value="rejected" className="bg-emerald-100 text-emerald-700">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* View Details Button */}
                          <button
                            onClick={() => viewSubmissionDetails(submission)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleEdit(submission)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Submission"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(submission._id)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Delete Submission"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">No submissions found</p>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {submissions.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredSubmissions.length} of {submissions.length} submissions
          </div>
        )}
      </div>

      {/* Submission Details Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Submission Details</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Project Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Project Title</p>
                      <p className="font-medium text-gray-900">{selectedSubmission.projectTitle || selectedSubmission.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Project Type</p>
                      <p className="font-medium text-gray-900">{selectedSubmission.projectType || selectedSubmission.type}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Synopsis</p>
                      <p className="text-gray-700">{selectedSubmission.briefSynopsis || selectedSubmission.description}</p>
                    </div>
                  </div>
                </div>

                {/* Submitter Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Submitter Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{selectedSubmission.userId?.name || selectedSubmission.submitterName || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{selectedSubmission.email || selectedSubmission.submitterEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{selectedSubmission.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{selectedSubmission.city || selectedSubmission.submitterCity}, {selectedSubmission.country || selectedSubmission.submitterCountry}</p>
                    </div>
                  </div>
                </div>

                {/* Credits */}
                {(selectedSubmission.directors?.length > 0 || selectedSubmission.writers?.length > 0) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Credits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedSubmission.directors?.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500">Directors</p>
                          <p className="text-gray-700">{selectedSubmission.directors.map(d => `${d.firstName} ${d.lastName}`).join(", ")}</p>
                        </div>
                      )}
                      {selectedSubmission.writers?.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500">Writers</p>
                          <p className="text-gray-700">{selectedSubmission.writers.map(w => `${w.firstName} ${w.lastName}`).join(", ")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Technical Specs */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Runtime</p>
                      <p className="font-medium text-gray-900">
                        {selectedSubmission.runtimeHours}:{selectedSubmission.runtimeMinutes}:{selectedSubmission.runtimeSeconds}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Language</p>
                      <p className="font-medium text-gray-900">{selectedSubmission.language || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Shooting Format</p>
                      <p className="font-medium text-gray-900">{selectedSubmission.shootingFormat || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Aspect Ratio</p>
                      <p className="font-medium text-gray-900">{selectedSubmission.aspectRatio || "16:9"}</p>
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Admin Notes</h3>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows="3"
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Add notes about this submission..."
                  />
                </div>

                {/* Status Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => updateSubmissionStatus(selectedSubmission._id, "approved", adminNotes)}
                    disabled={updatingId === selectedSubmission._id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
                  >
                    {updatingId === selectedSubmission._id ? "Processing..." : "✓ Approve"}
                  </button>
                  <button
                    onClick={() => updateSubmissionStatus(selectedSubmission._id, "in-review", adminNotes)}
                    disabled={updatingId === selectedSubmission._id}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
                  >
                    {updatingId === selectedSubmission._id ? "Processing..." : "📝 Mark In Review"}
                  </button>
                  <button
                    onClick={() => updateSubmissionStatus(selectedSubmission._id, "rejected", adminNotes)}
                    disabled={updatingId === selectedSubmission._id}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
                  >
                    {updatingId === selectedSubmission._id ? "Processing..." : "✗ Reject"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}