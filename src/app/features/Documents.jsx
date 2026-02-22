import { useEffect, useState } from "react";
import { X, Search, Filter, Eye, Download, Trash2, FileText, Folder, Archive, } from "lucide-react";
import axios from "axios";

const DocumentsModal = ({ onClose }) => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [categories, setCategories] = useState(["all"]);
  const [stats, setStats] = useState({
    total_documents: 0,
    total_categories: 0,
    total_size: "0 MB",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [searchQuery, filterType, documents]);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await axios.get(
        "https://jellyfish-app-z83s2.ondigitalocean.app/api/admin/allDocuments"
      );

      // Map API response to frontend table format
      const docs = response.data.map((doc) => ({
        id: doc.qualification_id,
        name: doc.type,
        category: doc.type,
        size: "-", // you can calculate size if needed
        uploaded_by: doc.applicant_id,
        file_url: doc.document,
      }));

      setDocuments(docs);
      setFilteredDocs(docs);

      const uniqueCategories = ["all", ...new Set(docs.map((d) => d.category))];
      setCategories(uniqueCategories);

      setStats({
        total_documents: docs.length,
        total_categories: uniqueCategories.length - 1,
        total_size: "-", // API doesn’t return size
      });
    } catch (err) {
      setError("Failed to load documents.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterDocuments = () => {
    let filtered = [...documents];

    if (searchQuery) {
      filtered = filtered.filter((doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((doc) => doc.category === filterType);
    }

    setFilteredDocs(filtered);
  };

  const handleView = (doc) => {
    window.open(doc.file_url, "_blank");
  };

  const handleDownload = (doc) => {
    const link = document.createElement("a");
    link.href = doc.file_url;
    link.download = doc.name;
    link.click();
  };

  const handleDelete = async (doc) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    try {
      await axios.delete(`/api/hr/documents/${doc.id}`);
      fetchDocuments();
    } catch {
      alert("Failed to delete document.");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const LoadingState = () => (
    <div className="text-center py-12 text-gray-500">Loading documents...</div>
  );

  const ErrorState = ({ message, onRetry }) => (
    <div className="text-center py-12">
      <p className="text-red-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-green-700 text-white rounded-lg"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-white bg-opacity-50"
        onClick={onClose}
      />
      <div className="absolute inset-4 md:inset-8 bg-white rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage and view all your documents
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Search & Filter */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-4 focus:ring-green-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-4 focus:ring-green-100"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchDocuments} />
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Total Documents */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-green-700 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Documents</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stats.total_documents}
                      </p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FileText className="w-6 h-6 text-green-700" />
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Categories</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stats.total_categories}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Folder className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Total Size */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Size</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stats.total_size}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Archive className="w-6 h-6 text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                        Document Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                        Size
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                        Uploaded By
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {doc.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {doc.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {doc.size}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {doc.uploaded_by}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleView(doc)}
                            className="p-2 hover:text-green-700"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-2 hover:text-blue-700"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(doc)}
                            className="p-2 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsModal;