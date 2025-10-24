// app/admin/backdoor-add/page.jsx
"use client";

import React, { useMemo, useState } from "react";
import { Save, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

export default function BackdoorAddAdminPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    employee_number: "",
    department: "",
    role: "",
    phone_number: "",
  });

  // ------------------ helpers ------------------
  const API_BASE = "https://jellyfish-app-z83s2.ondigitalocean.app";

  const postJSON = async (url, token, body) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text().catch(() => "");
    let data = null;
    if (text) {
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
    }
    if (!res.ok) {
      const msg =
        (data && (data.message || data.error || data.detail || data.raw)) ||
        `Request failed: ${res.status} ${res.statusText}`;
      const err = new Error(msg);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data || {};
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // Simple client validation
  const errors = useMemo(() => {
    const e = {};
    const email = (formData.email || "").trim();
    if (!email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";

    if (!(formData.first_name || "").trim()) e.first_name = "First name is required";
    if (!(formData.last_name || "").trim()) e.last_name = "Last name is required";
    if (!(formData.department || "").trim()) e.department = "Department is required";
    if (!(formData.role || "").trim()) e.role = "Role is required";
    if (!(formData.phone_number || "").trim()) e.phone_number = "Phone number is required";
    return e;
  }, [formData]);

  const canSubmit = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const departmentOptions = [
    "Engineering","Product","Design","Analytics","Marketing","Sales",
    "HR","Operations","Finance","Legal","IT","Support",
  ];

  const roleOptions = ["SUPERADMIN","ADMIN","HR","RECRUITER","MANAGER", "FINANCE"];

  // Build payload with normalized values
  const buildPayload = () => ({
    email: (formData.email || "").trim().toLowerCase(),
    first_name: (formData.first_name || "").trim(),
    last_name: (formData.last_name || "").trim(),
    employee_number: (formData.employee_number || "").trim(),
    department: (formData.department || "").trim(),
    role: (formData.role || "").trim(),
    phone_number: (formData.phone_number || "").trim(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const payload = buildPayload();

      await postJSON(`${API_BASE}/api/admin/backdoorAdmnUzr`, token, payload);

      setShowSuccess(true);
      setFormData({
        email: "",
        first_name: "",
        last_name: "",
        employee_number: "",
        department: "",
        role: "",
        phone_number: "",
      });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setServerError(err?.message || "Could not create admin. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-0px)] bg-white">
      {/* Top bar / title */}

      {/* Success banner */}
      {showSuccess && (
        <div className="p-4 bg-green-50 border-b border-green-200 flex items-start">
          <CheckCircle className="text-green-600 mr-3 mt-0.5" size={18} />
          <div>
            <h4 className="text-sm font-medium text-green-800">Admin created successfully</h4>
            <p className="text-sm text-green-700 mt-1">
              The admin user has been added via the backdoor endpoint.
            </p>
          </div>
        </div>
      )}

      {/* Error banner */}
      {!!serverError && (
        <div className="p-4 bg-red-50 border-b border-red-200 flex items-start">
          <AlertTriangle className="text-red-600 mr-3 mt-0.5" size={18} />
          <div>
            <h4 className="text-sm font-medium text-red-800">Couldn’t create admin</h4>
            <p className="text-sm text-red-700 mt-1">{serverError}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form className="max-w-3xl mx-auto p-6 space-y-6" onSubmit={handleSubmit}>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1
              ${errors.email ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-300 focus:border-green-500 focus:ring-green-100"}`}
            placeholder="admin@company.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* First/Last name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1
                ${errors.first_name ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-300 focus:border-green-500 focus:ring-green-100"}`}
              placeholder="Jane"
            />
            {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1
                ${errors.last_name ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-300 focus:border-green-500 focus:ring-green-100"}`}
              placeholder="Doe"
            />
            {errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name}</p>}
          </div>
        </div>

        {/* Employee number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employee Number</label>
          <input
            type="text"
            name="employee_number"
            value={formData.employee_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
            placeholder="EMP-0001"
          />
        </div>

        {/* Department + Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1
                ${errors.department ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-300 focus:border-green-500 focus:ring-green-100"}`}
            >
              <option value="">Select Department</option>
              {departmentOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.department && <p className="mt-1 text-xs text-red-600">{errors.department}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1
                ${errors.role ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-300 focus:border-green-500 focus:ring-green-100"}`}
            >
              <option value="">Select Role</option>
              {roleOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1
              ${errors.phone_number ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-300 focus:border-green-500 focus:ring-green-100"}`}
            placeholder="+27 82 000 0000"
          />
          {errors.phone_number && <p className="mt-1 text-xs text-red-600">{errors.phone_number}</p>}
        </div>

        {/* Footer actions */}
        <div className="mt-8 border-t border-gray-200 pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            title={!canSubmit ? "Fill in all required fields" : undefined}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="mr-1 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save size={14} className="mr-1" />
                Create Admin
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
