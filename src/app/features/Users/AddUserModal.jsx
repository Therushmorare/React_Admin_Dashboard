"use client";
import React, { useEffect, useState } from "react";

const API_BASE = "https://jellyfish-app-z83s2.ondigitalocean.app";

const getAuth = () => {
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("access_token") : null;
  const sessionAid =
    typeof window !== "undefined" ? sessionStorage.getItem("admin_id") : null;
  return { token, sessionAid };
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
  const [admins, setAdmins] = useState([]);
  const [selectedAid, setSelectedAid] = useState("");

  // Load admins if we need an AID (admin or recruiter flows)
  useEffect(() => {
    const needAid = show && (activeTab === "admin" || activeTab === "recruiter");
    if (!needAid) return;

    const { sessionAid } = getAuth();
    // If we already have a session AID, we don't need to fetch list (optional).
    if (sessionAid) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/allAdmins`, {
          headers: headers(getAuth().token),
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to fetch admins (${res.status})`);
        const data = await res.json();
        if (Array.isArray(data)) {
          // keep only active admins for the performer list
          setAdmins(data.filter((a) => a.is_active));
        } else {
          setAdmins([]);
        }
      } catch (e) {
        console.error(e);
        setAdmins([]);
      }
    })();
  }, [show, activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
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
    setSelectedAid("");
    setUiError("");
  };

  const handleClose = () => {
    resetForm();
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
      // need department/role/employeeNumber
      return (
        baseValid &&
        formData.employeeNumber &&
        formData.department &&
        formData.role &&
        !!getEffectiveAid()
      );
    }

    if (activeTab === "employee") {
      return baseValid && formData.department && formData.position;
    }

    if (activeTab === "recruiter") {
      // backend requires hr_employee_number
      return baseValid && formData.department && formData.employeeNumber && !!getEffectiveAid();
    }

    return baseValid;
  };

  // Compute AID to use: prefer session admin_id; else selectedAid from dropdown
  const getEffectiveAid = () => {
    const { sessionAid } = getAuth();
    return (sessionAid && sessionAid.trim()) || (selectedAid && selectedAid.trim()) || "";
  };

  const handleSubmit = async () => {
    setUiError("");
    setSubmitting(true);

    try {
      const { token } = getAuth();
      const aid = getEffectiveAid();
      if (!aid) {
        throw new Error(
          "Select the Admin performing this action. (No admin_id in session and none selected.)"
        );
      }

      let newUser = null;

      if (activeTab === "admin") {
        // POST /api/admin/addNewAdmin/{aid}
        const url = `${API_BASE}/api/admin/addNewAdmin/${aid}`;
        const payload = {
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          employee_number: formData.employeeNumber,
          department: formData.department,
          role: formData.role,
          phone_number: formData.phoneNumber,
          aid, // API’s example shows aid in body too
        };

        const res = await fetch(url, {
          method: "POST",
          headers: headers(token),
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const text = await res.text();
          // Show a friendly hint if backend says admin not found
          if (text?.toLowerCase?.().includes("admin user does not exist")) {
            throw new Error(
              "Admin user does not exist. Pick a valid Admin in the selector or ensure sessionStorage.admin_id is set to an existing admin."
            );
          }
          throw new Error(text || `Add admin failed (${res.status})`);
        }

        let data = null;
        try {
          data = await res.json();
        } catch {}

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
        // POST /api/admin/addHrMember/{aid}
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
          if (text?.toLowerCase?.().includes("admin user does not exist")) {
            throw new Error(
              "Admin user does not exist. Choose a valid Admin in the dropdown or set sessionStorage.admin_id to an existing admin_id."
            );
          }
          throw new Error(text || `Add HR member failed (${res.status})`);
        }

        let data = null;
        try {
          data = await res.json();
        } catch {}

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
          department: formData.department,
          role: "HR_RECRUITER",
          phone: formData.phoneNumber,
          status: "active",
        };
      } else if (activeTab === "employee") {
        // No API shared for create employee; bubble up stub
        newUser = { ...formData, id: `tmp_${Date.now()}` };
      } else {
        newUser = { ...formData, id: `tmp_${Date.now()}` };
      }

      onAdd?.(newUser);
      handleClose();
    } catch (e) {
      setUiError(e.message || "Failed to add user");
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  const needAidSelector = (activeTab === "admin" || activeTab === "recruiter") && !getAuth().sessionAid;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Add New {roleLabel}
        </h3>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* If no session AID, let user pick which Admin is performing the action */}
          {needAidSelector && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin performing this action *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                value={selectedAid}
                onChange={(e) => setSelectedAid(e.target.value)}
              >
                <option value="">Select an admin</option>
                {admins.map((a) => (
                  <option key={a.admin_id} value={a.admin_id}>
                    {a.first_name} {a.last_name} — {a.email}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Tip: to skip this step in future, store{" "}
                <code>sessionStorage.admin_id</code> after login.
              </p>
            </div>
          )}

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

          {/* Employee-only */}
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

          {/* HR-only: required by backend */}
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
                placeholder="EMP800"
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