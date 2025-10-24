"use client";
import React, { useState } from "react";

const API_BASE = "https://jellyfish-app-z83s2.ondigitalocean.app";

const getAuth = () => {
  const aid =
    (typeof window !== "undefined" && sessionStorage.getItem("user_id")) ||
    (typeof window !== "undefined" && localStorage.getItem("user_id")) || // your older fallback
    null;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("access_token") : null;
  return { aid, token };
};

const headers = (token) => ({
  accept: "application/json",
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const AddUserModal = ({ show, onClose, onAdd, activeTab, roleLabel }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    employeeNumber: "",
    department: "",
    role: "",
    position: "",
    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);
  const [uiError, setUiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      employeeNumber: "",
      department: "",
      role: "",
      position: "",
      status: "active",
    });
  };

  const handleClose = () => {
    resetForm();
    setUiError("");
    onClose();
  };

  // Validation per tab
  const isFormValid = () => {
    const baseValid =
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phoneNumber;

    if (activeTab === "admin") {
      // Removed the incorrect `formData.aid` check
      return (
        baseValid &&
        formData.employeeNumber &&
        formData.department &&
        formData.role
      );
    }

    if (activeTab === "employee") {
      return baseValid && formData.department && formData.position;
    }

    if (activeTab === "recruiter") {
      // HR member requires employee number at the backend
      return baseValid && formData.department && formData.employeeNumber;
    }

    // applicants don't use this modal in your flow
    return baseValid;
  };

  const handleSubmit = async () => {
    setUiError("");
    setSubmitting(true);
    const { aid, token } = getAuth();

    try {
      if (!aid) {
        throw new Error(
          "Missing admin ID (aid). Ensure sessionStorage.admin_id is set after login."
        );
      }

      let newUser = null;

      if (activeTab === "admin") {
        // /api/admin/addNewAdmin/{aid}
        const url = `${API_BASE}/api/admin/addNewAdmin/${aid}`;
        const payload = {
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          employee_number: formData.employeeNumber,
          department: formData.department,
          role: formData.role, // e.g., MANAGER, SUPERUSER, etc.
          phone_number: formData.phoneNumber,
          aid, // API example shows this in body
        };

        const res = await fetch(url, {
          method: "POST",
          headers: headers(token),
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Add admin failed (${res.status})`);
        }

        // If the API returns the created admin, parse it.
        // If it returns a message only, synthesize a user object from form data:
        let data = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        // Map the response (or fallback to form data)
        const id =
          data?.admin_id ||
          data?.id ||
          (typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `tmp_${Date.now()}`);

        newUser = {
          id,
          adminId: id,
          firstName: data?.first_name ?? formData.firstName,
          lastName: data?.last_name ?? formData.lastName,
          email: data?.email ?? formData.email,
          department: data?.departmet || data?.department || formData.department,
          role: (data?.role || formData.role || "").toString().trim(),
          phone: data?.phone_number ?? formData.phoneNumber,
          status: data?.is_active === false ? "inactive" : "active",
        };
      } else if (activeTab === "recruiter") {
        // /api/admin/addHrMember/{aid}
        const url = `${API_BASE}/api/admin/addHrMember/${aid}`;
        const payload = {
          admin_id: aid,
          hr_email: formData.email,
          hr_employee_number: formData.employeeNumber,
          first_name: formData.firstName,
          last_name: formData.lastName,
        };

        const res = await fetch(url, {
          method: "POST",
          headers: headers(token),
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Add HR member failed (${res.status})`);
        }

        let data = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        const id =
          data?.employee_id ||
          data?.id ||
          (typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `tmp_${Date.now()}`);

        newUser = {
          id,
          employeeId: id,
          firstName: data?.first_name ?? formData.firstName,
          lastName: data?.last_name ?? formData.lastName,
          email: data?.hr_email ?? formData.email,
          department: formData.department, // endpoint doesn't include dept; keep from form
          role: "HR_RECRUITER",
          phone: formData.phoneNumber,
          status: "active",
        };
      } else if (activeTab === "employee") {
        // You didn’t share an employee-create endpoint; let parent onAdd() handle the stub.
        newUser = { ...formData, id: `tmp_${Date.now()}` };
      } else {
        // applicants not created here
        newUser = { ...formData, id: `tmp_${Date.now()}` };
      }

      // Hand result back to parent so it can insert into the correct list
      onAdd?.(newUser);

      // Close + reset
      handleClose();
    } catch (e) {
      setUiError(e.message || "Failed to add user");
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Add New {roleLabel}
        </h3>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Names */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              placeholder="Enter last name"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              placeholder="email@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              placeholder="+27 82 123 4567"
            />
          </div>

          {/* Admin-only fields */}
          {activeTab === "admin" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Number *
                </label>
                <input
                  type="text"
                  name="employeeNumber"
                  value={formData.employeeNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  placeholder="EMP001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role * (e.g., MANAGER, FINANCE, SUPERUSER)
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  placeholder="MANAGER"
                />
              </div>
            </>
          )}

          {/* Department (not for applicants) */}
          {activeTab !== "applicant" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                placeholder="Enter department"
              />
            </div>
          )}

          {/* Employee-only field */}
          {activeTab === "employee" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                placeholder="Enter position"
              />
            </div>
          )}

          {/* HR-only field needed by backend */}
          {activeTab === "recruiter" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Number * (HR)
              </label>
              <input
                type="text"
                name="employeeNumber"
                value={formData.employeeNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                placeholder="EMP123"
              />
            </div>
          )}

          {/* Inline error */}
          {uiError && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
              {uiError}
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid() || submitting}
            className="flex-1 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {submitting ? "Adding..." : `Add ${roleLabel}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;