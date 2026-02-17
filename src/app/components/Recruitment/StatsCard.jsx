"use client"

import React from 'react';
import { Clock, CheckCircle, XCircle, Briefcase } from 'lucide-react';

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pending Approval</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
          </div>
          <Clock size={32} className="text-yellow-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Approved This Month</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.approved}</p>
          </div>
          <CheckCircle size={32} className="text-green-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Rejected This Month</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.rejected}</p>
          </div>
          <XCircle size={32} className="text-red-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Jobs</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.active}</p>
          </div>
          <Briefcase size={32} className="text-blue-500" />
        </div>
      </div>
    </div>
  );
};

export default StatsCards;