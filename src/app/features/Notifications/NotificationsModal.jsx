"use client"

import React, { useState, useEffect } from 'react';
import { 
  X, Check, Trash2, Bell, BellOff, CheckCheck, Clock, 
  Briefcase, FileText, Calendar, AlertCircle, CheckCircle 
} from 'lucide-react';
import axios from 'axios';

const NotificationsModal = ({ onClose }) => {

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  //Fetch applicants from API
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          "https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/all_applicants",
          {
            headers: {
              "Accept": "application/json",
              // If you use JWT add:
              // Authorization: `Bearer ${token}`
            }
          }
        );

        const applicants = response.data;

        //Convert applicants into notifications
        const formattedNotifications = applicants.map((applicant, index) => ({
          id: applicant.application_code || index,
          type: 'application',
          icon: Briefcase,
          title: 'New Job Application',
          message: `${applicant.first_name} ${applicant.last_name} applied for a job`,
          time: new Date(applicant.applied_at).toLocaleString(),
          isRead: false,
          priority: 'medium'
        }));

        setNotifications(formattedNotifications);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-yellow-100 text-yellow-600';
      case 'low': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getIconColor = (type) => {
    switch(type) {
      case 'application': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Bell className="text-green-700" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Filter Tabs (UNCHANGED DESIGN) */}
        <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === 'all' 
                  ? 'bg-green-700 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === 'unread' 
                  ? 'bg-green-700 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === 'read' 
                  ? 'bg-green-700 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Read ({notifications.length - unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {loading ? (
            <div className="flex justify-center py-10 text-gray-500">
              Loading notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <BellOff size={48} className="mb-3" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      notification.isRead 
                        ? 'bg-white border-gray-200' 
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    {!notification.isRead && (
                      <div className="absolute top-4 right-4">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                    )}

                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getIconColor(notification.type)}`}>
                        <IconComponent size={20} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={12} className="mr-1" />
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-200 font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotificationsModal;