"use client"

import React, { useState } from 'react';
import { Users, Briefcase, UserCheck, ClipboardCheck, TrendingUp, Calendar, Eye, MessageSquare } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RecruitmentDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('month');

  // Key Metrics Data
  const metrics = [
    {
      title: 'Active Job Posts',
      value: '24',
      change: '+3 this week',
      trend: 'up',
      icon: Briefcase,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Applications',
      value: '1,247',
      change: '+127 this week',
      trend: 'up',
      icon: Users,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Screened',
      value: '456',
      change: '+45 this week',
      trend: 'up',
      icon: ClipboardCheck,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Interviewed',
      value: '187',
      change: '+23 this week',
      trend: 'up',
      icon: MessageSquare,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Onboarded',
      value: '34',
      change: '+8 this month',
      trend: 'up',
      icon: UserCheck,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Time to Hire',
      value: '18 days',
      change: '-2 days',
      trend: 'down',
      icon: TrendingUp,
      color: 'bg-teal-500',
      lightColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    }
  ];

  // Applications Over Time Data
  const applicationsData = [
    { month: 'Jan', applications: 145, hired: 12 },
    { month: 'Feb', applications: 198, hired: 15 },
    { month: 'Mar', applications: 223, hired: 18 },
    { month: 'Apr', applications: 267, hired: 22 },
    { month: 'May', applications: 301, hired: 28 },
    { month: 'Jun', applications: 287, hired: 25 }
  ];

  // Recruitment Funnel Data
  const funnelData = [
    { stage: 'Applied', count: 1247, percentage: 100 },
    { stage: 'Screened', count: 456, percentage: 37 },
    { stage: 'Interview', count: 187, percentage: 15 },
    { stage: 'Offer', count: 89, percentage: 7 },
    { stage: 'Hired', count: 34, percentage: 3 }
  ];

  // Department Distribution
  const departmentData = [
    { name: 'Engineering', value: 420, color: '#3b82f6' },
    { name: 'Sales', value: 285, color: '#8b5cf6' },
    { name: 'Marketing', value: 198, color: '#ec4899' },
    { name: 'Operations', value: 167, color: '#f59e0b' },
    { name: 'HR', value: 89, color: '#10b981' },
    { name: 'Finance', value: 88, color: '#06b6d4' }
  ];

  // Source Performance
  const sourceData = [
    { source: 'LinkedIn', applications: 487, hired: 15 },
    { source: 'Indeed', applications: 356, hired: 12 },
    { source: 'Referral', applications: 198, hired: 5 },
    { source: 'Company Site', applications: 134, hired: 2 },
    { source: 'Other', applications: 72, hired: 0 }
  ];

  // Top Performing Jobs
  const topJobs = [
    { title: 'Senior Software Engineer', applications: 234, views: 1247, status: 'Active' },
    { title: 'Product Manager', applications: 189, views: 987, status: 'Active' },
    { title: 'Marketing Specialist', applications: 156, views: 845, status: 'Active' },
    { title: 'Sales Representative', applications: 142, views: 723, status: 'Active' },
    { title: 'UX Designer', applications: 128, views: 654, status: 'Active' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recruitment Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your hiring metrics and performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
              <Calendar size={16} />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</h3>
                    <p className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-blue-600'}`}>
                      {metric.change}
                    </p>
                  </div>
                  <div className={`${metric.lightColor} p-3 rounded-lg`}>
                    <Icon className={metric.textColor} size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applications Over Time */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications & Hires Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={applicationsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} name="Applications" />
                <Line type="monotone" dataKey="hired" stroke="#10b981" strokeWidth={2} name="Hired" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Department Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recruitment Funnel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recruitment Funnel</h3>
            <div className="space-y-3">
              {funnelData.map((stage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700">{stage.stage}</span>
                    <span className="text-gray-600">{stage.count} ({stage.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-700 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source Performance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Source</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="source" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="applications" fill="#3b82f6" name="Applications" radius={[8, 8, 0, 0]} />
                <Bar dataKey="hired" fill="#10b981" name="Hired" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Jobs Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Job Posts</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Job Title</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Applications</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Views</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Conversion Rate</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {topJobs.map((job, index) => {
                  const conversionRate = ((job.applications / job.views) * 100).toFixed(1);
                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Briefcase size={16} className="text-green-700" />
                          </div>
                          <span className="font-medium text-gray-900">{job.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{job.applications}</td>
                      <td className="py-3 px-4 text-gray-700 flex items-center space-x-1">
                        <Eye size={14} className="text-gray-400" />
                        <span>{job.views}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-700">{conversionRate}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Avg. Applications/Job</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">52</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600">Interview Success Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">47.6%</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
            <p className="text-sm text-gray-600">Offer Acceptance Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">82.1%</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Cost per Hire</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">$3,247</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentDashboard;