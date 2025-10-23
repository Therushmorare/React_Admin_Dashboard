"use client"

import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Filter, Download, User, FileText, Settings, LogIn, LogOut, Edit, Eye, Trash2, Clock, MapPin, X } from 'lucide-react';

const ActivityLog = ({ onClose, embedded = false }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [dateRange, setDateRange] = useState('week');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const activityTypes = [
    { key: 'all', label: 'All Activities', icon: Activity },
    { key: 'authentication', label: 'Authentication', icon: LogIn },
    { key: 'candidate', label: 'Candidate Actions', icon: User },
    { key: 'document', label: 'Document Access', icon: FileText },
    { key: 'settings', label: 'Settings Changes', icon: Settings },
    { key: 'profile', label: 'Profile Updates', icon: Edit }
  ];

  const activities = [
    {
      id: 1,
      type: 'authentication',
      action: 'Login',
      description: 'Successful login to the system',
      timestamp: '2024-09-19T10:30:00Z',
      ipAddress: '192.168.1.100',
      location: 'Johannesburg, South Africa',
      device: 'Chrome on Windows',
      severity: 'info'
    },
    {
      id: 2,
      type: 'candidate',
      action: 'View Candidate',
      description: 'Viewed candidate profile: Nombuso Simelane',
      timestamp: '2024-09-19T09:45:00Z',
      ipAddress: '192.168.1.100',
      location: 'Johannesburg, South Africa',
      device: 'Chrome on Windows',
      severity: 'info'
    },
    {
      id: 3,
      type: 'candidate',
      action: 'Status Update',
      description: 'Updated candidate status from "Applied" to "Interview" for John Doe',
      timestamp: '2024-09-19T09:15:00Z',
      ipAddress: '192.168.1.100',
      location: 'Johannesburg, South Africa',
      device: 'Chrome on Windows',
      severity: 'info'
    },
    {
      id: 4,
      type: 'document',
      action: 'Download CV',
      description: 'Downloaded CV: zandile_dlamini_resume.pdf',
      timestamp: '2024-09-19T08:50:00Z',
      ipAddress: '192.168.1.100',
      location: 'Johannesburg, South Africa',
      device: 'Chrome on Windows',
      severity: 'info'
    },
    {
      id: 5,
      type: 'settings',
      action: 'Notification Settings',
      description: 'Updated email notification preferences',
      timestamp: '2024-09-18T16:20:00Z',
      ipAddress: '192.168.1.100',
      location: 'Johannesburg, South Africa',
      device: 'Chrome on Windows',
      severity: 'info'
    },
    {
      id: 6,
      type: 'profile',
      action: 'Profile Update',
      description: 'Updated profile information and contact details',
      timestamp: '2024-09-18T15:35:00Z',
      ipAddress: '192.168.1.100',
      location: 'Johannesburg, South Africa',
      device: 'Chrome on Windows',
      severity: 'info'
    },
    {
      id: 7,
      type: 'authentication',
      action: 'Failed Login',
      description: 'Failed login attempt - incorrect password',
      timestamp: '2024-09-18T14:22:00Z',
      ipAddress: '10.0.0.45',
      location: 'Cape Town, South Africa',
      device: 'Firefox on macOS',
      severity: 'warning'
    },
    {
      id: 8,
      type: 'candidate',
      action: 'Candidate Review',
      description: 'Added review comments for candidate: Lebogang Malatjei',
      timestamp: '2024-09-18T11:10:00Z',
      ipAddress: '192.168.1.100',
      location: 'Johannesburg, South Africa',
      device: 'Chrome on Windows',
      severity: 'info'
    },
    {
      id: 9,
      type: 'document',
      action: 'Document Access',
      description: 'Accessed team documents: Q3 Performance Report',
      timestamp: '2024-09-17T13:45:00Z',
      ipAddress: '192.168.1.100',
      location: 'Johannesburg, South Africa',
      device: 'Chrome on Windows',
      severity: 'info'
    },
    {
      id: 10,
      type: 'authentication',
      action: 'Logout',
      description: 'User logged out from the system',
      timestamp: '2024-09-17T18:30:00Z',
      ipAddress: '192.168.1.100',
      location: 'Johannesburg, South Africa',
      device: 'Chrome on Windows',
      severity: 'info'
    }
  ];

  const filteredActivities = activities.filter(activity => {
    const matchesType = selectedFilter === 'all' || activity.type === selectedFilter;

    const activityDate = new Date(activity.timestamp);
    const now = new Date();
    let matchesDate = true;

    switch (dateRange) {
      case 'today':
        matchesDate = activityDate.toDateString() === now.toDateString();
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = activityDate >= weekAgo;
        break;
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        matchesDate = activityDate >= monthAgo;
        break;
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        matchesDate = activityDate >= yearAgo;
        break;
    }

    return matchesType && matchesDate;
  });

  const getActivityIcon = (type, action) => {
    switch (type) {
      case 'authentication':
        return action === 'Login' ? <LogIn className="w-4 h-4" /> : <LogOut className="w-4 h-4" />;
      case 'candidate':
        return action.includes('View') ? <Eye className="w-4 h-4" /> : 
               action.includes('Update') ? <Edit className="w-4 h-4" /> : <User className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'settings':
        return <Settings className="w-4 h-4" />;
      case 'profile':
        return <Edit className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'warning':
        return 'bg-yellow-100 border-yellow-200';
      case 'error':
        return 'bg-red-100 border-red-200';
      case 'success':
        return 'bg-green-100 border-green-200';
      default:
        return 'bg-blue-100 border-blue-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      case 'success':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
  };

  const exportActivityLog = () => {
    console.log('Exporting activity log...');
  };

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
            <div className="flex justify-between items-start mb-8 sticky top-0 bg-white pb-4 border-b border-gray-100">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-3">Activity Log</h1>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                  View your recent account activity, login history, and system interactions.
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

            {/* Export Button */}
            <div className="flex justify-end mb-6 sticky top-20 bg-white py-4 border-b border-gray-100">
              <button
                onClick={exportActivityLog}
                className="flex items-center space-x-2 px-6 py-2 border border-green-700 text-green-700 rounded-lg hover:bg-green-50 transition-colors duration-200"
              >
                <Download size={16} />
                <span>Export Log</span>
              </button>
            </div>

            <div className="space-y-8">
              {/* Filters Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Filter className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    <p className="text-sm text-gray-600">Filter activities by type and date range</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Activity Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {activityTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <button
                            key={type.key}
                            onClick={() => setSelectedFilter(type.key)}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                              selectedFilter === type.key
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <IconComponent size={16} />
                            <span>{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-200"
                    >
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Activity Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Activity Summary</h2>
                    <p className="text-sm text-gray-600">Overview of your recent activity</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Activity className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xl font-bold text-gray-900">{filteredActivities.length}</p>
                        <p className="text-xs text-gray-600">Total</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <LogIn className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xl font-bold text-gray-900">
                          {filteredActivities.filter(a => a.action === 'Login').length}
                        </p>
                        <p className="text-xs text-gray-600">Logins</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xl font-bold text-gray-900">
                          {filteredActivities.filter(a => a.type === 'candidate').length}
                        </p>
                        <p className="text-xs text-gray-600">Candidates</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <FileText className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xl font-bold text-gray-900">
                          {filteredActivities.filter(a => a.type === 'document').length}
                        </p>
                        <p className="text-xs text-gray-600">Documents</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Activity Timeline</h2>
                    <p className="text-sm text-gray-600">Chronological list of your recent activities</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredActivities.map((activity, index) => (
                    <div key={activity.id} className={`p-4 border rounded-lg transition-colors hover:bg-gray-50 ${getSeverityColor(activity.severity)}`}>
                      <div className="flex items-start space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 ${getSeverityIcon(activity.severity)}`}>
                          {getActivityIcon(activity.type, activity.action)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-sm font-medium text-gray-900">{activity.action}</h3>
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                              
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTimestamp(activity.timestamp)}</span>
                                </div>
                                
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{activity.location}</span>
                                </div>
                                
                                <span>{activity.device}</span>
                                <span>IP: {activity.ipAddress}</span>
                              </div>
                            </div>

                            <div className="ml-4 text-right flex-shrink-0">
                              <p className="text-xs text-gray-500">
                                {new Date(activity.timestamp).toLocaleTimeString()}
                              </p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                activity.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                activity.severity === 'error' ? 'bg-red-100 text-red-800' :
                                activity.severity === 'success' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {activity.severity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredActivities.length === 0 && (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Found</h3>
                    <p className="text-sm text-gray-600">
                      No activities match your current filter criteria. Try adjusting your filters or selecting a different date range.
                    </p>
                  </div>
                )}

                {/* Load More */}
                {filteredActivities.length > 0 && (
                  <div className="text-center mt-8">
                    <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      Load More Activities
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivityLog;