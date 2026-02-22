"use client"

import React from 'react';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  const getTabStyles = (isActive, color) => {
    if (!isActive) return 'bg-gray-50 border-2 border-transparent hover:bg-gray-100';
    
    const colorMap = {
      red: 'bg-red-50 border-2 border-red-500',
      blue: 'bg-blue-50 border-2 border-blue-500',
      green: 'bg-green-50 border-2 border-green-500',
      purple: 'bg-purple-50 border-2 border-purple-500'
    };
    return colorMap[color] || 'bg-gray-50 border-2 border-gray-500';
  };
  
  const getIconStyles = (isActive, color) => {
    if (!isActive) return 'bg-white text-gray-600';
    
    const colorMap = {
      red: 'bg-red-100 text-red-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };
  
  const getLabelStyles = (isActive, color) => {
    if (!isActive) return 'text-gray-700';
    
    const colorMap = {
      red: 'text-red-900',
      blue: 'text-blue-900',
      green: 'text-green-900',
      purple: 'text-purple-900'
    };
    return colorMap[color] || 'text-gray-900';
  };
  
  const getCountStyles = (isActive, color) => {
    if (!isActive) return 'text-gray-500';
    
    const colorMap = {
      red: 'text-red-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600'
    };
    return colorMap[color] || 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-2 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center justify-between p-4 rounded-lg transition-all ${getTabStyles(isActive, tab.color)}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getIconStyles(isActive, tab.color)}`}>
                  <Icon size={20} />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${getLabelStyles(isActive, tab.color)}`}>
                    {tab.label}
                  </p>
                  <p className={`text-xs ${getCountStyles(isActive, tab.color)}`}>
                    {tab.count} users
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;