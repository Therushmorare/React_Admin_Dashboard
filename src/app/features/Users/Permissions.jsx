"use client"

import React, { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';

const getPermissionDescription = (permission) => {
  const descriptions = {
    'Manage Users': 'Create, edit, and delete user accounts',
    'Approve Jobs': 'Review and approve job postings',
    'View Reports': 'Access system reports and analytics',
    'System Settings': 'Configure system-wide settings',
    'Delete Users': 'Permanently remove users from the system',
    'Manage Departments': 'Create and modify departments',
    'View Analytics': 'Access detailed analytics dashboards',
    'Export Data': 'Export system data to external formats',
    'Manage Roles': 'Create and modify user roles',
    'Post Jobs': 'Create and publish job postings',
    'Review Applications': 'View and evaluate candidate applications',
    'Schedule Interviews': 'Arrange and manage interview schedules',
    'Send Emails': 'Communicate with candidates via email',
    'Edit Job Posts': 'Modify existing job postings',
    'Delete Applications': 'Remove applications from the system',
    'View Candidate Reports': 'Access candidate analytics and reports',
    'Manage Interview Schedules': 'Organize and coordinate interviews',
    'Access Candidate Database': 'View full candidate database',
    'View Jobs': 'Browse available job openings',
    'Apply for Internal Positions': 'Submit applications for internal roles',
    'View Company Directory': 'Access employee directory',
    'Access Training Materials': 'View training and development resources',
    'Submit Referrals': 'Refer candidates for open positions',
    'Apply for Jobs': 'Submit job applications',
    'Track Applications': 'Monitor application status',
    'Update Profile': 'Edit personal profile information',
    'Upload Documents': 'Upload resumes and supporting documents',
    'Withdraw Applications': 'Cancel submitted applications'
  };
  return descriptions[permission] || 'Permission for this action';
};

const getAllAvailablePermissions = (activeTab) => {
  const permissionsByRole = {
    'admin': [
      'Manage Users',
      'Approve Jobs',
      'View Reports',
      'System Settings',
      'Delete Users',
      'Manage Departments',
      'View Analytics',
      'Export Data',
      'Manage Roles'
    ],
    'recruiter': [
      'Post Jobs',
      'Review Applications',
      'Schedule Interviews',
      'Send Emails',
      'Edit Job Posts',
      'Delete Applications',
      'View Candidate Reports',
      'Manage Interview Schedules',
      'Access Candidate Database'
    ],
    'employee': [
      'View Jobs',
      'Apply for Internal Positions',
      'View Company Directory',
      'Access Training Materials',
      'Submit Referrals'
    ],
    'applicant': [
      'Apply for Jobs',
      'Track Applications',
      'Update Profile',
      'Upload Documents',
      'Withdraw Applications'
    ]
  };
  return permissionsByRole[activeTab] || [];
};

const PermissionsModal = ({ show, onClose, onSave, user, activeTab, roleLabel }) => {
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (user && user.permissions) {
      setSelectedPermissions([...user.permissions]);
    }
  }, [user]);

  const handlePermissionToggle = (permission) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  const handleSave = () => {
    onSave({ ...user, permissions: selectedPermissions });
    onClose();
  };

  if (!show || !user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;
  const availablePermissions = getAllAvailablePermissions(activeTab);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Edit Permissions</h3>
            <p className="text-sm text-gray-600 mt-1">{fullName} - {roleLabel}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Shield size={20} className="text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Permission Management</h4>
                <p className="text-sm text-blue-700">
                  Select the permissions you want to grant to this user. These permissions determine what actions they can perform in the system.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Available Permissions for {roleLabel}s</h4>
            
            {availablePermissions.map((permission) => {
              const isChecked = selectedPermissions.includes(permission);
              return (
                <label
                  key={permission}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-green-50 border-green-500'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handlePermissionToggle(permission)}
                      className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                    />
                    <div>
                      <p className={`font-medium ${isChecked ? 'text-green-900' : 'text-gray-900'}`}>
                        {permission}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {getPermissionDescription(permission)}
                      </p>
                    </div>
                  </div>
                  {isChecked && (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500">
                      <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  )}
                </label>
              );
            })}
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-gray-900 mb-2">Selected Permissions Summary</h5>
            <div className="flex flex-wrap gap-2">
              {selectedPermissions.length > 0 ? (
                selectedPermissions.map((permission, idx) => (
                  <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    {permission}
                    <button
                      onClick={() => handlePermissionToggle(permission)}
                      className="ml-2 hover:text-green-900"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">No permissions selected</p>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
          >
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;