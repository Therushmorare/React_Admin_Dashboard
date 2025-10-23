"use client"

import React from 'react';
import { X, Mail, Phone } from 'lucide-react';

const UserDetailsModal = ({ show, onClose, user, activeTab, roleLabel }) => {
  if (!show || !user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=22c55e&color=ffffff`}
              alt={fullName}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h4 className="text-xl font-semibold text-gray-900">{fullName}</h4>
              <p className="text-gray-600">{roleLabel}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {user.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h5 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h5>
            <div className="space-y-2 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center text-sm">
                <Mail size={16} className="text-gray-500 mr-2" />
                <span className="text-gray-700">{user.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone size={16} className="text-gray-500 mr-2" />
                <span className="text-gray-700">{user.phone || user.phoneNumber}</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h5 className="text-sm font-semibold text-gray-900 mb-3">Additional Information</h5>
            <div className="grid grid-cols-2 gap-4">
              {activeTab !== 'applicant' && user.department && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Department</p>
                  <p className="text-sm font-medium text-gray-900">{user.department}</p>
                </div>
              )}
              
              {activeTab === 'admin' && (
                <>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Employee Number</p>
                    <p className="text-sm font-medium text-gray-900">{user.employeeNumber}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Role</p>
                    <p className="text-sm font-medium text-gray-900">{user.role}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">AID</p>
                    <p className="text-sm font-medium text-gray-900">{user.aid}</p>
                  </div>
                </>
              )}

              {activeTab === 'employee' && user.position && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Position</p>
                  <p className="text-sm font-medium text-gray-900">{user.position}</p>
                </div>
              )}
              
              {activeTab === 'recruiter' && (
                <>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Active Jobs</p>
                    <p className="text-sm font-medium text-gray-900">{user.activeJobs || 0}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Applications Reviewed</p>
                    <p className="text-sm font-medium text-gray-900">{user.applicationsReviewed || 0}</p>
                  </div>
                </>
              )}
              
              {activeTab === 'applicant' && (
                <>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Applications Submitted</p>
                    <p className="text-sm font-medium text-gray-900">{user.applicationsSubmitted || 0}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Last Application</p>
                    <p className="text-sm font-medium text-gray-900">
                      {user.lastApplication 
                        ? new Date(user.lastApplication).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'N/A'}
                    </p>
                  </div>
                </>
              )}
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Join Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(user.joinDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Last Active</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(user.lastActive).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Permissions */}
          {user.permissions && user.permissions.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-3">Permissions</h5>
              <div className="flex flex-wrap gap-2">
                {user.permissions.map((permission, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;