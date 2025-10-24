// app/admin/jobs/page.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import JobCard from "@/app/components/JobCard"; // <-- update to your actual import path
// If your JobCard is at /app/components/JobCard.jsx adjust the path above accordingly.

const API_BASE = "https://jellyfish-app-z83s2.ondigitalocean.app";

/** ----- Helpers ----- **/

// Map API job to the shape expected by JobCard.
// Your JobCard expects fields like: title, department, locationType, city, salaryRange, description,
// requiredSkills, submittedBy, submittedDate, priority.
// We derive reasonable defaults from the API payload.
function adaptJob(apiJob) {
  // Parse locationType + city from "office" (e.g., "Midrand, Onsite")
  const office = String(apiJob.office || "");
  const parts = office.split(",").map((s) => s.trim());
  const city = parts[0] || "";
  const rawType = (parts[1] || "").toLowerCase(); // "onsite" / "remote" / "hybrid" if provided
  const locationType =
    rawType === "remote" ? "remote" : rawType === "hybrid" ? "hybrid" : "onsite";

  // Salary from first filter (if present)
  const filter0 = Array.isArray(apiJob.filters) && apiJob.filters.length > 0 ? apiJob.filters[0] : null;
  const salary = Number(filter0?.salary ?? 0);

  return {
    // IDs
    id: apiJob.job_id,
    // Titles
    title: apiJob.job_title || apiJob.expected_candidates || "Untitled Job",
    department: apiJob.department || "Unknown",
    // Location
    locationType,
    city,
    // Salary range (your card expects min/max/currency)
    salaryRange: {
      currency: "ZAR",
      min: salary || 0,
      max: salary || 0,
    },
    // About / description
    description: apiJob.job_description || "",
    // Skills (API doesn’t return; use empty array so the chip section is safe)
    requiredSkills: [],
    // Submitter + dates
    submittedBy: apiJob.poster_id?.slice(0, 8) || "Unknown",
    submittedDate: apiJob.created_at || new Date().toISOString().split("T")[0],
    // Priority (if you have PRIORITY_COLORS["medium"] defined; otherwise change this)
    priority: "medium",
    // Pass through original in case you need more in handlers
    _raw: apiJob,
  };
}

function groupByDepartment(jobs) {
  const groups = {};
  for (const j of jobs) {
    const dept = j.department || "Unknown";
    if (!groups[dept]) groups[dept] = [];
    groups[dept].push(j);
  }
  return groups;
}

export default function AdminJobsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allJobs, setAllJobs] = useState([]);

  // Read role/department from sessionStorage
  const [adminRole, setAdminRole] = useState("");
  const [adminDept, setAdminDept] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAdminRole(sessionStorage.getItem("admin_role") || "");
      setAdminDept(sessionStorage.getItem("admin_department") || "");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/candidate/allPosts`, {
          method: "GET",
          headers: { accept: "application/json" },
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Failed to fetch: ${res.status}`);
        }
        const data = await res.json();
        const jobs = Array.isArray(data?.jobs) ? data.jobs.map(adaptJob) : [];
        if (!cancelled) setAllJobs(jobs);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load jobs");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchJobs();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter visible jobs based on role rules
  const visibleJobs = useMemo(() => {
    const role = (adminRole || "").toUpperCase();
    if (role === "FINANCE" || role === "SUPERUSER" || role === "SUPERADMIN") {
      return allJobs;
    }
    if (role === "MANAGER" && adminDept) {
      return allJobs.filter((j) => (j.department || "").toUpperCase() === adminDept.toUpperCase());
    }
    // Default: if role unknown or anything else, show nothing (or limit to dept if you prefer)
    return [];
  }, [allJobs, adminRole, adminDept]);

  const grouped = useMemo(() => groupByDepartment(visibleJobs), [visibleJobs]);
  const departments = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  /** ----- Actions ----- **/
  const handleViewDetails = (job) => {
    // route to a details page or open a modal
    // example: router.push(`/admin/jobs/${job.id}`)
    alert(`View Details: ${job.title}`);
  };

  const handleApprove = async (jobId) => {
    // call your approval API here
    alert(`Approve job: ${jobId}`);
  };

  const handleReject = async (jobId) => {
    // call your reject API here
    alert(`Reject job: ${jobId}`);
  };

  /** ----- Render ----- **/
  return (
    <main className="min-h-[calc(100vh-0px)] bg-gray-50">
      <div className="border-b border-gray-200 p-5">
        <h1 className="text-xl font-semibold">Jobs Awaiting Review</h1>
        <p className="text-sm text-gray-500 mt-1">
          Role: <span className="font-medium">{adminRole || "N/A"}</span>
          {adminRole?.toUpperCase() === "MANAGER" && (
            <> · Department: <span className="font-medium">{adminDept || "N/A"}</span></>
          )}
        </p>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {loading && <p className="text-gray-600">Loading jobs…</p>}
        {!!error && (
          <div className="text-red-700 bg-red-50 border border-red-200 rounded p-3 mb-4">
            {error}
            {/* If you run into CORS on this GET too, proxy via your server as discussed earlier. */}
          </div>
        )}

        {!loading && !error && visibleJobs.length === 0 && (
          <p className="text-gray-600">No jobs match your role/department.</p>
        )}

        {!loading && !error && departments.map((dept) => (
          <section key={dept} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{dept}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grouped[dept].map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={handleViewDetails}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}