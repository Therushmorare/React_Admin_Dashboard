"use client"

import React from 'react';
import { XCircle, CheckCircle, Calendar } from 'lucide-react';
import { PRIORITY_COLORS } from '../../constants/approvals/constants';

const JobDetailModal = ({ job, onClose, onApprove, onReject }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-30 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
              <span className={`px-2 py-1 rounded text-xs font-medium ${PRIORITY_COLORS[job.priority].bg} ${PRIORITY_COLORS[job.priority].text}`}>
                {job.priority.toUpperCase()} PRIORITY
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>{job.department}</span>
              <span>•</span>
              <span>{job.type}</span>
              <span>•</span>
              <span>{job.seniorityLevel}</span>
              <span>•</span>
              <span>{job.locationType === 'remote' ? 'Remote' : 
                    job.locationType === 'hybrid' ? `Hybrid - ${job.city}` : 
                    job.city}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Submission Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Submitted by {job.submittedBy}</p>
                <p className="text-sm text-blue-700 mt-1">
                  {new Date(job.submittedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <Calendar size={24} className="text-blue-600" />
            </div>
          </div>

          {/* Salary */}
          {job.salaryRange.min && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Salary Range</h3>
              <p className="text-gray-700">
                {job.salaryRange.currency} {parseInt(job.salaryRange.min).toLocaleString()} - {parseInt(job.salaryRange.max).toLocaleString()} per year
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Responsibilities</h3>
              <div className="text-gray-700 whitespace-pre-line">{job.responsibilities}</div>
            </div>
          )}

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill, idx) => (
                <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {job.preferredSkills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Preferred Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.preferredSkills.map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {job.education && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Education & Experience</h3>
              <div className="text-gray-700 whitespace-pre-line">{job.education}</div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Benefits & Perks</h3>
              <div className="text-gray-700 whitespace-pre-line">{job.benefits}</div>
            </div>
          )}

          {/* Custom Questions */}
          {job.customQuestions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Application Questions</h3>
              <div className="space-y-3">
                {job.customQuestions.map((question, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-gray-900">{question.question}</p>
                      {question.required && <span className="text-red-500 text-sm">Required</span>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Type: {question.type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onReject(job.id)}
            className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center"
          >
            <XCircle size={16} className="mr-2" />
            Reject
          </button>
          <button
            onClick={() => onApprove(job.id)}
            className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors flex items-center"
          >
            <CheckCircle size={16} className="mr-2" />
            Approve Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;