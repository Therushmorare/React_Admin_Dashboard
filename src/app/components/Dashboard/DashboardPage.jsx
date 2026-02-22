"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Briefcase, FileText, TrendingUp, TrendingDown, Activity, Clock, CheckCircle, XCircle, AlertTriangle, DollarSign, Eye, Calendar, ArrowUpRight, BarChart3, PieChart, Award, UserPlus } from 'lucide-react';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('week');

  // ====== State ======
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingReviews: 0,
    activeUsers: 0,
    newUsersThisWeek: 0,
    jobsPublished: 0,
    applicationsToday: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [topJobs, setTopJobs] = useState([]);
  const [topRecruiters, setTopRecruiters] = useState([]);
  const [applicationStats, setApplicationStats] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [0,0,0,0,0,0,0]
  });
  const [departmentStats, setDepartmentStats] = useState([]);

  // ====== Fetch data from APIs ======
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, jobsRes, applicantsRes, hrRes] = await Promise.all([
          axios.get('https://jellyfish-app-z83s2.ondigitalocean.app/api/candidate/'),
          axios.get('https://jellyfish-app-z83s2.ondigitalocean.app/api/candidate/allPosts'),
          axios.get('https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/all_applicants'),
          axios.get('https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/allHRMembers')
        ]);

        const users = usersRes.data;
        const jobs = jobsRes.data.jobs || jobsRes.data; // sometimes nested
        const applicants = applicantsRes.data;
        const hrMembers = hrRes.data;

        // ====== Stats calculations ======
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);

        const applicationsToday = applicants.filter(a => {
          const appliedDate = new Date(a.applied_at);
          return appliedDate.toDateString() === today.toDateString();
        }).length;

        const newUsersThisWeek = users.filter(u => {
          if (!u.created_at) return false;
          const userDate = new Date(u.created_at);
          return userDate >= oneWeekAgo && userDate <= today;
        }).length;

        setStats({
          totalUsers: users.length,
          activeJobs: jobs.length,
          totalApplications: applicants.length,
          pendingReviews: applicants.filter(a => a.application_status === 'PENDING').length,
          activeUsers: users.filter(u => u.email).length,
          newUsersThisWeek,
          jobsPublished: jobs.filter(j => j.status === 'SCREENING').length,
          applicationsToday
        });

        // ====== Recent Activities (latest 5) ======
        const activities = [
          ...applicants.slice(-5).map(a => ({
            id: a.application_code,
            type: 'application',
            icon: FileText,
            color: 'blue',
            title: 'New Application Received',
            description: `${a.first_name} ${a.last_name} applied for ${a.job_id}`,
            time: new Date(a.applied_at).toLocaleString(),
            status: 'new'
          })),
          ...users.slice(-5).map(u => ({
            id: u.applicant_id || u.employee_id,
            type: 'user',
            icon: UserPlus,
            color: 'green',
            title: 'New User Registered',
            description: `${u.first_name} ${u.last_name} created an account`,
            time: u.created_at ? new Date(u.created_at).toLocaleString() : 'Just now',
            status: 'success'
          })),
          ...jobs.slice(-5).map(j => ({
            id: j.job_id,
            type: 'job',
            icon: Briefcase,
            color: 'purple',
            title: 'Job Published',
            description: `${j.job_title} posted by ${j.poster_id || 'N/A'}`,
            time: j.created_at ? new Date(j.created_at).toLocaleString() : 'Just now',
            status: 'success'
          }))
        ];
        setRecentActivities(activities);

        // ====== Top Jobs ======
        setTopJobs(jobs.map(j => ({
          id: j.job_id,
          title: j.job_title,
          applications: applicants.filter(a => a.job_id === j.job_id).length,
          views: Math.floor(Math.random() * 300),
          status: j.status.toLowerCase()
        })));

        // ====== Top Recruiters ======
        setTopRecruiters(hrMembers.map(hr => ({
          id: hr.employee_id,
          name: `${hr.first_name} ${hr.last_name}`,
          avatar: `https://ui-avatars.com/api/?name=${hr.first_name}+${hr.last_name}&background=2563eb&color=ffffff`,
          activeJobs: jobs.filter(j => j.poster_id === hr.employee_id).length,
          applicationsReviewed: Math.floor(Math.random() * 200)
        })));

        // ====== Application Stats by Weekday ======
        const counts = [0,0,0,0,0,0,0];
        applicants.forEach(a => {
          const day = new Date(a.applied_at).getDay(); // 0=Sun
          counts[day === 0 ? 6 : day-1] += 1; // shift Sun to end
        });
        setApplicationStats({ labels: applicationStats.labels, data: counts });

        // ====== Department Stats ======
        const deptMap = {};

        // Loop through all jobs
        jobs.forEach(job => {
          const dept = job.department || 'Unknown';
          
          // Count applicants for this job
          const applicantsForJob = applicants.filter(a => a.job_id === job.job_id);
          const count = applicantsForJob.length;

          if (!deptMap[dept]) deptMap[dept] = 0;
          deptMap[dept] += count; // accumulate applicants per department
        });

        // Transform map into array for rendering
        const depts = Object.entries(deptMap).map(([name, count]) => ({
          name,
          count,
          percentage: applicants.length > 0 ? Math.round((count / applicants.length) * 100) : 0,
          color: ['blue','green','purple','yellow','red'][Math.floor(Math.random()*5)]
        }));

      setDepartmentStats(depts);
            } catch (err) {
              console.error('Error fetching dashboard data:', err);
        }//comment nje
    };

    fetchData();
  }, []);

  const getActivityIcon = (activity) => activity.icon;
  const getActivityColor = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  const maxApplications = Math.max(...applicationStats.data);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ====== Header and Time Filter ====== */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your dashboard overview.</p>
          </div>
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

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* ====== Key Metrics Cards ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg"><Users size={24} className="text-blue-600" /></div>
              <span className="flex items-center text-sm font-medium text-green-600"><TrendingUp size={16} className="mr-1" />+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
            <p className="text-sm text-gray-600 mt-1">Total Users</p>
            <p className="text-xs text-gray-500 mt-2">{stats.activeUsers} active</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg"><Briefcase size={24} className="text-green-600" /></div>
              <span className="flex items-center text-sm font-medium text-green-600"><TrendingUp size={16} className="mr-1" />+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.activeJobs}</h3>
            <p className="text-sm text-gray-600 mt-1">Active Jobs</p>
            <p className="text-xs text-gray-500 mt-2">{stats.jobsPublished} published this week</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg"><FileText size={24} className="text-purple-600" /></div>
              <span className="flex items-center text-sm font-medium text-green-600"><TrendingUp size={16} className="mr-1" />+24%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalApplications}</h3>
            <p className="text-sm text-gray-600 mt-1">Total Applications</p>
            <p className="text-xs text-gray-500 mt-2">{stats.applicationsToday} received today</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg"><Clock size={24} className="text-yellow-600" /></div>
              <span className="flex items-center text-sm font-medium text-red-600"><TrendingDown size={16} className="mr-1" />-5%</span>
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