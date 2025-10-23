"use client"

import React, { useState, useEffect } from 'react';
import { Camera, User, Mail, Phone, MapPin, Calendar, Save, X } from 'lucide-react';

const ProfileSettings = ({ onClose, embedded = false }) => {
  const [profileData, setProfileData] = useState({
    firstName: 'Nombuso',
    lastName: 'Simelane',
    email: 'nombuso.simelane@email.com',
    phone: '+27 123 456 7890',
    position: 'Recruitment Officer',
    department: 'Human Resources',
    location: 'Johannesburg, South Africa',
    dateOfBirth: '1999-05-15',
    bio: 'Recruitment Officer at Human Resources.',
    avatar: null
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    console.log('Saving profile data:', profileData);
    setIsDirty(false);
  };

  const handleCancel = () => {
    setProfileData({
      firstName: 'Nombuso',
      lastName: 'Simelane',
      email: 'nombuso.simelane@email.com',
      phone: '+27 123 456 7890',
      position: 'Recruitment Officer',
      department: 'Human Resources',
      location: 'Johannesburg, South Africa',
      dateOfBirth: '1999-05-15',
      bio: 'Recruitment Officer at Human Resources.',
      avatar: null
    });
    setIsDirty(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('avatar', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
        
        {/* Scrollable Content */}
        <div className="h-full overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 sticky top-0 bg-white pb-4 border-b border-gray-100">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-3">Profile Settings</h1>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                  Manage your personal information and profile details.
                </p>
              </div>

              {/* Close Button */}
              {!embedded && (
              <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              )}
            </div>

            {/* Action Buttons */}
            {isDirty && (
              <div className="flex items-center space-x-3 mb-6 sticky top-20 bg-white py-4 border-b border-gray-100">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-200"
                >
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            )}

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
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-800 transition-colors shadow-lg"
                  >
                    <Camera size={14} className="text-white" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Profile Picture</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Upload a new profile picture. Recommended size is 400x400px.
                  </p>
                  <p className="text-xs text-gray-500">JPG, PNG or GIF (max. 5MB)</p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Mail size={16} className="mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Phone size={16} className="mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      value={profileData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200"
                      placeholder="Your job title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={profileData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200"
                    >
                      <option value="">Select Department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MapPin size={16} className="mr-2" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200"
                      placeholder="Your location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Calendar size={16} className="mr-2" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200 resize-none"
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {profileData.bio.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end bg-white rounded-lg p-6">
                <button
                  onClick={handleSave}
                  disabled={!isDirty}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isDirty
                      ? 'bg-green-700 text-white hover:bg-green-800 shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
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