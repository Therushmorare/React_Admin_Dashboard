"use client";

import React from "react";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { PRIORITY_COLORS } from "../../constants/approvals/constants";

// ---- helpers ----
const formatMoney = (money) => {
  // accepts {amount, currency} OR number
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

const JobCard = ({ job = {}, onViewDetails, onApprove, onReject }) => {
  // ----- safe derivations -----
  const title = job.title || "Untitled";
  const department = job.department || "—";

  // Location: prefer your old fields; else fall back to API "office"
  const locationText =
    job.locationType === "remote"
      ? "Remote"
      : job.locationType === "hybrid"
      ? `Hybrid${job.city ? ` - ${job.city}` : ""}`
      : job.city || job.office || "—";

  // Salary: support multiple shapes:
  // 1) preformatted string (salaryDisplay)
  // 2) normalized object {amount, currency} in job.salary
  // 3) range object in job.salaryRange {min, max, currency}
  // 4) raw number in job.filters?.[0]?.salary
  let salaryText = "—";
  if (typeof job.salaryDisplay === "string") {
    salaryText = job.salaryDisplay;
  } else if (job.salaryRange && (job.salaryRange.min || job.salaryRange.max)) {
    const cur = job.salaryRange.currency || "ZAR";
    const min =
      job.salaryRange.min != null ? formatMoney({ amount: Number(job.salaryRange.min), currency: cur }) : null;
    const max =
      job.salaryRange.max != null ? formatMoney({ amount: Number(job.salaryRange.max), currency: cur }) : null;
    salaryText =
      min && max ? `${min} - ${max}` : min || max || "—";
  } else if (job.salary && (typeof job.salary.amount === "number" || job.salary.amount === null)) {
    salaryText = formatMoney(job.salary);
  } else if (Array.isArray(job.filters) && job.filters[0] && typeof job.filters[0].salary === "number") {
    salaryText = formatMoney(job.filters[0].salary);
  }

  const description = job.description || "No description provided.";
  const requiredSkills = Array.isArray(job.requiredSkills)
    ? job.requiredSkills
    : [];

  const submittedBy = job.submittedBy || "unknown";
  const submittedDate =
    job.submittedDate || job.createdAt || job.created_at || null;
  const submittedDateStr = submittedDate
    ? new Date(submittedDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  const priorityLabel = (job.priority || "low").toString().toUpperCase();

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${safePriorityClasses(
                  job.priority
                )}`}
              >
                {priorityLabel}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="flex items-center">
                <Briefcase size={14} className="mr-1" />
                {department}
              </span>
              <span className="flex items-center">
                <MapPin size={14} className="mr-1" />
                {locationText}
              </span>
              <span className="flex items-center">
                <DollarSign size={14} className="mr-1" />
                {salaryText}
              </span>
            </div>
          </div>
        </div>

        {/* Description Preview */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{description}</p>

        {/* Skills Preview */}
        {requiredSkills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {requiredSkills.slice(0, 4).map((skill, idx) => (
                <span
                  key={`${skill}-${idx}`}
                  className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs"
                >
                  {skill}
                </span>
              ))}
              {requiredSkills.length > 4 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                  +{requiredSkills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Submission Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <span className="flex items-center">
              <Users size={14} className="mr-1" />
              Submitted by <span className="font-medium ml-1">{submittedBy}</span>
            </span>
            <span className="flex items-center mt-1">
              <Calendar size={14} className="mr-1" />
              {submittedDateStr}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => onViewDetails && onViewDetails(job)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Eye size={14} className="mr-1" />
            View Details
          </button>
          <button
            onClick={() => onApprove && onApprove(job.id)}
            className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors flex items-center"
          >
            <CheckCircle size={14} className="mr-1" />
            Approve
          </button>
          <button
            onClick={() => onReject && onReject(job.id)}
            className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center"
          >
            <XCircle size={14} className="mr-1" />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;