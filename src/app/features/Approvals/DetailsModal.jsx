"use client";

import React, { useState, useMemo } from "react";
import { XCircle, CheckCircle, Calendar, AlertCircle } from "lucide-react";
import { PRIORITY_COLORS } from "../../constants/approvals/constants";

// ----------------- config -----------------
const API_BASE = "https://jellyfish-app-z83s2.ondigitalocean.app";

// ---- helpers already used elsewhere ----
const formatMoney = (money) => {
  if (typeof money === "number") {
    try {
      return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(money);
    } catch {
      return `ZAR ${Number(money).toLocaleString("en-ZA")}`;
    }
  }
  const amount = money && typeof money.amount === "number" ? money.amount : null;
  const currency = (money && money.currency) || "ZAR";
  if (amount === null) return "—";
  try {
    return new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toLocaleString("en-ZA")}`;
  }
};

const safePriorityClasses = (priority) => {
  const key = (priority || "low").toLowerCase();
  const colors = PRIORITY_COLORS?.[key] || { bg: "bg-gray-100", text: "text-gray-700" };
  return `${colors.bg} ${colors.text}`;
};

// ----------------- NEW helpers: auth + API chooser -----------------
const getAuth = () => {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("access_token") : null;
  const adminId = typeof window !== "undefined" ? sessionStorage.getItem("admin_id") : null;
  const adminRole = typeof window !== "undefined" ? sessionStorage.getItem("admin_role") : null; // "MANAGER" | "FINANCE" | "SUPERUSER"
  const adminDept = typeof window !== "undefined" ? sessionStorage.getItem("admin_department") : null;
  const employeeId = typeof window !== "undefined" ? sessionStorage.getItem("user_id") : null; // fallback if needed
  return { token, adminId, adminRole, adminDept, employeeId };
};

// Optional: derive stage flags from the job if your API provides them.
// We fall back to simple status checks if not available.
const extractStage = (job) => {
  // Expected booleans if backend sends them; otherwise infer best-effort
  const departmentApproved =
    job?.departmentApproved ?? job?.deptApproved ?? (job?.status?.toUpperCase?.() === "DEPT_APPROVED" ? true : false);
  const financeApproved =
    job?.financeApproved ?? (job?.status?.toUpperCase?.() === "FINANCE_APPROVED" ? true : false);
  const superuserApproved =
    job?.superuserApproved ?? (job?.status?.toUpperCase?.() === "APPROVED" ? true : false);
  return { departmentApproved, financeApproved, superuserApproved };
};

const roleApproveLabel = (role) =>
  role === "MANAGER" ? "Approve (Department)" : role === "FINANCE" ? "Approve (Finance)" : role === "SUPERUSER" ? "Approve (Superuser)" : "Approve";

const canRejectForRole = (role) => role === "MANAGER" || role === "SUPERUSER"; // finance endpoint has no reject

// Build endpoint + payload for APPROVE
const buildApproveRequest = ({ role, dept, adminId, token, job }) => {
  const jid = job?.id || job?.job_id;
  const eid = job?.poster_id || job?.employee_id || getAuth().employeeId; // best guess
  if (!adminId || !jid) throw new Error("Missing admin_id or job_id.");

  if (role === "MANAGER" && (dept || "").toLowerCase() === "job post department") {
    return {
      url: `${API_BASE}/api/admin/departmentApprove/${adminId}/${eid}/${jid}`,
      body: { admin_id: adminId, employee_id: eid, job_id: jid, status: "APPROVED" },
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  }
  if (role === "FINANCE") {
    return {
      url: `${API_BASE}/api/admin/financeApproval/${adminId}/${jid}`,
      body: { admin_id: adminId, job_id: jid },
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  }
  if (role === "SUPERUSER") {
    return {
      url: `${API_BASE}/api/admin/approveJobPost/${adminId}/${eid}/${jid}`,
      body: { admin_id: adminId, employee_id: eid, job_id: jid, status: "APPROVED" },
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  }
  throw new Error("Your role/department is not allowed to approve this post.");
};

// Build endpoint + payload for REJECT (manager & superuser only)
const buildRejectRequest = ({ role, dept, adminId, token, job }) => {
  const jid = job?.id || job?.job_id;
  const eid = job?.poster_id || job?.employee_id || getAuth().employeeId;
  if (!adminId || !jid) throw new Error("Missing admin_id or job_id.");

  if (role === "MANAGER" && (dept || "").toLowerCase() === "job post department") {
    return {
      url: `${API_BASE}/api/admin/departmentApprove/${adminId}/${eid}/${jid}`,
      body: { admin_id: adminId, employee_id: eid, job_id: jid, status: "REJECTED" },
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  }
  if (role === "SUPERUSER") {
    return {
      url: `${API_BASE}/api/admin/approveJobPost/${adminId}/${eid}/${jid}`,
      body: { admin_id: adminId, employee_id: eid, job_id: jid, status: "REJECTED" },
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  }
  throw new Error("This role cannot reject. Finance can only approve.");
};

const JobDetailModal = ({ job, onClose, onApprove, onReject }) => {
  const [submitting, setSubmitting] = useState(false);
  const [uiError, setUiError] = useState(null);

  if (!job) return null;

  // ---------- Safe derivations ----------
  const title = job.title || "Untitled";
  const priorityLabel = (job.priority || "low").toString().toUpperCase();
  const department = job.department || "—";
  const type = job.type || job.employmentType || "—";
  const seniority = job.seniorityLevel || "—";
  const locationText =
    job.locationType === "remote"
      ? "Remote"
      : job.locationType === "hybrid"
      ? `Hybrid${job.city ? ` - ${job.city}` : ""}`
      : job.city || job.office || "—";
  const submittedBy = job.submittedBy || "unknown";
  const submittedDate = job.submittedDate || job.createdAt || job.created_at || null;
  const submittedDateStr = submittedDate
    ? new Date(submittedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  // Salary display (handles multiple shapes)
  let salarySection = null;
  if (typeof job.salaryDisplay === "string") {
    salarySection = job.salaryDisplay;
  } else if (job.salaryRange && (job.salaryRange.min != null || job.salaryRange.max != null)) {
    const cur = job.salaryRange.currency || "ZAR";
    const min = job.salaryRange.min != null ? formatMoney({ amount: Number(job.salaryRange.min), currency: cur }) : null;
    const max = job.salaryRange.max != null ? formatMoney({ amount: Number(job.salaryRange.max), currency: cur }) : null;
    salarySection = min && max ? `${min} - ${max}` : min || max || "—";
  } else if (job.salary && (typeof job.salary.amount === "number" || job.salary.amount === null)) {
    salarySection = formatMoney(job.salary);
  } else if (Array.isArray(job.filters) && job.filters[0] && typeof job.filters[0].salary === "number") {
    salarySection = formatMoney(job.filters[0].salary);
  }

  const responsibilities = job.responsibilities || null;
  const requiredSkills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
  const preferredSkills = Array.isArray(job.preferredSkills) ? job.preferredSkills : [];
  const education = job.education || null;
  const benefits = job.benefits || null;
  const customQuestions = Array.isArray(job.customQuestions) ? job.customQuestions : [];

  // ---- role & stage gating ----
  const { adminRole, adminDept } = getAuth();
  const { departmentApproved, financeApproved } = extractStage(job);

  const approveDisabled = useMemo(() => {
    if (submitting) return true;
    if (adminRole === "FINANCE" && !departmentApproved) return true; // wait for dept
    if (adminRole === "SUPERUSER" && !financeApproved) return true; // wait for finance
    return false;
  }, [submitting, adminRole, departmentApproved, financeApproved]);

  const rejectDisabled = useMemo(() => {
    if (submitting) return true;
    if (!canRejectForRole(adminRole)) return true;
    return false;
  }, [submitting, adminRole]);

  const approveTitle =
    adminRole === "FINANCE" && !departmentApproved
      ? "Department must approve first"
      : adminRole === "SUPERUSER" && !financeApproved
      ? "Finance must approve first"
      : roleApproveLabel(adminRole);

  // ---- handlers ----
  const doApprove = async () => {
    setUiError(null);
    setSubmitting(true);
    try {
      const { token, adminId, adminRole: role, adminDept: dept } = getAuth();
      const req = buildApproveRequest({ role, dept, adminId, token, job });
      const res = await fetch(req.url, { method: "POST", headers: req.headers, body: JSON.stringify(req.body) });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Approve failed (${res.status})`);
      }
      onApprove && onApprove(job.id || job.job_id);
      onClose && onClose();
    } catch (e) {
      setUiError(e.message || "Failed to approve");
    } finally {
      setSubmitting(false);
    }
  };

  const doReject = async () => {
    setUiError(null);
    setSubmitting(true);
    try {
      const { token, adminId, adminRole: role, adminDept: dept } = getAuth();
      const req = buildRejectRequest({ role, dept, adminId, token, job });
      const res = await fetch(req.url, { method: "POST", headers: req.headers, body: JSON.stringify(req.body) });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Reject failed (${res.status})`);
      }
      onReject && onReject(job.id || job.job_id);
      onClose && onClose();
    } catch (e) {
      setUiError(e.message || "Failed to reject");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-30 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <span className={`px-2 py-1 rounded text-xs font-medium ${safePriorityClasses(job.priority)}`}>
                {priorityLabel} PRIORITY
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>{department}</span>
              <span>•</span>
              <span>{type}</span>
              <span>•</span>
              <span>{seniority}</span>
              <span>•</span>
              <span>{locationText}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Submission Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Submitted by {submittedBy}</p>
                <p className="text-sm text-blue-700 mt-1">{submittedDateStr}</p>
              </div>
              <Calendar size={24} className="text-blue-600" />
            </div>
          </div>

          {/* Salary */}
          {salarySection && salarySection !== "—" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Salary</h3>
              <p className="text-gray-700">{salarySection} per year</p>
            </div>
          )}

          {/* Description */}
          {job.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>
          )}

          {/* Responsibilities */}
          {responsibilities && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Responsibilities</h3>
              <div className="text-gray-700 whitespace-pre-line">{responsibilities}</div>
            </div>
          )}

          {/* Skills */}
          {requiredSkills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((skill, idx) => (
                  <span key={`${skill}-${idx}`} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {preferredSkills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Preferred Skills</h3>
              <div className="flex flex-wrap gap-2">
                {preferredSkills.map((skill, idx) => (
                  <span key={`${skill}-${idx}`} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Education & Experience</h3>
              <div className="text-gray-700 whitespace-pre-line">{education}</div>
            </div>
          )}

          {/* Benefits */}
          {benefits && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Benefits & Perks</h3>
              <div className="text-gray-700 whitespace-pre-line">{benefits}</div>
            </div>
          )}

          {/* Custom Questions */}
          {customQuestions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Application Questions</h3>
              <div className="space-y-3">
                {customQuestions.map((question, idx) => {
                  const q = question?.question || "Untitled question";
                  const required = question?.required === true || question?.required === "1" || question?.required === 1;
                  const type = question?.type || "—";
                  return (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-gray-900">{q}</p>
                        {required && <span className="text-red-500 text-sm">Required</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Type: {type}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inline error */}
          {uiError && (
            <div className="flex items-center gap-2 p-3 rounded border border-red-200 bg-red-50 text-red-700">
              <AlertCircle size={16} />
              <span className="text-sm">{uiError}</span>
            </div>
          )}
        </div>

        {/* Footer actions (role-aware) */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={submitting}
          >
            Close
          </button>

          <button
            onClick={doReject}
            disabled={rejectDisabled}
            title={!canRejectForRole(adminRole) ? "This role cannot reject" : undefined}
            className={`px-6 py-3 border rounded-lg transition-colors flex items-center ${
              rejectDisabled
                ? "border-red-200 text-red-300 cursor-not-allowed"
                : "border-red-300 text-red-600 hover:bg-red-50"
            }`}
          >
            <XCircle size={16} className="mr-2" />
            Reject
          </button>

          <button
            onClick={doApprove}
            disabled={approveDisabled}
            title={approveTitle}
            className={`px-6 py-3 text-white rounded-lg transition-colors flex items-center ${
              approveDisabled ? "bg-green-300 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
            }`}
          >
            <CheckCircle size={16} className="mr-2" />
            {roleApproveLabel(adminRole)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;