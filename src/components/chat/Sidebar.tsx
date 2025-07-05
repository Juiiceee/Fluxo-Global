"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/utils";
import { ConnectButton } from "@/components/ConnectButton";

interface SidebarProps {
	className?: string;
	isOpen?: boolean;
	onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className, isOpen, onToggle }) => {
	const recentChats = [
		{ id: "1", title: "React Best Practices", time: "2 hours ago" },
		{ id: "2", title: "API Integration Help", time: "1 day ago" },
		{ id: "3", title: "UI Design Discussion", time: "2 days ago" },
		{ id: "4", title: "Database Optimization", time: "3 days ago" },
		{ id: "5", title: "Next.js Performance", time: "4 days ago" },
		{ id: "6", title: "TypeScript Configuration", time: "5 days ago" },
		{ id: "7", title: "CSS Grid Layout", time: "1 week ago" },
		{ id: "8", title: "Authentication Setup", time: "1 week ago" },
		{ id: "9", title: "State Management", time: "2 weeks ago" },
		{ id: "10", title: "Component Architecture", time: "2 weeks ago" },
		{ id: "11", title: "Testing Strategies", time: "3 weeks ago" },
		{ id: "12", title: "Deployment Guide", time: "3 weeks ago" },
	];

	return (
		<div
			className={cn(
				"h-full bg-gradient-to-b from-white via-gray-50 to-white border-r border-gray-200/50 flex flex-col overflow-hidden",
				className
			)}
		>
			{/* Header section with toggle button */}
			<div className="p-4 border-b border-gray-200/50 flex-shrink-0">
				<div className="flex items-center justify-between">
					<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
						Recent Chats
					</h3>

					{/* Toggle Button */}
				</div>
			</div>

			{/* Scrollable chats section */}
			<div className="flex-1 overflow-y-auto">
				<nav className="p-4 space-y-1">
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
										<p className="text-xs text-gray-500 mt-1">{chat.time}</p>
									</div>
								</div>
							</button>
						))}
					</div>
				</nav>
			</div>

			{/* User Profile */}
			<div className="p-4 border-t border-gray-200/50 flex-shrink-0">
				<div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer group">
					<ConnectButton showDisconnect={false} />
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
