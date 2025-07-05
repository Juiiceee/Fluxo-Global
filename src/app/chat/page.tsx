import ChatLayout from '@/components/chat/ChatLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Assistant - Premium Chat Experience',
  description: 'Experience the future of conversational AI with our premium chat interface. Elegant, intuitive, and powerful.',
};

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      <div className="relative min-h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,_rgba(0,0,0,0.1)_0px,_transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_75%,_rgba(0,0,0,0.1)_0px,_transparent_50%)]"></div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 h-screen">
          <ChatLayout />
        </div>
      </div>
    </main>
  );
} 