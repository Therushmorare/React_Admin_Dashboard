"use client"
import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteConfirmModal = ({ show, onClose, onConfirm, user }) => {
  if (!show || !user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <Trash2 size={24} className="text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Delete User</h3>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to delete <strong>{fullName}</strong>? This action cannot be undone.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(user.id);
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;