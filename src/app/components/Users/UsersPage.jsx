"use client";

import React, { useState, useEffect } from "react";
import { Plus, Shield, Briefcase, Users as UsersIcon, FileText } from "lucide-react";
import { UserAPI } from "../../services/usersApi";
import TabNavigation from "./TabNavigation";
import SearchBar from "./SearchBar";
import UserTable from "./UserTable";
import AddUserModal from "../../features/Users/AddUserModal";
import EditUserModal from "../../features/Users/EditUserModal";
import DeleteConfirmModal from "../../features/Users/DeleteModal";
import UserDetailsModal from "../../features/Users/Details";
import PermissionsModal from "../../features/Users/Permissions";

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState("admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Modals
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Data
  const [adminUsers, setAdminUsers] = useState([]);
  const [recruiterUsers, setRecruiterUsers] = useState([]);
  const [employeeUsers, setEmployeeUsers] = useState([]);
  const [applicantUsers, setApplicantUsers] = useState([]);

  useEffect(() => {
    // If you need an adminId locally for other actions
    if (!localStorage.getItem("adminId")) {
      localStorage.setItem("adminId", "1");
      console.log("Temporary admin ID set to 1");
    }
  }, []);

  const tabs = [
    { id: "admin", label: "Admin Users", icon: Shield, color: "red", count: adminUsers.length },
    { id: "recruiter", label: "HR Recruiters", icon: Briefcase, color: "blue", count: recruiterUsers.length },
    { id: "employee", label: "Employees", icon: UsersIcon, color: "green", count: employeeUsers.length },
    { id: "applicant", label: "Applicants", icon: FileText, color: "purple", count: applicantUsers.length },
  ];

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "admin": {
          const admins = await UserAPI.getAdminUsers();
          setAdminUsers(admins);
          break;
        }
        case "recruiter": {
          const recruiters = await UserAPI.getRecruiterUsers();
          setRecruiterUsers(recruiters);
          break;
        }
        case "employee": {
          const employees = await UserAPI.getEmployeeUsers();
          setEmployeeUsers(employees);
          break;
        }
        case "applicant": {
          const applicants = await UserAPI.getApplicantUsers();
          setApplicantUsers(applicants);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      let newUser;
      switch (activeTab) {
        case "recruiter":
          newUser = await UserAPI.createRecruiterUser(userData);
          setRecruiterUsers((prev) => [...prev, newUser]);
          break;
        case "employee":
          newUser = await UserAPI.createEmployeeUser(userData);
          setEmployeeUsers((prev) => [...prev, newUser]);
          break;
        case "admin":
        case "applicant":
        default:
          // Implement when APIs are ready
          break;
      }
      if (newUser) console.log("User created successfully:", newUser);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      let result = updatedUser;

      switch (activeTab) {
        case "admin": {
          // Example uses stubbed API that echoes the payload back
          result = await UserAPI.updateAdminUser(updatedUser.id, updatedUser);
          setAdminUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? result : u)));
          break;
        }
        case "recruiter": {
          setRecruiterUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
          break;
        }
        case "employee": {
          result = await UserAPI.updateEmployeeUser(updatedUser.id, updatedUser);
          setEmployeeUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? result : u)));
          break;
        }
        case "applicant": {
          setApplicantUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
          break;
        }
        default:
          break;
      }

      console.log("User updated successfully:", result);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      switch (activeTab) {
        case "admin":
          await UserAPI.deleteAdminUser(userId);
          setAdminUsers((prev) => prev.filter((u) => u.id !== userId));
          break;
        case "recruiter":
          await UserAPI.deleteRecruiterUser(userId);
          setRecruiterUsers((prev) => prev.filter((u) => u.id !== userId));
          break;
        case "employee":
          await UserAPI.deleteEmployeeUser(userId);
          setEmployeeUsers((prev) => prev.filter((u) => u.id !== userId));
          break;
        case "applicant":
          await UserAPI.deleteApplicantUser(userId);
          setApplicantUsers((prev) => prev.filter((u) => u.id !== userId));
          break;
        default:
          break;
      }

      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const users = getCurrentUsers();
      const user = users.find((u) => u.id === userId);
      const newStatus = user?.status === "active" ? "inactive" : "active";

      await UserAPI.toggleUserStatus(userId, newStatus);

      switch (activeTab) {
        case "admin":
          setAdminUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
          break;
        case "recruiter":
          setRecruiterUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
          break;
        case "employee":
          setEmployeeUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
          break;
        case "applicant":
          setApplicantUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
          break;
        default:
          break;
      }

      console.log("User status updated successfully");
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const handleSavePermissions = async (updatedUser) => {
    try {
      await UserAPI.updateUserPermissions(updatedUser.id, updatedUser.permissions);

      switch (activeTab) {
        case "admin":
          setAdminUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
          break;
        case "recruiter":
          setRecruiterUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
          break;
        case "employee":
          setEmployeeUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
          break;
        case "applicant":
          setApplicantUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
          break;
        default:
          break;
      }

      console.log("Permissions updated successfully");
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  const getCurrentUsers = () => {
    switch (activeTab) {
      case "admin":
        return adminUsers;
      case "recruiter":
        return recruiterUsers;
      case "employee":
        return employeeUsers;
      case "applicant":
        return applicantUsers;
      default:
        return [];
    }
  };

  const getRoleLabel = () => {
    const labels = {
      admin: "Admin",
      recruiter: "HR Recruiter",
      employee: "Employee",
      applicant: "Applicant",
    };
    return labels[activeTab];
  };

  const filteredUsers = getCurrentUsers().filter((user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim().toLowerCase();
    const email = (user.email || "").toLowerCase();
    const dept = (user.department || "").toLowerCase();
    const role = (user.role || "").toLowerCase();
    const query = (searchQuery || "").toLowerCase();

    return (
      fullName.includes(query) ||
      email.includes(query) ||
      dept.includes(query) ||
      role.includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">Manage system users and their permissions</p>
            </div>
            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
            >
              <Plus size={16} />
              <span>Add {getRoleLabel()}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${getRoleLabel().toLowerCase()}s by name, email, department, or role...`}
        />

        {/* Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <UserTable
            users={filteredUsers}
            activeTab={activeTab}
            onEdit={(user) => {
              setSelectedUser(user);
              setShowEditUser(true);
            }}
            onDelete={(user) => {
              setSelectedUser(user);
              setShowDeleteConfirm(true);
            }}
            onViewDetails={(user) => {
              setSelectedUser(user);
              setShowUserDetails(true);
            }}
            onEditPermissions={(user) => {
              setSelectedUser(user);
              setShowPermissions(true);
            }}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      {/* Modals */}
      <AddUserModal
        show={showAddUser}
        onClose={() => setShowAddUser(false)}
        onAdd={handleAddUser}
        activeTab={activeTab}
        roleLabel={getRoleLabel()}
      />

      <EditUserModal
        show={showEditUser}
        onClose={() => {
          setShowEditUser(false);
          setSelectedUser(null);
        }}
        onSave={handleEditUser}
        user={selectedUser}
        activeTab={activeTab}
        roleLabel={getRoleLabel()}
      />

      <DeleteConfirmModal
        show={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedUser(null);
        }}
        onConfirm={(u) => handleDeleteUser(u?.id)}
        user={selectedUser}
      />

      <UserDetailsModal
        show={showUserDetails}
        onClose={() => {
          setShowUserDetails(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        activeTab={activeTab}
        roleLabel={getRoleLabel()}
      />

      <PermissionsModal
        show={showPermissions}
        onClose={() => {
          setShowPermissions(false);
          setSelectedUser(null);
        }}
        onSave={handleSavePermissions}
        user={selectedUser}
        activeTab={activeTab}
        roleLabel={getRoleLabel()}
      />
    </div>
  );
};

export default UsersPage;