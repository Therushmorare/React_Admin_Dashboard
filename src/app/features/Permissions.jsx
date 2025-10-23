"use client"

import React, { useState, useEffect } from 'react';
import { Shield, User, Users, FileText, Calendar, Mail, Settings, CheckCircle, Lock, Unlock, AlertTriangle, Eye, Edit, Trash2, Search, X } from 'lucide-react';

const Permissions = ({ onClose, embedded = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const permissionCategories = [
    { key: 'all', label: 'All Permissions', icon: Shield },
    { key: 'candidates', label: 'Candidates', icon: User },
    { key: 'jobs', label: 'Job Postings', icon: FileText },
    { key: 'interviews', label: 'Interviews', icon: Calendar },
    { key: 'communications', label: 'Communications', icon: Mail },
    { key: 'employee', label: 'Employee Management', icon: Users },
    { key: 'system', label: 'System Settings', icon: Settings }
  ];

  const [permissions, setPermissions] = useState([
    {
      id: 1,
      category: 'candidates',
      name: 'View Candidate Applications',
      description: 'View all candidate applications and profiles',
      enabled: true,
      level: 'read'
    },
    {
      id: 2,
      category: 'candidates',
      name: 'Edit Candidate Information',
      description: 'Modify candidate profiles and application details',
      enabled: true,
      level: 'write'
    },
    {
      id: 3,
      category: 'candidates',
      name: 'Delete Applications',
      description: 'Remove candidate applications from the system',
      enabled: false,
      level: 'delete'
    },
    {
      id: 4,
      category: 'candidates',
      name: 'Change Application Status',
      description: 'Update candidate status (Applied, Screening, Interview, Offered, etc.)',
      enabled: true,
      level: 'write'
    },
    {
      id: 5,
      category: 'candidates',
      name: 'Download Candidate Documents',
      description: 'Download CVs, cover letters, and other candidate documents',
      enabled: true,
      level: 'read'
    },
    {
      id: 6,
      category: 'candidates',
      name: 'Add Notes to Candidates',
      description: 'Add private notes and comments to candidate profiles',
      enabled: true,
      level: 'write'
    },
    {
      id: 7,
      category: 'jobs',
      name: 'View Job Postings',
      description: 'View all active and archived job postings',
      enabled: true,
      level: 'read'
    },
    {
      id: 8,
      category: 'jobs',
      name: 'Create Job Postings',
      description: 'Create new job postings and publish them',
      enabled: true,
      level: 'write'
    },
    {
      id: 9,
      category: 'jobs',
      name: 'Edit Job Postings',
      description: 'Modify existing job postings and requirements',
      enabled: true,
      level: 'write'
    },
    {
      id: 10,
      category: 'jobs',
      name: 'Delete Job Postings',
      description: 'Remove job postings from the system',
      enabled: false,
      level: 'delete'
    },
    {
      id: 11,
      category: 'jobs',
      name: 'Publish/Unpublish Jobs',
      description: 'Control job posting visibility and status',
      enabled: false,
      level: 'write'
    },
    {
      id: 12,
      category: 'interviews',
      name: 'View Interview Schedule',
      description: 'View all scheduled interviews and calendar',
      enabled: true,
      level: 'read'
    },
    {
      id: 13,
      category: 'interviews',
      name: 'Schedule Interviews',
      description: 'Create and schedule new interviews with candidates',
      enabled: true,
      level: 'write'
    },
    {
      id: 14,
      category: 'interviews',
      name: 'Reschedule Interviews',
      description: 'Modify existing interview schedules and timings',
      enabled: true,
      level: 'write'
    },
    {
      id: 15,
      category: 'interviews',
      name: 'Cancel Interviews',
      description: 'Cancel scheduled interviews',
      enabled: true,
      level: 'write'
    },
    {
      id: 16,
      category: 'interviews',
      name: 'Add Interview Feedback',
      description: 'Submit feedback and evaluations after interviews',
      enabled: true,
      level: 'write'
    },
    {
      id: 17,
      category: 'interviews',
      name: 'View Interview Feedback',
      description: 'View feedback submitted by other interviewers',
      enabled: true,
      level: 'read'
    },
    {
      id: 18,
      category: 'communications',
      name: 'Send Email to Candidates',
      description: 'Send individual emails to candidates',
      enabled: true,
      level: 'write'
    },
    {
      id: 19,
      category: 'communications',
      name: 'Send Bulk Emails',
      description: 'Send emails to multiple candidates at once',
      enabled: true,
      level: 'write'
    },
    {
      id: 20,
      category: 'communications',
      name: 'Use Email Templates',
      description: 'Access and use pre-defined email templates',
      enabled: true,
      level: 'read'
    },
    {
      id: 21,
      category: 'communications',
      name: 'Edit Email Templates',
      description: 'Edit email templates',
      enabled: true,
      level: 'write'
    },
    {
      id: 23,
      category: 'employee',
      name: 'View Employees',
      description: 'View list of all employees and their roles',
      enabled: true,
      level: 'read'
    },
    {
      id: 25,
      category: 'employee',
      name: 'Assign Candidates',
      description: 'Assign candidates to different departments',
      enabled: true,
      level: 'write'
    },

    {
      id: 27,
      category: 'system',
      name: 'Access System Settings',
      description: 'Access general system settings and configurations',
      enabled: false,
      level: 'admin'
    },
    {
      id: 28,
      category: 'system',
      name: 'Export Data',
      description: 'Export candidate and application data',
      enabled: true,
      level: 'read'
    },
    {
      id: 29,
      category: 'system',
      name: 'Import Data',
      description: 'Import bulk candidate data into the system',
      enabled: false,
      level: 'write'
    },
    {
      id: 30,
      category: 'system',
      name: 'View Analytics',
      description: 'Access recruitment analytics and reports',
      enabled: true,
      level: 'read'
    }
  ]);



  const filteredPermissions = permissions.filter(perm => {
    const matchesCategory = selectedCategory === 'all' || perm.category === selectedCategory;
    const matchesSearch = perm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         perm.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPermissionIcon = (level) => {
    switch (level) {
      case 'read':
        return <Eye className="w-4 h-4" />;
      case 'write':
        return <Edit className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'read':
        return 'bg-blue-100 text-blue-700';
      case 'write':
        return 'bg-green-100 text-green-700';
      case 'delete':
        return 'bg-red-100 text-red-700';
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const enabledCount = permissions.filter(p => p.enabled).length;
  const totalCount = permissions.length;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
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
            <div className="flex justify-between items-start mb-8 sticky top-0 bg-white pb-4 border-b border-gray-100 z-10">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-3">Permissions & Access Control</h1>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                  Manage your account permissions and access levels for different features and resources.
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

            <div className="space-y-8">
              {/* Permission Overview */}
              <div className="bg-green-800 rounded-lg shadow-sm border border-green-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <Shield className="w-8 h-8 text-green-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">Your Access Level</h2>
                      <p className="text-sm text-gray-200 mt-1">HR Manager - Standard Access</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">{enabledCount}/{totalCount}</p>
                    <p className="text-sm text-gray-200">Permissions Active</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Read Access</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {permissions.filter(p => p.level === 'read' && p.enabled).length}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <Edit className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Write Access</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {permissions.filter(p => p.level === 'write' && p.enabled).length}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-700">Restricted</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {permissions.filter(p => !p.enabled).length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Permissions</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Search by name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Category</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {permissionCategories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <button
                            key={category.key}
                            onClick={() => setSelectedCategory(category.key)}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                              selectedCategory === category.key
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <IconComponent size={16} />
                            <span>{category.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Lock className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Permission Details</h2>
                    <p className="text-sm text-gray-600">
                      {filteredPermissions.length} permission{filteredPermissions.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredPermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className={`p-4 border rounded-lg transition-all duration-200 ${
                        permission.enabled
                          ? 'bg-green-50 border-green-200 hover:bg-green-100'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            permission.enabled ? 'bg-green-200' : 'bg-gray-300'
                          }`}>
                            {permission.enabled ? (
                              <Unlock className="w-5 h-5 text-green-700" />
                            ) : (
                              <Lock className="w-5 h-5 text-gray-500" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-sm font-semibold text-gray-900">{permission.name}</h3>
                              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(permission.level)}`}>
                                {getPermissionIcon(permission.level)}
                                <span className="capitalize">{permission.level}</span>
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{permission.description}</p>
                          </div>
                        </div>

                        <div
                          className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent ${
                            permission.enabled ? 'bg-green-600' : 'bg-gray-300'
                          } opacity-60 cursor-not-allowed`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 ${
                              permission.enabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredPermissions.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Permissions Found</h3>
                    <p className="text-sm text-gray-600">
                      No permissions match your search criteria. Try adjusting your filters.
                    </p>
                  </div>
                )}
              </div>

              {/* Warning Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900 mb-1">View Only Access</h3>
                    <p className="text-sm text-blue-800">
                      You are viewing your current permissions. These cannot be modified directly. 
                      Contact your system administrator if you need changes to your access levels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Permissions;