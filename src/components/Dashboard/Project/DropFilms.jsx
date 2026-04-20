"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const SubmissionsPage = () => {
  // Sample Data - You will eventually fetch this from your MongoDB
  const [submissions] = useState([
    {
      id: "SUB-8821",
      projectName: "The Silent Forest",
      festival: "Sundance Film Festival 2026",
      category: "Best Short Film",
      date: "Mar 15, 2026",
      status: "Pending", // Options: Pending, Accepted, Rejected, Under Review
      fee: "$45.00"
    },
    {
      id: "SUB-7742",
      projectName: "Midnight in Dhaka",
      festival: "Dhaka International Film Festival",
      category: "National Competition",
      date: "Feb 10, 2026",
      status: "Accepted",
      fee: "$0.00"
    },
    {
      id: "SUB-6610",
      projectName: "TechFocus Documentary",
      festival: "Cannes Indie Shorts",
      category: "Documentary Short",
      date: "Jan 05, 2026",
      status: "Rejected",
      fee: "$30.00"
    }
  ]);

  // Status Badge Helper
  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted": return "bg-green-100 text-green-700 border-green-200";
      case "Rejected": return "bg-red-100 text-red-700 border-red-200";
      case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="p-6 md:p-10 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Project Submissions</h1>
            <p className="text-sm text-gray-500 mt-1">Track the status of your films across different festivals.</p>
          </div>
          <Link href="/project/add">
            <button className="bg-[#1EB97A] hover:bg-[#189663] text-white px-5 py-2.5 rounded-md font-semibold text-sm transition-all shadow-sm">
              Submit New Project
            </button>
          </Link>
        </div>

        {/* Stats Overview (Optional but looks great) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase">Total Submissions</p>
            <p className="text-2xl font-bold text-gray-800">{submissions.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase">Accepted</p>
            <p className="text-2xl font-bold text-green-600">1</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase">Pending</p>
            <p className="text-2xl font-bold text-amber-500">1</p>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Project & Festival</th>
                  <th className="px-6 py-4">Category</th>
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
                        <span className="text-xs text-blue-600 hover:underline cursor-pointer mt-0.5">{sub.festival}</span>
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
                      <button className="text-gray-400 hover:text-blue-600 text-xs font-bold underline uppercase tracking-tighter">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State Logic */}
          {submissions.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-gray-500 italic">No submissions found. Start your journey by submitting a project!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionsPage;