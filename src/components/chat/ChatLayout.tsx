'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import ChatInput from './ChatInput';
import { cn } from '@/components/utils';
import { Message } from '@/types/chat';
import Image from 'next/image';
import { ConnectButton } from '../ConnectButton';

interface ChatLayoutProps {
  className?: string;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Welcome to your premium AI assistant experience. I'm here to help you with thoughtful conversations, creative tasks, and intelligent analysis. How may I assist you today?",
      role: 'assistant',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate API response with more sophisticated placeholder
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `I appreciate your message: "${content}". \n\nThis premium chat interface is designed to provide you with an exceptional conversational experience. While I'm currently in demonstration mode, the full API integration will enable me to provide intelligent, contextual responses tailored to your specific needs.\n\nIs there anything specific you'd like to explore or discuss?`,
          role: 'assistant',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: 'I apologize, but I encountered an issue processing your request. Please try again, and I\'ll be happy to assist you.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className={cn('h-screen flex flex-col', className)}>
      {/* Premium Header */}
      <header className="relative bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200/50 backdrop-blur-sm z-30">
        <div className="absolute inset-0 bg-gradient-to-r from-black/[0.02] via-transparent to-black/[0.02]"></div>
        <div className="relative px-6 py-4 flex items-center justify-between">
          {/* Left: Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Image src="/borderFluxo.png" alt="Fluxo" width={50} height={50} />
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
            >
            </button>
          </div>

          {/* Right: Action Button and Status */}
          <div className="flex items-center space-x-4">
            <ConnectButton />
            
            <button className="px-4 py-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95">
              New Chat
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex relative">
        {/* Sidebar */}
        <div className={cn(
          'fixed inset-y-0 left-0 z-20 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Chat Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <ChatArea messages={messages} isLoading={isLoading} />
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout; 