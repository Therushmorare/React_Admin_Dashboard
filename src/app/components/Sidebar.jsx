"use client"

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';


const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/pages/dashboard' },
    { id: 'users', label: 'Users', href: '/pages/users' },
    { id: 'requests', label: 'Requests', href: '/pages/requests' },
    { id: 'logs', label: 'Logs', href: '/pages/logs' },
  ];

  const handleItemClick = (href) => {
    router.push(href);
  };

  return (
    <div className="w-48 h-screen bg-white text-black flex flex-col fixed top-0 left-0 shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)]">
      {/* Logo*/}
      <div className="p-6 border-b border-gray-600">
        <img src="https://www.bma.gov.za/wp-content/uploads/2022/04/BMA-Logo-Approved-3.png" alt="Logo" className="w-full max-w-28 ml-2 top-0 h-auto object-contain" />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="flex flex-col space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick( item.href)}
                  className={`w-full flex items-center justify-between p-2 rounded-md transition-all duration-200 border-none cursor-pointer text-black text-sm ${
                    isActive 
                      ? 'bg-green-100 text-green-700 font-medium' 
                      : 'hover:bg-green-100 hover:text-green-700'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{item.label}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;