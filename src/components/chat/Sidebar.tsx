'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/utils';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {

  const recentChats = [
    { id: '1', title: 'React Best Practices', time: '2 hours ago' },
    { id: '2', title: 'API Integration Help', time: '1 day ago' },
    { id: '3', title: 'UI Design Discussion', time: '2 days ago' },
  ];

  return (
    <div className={cn('h-full bg-gradient-to-b from-white via-gray-50 to-white border-r border-gray-200/50 flex flex-col', className)}>
      <nav className="flex-1 p-4 space-y-1">
        {/* Recent Chats */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Chats</h3>
          <div className="space-y-1">
            {recentChats.map((chat) => (
              <button
                key={chat.id}
                className="w-full p-3 rounded-lg text-left hover:bg-gray-100 transition-all duration-200 group"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-gray-800">
                      {chat.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {chat.time}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200/50">
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-800">Premium User</p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600">Active now</span>
            </div>
          </div>
          <button className="p-1 rounded-md hover:bg-gray-200 transition-colors duration-200">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 