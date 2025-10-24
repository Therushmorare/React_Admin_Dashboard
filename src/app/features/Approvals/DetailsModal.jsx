"use client";

import React from "react";
import { XCircle, CheckCircle, Calendar } from "lucide-react";
import { PRIORITY_COLORS } from "../../constants/approvals/constants";

// ---- helpers ----
const formatMoney = (money) => {
  // accepts number OR { amount, currency }
  if (typeof money === "number") {
    try {
      return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
      }).format(money);
    } catch {
      return `ZAR ${Number(money).toLocaleString("en-ZA")}`;
    }
  }
  const amount =
    money && typeof money.amount === "number" ? money.amount : null;
  const currency = (money && money.currency) || "ZAR";
  if (amount === null) return "—";
  try {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toLocaleString("en-ZA")}`;
  }
};

const safePriorityClasses = (priority) => {
  const key = (priority || "low").toLowerCase();
  const colors = PRIORITY_COLORS?.[key] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
  };
  return `${colors.bg} ${colors.text}`;
};

const JobDetailModal = ({ job, onClose, onApprove, onReject }) => {
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
  const submittedDate =
    job.submittedDate || job.createdAt || job.created_at || null;
  const submittedDateStr = submittedDate
    ? new Date(submittedDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  // Salary: support salaryDisplay, salaryRange {min,max,currency}, salary {amount,currency}, or filters[0].salary
  let salarySection = null;
  if (typeof job.salaryDisplay === "string") {
    salarySection = job.salaryDisplay;
  } else if (job.salaryRange && (job.salaryRange.min != null || job.salaryRange.max != null)) {
    const cur = job.salaryRange.currency || "ZAR";
    const min =
      job.salaryRange.min != null
        ? formatMoney({ amount: Number(job.salaryRange.min), currency: cur })
        : null;
    const max =
      job.salaryRange.max != null
        ? formatMoney({ amount: Number(job.salaryRange.max), currency: cur })
        : null;
    salarySection = min && max ? `${min} - ${max}` : min || max || "—";
  } else if (job.salary && (typeof job.salary.amount === "number" || job.salary.amount === null)) {
    salarySection = formatMoney(job.salary);
  } else if (Array.isArray(job.filters) && job.filters[0] && typeof job.filters[0].salary === "number") {
    salarySection = formatMoney(job.filters[0].salary);
  }

  const description = job.description || "No description provided.";
  const responsibilities = job.responsibilities || null;
  const requiredSkills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
  const preferredSkills = Array.isArray(job.preferredSkills) ? job.preferredSkills : [];
  const education = job.education || null;
  const benefits = job.benefits || null;
  const customQuestions = Array.isArray(job.customQuestions) ? job.customQuestions : [];

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-30 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${safePriorityClasses(
                  job.priority
                )}`}
              >
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
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Submission Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Submitted by {submittedBy}
                </p>
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
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{description}</p>
          </div>

          {/* Responsibilities */}
          {responsibilities && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Key Responsibilities
              </h3>
              <div className="text-gray-700 whitespace-pre-line">
                {responsibilities}
              </div>
            </div>
          )}

          {/* Skills */}
          {requiredSkills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((skill, idx) => (
                  <span
                    key={`${skill}-${idx}`}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {preferredSkills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Preferred Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {preferredSkills.map((skill, idx) => (
                  <span
                    key={`${skill}-${idx}`}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Education & Experience
              </h3>
              <div className="text-gray-700 whitespace-pre-line">{education}</div>
            </div>
          )}

          {/* Benefits */}
          {benefits && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Benefits & Perks
              </h3>
              <div className="text-gray-700 whitespace-pre-line">{benefits}</div>
            </div>
          )}

          {/* Custom Questions */}
          {customQuestions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Custom Application Questions
              </h3>
              <div className="space-y-3">
                {customQuestions.map((question, idx) => {
                  const q = question?.question || "Untitled question";
                  const required =
                    question?.required === true ||
                    question?.required === "1" ||
                    question?.required === 1;
                  const type = question?.type || "—";
                  return (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-gray-900">{q}</p>
                        {required && (
                          <span className="text-red-500 text-sm">Required</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Type: {type}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onReject && onReject(job.id)}
            className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center"
          >
            <XCircle size={16} className="mr-2" />
            Reject
          </button>
          <button
            onClick={() => onApprove && onApprove(job.id)}
            className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors flex items-center"
          >
            <CheckCircle size={16} className="mr-2" />
            Approve Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;