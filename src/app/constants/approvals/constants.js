export const PRIORITY_COLORS = {
  high: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  low: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' }
};

export const FILTER_OPTIONS = ['all', 'high', 'medium', 'low'];

export const API_ENDPOINTS = {
  GET_PENDING_JOBS: 'api',
  APPROVE_JOB: 'api',
  REJECT_JOB: 'api',
  GET_STATS: 'api',
};