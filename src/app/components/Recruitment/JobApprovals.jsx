"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Clock } from "lucide-react";
import StatsCards from "../../components/Recruitment/StatsCard";
import FilterSearch from "../../components/Recruitment/FilterSearch";
import JobCard from "../../components/Recruitment/JobCard";
import EmptyState from "../../features/Approvals/EmptyState";
import JobDetailModal from "../../features/Approvals/DetailsModal";
import { ApproveModal, RejectModal } from "../../features/Approvals/ConfirmationModals";

// ======================= Config =======================
const API_BASE = "https://jellyfish-app-z83s2.ondigitalocean.app";

// ======================= Utils ========================
const toUpper = (s) => (s || "").toUpperCase();

const derivePriority = (job) => {
  const sal = job?.filters?.[0]?.salary ?? 0;
  const exp = job?.filters?.[0]?.experience ?? 0;
  if (typeof sal === "number" && (sal >= 90000 || exp >= 7)) return "high";
  if (typeof sal === "number" && (sal >= 60000 || exp >= 4)) return "medium";
  return "low";
};

// Always return a Money-like object so job.salary.currency never explodes
const normalizeSalary = (filters) => {
  const f0 = (filters && filters[0]) || {};
  const amount =
    typeof f0.salary === "number" && Number.isFinite(f0.salary) ? f0.salary : null; // null if not provided
  return { amount, currency: "ZAR" };
};

const mapApiJobToCard = (j) => ({
  id: j.job_id,
  title: j.job_title || "Untitled",
  department: j.department || "—",
  office: j.office || "—",
  status: j.status || "REVIEW",
  createdAt: j.created_at,
  employmentType: j.employment_type,
  expectedCandidates: j.expected_candidates,
  quantity: j.quantity,
  closingDate: j.closing_date,
  description: j.job_description,
  filters: j.filters || [],
  salary: normalizeSalary(j.filters),
  priority: derivePriority(j),
  submittedBy: j.poster_id ? j.poster_id.slice(0, 8) : "unknown",
});

const formatMoney = (money) => {
  if (!money || typeof money.amount !== "number") return "—";
  const currency = money.currency || "ZAR";
  try {
    return new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(money.amount);
  } catch {
    return `${currency} ${Number(money.amount).toLocaleString("en-ZA")}`;
  }
};

// ======================= Page =========================
const JobApprovalsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [actioningJobId, setActioningJobId] = useState(null);

  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    pending: 0,
    approved: 12,
    rejected: 3,
    avgApprovalTime: "2.5 days",
  });

  // --------------- API: list ---------------
  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/candidate/allPosts`, {
        headers: { accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Failed to load jobs (${res.status})`);
      const data = await res.json();
      const mapped = (data.jobs || []).map(mapApiJobToCard);
      setPendingJobs(mapped);
      updateStats(mapped);
    } catch (e) {
      setError(e?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // --------------- API: detail ---------------
  const fetchJobDetails = useCallback(async (jobId) => {
    if (!jobId) return;
    setDetailLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/candidate/viewPost/${jobId}`, {
        headers: { accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Failed to load job details (${res.status})`);
      const data = await res.json();

      const base = mapApiJobToCard(data);
      const detailed = {
        ...base,
        requirements: Array.isArray(data.requirements) ? data.requirements : [],
        duties: Array.isArray(data.duties) ? data.duties : [],
        documents: Array.isArray(data.documents) ? data.documents : [],
        questions: Array.isArray(data.questions) ? data.questions : [],
      };
      setSelectedJob(detailed);
    } catch {
      // keep whatever is already shown
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // --------------- Stats ---------------
  const updateStats = (jobs) => {
    const pendingCount = jobs.filter((j) => toUpper(j.status) === "REVIEW").length;
    const approvedCount = jobs.filter((j) => toUpper(j.status) === "APPROVED").length;
    const rejectedCount = jobs.filter((j) => toUpper(j.status) === "REJECTED").length;

    setStats((prev) => ({
      ...prev,
      pending: pendingCount,
      approved: Math.max(prev.approved, approvedCount),
      rejected: Math.max(prev.rejected, rejectedCount),
    }));
  };

  // --------------- Approve / Reject ---------------
  const handleApprove = (job) => {
    setSelectedJob(job);
    setActioningJobId(job.id);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    if (!actioningJobId) return;

    const job = pendingJobs.find(j => j.id === actioningJobId);
    if (!job) {
      alert("Job not found");
      return;
    }    
    try {
      // Get admin data from sessionStorage
      const admin_id = sessionStorage.getItem("user_id");
      const role = sessionStorage.getItem("admin_role");
      const department = sessionStorage.getItem("admin_department");

      if (!admin_id || !role) {
        throw new Error("Admin session not found");
      }

      // Get job data safely
      const employee_id = job.submittedBy; // since you mapped poster_id → submittedBy
      const job_id = job.id;

      let url = "";
      let body = {};
      let newStatus = "";

      // DEPARTMENT MANAGER
      if (role === "MANAGER" && department !== "FINANCE") {
        url = `${API_BASE}/api/admin/departmentApprove/${admin_id}/${employee_id}/${job_id}`;

        body = {
          admin_id,
          employee_id,
          job_id,
          status: "PASSED",
        };

        newStatus = "PASSED";
      }

      // FINANCE MANAGER
      else if (role === "MANAGER" && department === "FINANCE") {
        url = `${API_BASE}/api/admin/financeApproval/${admin_id}/${job_id}`;

        body = {
          admin_id,
          job_id,
        };

        newStatus = "REVIEWED";
      }

      // HR MANAGER (FINAL)
      else if (role === "HR_MANAGER") {
        url = `${API_BASE}/api/admin/approveJobPost/${admin_id}/${employee_id}/${job_id}`;

        body = {
          admin_id,
          employee_id,
          job_id,
          status: "APPROVED",
        };

        newStatus = "APPROVED";
      }

      else {
        throw new Error("You are not authorized to approve this job post");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Approval failed");
      }

      // Update UI only after success
      const updatedJobs = pendingJobs.map((job) =>
        job.id === actioningJobId
          ? { ...job, status: newStatus }
          : job
      );

      setPendingJobs(updatedJobs);
      updateStats(updatedJobs);

      setShowApproveModal(false);
      setActioningJobId(null);
      setSelectedJob(null);

    } catch (error) {
      console.error("Approval error:", error);
      alert(error.message);
    }
  };

  const handleReject = (jobId) => {
    setActioningJobId(jobId);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!actioningJobId || !selectedJob || !rejectionReason.trim()) return;

    try {
      const admin_id = sessionStorage.getItem("user_id");
      const role = sessionStorage.getItem("admin_role");
      const department = sessionStorage.getItem("admin_department");

      if (!admin_id || !role) {
        throw new Error("Admin session not found");
      }

      const employee_id = selectedJob.poster_id;
      const job_id = selectedJob.job_id;

      let url = "";
      let body = {};
      let newStatus = "REJECTED";

      // DEPARTMENT MANAGER
      if (role === "MANAGER") {
        url = `${API_BASE}/api/admin/departmentApprove/${admin_id}/${employee_id}/${job_id}`;

        body = {
          admin_id,
          employee_id,
          job_id,
          status: "REJECTED"
        };
      }

      // HR MANAGER
      else if (role === "HR_MANAGER") {
        url = `${API_BASE}/api/admin/approveJobPost/${admin_id}/${employee_id}/${job_id}`;

        body = {
          admin_id,
          employee_id,
          job_id,
          status: "REJECTED"
        };
      }

      // FINANCE CANNOT REJECT
      else if (role === "MANAGER" && department === "FINANCE") {
        throw new Error("Finance managers cannot reject job posts at this stage");
      }

      else {
        throw new Error("You are not authorized to reject this job post");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Rejection failed");
      }

      // Update UI only after backend success
      const updatedJobs = pendingJobs.map((job) =>
        job.id === actioningJobId
          ? { ...job, status: newStatus, rejectionReason }
          : job
      );

      setPendingJobs(updatedJobs);
      updateStats(updatedJobs);

      setShowRejectModal(false);
      setActioningJobId(null);
      setRejectionReason("");
      setSelectedJob(null);

    } catch (error) {
      console.error("Rejection error:", error);
      alert(error.message);
    }
  };

  const cancelApprove = () => {
    setShowApproveModal(false);
    setActioningJobId(null);
  };

  const cancelReject = () => {
    setShowRejectModal(false);
    setActioningJobId(null);
    setRejectionReason("");
  };

  // --------------- Filters / Search ---------------
  const filteredJobs = useMemo(() => {
    const norm = (s) => (s || "").toLowerCase();
    return pendingJobs
      .filter((job) => toUpper(job.status) === "REVIEW") // pending
      .filter((job) => (selectedFilter === "all" ? true : job.priority === selectedFilter))
      .filter((job) => {
        if (!searchQuery) return true;
        return (
          norm(job.title).includes(norm(searchQuery)) ||
          norm(job.department).includes(norm(searchQuery)) ||
          norm(job.submittedBy || "").includes(norm(searchQuery)) ||
          norm(job.office).includes(norm(searchQuery))
        );
      });
  }, [pendingJobs, selectedFilter, searchQuery]);

  // --------------- Card actions ---------------
  const onViewDetails = async (jobCard) => {
    setSelectedJob(jobCard); // show immediately
    await fetchJobDetails(jobCard.id); // then hydrate
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Post Approvals</h1>
              <p className="text-gray-600 mt-1">Review and approve pending job postings</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>Avg. approval time: {stats.avgApprovalTime}</span>
            </div>
          </div>
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Filters and Search */}
        <FilterSearch
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Job Cards Grid */}
        {loading ? (
          <div className="text-gray-600">Loading jobs…</div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={{
                  ...job,
                  // If JobCard prints salary directly, pass a preformatted string:
                  salaryDisplay: formatMoney(job.salary),
                }}
                onViewDetails={() => onViewDetails(job)}
                onApprove={() => handleApprove(job)}
                onReject={() => handleReject(job.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal
        job={
          selectedJob
            ? { ...selectedJob, salaryDisplay: formatMoney(selectedJob.salary) }
            : null
        }
        loading={detailLoading}
        onClose={() => setSelectedJob(null)}
        onApprove={(jobId) => handleApprove(jobId || (selectedJob && selectedJob.id))}
        onReject={(jobId) => handleReject(jobId || (selectedJob && selectedJob.id))}
      />

      {/* Approve Confirmation Modal */}
      <ApproveModal show={showApproveModal} onConfirm={confirmApprove} onCancel={cancelApprove} />

      {/* Reject Modal */}
      <RejectModal
        show={showRejectModal}
        onConfirm={confirmReject}
        onCancel={cancelReject}
        reason={rejectionReason}
        setReason={setRejectionReason}
      />
    </div>
  );
};

export default JobApprovalsPage;