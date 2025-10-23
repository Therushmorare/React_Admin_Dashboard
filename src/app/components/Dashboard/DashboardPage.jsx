"use client"

import React, { useState } from 'react';
import { Users, Briefcase, FileText, TrendingUp, TrendingDown, Activity, Clock, CheckCircle, XCircle, AlertTriangle, DollarSign, Eye, Calendar, ArrowUpRight, ArrowDownRight, BarChart3, PieChart, Mail, Phone, MapPin, Award, Target, UserCheck, UserPlus, MessageSquare, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('week');

  const stats = {
    totalUsers: 25,
    activeJobs: 34,
    totalApplications: 487,
    pendingReviews: 23,
    activeUsers: 22,
    newUsersThisWeek: 3,
    jobsPublished: 8,
    applicationsToday: 12
  };

  const recentActivities = [
    {
      id: 1,
      type: 'application',
      icon: FileText,
      color: 'blue',
      title: 'New Application Received',
      description: 'Robert Thompson applied for Marketing Manager',
      time: '5 minutes ago',
      status: 'new'
    },
    {
      id: 2,
      type: 'user',
      icon: UserPlus,
      color: 'green',
      title: 'New User Registered',
      description: 'Lisa Anderson created an applicant account',
      time: '23 minutes ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'job',
      icon: Briefcase,
      color: 'purple',
      title: 'Job Published',
      description: 'Senior Software Engineer posted by Emily Rodriguez',
      time: '1 hour ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'security',
      icon: AlertTriangle,
      color: 'red',
      title: 'Failed Login Attempts',
      description: '5 failed attempts from IP 41.203.67.89',
      time: '2 hours ago',
      status: 'warning'
    },
    {
      id: 5,
      type: 'review',
      icon: CheckCircle,
      color: 'green',
      title: 'Application Approved',
      description: 'Michael Chen approved candidate for Senior Developer',
      time: '3 hours ago',
      status: 'success'
    }
  ];

  const topJobs = [
    { id: 1, title: 'Senior Software Engineer', applications: 45, views: 234, status: 'active' },
    { id: 2, title: 'Marketing Manager', applications: 38, views: 189, status: 'active' },
    { id: 3, title: 'Product Designer', applications: 32, views: 156, status: 'active' },
    { id: 4, title: 'Data Analyst', applications: 28, views: 142, status: 'active' },
    { id: 5, title: 'HR Specialist', applications: 24, views: 98, status: 'active' }
  ];

  const topRecruiters = [
    { id: 1, name: 'Emily Rodriguez', avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=2563eb&color=ffffff', activeJobs: 12, applicationsReviewed: 203 },
    { id: 2, name: 'Michael Chen', avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=3b82f6&color=ffffff', activeJobs: 8, applicationsReviewed: 145 },
    { id: 3, name: 'Nombuso Johnson', avatar: 'https://ui-avatars.com/api/?name=Nombuso+Johnson&background=ef4444&color=ffffff', activeJobs: 6, applicationsReviewed: 98 }
  ];

  const applicationStats = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [12, 19, 15, 25, 22, 18, 12]
  };

  const departmentStats = [
    { name: 'Engineering', count: 8, percentage: 32, color: 'blue' },
    { name: 'Sales', count: 6, percentage: 24, color: 'green' },
    { name: 'Marketing', count: 5, percentage: 20, color: 'purple' },
    { name: 'HR', count: 4, percentage: 16, color: 'yellow' },
    { name: 'Finance', count: 2, percentage: 8, color: 'red' }
  ];

  const systemHealth = [
    { name: 'Database', status: 'healthy', uptime: '99.9%', color: 'green' },
    { name: 'API Server', status: 'healthy', uptime: '99.8%', color: 'green' },
    { name: 'Email Service', status: 'warning', uptime: '98.5%', color: 'yellow' },
    { name: 'Storage', status: 'healthy', uptime: '100%', color: 'green' }
  ];

  const getActivityIcon = (activity) => {
    const Icon = activity.icon;
    return Icon;
  };

  const getActivityColor = (color) => {
    const colorMap = {
      'blue': 'bg-blue-100 text-blue-600',
      'green': 'bg-green-100 text-green-600',
      'purple': 'bg-purple-100 text-purple-600',
      'red': 'bg-red-100 text-red-600',
      'yellow': 'bg-yellow-100 text-yellow-600'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  const maxApplications = Math.max(...applicationStats.data);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, Nombuso! Here's what's happening today.</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users size={24} className="text-blue-600" />
              </div>
              <span className="flex items-center text-sm font-medium text-green-600">
                <TrendingUp size={16} className="mr-1" />
                +12%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
            <p className="text-sm text-gray-600 mt-1">Total Users</p>
            <p className="text-xs text-gray-500 mt-2">{stats.activeUsers} active</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Briefcase size={24} className="text-green-600" />
              </div>
              <span className="flex items-center text-sm font-medium text-green-600">
                <TrendingUp size={16} className="mr-1" />
                +8%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.activeJobs}</h3>
            <p className="text-sm text-gray-600 mt-1">Active Jobs</p>
            <p className="text-xs text-gray-500 mt-2">{stats.jobsPublished} published this week</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText size={24} className="text-purple-600" />
              </div>
              <span className="flex items-center text-sm font-medium text-green-600">
                <TrendingUp size={16} className="mr-1" />
                +24%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalApplications}</h3>
            <p className="text-sm text-gray-600 mt-1">Total Applications</p>
            <p className="text-xs text-gray-500 mt-2">{stats.applicationsToday} received today</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
              <span className="flex items-center text-sm font-medium text-red-600">
                <TrendingDown size={16} className="mr-1" />
                -5%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</h3>
            <p className="text-sm text-gray-600 mt-1">Pending Reviews</p>
            <p className="text-xs text-gray-500 mt-2">Requires attention</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Application Trends */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Application Trends</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <BarChart3 size={16} />
                <span>Last 7 days</span>
              </div>
            </div>
            <div className="space-y-4">
              {applicationStats.labels.map((label, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-sm font-semibold text-gray-900">{applicationStats.data[index]}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${(applicationStats.data[index] / maxApplications) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Average daily applications</span>
                <span className="font-semibold text-gray-900">17.5</span>
              </div>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Departments</h2>
              <PieChart size={16} className="text-gray-600" />
            </div>
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full bg-${dept.color}-500`} />
                      <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{dept.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-${dept.color}-500 h-2 rounded-full`}
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{dept.percentage}% of total</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Jobs and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Performing Jobs */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Top Performing Jobs</h2>
              <button className="text-sm text-green-700 hover:text-green-800 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {topJobs.map((job, index) => (
                <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">{job.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-600 flex items-center">
                          <FileText size={12} className="mr-1" />
                          {job.applications} apps
                        </span>
                        <span className="text-xs text-gray-600 flex items-center">
                          <Eye size={12} className="mr-1" />
                          {job.views} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Activity size={16} className="text-gray-600" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = getActivityIcon(activity);
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.color)}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">{activity.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Recruiters and System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Recruiters */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Top Recruiters</h2>
              <Award size={16} className="text-gray-600" />
            </div>
            <div className="space-y-4">
              {topRecruiters.map((recruiter, index) => (
                <div key={recruiter.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={recruiter.avatar}
                        alt={recruiter.name}
                        className="w-12 h-12 rounded-full"
                      />
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Award size={12} className="text-yellow-900" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{recruiter.name}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-gray-600">
                          {recruiter.activeJobs} active jobs
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600">
                          {recruiter.applicationsReviewed} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-green-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;