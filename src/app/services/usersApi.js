// services/usersApi.js
const API_BASE = "https://jellyfish-app-z83s2.ondigitalocean.app";

// ---- auth (optional) ----
const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("access_token") : null;
  return {
    accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// --- helpers ---
const normalizeRole = (raw) => {
  if (!raw) return "USER";
  const r = String(raw).trim().toUpperCase().replace(/^ROLE_/, "");
  if (r === "SUPERUSER" || r === "SUPER_USER") return "SUPERUSER";
  if (r === "MANAGER") return "MANAGER";
  if (r === "FINANCE") return "FINANCE";
  if (r === "HR" || r === "RECRUITER") return "HR_RECRUITER";
  return r;
};

const normalizeDept = (raw) => (raw || "").toString().trim();

// --- mappers ---
const mapAdmin = (a) => ({
  id: a.admin_id,
  adminId: a.admin_id,
  firstName: a.first_name || "",
  lastName: a.last_name || "",
  email: a.email || "",
  department: normalizeDept(a.departmet || a.department || ""),
  role: normalizeRole(a.role),
  phone: a.phone_number || "",
  status: a.is_active ? "active" : "inactive",
});

const mapHR = (h) => ({
  id: h.employee_id,
  employeeId: h.employee_id,
  firstName: h.first_name || "",
  lastName: h.last_name || "",
  email: h.email || "",
  department: normalizeDept(h.departmet || h.department || ""),
  role: normalizeRole(h.role || "RECRUITER"),
  phone: h.phone_number || "",
  status: h.is_active ? "active" : "inactive",
});

const mapApplicant = (a) => ({
  id: a.applicant_id,
  applicantId: a.applicant_id,
  jobId: a.job_id,
  applicationCode: a.application_code,
  status: a.application_status || "APPLIED",
  appliedAt: a.applied_at ? new Date(a.applied_at).toLocaleString("en-GB") : null,
  firstName: a.first_name || "",
  lastName: a.last_name || "",
  email: a.email || "",
  phone: a.phone_number || "",
  idNumber: a.ID_Number || "",
  dob: a.date_of_birth || "",
  address: a.physical_address || "",
  city: a.city || "",
  province: a.province || "",
  nationality: a.nationality || "",
  professionalSummary: a.professional_summary || "",
});

// --- API ---
export const UserAPI = {
  // ---------- ADMINS ----------
  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/api/admin/allAdmins`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch admins (${res.status})`);
    const data = await res.json();
    return Array.isArray(data) ? data.map(mapAdmin) : [];
  },

  async updateAdminUser(id, payload) {
    return { ...payload, id }; // stub
  },

  async deleteAdminUser(id) {
    return true; // stub
  },

  // ---------- HR / RECRUITERS ----------
  async getRecruiterUsers() {
    const res = await fetch(`${API_BASE}/api/hr/allHRMembers`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch HR members (${res.status})`);
    const data = await res.json();
    return Array.isArray(data) ? data.map(mapHR) : [];
  },

  async createRecruiterUser(payload) {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `tmp_${Date.now()}`;
    return { id, ...payload, status: "active" };
  },

  async deleteRecruiterUser(id) {
    return true;
  },

  // ---------- EMPLOYEES ----------
  async getEmployeeUsers() {
    const res = await fetch(`${API_BASE}/api/hr/allEmployees`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`Failed to fetch employees (${res.status})`);

    const data = await res.json();

    // API returns: { employee_data: [...] }
    const employees = Array.isArray(data.employee_data)
      ? data.employee_data
      : [];

    return employees.map((e) => ({
      id: e.employee_id,
      employeeId: e.employee_id,
      employeeNumber: e.employee_number || "",
      firstName: e.first_name || "",
      lastName: e.last_name || "",
      email: e.email || "",
      phone: e.phone_number || "",
      department: normalizeDept(e.department || ""),
      role: normalizeRole(e.job_title || "EMPLOYEE"),
      status: e.status ? e.status.toLowerCase() : "inactive",
      jobTitle: e.job_title || "",
      employmentType: e.employment_type || "",
      nationality: e.nationality || "",
      idNumber: e.ID_number || "",
      dob: e.date_of_birth || "",
      description: e.description || "",
    }));
  },

  async createEmployeeUser(payload) {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `tmp_${Date.now()}`;
    return { id, ...payload, status: "active" };
  },

  async updateEmployeeUser(id, payload) {
    return { ...payload, id };
  },

  async deleteEmployeeUser(id) {
    return true;
  },

  // ---------- APPLICANTS ----------
  async getApplicantUsers() {
    const res = await fetch(`${API_BASE}/api/hr/all_applicants`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch applicants (${res.status})`);
    const data = await res.json();
    return Array.isArray(data) ? data.map(mapApplicant) : [];
  },

  async deleteApplicantUser(id) {
    // TODO: real DELETE
    return true;
  },

  // ---------- COMMON ----------
  async toggleUserStatus(id, newStatus) {
    return { id, status: newStatus };
  },

  async updateUserPermissions(id, permissions) {
    return { id, permissions };
  },
};