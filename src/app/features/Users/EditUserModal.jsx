"use client"

import React, { useState, useEffect } from 'react';

const EditUserModal = ({ show, onClose, onSave, user, activeTab, roleLabel }) => {
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

  const handleSubmit = async (userId) => {
    setUiError("");
    setSubmitting(true);

    try {
      const { token } = getAuth();
      const aid = getEffectiveAid();
      let url = "";
      let payload = {};

      if (activeTab === "admin") {
        // Edit admin
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
      } 
      else if (activeTab === "recruiter") {
        // Edit recruiter
        url = `${API_BASE}/api/admin/editRecruiter/${aid}/${formData.email}`;
        payload = {
          admin_id: aid,
          hr_email: formData.email,
          hr_employee_number: formData.employeeNumber,
          first_name: formData.firstName,
          last_name: formData.lastName,
        };
      } 

      if (url) {
        const res = await fetch(url, { 
          method: "PUT", 
          headers: headers(token), 
          body: JSON.stringify(payload) 
        });
        if (!res.ok) throw new Error(await res.text() || `Update failed (${res.status})`);
      }

      const updatedUser = {
        id: userId,
        ...formData,
        status: formData.status || "active",
      };

      onEdit?.(updatedUser);
      handleClose();
    } catch (e) {
      setUiError(e.message || "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  if (!show || !user) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit {roleLabel}</h3>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
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
            className="flex-1 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;