"use client"

import React, { useState } from 'react';
import { Users } from 'lucide-react';
import UserTableRow from './TableRow';

const UserTable = ({ 
  users, 
  activeTab, 
  onEdit, 
  onDelete, 
  onViewDetails, 
  onEditPermissions, 
  onToggleStatus 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">User</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Contact</th>
              {activeTab !== 'applicant' && (
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Department</th>
              )}
              {activeTab === 'admin' && (
                <>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Employee #</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Role</th>
                </>
              )}
              {activeTab === 'employee' && (
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Position</th>
              )}
              {activeTab === 'recruiter' && (
                <>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Active Jobs</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Apps Reviewed</th>
                </>
              )}
              {activeTab === 'applicant' && (
                <>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Applications</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Last Applied</th>
                </>
              )}
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Join Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                activeTab={activeTab}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
                onEditPermissions={onEditPermissions}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
          <p className="text-gray-600">No users have been added yet</p>
        </div>
      )}
    </div>
  );
};

export default UserTable;