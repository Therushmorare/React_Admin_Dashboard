"use client"

import React, { useState, useEffect } from 'react';
import { User, Shield, Settings, HelpCircle, Activity, X } from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import AccountSettings from './AccountSettings';
import Permissions from './Permissions';
import HelpSupport from './Help';
import ActivityLog from './ActivityLog';

const SettingsPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'account', label: 'Account', icon: Shield },
    { key: 'permissions', label: 'Permissions', icon: Settings },
    { key: 'help', label: 'Help & Support', icon: HelpCircle },
    { key: 'activity', label: 'Activity Log', icon: Activity }
  ];

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const renderContent = () => {
  switch (activeTab) {
    case 'profile':
      return <ProfileSettings onClose={handleClose} embedded={true} />;
    case 'account':
      return <AccountSettings onClose={handleClose} embedded={true} />;
    case 'permissions':
      return <Permissions onClose={handleClose} embedded={true} />;
    case 'help':
      return <HelpSupport onClose={handleClose} embedded={true} />;
    case 'activity':
      return <ActivityLog onClose={handleClose} embedded={true} />;
    default:
      return null;
  }
};

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Slide Panel */}
      <div className={`fixed top-0 right-0 h-full w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header with Tabs */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="flex items-center justify-between px-8 pt-6 pb-4">
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="px-8">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'border-green-700 text-green-700'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="h-[calc(100%-140px)] overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;