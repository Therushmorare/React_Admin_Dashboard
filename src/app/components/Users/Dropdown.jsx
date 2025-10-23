"use client"

import React from 'react';
import { Eye, Edit, Lock, UserX, UserCheck, Trash2, MoreVertical } from 'lucide-react';

const UserActionsDropdown = ({ 
  user, 
  isOpen, 
  onToggle, 
  onClose, 
  onEdit, 
  onDelete, 
  onViewDetails, 
  onEditPermissions, 
  onToggleStatus 
}) => {
  return (
    <div className="relative">
      <button 
        onClick={onToggle} 
        className="p-1 hover:bg-gray-100 rounded transition-colors"
      >
        <MoreVertical size={16} className="text-gray-600" />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onClose} />
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <button
              onClick={() => {
                onViewDetails(user);
                onClose();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <Eye size={14} className="mr-2" />
              View Details
            </button>
            <button
              onClick={() => {
                onEdit(user);
                onClose();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <Edit size={14} className="mr-2" />
              Edit User
            </button>
            <button
              onClick={() => {
                onEditPermissions(user);
                onClose();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <Lock size={14} className="mr-2" />
              Edit Permissions
            </button>
            <button
              onClick={() => {
                onToggleStatus(user.id);
                onClose();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
              {user.status === 'active' ? (
                <>
                  <UserX size={14} className="mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <UserCheck size={14} className="mr-2" />
                  Activate
                </>
              )}
            </button>
            <button
              onClick={() => {
                onDelete(user);
                onClose();
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
            >
              <Trash2 size={14} className="mr-2" />
              Delete User
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserActionsDropdown;