"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, LogOut } from 'lucide-react';
import SettingsPanel from '../features/Settings';
import DocumentsModal from '../features/Documents';
import NotificationsModal from '../features/Notifications/NotificationsModal';
import axios from "axios";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const dropdownRef = useRef(null);

  const [userId, setUserId] = useState(null); // browser-safe
  const [userAvatar, setUserAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [appliedCount, setAppliedCount] = useState(0);

  // Get user_id safely from sessionStorage (browser-only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = sessionStorage.getItem("user_id");
      if (storedId) {
        setUserId(storedId);
      }
    }
  }, []);

  // Fetch HR member data once userId is available
  useEffect(() => {
    if (!userId) return;

    const fetchHRMembers = async () => {
      try {
        const response = await axios.get(
          "https://jellyfish-app-z83s2.ondigitalocean.app/api/admin/allAdmins",
          { headers: { Accept: "application/json" } }
        );

        const hrMembers = response.data;
        const currentUser = hrMembers.find(
          (member) => member.admin_id === userId
        );

        if (currentUser) {
          setUserName(`${currentUser.first_name} ${currentUser.last_name}`);
          setUserEmail(currentUser.email);
          setUserAvatar(""); // placeholder for future avatar logic
        }
      } catch (error) {
        console.error("Error fetching HR members:", error);
      }
    };

    fetchHRMembers();
  }, [userId]);

  // Fetch all applicants and count applied
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          "https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/all_applicants",
          { headers: { Accept: "application/json" } }
        );

        const applicants = response.data;
        const count = applicants.filter(app => app.application_status === "APPLIED").length;
        setAppliedCount(count);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const profileMenuItems = [
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => setShowSettingsPanel(true),
      description: 'Profile settings and more'
    }
  ];

  const AvatarComponent = ({ size = 'md' }) => {
    const sizes = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg'
    };

    if (userAvatar) {
      return (
        <img 
          src={userAvatar} 
          alt={userName}
          className={`${sizes[size]} rounded-full object-cover`}
        />
      );
    }

    return (
      <div className={`${sizes[size]} bg-green-700 rounded-full flex items-center justify-center text-white font-semibold`}>
        {getInitials(userName)}
      </div>
    );
  };

  return (
    <>
      <nav className="h-18 bg-white flex items-center justify-between px-6 sticky top-0 z-50 shadow-[0_8px_10px_-4px_rgba(0,0,0,0.15)]">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            <input
              type="text"
              placeholder="Search Anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-all duration-200 focus:border-green-700 focus:ring-4 focus:ring-green-100 placeholder-gray-400"
              style={{ borderColor: searchQuery ? '#0D5E3A' : '' }}
            />
          </div>
        </div>

        {/* Right side items */}
        <div className="flex items-center space-x-4">
          {/* Documents */}
          {/*<button 
            onClick={() => setShowDocumentsModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-all duration-200"
          >
            <span>Documents</span>
          </button>*/}

          {/* Payroll */}
          {/*<button 
            onClick={() => console.log('Payroll clicked')}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-all duration-200"
          >
            <span>Payroll</span>
          </button>*/}

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotificationsModal(!showNotificationsModal)}
              className="relative p-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-all duration-200"
            >
              <Bell size={20} />
              {appliedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {appliedCount}
                </span>
              )}
            </button>
          </div>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-700 transition-all duration-200"
            >
              <AvatarComponent size="sm" />
              <span className="text-sm font-medium text-gray-700">Profile</span>
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-75 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <AvatarComponent size="md" />
                    <div>
                      <p className="font-semibold text-gray-900">{userName}</p>
                      <p className="text-sm text-gray-600">{userEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {profileMenuItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          item.onClick();
                          setShowProfileDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 group"
                      >
                        <div className="flex items-start space-x-3">
                          <IconComponent size={16} className="text-gray-500 group-hover:text-green-700 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 group-hover:text-green-700">
                              {item.label}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Logout Section */}
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={() => {
                      // Clear all sessionStorage items
                      sessionStorage.removeItem("access_token");
                      sessionStorage.removeItem("employee_email");
                      sessionStorage.removeItem("user_id");
                      // Optional: clear everything just in case
                      // sessionStorage.clear();

                      // Close profile dropdown
                      setShowProfileDropdown(false);

                      // Redirect to login page
                      if (typeof window !== "undefined") {
                        window.location.href = "/login"; // replace with your login route
                      }
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors duration-150 group"
                  >
                    <div className="flex items-center space-x-3">
                      <LogOut size={16} className="text-gray-500 group-hover:text-red-600" />
                      <span className="text-sm font-medium text-gray-900 group-hover:text-red-600">
                        Logout
                      </span>
                    </div>
                  </button>
                </div>                
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Settings Panel */}
      {showSettingsPanel && (
        <SettingsPanel onClose={() => setShowSettingsPanel(false)} />
      )}

      {/* Documents Modal */}
      {showDocumentsModal && (
        <DocumentsModal onClose={() => setShowDocumentsModal(false)} />
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <NotificationsModal onClose={() => setShowNotificationsModal(false)} />
      )}
    </>
  );
};

export default Navbar;