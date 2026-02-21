"use client"

import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, RefreshCw, Clock, User, Activity, FileText, 
  AlertTriangle, XCircle, ChevronDown, CheckCircle 
} from 'lucide-react';

// ====== Dropdown options ======
const logTypes = [
  { id: 'all', label: 'All' },
  { id: 'system', label: 'System' },
  { id: 'user_management', label: 'User Management' },
];

const severityLevels = [
  { id: 'all', label: 'All' },
  { id: 'info', label: 'Info' },
  { id: 'success', label: 'Success' },
  { id: 'warning', label: 'Warning' },
  { id: 'error', label: 'Error' },
];

const dateRanges = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'all', label: 'All Time' },
];

// ====== Helper Icon & Color Mappers ======
const getTypeIcon = (type) => User;
const getSeverityIcon = (severity) => {
  switch(severity) {
    case 'success': return CheckCircle;
    case 'warning': return AlertTriangle;
    case 'error': return XCircle;
    default: return Activity;
  }
};
const getSeverityColor = (severity) => {
  switch(severity) {
    case 'success': return 'bg-green-100 text-green-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'error': return 'bg-red-100 text-red-800';
    default: return 'bg-blue-100 text-blue-800';
  }
};
const getTypeColor = (type) => {
  switch(type) {
    case 'system': return 'bg-blue-100 text-blue-800';
    case 'user_management': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const LogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [showFilters, setShowFilters] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // =========================
  // FETCH LOGS
  // =========================
  useEffect(() => { fetchLogs(); }, []);
  const fetchLogs = async () => {
    try {
      setLoading(true); setError(null);
      const response = await fetch(
        "https://jellyfish-app-z83s2.ondigitalocean.app/api/admin/logs",
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) throw new Error("Failed to fetch logs");
      const data = await response.json();

      const transformedLogs = data.map((log, index) => ({
        id: index + 1,
        timestamp: log.created_at,
        type: mapType(log.applicant_type),
        severity: mapSeverity(log.action),
        action: extractAction(log.action),
        user: log.applicant_type || "System",
        details: log.action,
        ip: "N/A",
        resource: extractResource(log.action),
      }));

      setLogs(transformedLogs);
    } catch (err) {
      console.error(err);
      setError("Unable to load logs.");
    } finally { setLoading(false); }
  };

  // =========================
  // HELPERS
  // =========================
  const mapType = (applicantType) => {
    if (!applicantType) return "system";
    if (applicantType.toLowerCase().includes("admin")) return "user_management";
    return "system";
  };
  const mapSeverity = (action) => {
    const lower = action.toLowerCase();
    if (lower.includes("failed") || lower.includes("error")) return "error";
    if (lower.includes("added") || lower.includes("approved")) return "success";
    if (lower.includes("warning")) return "warning";
    return "info";
  };
  const extractAction = (action) => action.split(":")[0];
  const extractResource = (action) => action.split(":")[1] || "N/A";

  // =========================
  // FILTERING
  // =========================
  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || log.type === selectedType;
    const matchesSeverity = selectedSeverity === "all" || log.severity === selectedSeverity;
    return matchesSearch && matchesType && matchesSeverity;
  });

  // =========================
  // STATS
  // =========================
  const getStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayLogs = logs.filter(log => log.timestamp.startsWith(today));
    return {
      total: logs.length,
      today: todayLogs.length,
      errors: logs.filter(log => log.severity === "error").length,
      warnings: logs.filter(log => log.severity === "warning").length,
    };
  };
  const stats = getStats();

  // =========================
  // EXPORT CSV
  // =========================
  const handleExport = () => {
    const csvContent = [
      ["Timestamp","Type","Severity","Action","User","Details","IP Address","Resource"].join(","),
      ...filteredLogs.map(log => [log.timestamp, log.type, log.severity, log.action, log.user, log.details, log.ip, log.resource].join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `system_logs_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    return isToday ? `Today at ${time}` : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + ` at ${time}`;
  };

  // =========================
  // LOADING + ERROR UI
  // =========================
  if (loading) return <div className="flex justify-center py-10 text-gray-500">Loading logs...</div>;
  if (error) return <div className="flex justify-center py-10 text-red-500">{error}</div>;

  // =========================
  // JSX RENDER
  // =========================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header & Actions */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
            <p className="text-gray-600 mt-1">Monitor system activities and user actions</p>
          </div>
          <div className="flex space-x-3">
            <button onClick={handleExport} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download size={16} /><span>Export</span>
            </button>
            <button onClick={() => window.location.reload()} className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800">
              <RefreshCw size={16} /><span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4 flex justify-between items-center">
            <div><p className="text-sm text-blue-600 font-medium">Total Logs</p><p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p></div>
            <Activity size={24} className="text-blue-600" />
          </div>
          <div className="bg-green-50 rounded-lg p-4 flex justify-between items-center">
            <div><p className="text-sm text-green-600 font-medium">Today</p><p className="text-2xl font-bold text-green-900 mt-1">{stats.today}</p></div>
            <Clock size={24} className="text-green-600" />
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 flex justify-between items-center">
            <div><p className="text-sm text-yellow-600 font-medium">Warnings</p><p className="text-2xl font-bold text-yellow-900 mt-1">{stats.warnings}</p></div>
            <AlertTriangle size={24} className="text-yellow-600" />
          </div>
          <div className="bg-red-50 rounded-lg p-4 flex justify-between items-center">
            <div><p className="text-sm text-red-600 font-medium">Errors</p><p className="text-2xl font-bold text-red-900 mt-1">{stats.errors}</p></div>
            <XCircle size={24} className="text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search logs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={16} /><span>Filters</span><ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Log Type</label>
                <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100">
                  {logTypes.map(type => <option key={type.id} value={type.id}>{type.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                <select value={selectedSeverity} onChange={e => setSelectedSeverity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100">
                  {severityLevels.map(level => <option key={level.id} value={level.id}>{level.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100">
                  {dateRanges.map(range => <option key={range.id} value={range.id}>{range.label}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Activity size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Logs Found</h3>
              <p className="text-gray-600">{searchQuery || selectedType !== 'all' || selectedSeverity !== 'all' ? 'Try adjusting your search or filter criteria' : 'No system logs have been recorded yet'}</p>
            </div>
          )}
          {filteredLogs.map(log => {
            const TypeIcon = getTypeIcon(log.type);
            const SeverityIcon = getSeverityIcon(log.severity);
            return (
              <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors flex items-start justify-between">
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
                      <div className="flex items-center"><Clock size={12} className="mr-1" />{formatTimestamp(log.timestamp)}</div>
                      <div className="flex items-center"><User size={12} className="mr-1" />{log.user}</div>
                      <div className="flex items-center"><Activity size={12} className="mr-1" />{log.ip}</div>
                      <div className="flex items-center"><FileText size={12} className="mr-1" />{log.resource}</div>
                    </div>
                  </div>
                  <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium capitalize ${getSeverityColor(log.severity)}`}>
                    {log.severity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination info */}
        {filteredLogs.length > 0 && <div className="mt-4 text-center text-sm text-gray-600">Showing {filteredLogs.length} of {logs.length} logs</div>}
      </div>
    </div>
  );
};

export default LogsPage;