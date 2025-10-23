"use client"

import React, { useState } from 'react';
import { Search, Filter, Download, RefreshCw, Calendar, Clock, User, Shield, Briefcase, Users, FileText, AlertTriangle, CheckCircle, XCircle, Info, Activity, Database, Settings, Mail, Trash2, Edit, Eye, Lock, UserPlus, UserMinus, ChevronDown } from 'lucide-react';

const LogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [showFilters, setShowFilters] = useState(false);

  const [logs] = useState([
    {
      id: 1,
      timestamp: '2025-10-16T14:32:15',
      type: 'user_management',
      severity: 'info',
      action: 'User Created',
      user: 'Sarah Johnson',
      details: 'Created new HR Recruiter account for Michael Chen',
      ip: '197.184.23.45',
      resource: 'michael.chen@company.com'
    },
    {
      id: 2,
      timestamp: '2025-10-16T14:28:42',
      type: 'security',
      severity: 'warning',
      action: 'Failed Login Attempt',
      user: 'Unknown',
      details: 'Multiple failed login attempts detected from IP 41.203.67.89',
      ip: '41.203.67.89',
      resource: 'admin@company.com'
    },
    {
      id: 3,
      timestamp: '2025-10-16T14:15:23',
      type: 'job_posting',
      severity: 'success',
      action: 'Job Published',
      user: 'Emily Rodriguez',
      details: 'Published job posting: Senior Software Engineer',
      ip: '197.184.23.47',
      resource: 'Job ID: 1234'
    },
    {
      id: 4,
      timestamp: '2025-10-16T13:45:10',
      type: 'application',
      severity: 'info',
      action: 'Application Submitted',
      user: 'Robert Thompson',
      details: 'Submitted application for Marketing Manager position',
      ip: '105.186.234.12',
      resource: 'Job ID: 5678'
    },
    {
      id: 5,
      timestamp: '2025-10-16T13:30:55',
      type: 'user_management',
      severity: 'warning',
      action: 'User Deactivated',
      user: 'Robert Wilson',
      details: 'Deactivated user account: Daniel Kim',
      ip: '197.184.23.46',
      resource: 'daniel.kim@company.com'
    },
    {
      id: 6,
      timestamp: '2025-10-16T13:12:33',
      type: 'security',
      severity: 'success',
      action: 'Permissions Updated',
      user: 'Sarah Johnson',
      details: 'Updated permissions for Emily Rodriguez',
      ip: '197.184.23.45',
      resource: 'emily.rodriguez@company.com'
    },
    {
      id: 7,
      timestamp: '2025-10-16T12:58:17',
      type: 'system',
      severity: 'error',
      action: 'Database Error',
      user: 'System',
      details: 'Database connection timeout occurred',
      ip: 'Internal',
      resource: 'PostgreSQL DB'
    },
    {
      id: 8,
      timestamp: '2025-10-16T12:45:09',
      type: 'email',
      severity: 'info',
      action: 'Email Sent',
      user: 'Michael Chen',
      details: 'Sent interview invitation to Lisa Anderson',
      ip: '197.184.23.48',
      resource: 'lisa.anderson@yahoo.com'
    },
    {
      id: 9,
      timestamp: '2025-10-16T12:30:44',
      type: 'application',
      severity: 'info',
      action: 'Application Reviewed',
      user: 'Emily Rodriguez',
      details: 'Reviewed application from James Brown',
      ip: '197.184.23.47',
      resource: 'Application ID: 9876'
    },
    {
      id: 10,
      timestamp: '2025-10-16T12:15:28',
      type: 'job_posting',
      severity: 'info',
      action: 'Job Updated',
      user: 'Michael Chen',
      details: 'Updated job posting: Product Manager',
      ip: '197.184.23.48',
      resource: 'Job ID: 4321'
    },
    {
      id: 11,
      timestamp: '2025-10-16T11:55:13',
      type: 'security',
      severity: 'success',
      action: 'Successful Login',
      user: 'David Park',
      details: 'User logged in successfully',
      ip: '197.184.23.50',
      resource: 'david.park@company.com'
    },
    {
      id: 12,
      timestamp: '2025-10-16T11:42:36',
      type: 'user_management',
      severity: 'info',
      action: 'Profile Updated',
      user: 'Jessica Martinez',
      details: 'Updated profile information',
      ip: '197.184.23.51',
      resource: 'jessica.martinez@company.com'
    },
    {
      id: 13,
      timestamp: '2025-10-16T11:28:51',
      type: 'system',
      severity: 'info',
      action: 'Backup Completed',
      user: 'System',
      details: 'Automated database backup completed successfully',
      ip: 'Internal',
      resource: 'Backup Server'
    },
    {
      id: 14,
      timestamp: '2025-10-16T11:10:22',
      type: 'security',
      severity: 'error',
      action: 'Unauthorized Access Attempt',
      user: 'Unknown',
      details: 'Attempted to access admin panel without permissions',
      ip: '41.203.67.89',
      resource: '/admin/settings'
    },
    {
      id: 15,
      timestamp: '2025-10-16T10:55:47',
      type: 'email',
      severity: 'warning',
      action: 'Email Delivery Failed',
      user: 'System',
      details: 'Failed to deliver email to candidate',
      ip: 'Internal',
      resource: 'candidate@invalid-domain.com'
    },
    {
      id: 16,
      timestamp: '2025-10-16T10:38:14',
      type: 'application',
      severity: 'success',
      action: 'Application Approved',
      user: 'Emily Rodriguez',
      details: 'Approved application for Senior Developer position',
      ip: '197.184.23.47',
      resource: 'Application ID: 5432'
    },
    {
      id: 17,
      timestamp: '2025-10-16T10:22:05',
      type: 'job_posting',
      severity: 'warning',
      action: 'Job Expired',
      user: 'System',
      details: 'Job posting automatically expired',
      ip: 'Internal',
      resource: 'Job ID: 3210'
    },
    {
      id: 18,
      timestamp: '2025-10-16T10:05:31',
      type: 'user_management',
      severity: 'success',
      action: 'Password Changed',
      user: 'Amanda Foster',
      details: 'Successfully changed account password',
      ip: '197.184.23.52',
      resource: 'amanda.foster@company.com'
    }
  ]);

  const logTypes = [
    { id: 'all', label: 'All Types', icon: Activity, color: 'gray' },
    { id: 'user_management', label: 'User Management', icon: Users, color: 'blue' },
    { id: 'security', label: 'Security', icon: Shield, color: 'red' },
    { id: 'job_posting', label: 'Job Posting', icon: Briefcase, color: 'green' },
    { id: 'application', label: 'Applications', icon: FileText, color: 'purple' },
    { id: 'email', label: 'Email', icon: Mail, color: 'yellow' },
    { id: 'system', label: 'System', icon: Database, color: 'indigo' }
  ];

  const severityLevels = [
    { id: 'all', label: 'All Severities' },
    { id: 'success', label: 'Success' },
    { id: 'info', label: 'Info' },
    { id: 'warning', label: 'Warning' },
    { id: 'error', label: 'Error' }
  ];

  const dateRanges = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'week', label: 'Last 7 Days' },
    { id: 'month', label: 'Last 30 Days' },
    { id: 'all', label: 'All Time' }
  ];

  const getTypeIcon = (type) => {
    const typeMap = {
      'user_management': Users,
      'security': Shield,
      'job_posting': Briefcase,
      'application': FileText,
      'email': Mail,
      'system': Database
    };
    return typeMap[type] || Activity;
  };

  const getSeverityIcon = (severity) => {
    const severityMap = {
      'success': CheckCircle,
      'info': Info,
      'warning': AlertTriangle,
      'error': XCircle
    };
    return severityMap[severity] || Info;
  };

  const getSeverityColor = (severity) => {
    const colorMap = {
      'success': 'text-green-600 bg-green-50',
      'info': 'text-blue-600 bg-blue-50',
      'warning': 'text-yellow-600 bg-yellow-50',
      'error': 'text-red-600 bg-red-50'
    };
    return colorMap[severity] || 'text-gray-600 bg-gray-50';
  };

  const getTypeColor = (type) => {
    const colorMap = {
      'user_management': 'text-blue-700 bg-blue-100',
      'security': 'text-red-700 bg-red-100',
      'job_posting': 'text-green-700 bg-green-100',
      'application': 'text-purple-700 bg-purple-100',
      'email': 'text-yellow-700 bg-yellow-100',
      'system': 'text-indigo-700 bg-indigo-100'
    };
    return colorMap[type] || 'text-gray-700 bg-gray-100';
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || log.type === selectedType;
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    
    return matchesSearch && matchesType && matchesSeverity;
  });

  const getStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter(log => log.timestamp.startsWith(today));
    
    return {
      total: logs.length,
      today: todayLogs.length,
      errors: logs.filter(log => log.severity === 'error').length,
      warnings: logs.filter(log => log.severity === 'warning').length
    };
  };

  const stats = getStats();

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'Type', 'Severity', 'Action', 'User', 'Details', 'IP Address', 'Resource'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.type,
        log.severity,
        log.action,
        log.user,
        log.details,
        log.ip,
        log.resource
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    if (isToday) {
      return `Today at ${time}`;
    }
    
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ` at ${time}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
              <p className="text-gray-600 mt-1">Monitor system activities and user actions</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
              >
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Logs</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
                </div>
                <Activity size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Today</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">{stats.today}</p>
                </div>
                <Clock size={24} className="text-green-600" />
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.warnings}</p>
                </div>
                <AlertTriangle size={24} className="text-yellow-600" />
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Errors</p>
                  <p className="text-2xl font-bold text-red-900 mt-1">{stats.errors}</p>
                </div>
                <XCircle size={24} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs by action, user, details, or resource..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} />
              <span>Filters</span>
              <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Log Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  >
                    {logTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  >
                    {severityLevels.map(level => (
                      <option key={level.id} value={level.id}>{level.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  >
                    {dateRanges.map(range => (
                      <option key={range.id} value={range.id}>{range.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logs List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="divide-y divide-gray-200">
            {filteredLogs.map((log) => {
              const TypeIcon = getTypeIcon(log.type);
              const SeverityIcon = getSeverityIcon(log.severity);
              
              return (
                <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-2 rounded-lg ${getSeverityColor(log.severity)}`}>
                        <SeverityIcon size={20} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-base font-semibold text-gray-900">{log.action}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                            {log.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">{log.details}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            {formatTimestamp(log.timestamp)}
                          </div>
                          <div className="flex items-center">
                            <User size={12} className="mr-1" />
                            {log.user}
                          </div>
                          <div className="flex items-center">
                            <Activity size={12} className="mr-1" />
                            {log.ip}
                          </div>
                          <div className="flex items-center">
                            <FileText size={12} className="mr-1" />
                            {log.resource}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      log.severity === 'success' ? 'bg-green-100 text-green-800' :
                      log.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      log.severity === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {log.severity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Activity size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Logs Found</h3>
              <p className="text-gray-600">
                {searchQuery || selectedType !== 'all' || selectedSeverity !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No system logs have been recorded yet'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination Info */}
        {filteredLogs.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsPage;