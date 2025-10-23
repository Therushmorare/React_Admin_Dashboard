"use client"

import React, { useState, useEffect } from 'react';
import { Search, Book, MessageCircle, Mail, Phone, FileText, Video, Users, ChevronRight, ExternalLink, Send, HelpCircle, X } from 'lucide-react';

const HelpSupport = ({ onClose, embedded = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: ''
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const helpCategories = [
    { key: 'all', label: 'All Topics', icon: Book },
    { key: 'candidates', label: 'Candidate Management', icon: Users },
    { key: 'account', label: 'Account Settings', icon: FileText },
    { key: 'permissions', label: 'Permissions & Access', icon: FileText },
    { key: 'notifications', label: 'Notifications', icon: MessageCircle },
    { key: 'technical', label: 'Technical Issues', icon: FileText }
  ];

  const helpArticles = [
    {
      id: 1,
      title: 'How to review and manage candidate applications',
      category: 'candidates',
      views: 1247,
      helpful: 89,
      lastUpdated: '2024-09-15',
      description: 'Learn how to efficiently review candidate applications and move them through your hiring pipeline.'
    },
    {
      id: 2,
      title: 'Setting up two-factor authentication',
      category: 'account',
      views: 892,
      helpful: 76,
      lastUpdated: '2024-09-12',
      description: 'Secure your account with two-factor authentication using your mobile device.'
    },
    {
      id: 3,
      title: 'Understanding role permissions and access levels',
      category: 'permissions',
      views: 654,
      helpful: 82,
      lastUpdated: '2024-09-10',
      description: 'Learn about different permission levels and how they affect your access to system features.'
    },
    {
      id: 4,
      title: 'Customizing your notification preferences',
      category: 'notifications',
      views: 543,
      helpful: 91,
      lastUpdated: '2024-09-08',
      description: 'Configure when and how you receive notifications about candidate updates and system activities.'
    },
    {
      id: 5,
      title: 'Troubleshooting login issues',
      category: 'technical',
      views: 423,
      helpful: 67,
      lastUpdated: '2024-09-05',
      description: 'Common solutions for login problems and account access issues.'
    },
    {
      id: 6,
      title: 'Scheduling and managing interviews',
      category: 'candidates',
      views: 789,
      helpful: 88,
      lastUpdated: '2024-09-03',
      description: 'Step-by-step guide to scheduling interviews and managing your interview calendar.'
    }
  ];

  const quickActions = [
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: MessageCircle,
      action: () => setShowContactForm(true),
      color: 'green'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: Video,
      action: () => console.log('Open video tutorials'),
      color: 'blue'
    },
    {
      title: 'User Guide',
      description: 'Download complete user manual',
      icon: FileText,
      action: () => console.log('Download user guide'),
      color: 'purple'
    },
  ];

  const contactInfo = [
    {
      method: 'Email',
      value: 'support@binarywizards.com',
      icon: Mail,
      description: 'Response within 24 hours'
    },
    {
      method: 'Phone',
      value: '+27 11 123 4567',
      icon: Phone,
      description: 'Mon-Fri, 8:00 AM - 6:00 PM SAST'
    }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = () => {
    console.log('Submitting contact form:', contactForm);
    setShowContactForm(false);
    setContactForm({ subject: '', category: 'general', priority: 'medium', message: '' });
    // Add success message
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <>
      {/* Backdrop */}
      {!embedded && (
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
            isVisible ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={handleClose}
        />
      )}
      
      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border-2 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-200"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={contactForm.category}
                    onChange={(e) => setContactForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-200"
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical Issue</option>
                    <option value="account">Account Problem</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={contactForm.priority}
                    onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-200"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-200 resize-none"
                  placeholder="Please describe your issue or question in detail..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowContactForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleContactSubmit}
                disabled={!contactForm.subject || !contactForm.message}
                className="flex items-center space-x-2 px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Slide Panel */}
      <div className={embedded 
      ? "w-full h-full bg-white" 
      : `fixed top-0 right-0 h-full w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
      isVisible ? 'translate-x-0' : 'translate-x-full'
    }`}>
        
        {/* Scrollable Content */}
        <div className="h-full overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 sticky top-0 bg-white pb-4 border-b border-gray-100">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-3">Help & Support</h1>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                  Find answers to common questions, access documentation, or contact our support team for assistance.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <HelpCircle className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                    <p className="text-sm text-gray-600">Get help quickly with these common actions</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={action.action}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200 text-left group"
                      >
                        <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                          <IconComponent className={`w-5 h-5 text-${action.color}-600`} />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1 text-sm">{action.title}</h3>
                        <p className="text-xs text-gray-600">{action.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search and Filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Search className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Search Help Articles</h2>
                    <p className="text-sm text-gray-600">Find answers to your questions</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search help articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {helpCategories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <button
                            key={category.key}
                            onClick={() => setSelectedCategory(category.key)}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                              selectedCategory === category.key
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <IconComponent size={16} />
                            <span>{category.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Articles */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Book className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Help Articles</h2>
                    <p className="text-sm text-gray-600">Browse our knowledge base</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-2">{article.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{article.views} views</span>
                            <span>{article.helpful}% helpful</span>
                            <span>Updated {new Date(article.lastUpdated).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <ChevronRight className="w-4 h-4 text-gray-400 ml-4 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>

                {filteredArticles.length === 0 && (
                  <div className="text-center py-8">
                    <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                    <p className="text-sm text-gray-600">
                      Try adjusting your search terms or selecting a different category.
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Contact Support</h2>
                    <p className="text-sm text-gray-600">Get in touch with our support team</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contactInfo.map((contact, index) => {
                    const IconComponent = contact.icon;
                    return (
                      <div key={index} className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <IconComponent className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1 text-sm">{contact.method}</h3>
                        <p className="text-sm font-medium text-green-600 mb-2">{contact.value}</p>
                        <p className="text-xs text-gray-500">{contact.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpSupport;