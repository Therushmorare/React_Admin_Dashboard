"use client"

import React from 'react';
import { Briefcase, MapPin, DollarSign, Users, Calendar, Eye, CheckCircle, XCircle } from 'lucide-react';
import { PRIORITY_COLORS } from '../../constants/approvals/constants';

const JobCard = ({ job, onViewDetails, onApprove, onReject }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[job.priority].bg} ${PRIORITY_COLORS[job.priority].text}`}>
                {job.priority.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="flex items-center">
                <Briefcase size={14} className="mr-1" />
                {job.department}
              </span>
              <span className="flex items-center">
                <MapPin size={14} className="mr-1" />
                {job.locationType === 'remote' ? 'Remote' : 
                 job.locationType === 'hybrid' ? `Hybrid - ${job.city}` : 
                 job.city}
              </span>
              <span className="flex items-center">
                <DollarSign size={14} className="mr-1" />
                {job.salaryRange.currency} {parseInt(job.salaryRange.min).toLocaleString()} - {parseInt(job.salaryRange.max).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Description Preview */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{job.description}</p>

        {/* Skills Preview */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {job.requiredSkills.slice(0, 4).map((skill, idx) => (
              <span key={idx} className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 4 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                +{job.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Submission Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <span className="flex items-center">
              <Users size={14} className="mr-1" />
              Submitted by <span className="font-medium ml-1">{job.submittedBy}</span>
            </span>
            <span className="flex items-center mt-1">
              <Calendar size={14} className="mr-1" />
              {new Date(job.submittedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => onViewDetails(job)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Eye size={14} className="mr-1" />
            View Details
          </button>
          <button
            onClick={() => onApprove(job.id)}
            className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors flex items-center"
          >
            <CheckCircle size={14} className="mr-1" />
            Approve
          </button>
          <button
            onClick={() => onReject(job.id)}
            className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center"
          >
            <XCircle size={14} className="mr-1" />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;