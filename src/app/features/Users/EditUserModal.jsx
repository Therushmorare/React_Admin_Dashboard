"use client"
// services/usersApi.js
const API_BASE = "https://jellyfish-app-z83s2.ondigitalocean.app";

import React, { useState, useEffect } from 'react';

const EditUserModal = ({ show, onClose, onEdit, user, activeTab, roleLabel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    employeeNumber: '',
    department: '',
    role: '',
    aid: '',
    position: ''
  });

  const [uiError, setUiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || user.phone || '',
        employeeNumber: user.employeeNumber || '',
        department: user.department || '',
        role: user.role || '',
        aid: user.aid || '',
        position: user.position || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setUiError("");
    setSubmitting(true);

    try {
      const token = sessionStorage.getItem("access_token");
      const aid = sessionStorage.getItem("user_id");
      const userId = user?.id;
      if (!userId) throw new Error("User ID missing.");

      let url = "";
      let payload = {};
      let method = "PUT";

      if (activeTab === "admin") {
        url = `${API_BASE}/api/admin/editAdmin/${userId}`;
        payload = {
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          employee_number: formData.employeeNumber,
          department: formData.department,
          role: formData.role,
          phone_number: formData.phoneNumber,
        };
      } else if (activeTab === "recruiter") {
        if (!aid) throw new Error("Admin ID required for recruiter update.");
        url = `${API_BASE}/api/admin/editRecruiter/${aid}/${formData.email}`;
        payload = {
          admin_id: aid,
          hr_email: formData.email,
          hr_employee_number: formData.employeeNumber,
          first_name: formData.firstName,
          last_name: formData.lastName,
        };
        method = "POST"; // API expects POST for recruiter edits
      }

      if (url) {
        const res = await fetch(url, { 
          method,
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(await res.text() || `Update failed (${res.status})`);
      }

      const updatedUser = {
        ...user,
        ...formData,
        status: user.status || "active",
      };

      onEdit?.(updatedUser);
      onClose();
    } catch (e) {
      setUiError(e.message || "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  if (!show || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit {roleLabel}</h3>

        {uiError && <p className="text-red-600 text-sm mb-2">{uiError}</p>}

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Admin specific */}
          {activeTab === 'admin' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Number *</label>
                <input
                  type="text"
                  name="employeeNumber"
                  value={formData.employeeNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AID *</label>
                <input
                  type="text"
                  name="aid"
                  value={formData.aid}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </>
          )}

          {/* Department for everyone except applicant */}
          {activeTab !== 'applicant' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />
            </div>
          )}

          {/* Employee Position */}
          {activeTab === 'employee' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;