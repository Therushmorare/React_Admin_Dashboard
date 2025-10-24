// data/jobs.js
// Loads jobs from the API, enriches each job with detail data, normalizes fields
// to match your mock shape, and filters visibility by admin role/department
// stored in sessionStorage.

const API_BASE = "https://jellyfish-app-z83s2.ondigitalocean.app";

/* ---------------- helpers: normalization ---------------- */

function normalizeType(s) {
  const v = String(s || "").toLowerCase().replace(/[-_]/g, "");
  if (v.includes("full")) return "Full-time";
  if (v.includes("part")) return "Part-time";
  if (v.includes("contract")) return "Contract";
  if (v.includes("intern")) return "Internship";
  return "Full-time";
}

function parseOffice(office) {
  const parts = String(office || "").split(",").map((x) => x.trim());
  const city = parts[0] || "";
  const kind = (parts[1] || "").toLowerCase();
  const locationType =
    kind === "remote" ? "remote" : kind === "hybrid" ? "hybrid" : "onsite";
  return { city, locationType };
}

function inferSeniority(job_title = "") {
  const s = (job_title || "").toLowerCase();
  if (s.includes("executive")) return "Executive Level";
  if (s.includes("senior")) return "Senior Level";
  if (s.includes("mid")) return "Mid Level";
  if (s.includes("entry") || s.includes("junior") || s.includes("jnr"))
    return "Entry Level";
  return "";
}

function mapQuestionType(t = "") {
  const s = t.toString().toLowerCase().replace(/[_\s]/g, "-");
  if (s.includes("multiple")) return "multiple-choice";
  if (s.includes("yes") || s.includes("no")) return "yes-no";
  if (s.includes("long")) return "long-text";
  return "short-text";
}

function normalizeStatus(s) {
  const v = String(s || "").toUpperCase();
  if (v === "REVIEW" || v === "IN_REVIEW" || v === "PENDING") return "pending";
  if (v === "APPROVED") return "approved";
  if (v === "REJECTED" || v === "DECLINED") return "rejected";
  return "pending";
}

/** Prefer a human title. If job_title looks like a label (e.g. "EXTERNAL"),
 * fall back to expected_candidates which reads like "Software Engineer". */
function pickTitle(job_title, expected_candidates) {
  const jt = String(job_title || "").trim();
  if (!jt) return expected_candidates || "Untitled Job";
  const labelish = jt.toUpperCase() === jt && jt.length <= 20; // "EXTERNAL" style
  if (labelish && expected_candidates) return expected_candidates;
  return jt;
}

/* ---------------- adapters ---------------- */

function adaptListItem(apiJob) {
  const { city, locationType } = parseOffice(apiJob.office);
  const salary =
    Array.isArray(apiJob.filters) && apiJob.filters[0]?.salary
      ? Number(apiJob.filters[0].salary)
      : 0;

  return {
    id: apiJob.job_id,
    title: pickTitle(apiJob.job_title, apiJob.expected_candidates),
    department: String(apiJob.department || "Unknown").trim(),
    type: normalizeType(apiJob.employment_type),
    locationType,
    city,
    seniorityLevel: inferSeniority(apiJob.job_title || apiJob.expected_candidates),
    salaryRange: { min: String(salary), max: String(salary), currency: "ZAR" },
    submittedBy: apiJob.poster_id?.slice(0, 8) || "Unknown",
    submittedDate: apiJob.created_at || new Date().toISOString().split("T")[0],
    description: apiJob.job_description || "",
    responsibilities: "", // filled by detail call
    requiredSkills: [],   // filled by detail call
    preferredSkills: [],  // API doesn't provide
    education: "",        // API doesn't provide
    benefits: "",         // API doesn't provide
    customQuestions: [],  // filled by detail call
    status: normalizeStatus(apiJob.status),
    priority: "medium",   // default key for your PRIORITY_COLORS
    _hasDetail: false,
  };
}

function mergeDetailIntoJob(base, detail) {
  const dFilter0 =
    Array.isArray(detail.filters) && detail.filters.length > 0 ? detail.filters[0] : null;
  const salary = Number(dFilter0?.salary ?? base.salaryRange.min ?? 0);

  const duties = Array.isArray(detail.duties) ? detail.duties.filter(Boolean) : [];
  const responsibilities = duties.length ? `• ${duties.join("\n• ")}` : base.responsibilities;

  const requiredSkills = Array.isArray(detail.requirements)
    ? detail.requirements.filter(Boolean)
    : base.requiredSkills;

  const customQuestions = Array.isArray(detail.questions)
    ? detail.questions.map((q) => ({
        question: q.question || "",
        type: mapQuestionType(q.type),
        required: q.required === "1" || q.required === 1 || q.required === true,
      }))
    : base.customQuestions;

  return {
    ...base,
    title: pickTitle(detail.job_title, detail.expected_candidates) || base.title,
    salaryRange: { ...base.salaryRange, min: String(salary), max: String(salary) },
    description: detail.job_description || base.description,
    submittedDate: detail.created_at || base.submittedDate,
    responsibilities,
    requiredSkills,
    customQuestions,
    status: normalizeStatus(detail.status || base.status),
    _hasDetail: true,
  };
}

/* ---------------- role/department filtering ---------------- */

function filterByRoleDepartment(jobs) {
  if (typeof window === "undefined") return jobs;
  const role = (sessionStorage.getItem("admin_role") || "").trim().toUpperCase();
  const dept = (sessionStorage.getItem("admin_department") || "").trim();

  // If no role set yet, show all to avoid blank screen
  if (!role) return jobs;

  if (role === "FINANCE" || role === "SUPERUSER" || role === "SUPERADMIN") {
    return jobs;
  }
  if (role === "MANAGER" && dept) {
    return jobs.filter(
      (j) => (j.department || "").trim().toUpperCase() === dept.toUpperCase()
    );
  }
  // Unknown role → show nothing (strict), but log for visibility
  console.warn("[jobs] No jobs due to role filter. role=", role, "dept=", dept);
  return [];
}

/* ---------------- api calls ---------------- */

async function fetchAllPosts() {
  const res = await fetch(`${API_BASE}/api/candidate/allPosts`, {
    method: "GET",
    headers: { accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to fetch jobs: ${res.status}`);
  }
  const data = await res.json();
  return Array.isArray(data?.jobs) ? data.jobs : [];
}

async function fetchPostDetail(jobId) {
  try {
    const res = await fetch(`${API_BASE}/api/candidate/viewPost/${jobId}`, {
      method: "GET",
      headers: { accept: "application/json" },
    });
    if (!res.ok) {
      console.warn(`[jobs] detail ${jobId} -> ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.warn(`[jobs] detail ${jobId} failed`, e);
    return null;
  }
}

// limit concurrent detail calls
async function fetchDetailsInBatches(ids, batchSize = 4) {
  const results = {};
  for (let i = 0; i < ids.length; i += batchSize) {
    const chunk = ids.slice(i, i + batchSize);
    const settled = await Promise.allSettled(chunk.map((id) => fetchPostDetail(id)));
    settled.forEach((s, idx) => {
      const id = chunk[idx];
      results[id] = s.status === "fulfilled" ? s.value : null;
    });
  }
  return results;
}

/* ---------------- public API ---------------- */

export async function getJobs() {
  // 1) list
  let list = [];
  try {
    list = await fetchAllPosts();
  } catch (e) {
    console.error("[jobs] fetchAllPosts failed:", e?.message || e);
    return []; // nothing we can do
  }

  // Adapt base items
  const baseJobs = list.map(adaptListItem);

  // 2) details (best-effort)
  const ids = baseJobs.map((j) => j.id);
  let detailsMap = {};
  try {
    detailsMap = await fetchDetailsInBatches(ids, 4);
  } catch (e) {
    console.warn("[jobs] fetchDetailsInBatches failed; proceeding with base list only");
  }

  const merged = baseJobs.map((job) => {
    const detail = detailsMap[job.id];
    return detail ? mergeDetailIntoJob(job, detail) : job;
  });

  // 3) visibility by role/department (with safe fallback)
  const filtered = filterByRoleDepartment(merged);
  if (filtered.length === 0 && merged.length > 0) {
    // If filtering removed everything, fall back to showing all
    // to avoid the "nothing displayed" UX surprise.
    console.warn("[jobs] Role/department filter returned 0; falling back to all jobs.");
    return merged;
  }
  return filtered;
}

export function groupByDepartment(jobs) {
  const out = {};
  for (const j of jobs) {
    const d = j.department || "Unknown";
    (out[d] ||= []).push(j);
  }
  return out;
}

// Legacy export: keep symbol but no static items (real data comes from API)
export const mockJobs = [];