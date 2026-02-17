"use client";

import React, { useState } from "react";
import { XCircle, Calendar, AlertCircle } from "lucide-react";
import { PRIORITY_COLORS } from "../../constants/approvals/constants";

// ----------------- helpers -----------------
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

// ================= COMPONENT =================
const JobDetailModal = ({ job, onClose }) => {
  const [uiError, setUiError] = useState(null);
  if (!job) return null;

  // ---------- Derived Values ----------
  const title = job.title || "Untitled";
  const priorityLabel = (job.priority || "low").toUpperCase();
  const department = job.department || "—";
  const employmentType = job.type || job.employmentType || "—";
  const seniority = job.seniorityLevel || "—";
  const jobStatus = job.status || "NONE";
  const candidates = job.quantity || "0";
  const locationText =
    job.locationType === "remote"
      ? "Remote"
      : job.locationType === "hybrid"
      ? `Hybrid${job.city ? ` - ${job.city}` : ""}`
      : job.city || job.office || "—";
  const submittedBy = job.submittedBy || "unknown";
  const submittedDate = job.submittedDate || job.createdAt || job.created_at || null;
  const submittedDateStr = submittedDate
    ? new Date(submittedDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  // Salary section
  let salarySection = "—";
  if (typeof job.salaryDisplay === "string") salarySection = job.salaryDisplay;
  else if (job.salaryRange) {
    const cur = job.salaryRange.currency || "ZAR";
    const min = job.salaryRange.min != null ? formatMoney({ amount: Number(job.salaryRange.min), currency: cur }) : null;
    const max = job.salaryRange.max != null ? formatMoney({ amount: Number(job.salaryRange.max), currency: cur }) : null;
    salarySection = min && max ? `${min} - ${max}` : min || max || "—";
  } else if (job.salary && job.salary.amount != null) salarySection = formatMoney(job.salary);
  else if (Array.isArray(job.filters) && job.filters[0] && typeof job.filters[0].salary === "number") salarySection = formatMoney(job.filters[0].salary);

  const responsibilities = job.responsibilities || null;
  const requiredSkills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
  const preferredSkills = Array.isArray(job.preferredSkills) ? job.preferredSkills : [];
  const education = job.education || null;
  const benefits = job.benefits || null;
  const customQuestions = Array.isArray(job.customQuestions) ? job.customQuestions : [];

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${safePriorityClasses(job.priority)}`}>
                {priorityLabel} PRIORITY
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>{department}</span>
              <span>•</span>
              <span>{employmentType}</span>
              <span>•</span>
              <span>{seniority}</span>
              <span>•</span>
              <span>{locationText}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <XCircle size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Submitted Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Submitted by {submittedBy}</p>
              <p className="text-sm text-blue-700 mt-1">{submittedDateStr}</p>
            </div>
            <Calendar size={24} className="text-blue-600" />
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
              <p className="text-gray-700 whitespace-pre-line">{responsibilities}</p>
            </div>
          )}

          {/* Skills */}
          {requiredSkills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((skill, idx) => (
                  <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
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
                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
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
              <p className="text-gray-700 whitespace-pre-line">{education}</p>
            </div>
          )}

          {/* Benefits */}
          {benefits && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Benefits & Perks</h3>
              <p className="text-gray-700 whitespace-pre-line">{benefits}</p>
            </div>
          )}

          {/* Custom Questions */}
          {customQuestions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Application Questions</h3>
              <div className="space-y-3">
                {customQuestions.map((q, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-gray-900">{q.question || "Untitled question"}</p>
                      {(q.required === true || q.required === "1" || q.required === 1) && (
                        <span className="text-red-500 text-sm">Required</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Type: {q.type || "—"}</p>
                  </div>
                ))}
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

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;