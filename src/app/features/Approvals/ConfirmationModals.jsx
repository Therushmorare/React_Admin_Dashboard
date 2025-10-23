"use client"

import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const ApproveModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-30 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
          <CheckCircle size={24} className="text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Approve Job Post?</h3>
        <p className="text-gray-600 text-center mb-6">
          This job posting will be published and visible to candidates immediately after approval.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export const RejectModal = ({ show, onConfirm, onCancel, reason, setReason }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-10 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <AlertCircle size={24} className="text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Reject Job Post</h3>
        <p className="text-gray-600 text-center mb-6">
          Please provide a reason for rejecting this job posting. This will be sent to the submitter.
        </p>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            placeholder="e.g., Salary range is outside budget guidelines, missing required information, duplicate position..."
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!reason.trim()}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Reject Job
          </button>
        </div>
      </div>
    </div>
  );
};