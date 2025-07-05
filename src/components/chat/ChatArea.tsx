"use client";

import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { cn } from "@/components/utils";
import { Message } from "@/types/chat";

interface ChatAreaProps {
	messages: Message[];
	isLoading?: boolean;
	className?: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading = false, className }) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		<div className={cn("flex-1 flex flex-col relative min-h-0", className)}>
			{/* Subtle top gradient */}
			<div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none z-10"></div>

			{/* Scrollable container */}
			<div
				ref={scrollContainerRef}
				className="flex-1 overflow-y-auto px-6 py-8"
				style={{ height: "100%" }}
			>
				<div className="max-w-4xl mx-auto">
					{messages.length === 0 ? (
						<div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
							<div className="relative mb-8">
								<div className="w-20 h-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl flex items-center justify-center shadow-2xl">
									<div className="w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-2xl flex items-center justify-center">
										<svg
											className="w-6 h-6 text-gray-900"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
											/>
										</svg>
									</div>
								</div>
								<div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
									<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
									</svg>
								</div>
							</div>

							<div className="space-y-4 max-w-md">
								<h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
									Welcome to Premium AI
								</h2>
								<p className="text-gray-600 leading-relaxed">
									Experience intelligent conversations with our advanced AI assistant. Ask
									questions, explore ideas, or engage in creative discussions.
								</p>

								<div className="flex flex-wrap gap-2 justify-center pt-4">
									{[
										"💡 Creative writing",
										"🔍 Research & analysis",
										"📊 Data insights",
										"🎯 Strategic planning",
									].map((tag, index) => (
										<span
											key={index}
											className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:shadow-md transition-shadow duration-200"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-8">
							{messages.map((message, index) => (
								<div
									key={message.id}
									className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
									style={{ animationDelay: `${index * 100}ms` }}
								>
									<MessageBubble message={message} />
								</div>
							))}
						</div>
					)}

					{/* Enhanced Loading indicator */}
					{isLoading && (
						<div className="flex justify-start mt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
							<div className="flex items-start space-x-4 max-w-[85%]">
								<div className="relative">
									<div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center shadow-sm">
										<div className="w-6 h-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
											<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
												<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
											</svg>
										</div>
									</div>
									<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
								</div>

								<div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 px-6 py-4 rounded-3xl rounded-tl-lg shadow-lg backdrop-blur-sm">
									<div className="flex items-center space-x-4">
										<div className="flex space-x-1">
											<div className="w-2 h-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full animate-bounce"></div>
											<div
												className="w-2 h-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full animate-bounce"
												style={{ animationDelay: "0.2s" }}
											></div>
											<div
												className="w-2 h-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full animate-bounce"
												style={{ animationDelay: "0.4s" }}
											></div>
										</div>
										<span className="text-sm font-medium text-gray-700">Thinking...</span>
									</div>
								</div>
							</div>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Subtle bottom gradient */}
			<div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50/50 to-transparent pointer-events-none z-10"></div>
		</div>
	);
};

export default ChatArea;
