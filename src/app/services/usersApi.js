// services/usersApi.js
const API_BASE = "https://jellyfish-app-z83s2.ondigitalocean.app";

// --- helpers ---
const normalizeRole = (raw) => {
  if (!raw) return "ADMIN";
  const r = String(raw).trim().toUpperCase();
  // Map common variants
  if (r === "SUPERUSER" || r === "SUPER_USER" || r === "ROLE_SUPERUSER") return "SUPERUSER";
  if (r === "MANAGER" || r === "ROLE_MANAGER") return "MANAGER";
  if (r === "FINANCE" || r === "ROLE_FINANCE") return "FINANCE";
  return r; // fallback
};

const mapAdmin = (a) => ({
  id: a.admin_id,                                   // unify to id
  adminId: a.admin_id,
  firstName: a.first_name || "",
  lastName: a.last_name || "",
  email: a.email || "",
  department: a.departmet || a.department || "",    // API misspells "department" as "departmet"
  role: normalizeRole(a.role),
  phone: a.phone_number || "",
  status: a.is_active ? "active" : "inactive",
});

const mapHR = (h) => ({
  id: h.employee_id,                                   // unify to id
  employeeId: h.employee_id,
  firstName: h.first_name || "",
  lastName: h.last_name || "",
  email: h.email || "",
  department: h.departmet || a.department || "",    // API misspells "department" as "departmet"
  role: normalizeRole(h.role),
  phone: h.phone_number || "",
  status: h.is_active ? "active" : "inactive",
});


// --- API ---
export const UserAPI = {
  // Admins
  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/api/admin/allAdmins`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch admins (${res.status})`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map(mapAdmin);
  },

  // Optional admin endpoints (stubs; replace with your real ones if available)
  async updateAdminUser(id, payload) {
    // Demo: pretend success and return updated object
    return { ...payload, id };
  },
  async deleteAdminUser(id) {
    // Demo: pretend success (no-op)
    return true;
  },

  // Recruiters
  async getRecruiterUsers() {
    // TODO: swap to real endpoint when you have it
    const res = await fetch(`${API_BASE}/api/hr/allHRMembers`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch admins (${res.status})`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map(mapHR);

  },
  async createRecruiterUser(payload) {
    // TODO: real POST
    return { id: crypto.randomUUID(), ...payload, status: "active" };
  },
  async deleteRecruiterUser(id) {
    return true;
  },

  // Employees
  async getEmployeeUsers() {
    // TODO: swap to real endpoint when you have it
    return [];
  },
  async createEmployeeUser(payload) {
    // TODO: real POST
    return { id: crypto.randomUUID(), ...payload, status: "active" };
  },
  async updateEmployeeUser(id, payload) {
    // TODO
    return { ...payload, id };
  },
  async deleteEmployeeUser(id) {
    return true;
  },

  // Applicants
  async getApplicantUsers() {
    // TODO
    return [];
  },
  async deleteApplicantUser(id) {
    return true;
  },

  // Common
  async toggleUserStatus(id, newStatus) {
    // TODO: real patch; for now just succeed
    return { id, status: newStatus };
  },

  async updateUserPermissions(id, permissions) {
    // TODO: real patch; for now just succeed
    return { id, permissions };
  },
};
