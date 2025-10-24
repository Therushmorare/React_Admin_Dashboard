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
  if (!raw) return "ADMIN";
  const r = String(raw).trim().toUpperCase().replace(/^ROLE_/, "");
  if (r === "SUPERUSER" || r === "SUPER_USER") return "SUPERUSER";
  if (r === "MANAGER") return "MANAGER";
  if (r === "FINANCE") return "FINANCE";
  return r; // fallback
};

const normalizeDept = (raw) => {
  // API sometimes sends 'departmet'
  return (raw || "").toString().trim();
};

// --- mappers (shape -> UI) ---
const mapAdmin = (a) => ({
  id: a.admin_id,                      // unify to id
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
  id: h.employee_id,                   // unify to id
  employeeId: h.employee_id,
  firstName: h.first_name || "",
  lastName: h.last_name || "",
  email: h.email || "",
  department: normalizeDept(h.departmet || h.department || ""), // <-- fixed (was a.department)
  role: normalizeRole(h.role || "RECRUITER"),
  phone: h.phone_number || "",
  status: h.is_active ? "active" : "inactive",
});

// --- API ---
export const UserAPI = {
  // Admins
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
    // TODO: replace with real endpoint when available
    return { ...payload, id };
  },

  async deleteAdminUser(id) {
    // TODO: replace with real endpoint when available
    return true;
  },

  // HR / Recruiters
  async getRecruiterUsers() {
    const res = await fetch(`${API_BASE}/api/hr/allHRMembers`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch hr members (${res.status})`);
    const data = await res.json();
    return Array.isArray(data) ? data.map(mapHR) : [];
  },

  async createRecruiterUser(payload) {
    // TODO: replace with real POST
    const id = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `tmp_${Date.now()}`;
    return { id, ...payload, status: "active" };
  },

  async deleteRecruiterUser(id) {
    // TODO: replace with real DELETE
    return true;
  },

  // Employees
  async getEmployeeUsers() {
    // TODO: swap to real endpoint when you have it
    return [];
  },

  async createEmployeeUser(payload) {
    // TODO: real POST
    const id = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `tmp_${Date.now()}`;
    return { id, ...payload, status: "active" };
  },

  async updateEmployeeUser(id, payload) {
    // TODO: real PATCH/PUT
    return { ...payload, id };
  },

  async deleteEmployeeUser(id) {
    // TODO: real DELETE
    return true;
  },

  // Applicants
  async getApplicantUsers() {
    // TODO: real GET
    return [];
  },

  async deleteApplicantUser(id) {
    // TODO: real DELETE
    return true;
  },

  // Common
  async toggleUserStatus(id, newStatus) {
    // TODO: real PATCH; for now just echo
    return { id, status: newStatus };
  },

  async updateUserPermissions(id, permissions) {
    // TODO: real PATCH; for now just echo
    return { id, permissions };
  },
};