"use client"

import React from 'react';
import { CheckCircle } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
      <p className="text-gray-600">There are no pending job approvals at the moment.</p>
    </div>
  );
};

export default EmptyState;