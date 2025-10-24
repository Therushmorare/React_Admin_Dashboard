"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Clock } from "lucide-react";
import StatsCards from "../../components/Recruitment/StatsCard";
import FilterSearch from "../../components/Recruitment/FilterSearch";
import JobCard from "../../components/Recruitment/JobCard";
import EmptyState from "../../features/Approvals/EmptyState";
import JobDetailModal from "../../features/Approvals/DetailsModal";
import { ApproveModal, RejectModal } from "../../features/Approvals/ConfirmationModals";

// ------------------ helpers ------------------
const API_BASE = "https://jellyfish-app-z83s2.ondigitalocean.app";

const derivePriority = (job) => {
  // Heuristic priority based on salary/experience if present
  const sal = job?.filters?.[0]?.salary ?? 0;
  const exp = job?.filters?.[0]?.experience ?? 0;
  if (sal >= 90000 || exp >= 7) return "high";
  if (sal >= 60000 || exp >= 4) return "medium";
  return "low";
};

const mapApiJobToCard = (j) => ({
  id: j.job_id,
  title: j.job_title || "Untitled",
  department: j.department || "—",
  office: j.office || "—",
  status: j.status, // "REVIEW", etc.
  createdAt: j.created_at,
  employmentType: j.employment_type,
  expectedCandidates: j.expected_candidates,
  quantity: j.quantity,
  closingDate: j.closing_date,
  description: j.job_description,
  filters: j.filters || [],
  priority: derivePriority(j),
  submittedBy: j.poster_id?.slice(0, 8) ?? "unknown", // placeholder label
});

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

  // ------------------ API ------------------
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
      setError(e.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

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
      // Merge detail into currently selected job shape
      const base = mapApiJobToCard(data);
      const detailed = {
        ...base,
        requirements: data.requirements || [],
        duties: data.duties || [],
        documents: data.documents || [],
        questions: data.questions || [],
      };
      setSelectedJob(detailed);
    } catch (e) {
      // If details fail, still show whatever we have from list
      setSelectedJob((prev) => prev); // no-op, keeps previous
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const updateStats = (jobs) => {
    const norm = (s) => (s || "").toUpperCase();
    const pendingCount = jobs.filter((j) => norm(j.status) === "REVIEW").length;
    const approvedCount = jobs.filter((j) => norm(j.status) === "APPROVED").length;
    const rejectedCount = jobs.filter((j) => norm(j.status) === "REJECTED").length;

    setStats((prev) => ({
      ...prev,
      pending: pendingCount,
      approved: Math.max(prev.approved, approvedCount), // keep non-negative
      rejected: Math.max(prev.rejected, rejectedCount),
    }));
  };

  // ------------------ Approve / Reject ------------------
  const handleApprove = (jobId) => {
    setActioningJobId(jobId);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    // TODO: call your real Approve endpoint here
    // await fetch(`${API_BASE}/api/approvals/approve/${actioningJobId}`, { method: "POST", ... })

    const updatedJobs = pendingJobs.map((job) =>
      job.id === actioningJobId ? { ...job, status: "APPROVED" } : job
    );
    setPendingJobs(updatedJobs);
    updateStats(updatedJobs);

    setShowApproveModal(false);
    setActioningJobId(null);
    setSelectedJob(null);
  };

  const handleReject = (jobId) => {
    setActioningJobId(jobId);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) return;

    // TODO: call your real Reject endpoint here with reason
    // await fetch(`${API_BASE}/api/approvals/reject/${actioningJobId}`, { method: "POST", body: JSON.stringify({ reason: rejectionReason }), ... })

    const updatedJobs = pendingJobs.map((job) =>
      job.id === actioningJobId ? { ...job, status: "REJECTED", rejectionReason } : job
    );
    setPendingJobs(updatedJobs);
    updateStats(updatedJobs);

    setShowRejectModal(false);
    setActioningJobId(null);
    setRejectionReason("");
    setSelectedJob(null);
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

  // ------------------ Filters / Search ------------------
  const filteredJobs = useMemo(() => {
    const norm = (s) => (s || "").toLowerCase();
    return pendingJobs
      // Treat API "REVIEW" as your "pending"
      .filter((job) => (job.status || "").toUpperCase() === "REVIEW")
      .filter((job) => {
        if (selectedFilter === "all") return true;
        return job.priority === selectedFilter;
      })
      .filter((job) => {
        if (!searchQuery) return true;
        return (
          norm(job.title).includes(norm(searchQuery)) ||
          norm(job.department).includes(norm(searchQuery)) ||
          norm(job.submittedBy).includes(norm(searchQuery)) ||
          norm(job.office).includes(norm(searchQuery))
        );
      });
  }, [pendingJobs, selectedFilter, searchQuery]);

  // When user clicks a card's "View details"
  const onViewDetails = async (jobCard) => {
    // show quick data immediately
    setSelectedJob(jobCard);
    // then load full details
    await fetchJobDetails(jobCard.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Post Approvals</h1>
              <p className="text-gray-600 mt-1">
                Review and approve pending job postings
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>Avg. approval time: {stats.avgApprovalTime}</span>
            </div>
          </div>
          {error && (
            <div className="mt-3 text-sm text-red-600">
              {error}
            </div>
          )}
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
                job={job}
                onViewDetails={onViewDetails}
                onApprove={() => handleApprove(job.id)}
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
        job={selectedJob}
        loading={detailLoading}
        onClose={() => setSelectedJob(null)}
        onApprove={(jobId) => handleApprove(jobId || selectedJob?.id)}
        onReject={(jobId) => handleReject(jobId || selectedJob?.id)}
      />

      {/* Approve Confirmation Modal */}
      <ApproveModal
        show={showApproveModal}
        onConfirm={confirmApprove}
        onCancel={cancelApprove}
      />

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