"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Download, Eye, Trash2, Filter, Search, Loader, FolderOpen, Calendar, User, Upload, AlertCircle, X } from 'lucide-react';
import { mockDocuments, mockCategories, mockStats, filterDocumentsByCategory, searchDocuments, paginateDocuments } from '../utils/mockDocsData';

//API|| ';ink';

const LoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <div className="text-center">
      <Loader className="animate-spin mx-auto mb-4 text-green-700" size={32} />
      <p className="text-gray-600">Loading documents...</p>
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex justify-center items-center h-64">
    <div className="text-center">
      <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
      <p className="text-gray-900 font-medium mb-2">Error Loading Documents</p>
      <p className="text-gray-600 text-sm mb-4">{message}</p>
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

const DocumentRow = React.memo(({ doc, onView, onDownload, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <FileText className="text-green-700 flex-shrink-0" size={20} />
          <span className="text-sm font-medium text-gray-900 truncate max-w-xs" title={doc.name}>
            {doc.name}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {doc.category}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{doc.size}</td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <User size={14} className="text-gray-400" />
          <span className="text-sm text-gray-600 truncate max-w-xs">{doc.uploaded_by}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Calendar size={14} className="text-gray-400" />
          <span className="text-sm text-gray-600">{doc.uploaded_date}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end space-x-2">
          <button 
            onClick={() => onView(doc.id)}
            className="p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
            title="View document"
          >
            <Eye size={18} />
          </button>
          <button 
            onClick={() => onDownload(doc.id)}
            className="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="Download document"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={() => onDelete(doc.id)}
            className="p-2 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Delete document"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
});

DocumentRow.displayName = 'DocumentRow';

const DocumentsModal = ({ onClose }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [categories, setCategories] = useState(['all']);
  const [stats, setStats] = useState({
    total_documents: 0,
    total_categories: 0,
    total_size: '0 MB'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total: 0
  });

  // Load mock data function
  const loadMockData = useCallback(() => {
    let filteredDocs = [...mockDocuments];
    
    if (filterType !== 'all') {
      filteredDocs = filterDocumentsByCategory(filteredDocs, filterType);
    }

    if (searchQuery) {
      filteredDocs = searchDocuments(filteredDocs, searchQuery);
    }
    
    // Paginateion
    const paginatedData = paginateDocuments(filteredDocs, pagination.page, pagination.page_size);
    
    setDocuments(paginatedData.documents);
    setCategories(['all', ...mockCategories]);
    setStats({
      ...mockStats,
      total_documents: paginatedData.total
    });
    setPagination(prev => ({
      ...prev,
      total: paginatedData.total
    }));
  }, [filterType, searchQuery, pagination.page, pagination.page_size]);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    //for demo 
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data
      loadMockData();
      
      /*
      const params = new URLSearchParams({
        page: pagination.page,
        page_size: pagination.page_size,
        ...(searchQuery && { search: searchQuery }),
        ...(filterType !== 'all' && { category: filterType })
      });

      const response = await fetch(`${API_BASE_URL}/documents?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setDocuments(data.documents || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0
      }));
      setCategories(['all', ...(data.categories || [])]);
      setStats(data.stats || stats);
      */
      
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.message || 'Failed to load documents');
      loadMockData();
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.page_size, searchQuery, filterType, loadMockData]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }));
      } else {
        fetchDocuments();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, filterType]);

  const handleView = async (docId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${docId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Error viewing document:', err);
      alert('Failed to view document');
    }
  };

  const handleDownload = async (docId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${docId}/download`, {
        method: 'GET'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document_${docId}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Error downloading document:', err);
      alert('Failed to download document');
    }
  };

  const handleDelete = async (docId) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${docId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        fetchDocuments();
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Failed to delete document');
    }
  };

  const handleUpload = () => {
    console.log('Upload document');
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-white bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="absolute inset-4 md:inset-8 bg-white rounded-lg shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
            <p className="text-sm text-gray-600 mt-1">Manage and view all your documents</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-4 focus:ring-green-100"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleUpload}
                className="px-6 py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
              >
                <Upload size={18} />
                Upload Document
              </button>
            </div>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchDocuments} />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-green-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Documents</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_documents}</p>
                    </div>
                    <FileText className="text-green-700" size={32} />
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Categories</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_categories}</p>
                    </div>
                    <FolderOpen className="text-blue-500" size={32} />
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Size</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_size}</p>
                    </div>
                    <FileText className="text-purple-500" size={32} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Document Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Uploaded By
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {documents.length > 0 ? (
                        documents.map((doc) => (
                          <DocumentRow
                            key={doc.id}
                            doc={doc}
                            onView={handleView}
                            onDownload={handleDownload}
                            onDelete={handleDelete}
                          />
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center">
                            <FileText className="mx-auto mb-3 text-gray-400" size={48} />
                            <p className="text-gray-600 font-medium">No documents found</p>
                            <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filter</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {pagination.total > pagination.page_size && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {((pagination.page - 1) * pagination.page_size) + 1} to {Math.min(pagination.page * pagination.page_size, pagination.total)} of {pagination.total} documents
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page * pagination.page_size >= pagination.total}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsModal;