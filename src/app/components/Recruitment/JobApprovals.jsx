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
    typeof f0.salary === "number" && Number.isFinite(f0.salary) ? f0.salary : null;
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
  submittedBy: j.poster_id || "unknown",
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
  const [user, setUser] = useState({ role: null, department: null });
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

  // ================== USER ROLE =====================
  useEffect(() => {
    const role = sessionStorage.getItem("admin_role");
    const department = sessionStorage.getItem("admin_department");
    setUser({ role, department });
  }, []);

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
      const admin_id = sessionStorage.getItem("user_id");
      const role = sessionStorage.getItem("admin_role");
      const department = sessionStorage.getItem("admin_department");

      if (!admin_id || !role) throw new Error("Admin session not found");

      const employee_id = job.submittedBy;
      const job_id = job.id;

      let url = "";
      let body = {};
      let newStatus = "";

      if (role === "MANAGER" && department !== "FINANCE") {
        url = `${API_BASE}/api/admin/departmentApprove/${admin_id}/${employee_id}/${job_id}`;
        body = { admin_id, employee_id, job_id, status: "PASSED" };
        newStatus = "PASSED";
      } else if (role === "MANAGER" && department === "FINANCE") {
        url = `${API_BASE}/api/admin/financeApproval/${admin_id}/${job_id}`;
        body = { admin_id, job_id };
        newStatus = "REVIEWED";
      } else if (role === "HR_MANAGER") {
        url = `${API_BASE}/api/admin/approveJobPost/${admin_id}/${employee_id}/${job_id}`;
        body = { admin_id, employee_id, job_id, status: "APPROVED" };
        newStatus = "APPROVED";
      } else {
        throw new Error("You are not authorized to approve this job post");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Approval failed");

      const updatedJobs = pendingJobs.map((j) =>
        j.id === actioningJobId ? { ...j, status: newStatus } : j
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
    if (!actioningJobId) return;

    const job = pendingJobs.find(j => j.id === actioningJobId);
    if (!job) {
      alert("Job not found");
      return;
    }    

    try {
      const admin_id = sessionStorage.getItem("user_id");
      const role = sessionStorage.getItem("admin_role");
      const department = sessionStorage.getItem("admin_department");

      if (!admin_id || !role) throw new Error("Admin session not found");

      const employee_id = job.submittedBy;
      const job_id = job.id;

      let url = "";
      let body = {};
      const newStatus = "REJECTED";

      if (role === "MANAGER" && department === "FINANCE") {
        throw new Error("Finance managers cannot reject job posts at this stage");
      } else if (role === "MANAGER") {
        url = `${API_BASE}/api/admin/departmentApprove/${admin_id}/${employee_id}/${job_id}`;
        body = { admin_id, employee_id, job_id, status: "REJECTED" };
      } else if (role === "HR_MANAGER") {
        url = `${API_BASE}/api/admin/approveJobPost/${admin_id}/${employee_id}/${job_id}`;
        body = { admin_id, employee_id, job_id, status: "REJECTED" };
      } else {
        throw new Error("You are not authorized to reject this job post");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Rejection failed");

      const updatedJobs = pendingJobs.map((j) =>
        j.id === actioningJobId ? { ...j, status: newStatus, rejectionReason } : j
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

  // --------------- Filters / Search (ROLE BASED) ---------------
  const filteredJobs = useMemo(() => {
    const norm = (s) => (s || "").toLowerCase();
    return pendingJobs
      .filter((job) => {
        if (!user.role) return false;
        const status = toUpper(job.status);
        if (user.role === "MANAGER" && user.department !== "FINANCE" && status === "PENDING") return true;
        if (user.role === "MANAGER" && user.department === "FINANCE" && status === "PASSED") return true;
        if (user.role === "HR_MANAGER" && status === "REVIEWED") return true;
        return false;
      })
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
  }, [pendingJobs, selectedFilter, searchQuery, user]);

  // --------------- Card actions ---------------
  const onViewDetails = async (jobCard) => {
    setSelectedJob(jobCard);
    await fetchJobDetails(jobCard.id);
  };

  // ====================== RENDER ======================
  return (
    <div>
      <StatsCards stats={stats} />
      <FilterSearch
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {loading ? (
        <p>Loading jobs...</p>
      ) : filteredJobs.length ? (
        filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onApprove={() => handleApprove(job)}
            onReject={() => handleReject(job.id)}
            onViewDetails={() => onViewDetails(job)}
          />
        ))
      ) : (
        <EmptyState />
      )}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          loading={detailLoading}
          onClose={() => setSelectedJob(null)}
        />
      )}
      <ApproveModal
        show={showApproveModal}
        onConfirm={confirmApprove}
        onCancel={cancelApprove}
      />
      <RejectModal
        show={showRejectModal}
        reason={rejectionReason}
        setReason={setRejectionReason}
        onConfirm={confirmReject}
        onCancel={cancelReject}
      />
    </div>
  );
};

export default JobApprovalsPage;