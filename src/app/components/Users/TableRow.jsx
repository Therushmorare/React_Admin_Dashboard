"use client"


import React from 'react';
import { Mail, Phone } from 'lucide-react';
import UserActionsDropdown from './Dropdown';

const UserTableRow = ({ 
  user, 
  activeTab, 
  dropdownOpen, 
  setDropdownOpen, 
  onEdit, 
  onDelete, 
  onViewDetails, 
  onEditPermissions, 
  onToggleStatus 
}) => {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center space-x-3">
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=22c55e&color=ffffff`} 
            alt={fullName} 
            className="w-10 h-10 rounded-full" 
          />
          <div>
            <p className="font-medium text-gray-900">{fullName}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <Mail size={12} className="mr-1" />
            {user.email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone size={12} className="mr-1" />
            {user.phone || user.phoneNumber}
          </div>
        </div>
      </td>
      {activeTab !== 'applicant' && (
        <td className="py-3 px-4 text-sm text-gray-700">{user.department}</td>
      )}
      {activeTab === 'admin' && (
        <>
          <td className="py-3 px-4 text-sm text-gray-700">{user.employeeNumber}</td>
          <td className="py-3 px-4 text-sm text-gray-700">{user.role}</td>
        </>
      )}
      {activeTab === 'employee' && (
        <td className="py-3 px-4 text-sm text-gray-700">{user.position}</td>
      )}
      {activeTab === 'recruiter' && (
        <>
          <td className="py-3 px-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {user.activeJobs || 0} active
            </span>
          </td>
          <td className="py-3 px-4 text-sm text-gray-700">{user.applicationsReviewed || 0}</td>
        </>
      )}
      {activeTab === 'applicant' && (
        <>
          <td className="py-3 px-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {user.applicationsSubmitted || 0} submitted
            </span>
          </td>
          <td className="py-3 px-4 text-sm text-gray-700">
            {user.lastApplication 
              ? new Date(user.lastApplication).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) 
              : 'N/A'}
          </td>
        </>
      )}
      <td className="py-3 px-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {user.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-700">
        {new Date(user.joinDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
      </td>
      <td className="py-3 px-4">
        <UserActionsDropdown
          user={user}
          isOpen={dropdownOpen === user.id}
          onToggle={() => setDropdownOpen(dropdownOpen === user.id ? null : user.id)}
          onClose={() => setDropdownOpen(null)}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          onEditPermissions={onEditPermissions}
          onToggleStatus={onToggleStatus}
        />
      </td>
    </tr>
  );
};

export default UserTableRow;