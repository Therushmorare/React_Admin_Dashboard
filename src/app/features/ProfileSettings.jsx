"use client"

import React, { useState, useEffect } from 'react';
import { Camera, User, Mail, Phone, MapPin, Calendar, Save, X } from 'lucide-react';
import axios from 'axios';

const ProfileSettings = ({ onClose, embedded = false }) => {
  const [profileData, setProfileData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const userId = sessionStorage.getItem("user_id");
  const token = sessionStorage.getItem("access_token");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) return;

        const response = await axios.get(
          'https://jellyfish-app-z83s2.ondigitalocean.app/api/admin/allAdmins',
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`, // optional if JWT required
            },
          }
        );

        const members = response.data;
        const currentUser = members.find(member => member.admin_id === userId);

        if (currentUser) {
          setProfileData({
            firstName: currentUser.first_name,
            lastName: currentUser.last_name,
            email: currentUser.email,
            phone: currentUser.phone_number || '',
            position: currentUser.position || '',
            department: currentUser.department || '',
            location: currentUser.location || '',
            dateOfBirth: currentUser.date_of_birth || '',
            bio: currentUser.bio || '',
            avatar: currentUser.avatar || null,
          });
        }

      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [userId, token]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleAvatarChange = (event) => {
    // Disable editing
    return;
  };

  const handleInputChange = () => {
    // Disable editing
    return;
  };

  if (!profileData) return null;

  return (
    <>
      {/* Backdrop */}
      {!embedded && (
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
            isVisible ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={handleClose}
        />
      )}

      {/* Slide Panel */}
      <div className={embedded
        ? "w-full h-full bg-white"
        : `fixed top-0 right-0 h-full w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="h-full overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 sticky top-0 bg-white pb-4 border-b border-gray-100">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-3">Profile Settings</h1>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                  View your personal information. Editing is disabled.
                </p>
              </div>
              {!embedded && (
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              )}
            </div>

            {/* Profile Form */}
            <div className="bg-gray-50 rounded-lg p-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-200 bg-white rounded-lg p-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={32} className="text-gray-400" />
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-700 rounded-full flex items-center justify-center cursor-not-allowed"
                  >
                    <Camera size={14} className="text-white" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Profile Picture</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Uploading new profile pictures is disabled.
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries({
                    "First Name": profileData.firstName,
                    "Last Name": profileData.lastName,
                    "Email": profileData.email,
                    "Phone Number": profileData.phone,
                    "Position": profileData.position,
                    "Department": profileData.department,
                    "Location": profileData.location,
                    "Date of Birth": profileData.dateOfBirth,
                  }).map(([label, value]) => (
                    <div key={label}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                      <input
                        type="text"
                        value={value}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio Section */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                <textarea
                  value={profileData.bio}
                  rows={4}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 resize-none cursor-not-allowed"
                />
              </div>

              {/* Save Button (disabled) */}
              <div className="flex justify-end bg-white rounded-lg p-6">
                <button
                  disabled
                  className="flex items-center space-x-2 px-8 py-3 rounded-lg font-medium bg-gray-200 text-gray-500 cursor-not-allowed"
                >
                  <Save size={16} />
                  <span>Save Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;