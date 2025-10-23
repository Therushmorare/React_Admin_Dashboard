"use client"

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import StatsCards from '../../components/Recruitment/StatsCard';
import FilterSearch from '../../components/Recruitment/FilterSearch';
import JobCard from '../../components/Recruitment/JobCard';
import EmptyState from '../../features/Approvals/EmptyState';
import JobDetailModal from '../../features/Approvals/DetailsModal';
import { ApproveModal, RejectModal } from '../../features/Approvals/ConfirmationModals';
import {mockJobs} from '@/app/data/mockData'


const JobApprovalsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actioningJobId, setActioningJobId] = useState(null);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 12,
    rejected: 3,
    avgApprovalTime: '2.5 days'
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    setPendingJobs(mockJobs);
    updateStats(mockJobs);
  };

  const updateStats = (jobs) => {
    setStats(prev => ({
      ...prev,
      pending: jobs.filter(job => job.status === 'pending').length
    }));
  };

  const handleApprove = (jobId) => {
    setActioningJobId(jobId);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    //API call:
    
    const updatedJobs = pendingJobs.map(job => 
      job.id === actioningJobId ? { ...job, status: 'approved' } : job
    );
    setPendingJobs(updatedJobs);
    updateStats(updatedJobs);
    
    setShowApproveModal(false);
    setActioningJobId(null);
    setSelectedJob(null);
  };

  const handleReject = (jobId) => {
    setActioningJobId(jobId);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (rejectionReason.trim()) {
      //SPI call:
      
      const updatedJobs = pendingJobs.map(job => 
        job.id === actioningJobId ? { ...job, status: 'rejected', rejectionReason } : job
      );
      setPendingJobs(updatedJobs);
      updateStats(updatedJobs);
      
      setShowRejectModal(false);
      setActioningJobId(null);
      setRejectionReason('');
      setSelectedJob(null);
    }
  };

  const cancelApprove = () => {
    setShowApproveModal(false);
    setActioningJobId(null);
  };

  const cancelReject = () => {
    setShowRejectModal(false);
    setActioningJobId(null);
    setRejectionReason('');
  };

  const filteredJobs = pendingJobs
    .filter(job => job.status === 'pending')
    .filter(job => {
      if (selectedFilter === 'all') return true;
      return job.priority === selectedFilter;
    })
    .filter(job => {
      if (!searchQuery) return true;
      return job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
             job.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Post Approvals</h1>
              <p className="text-gray-600 mt-1">Review and approve pending job postings</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>Avg. approval time: {stats.avgApprovalTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Filters and Search */}
        <FilterSearch
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Job Cards Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onViewDetails={setSelectedJob}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Approve Confirmation Modal */}
      <ApproveModal
        show={showApproveModal}
        onConfirm={confirmApprove}
        onCancel={cancelApprove}
      />

      {/* Reject Modal */}
      <RejectModal
        show={showRejectModal}
        onConfirm={confirmReject}
        onCancel={cancelReject}
        reason={rejectionReason}
        setReason={setRejectionReason}
      />
    </div>
  );
};

export default JobApprovalsPage;