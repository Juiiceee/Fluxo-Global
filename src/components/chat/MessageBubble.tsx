import React from "react";
import { cn } from "@/components/utils";
import { Message } from "@/types/chat";
import Image from "next/image";

interface MessageBubbleProps {
	message: Message;
	className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, className }) => {
	const isUser = message.role === "user";

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

	return (
		<div className={cn("flex w-full group", isUser ? "justify-end" : "justify-start", className)}>
			<div
				className={cn(
					"flex max-w-[85%] space-x-4",
					isUser ? "flex-row-reverse space-x-reverse" : ""
				)}
			>
				{/* Premium Avatar */}
				<div className="relative flex-shrink-0 mt-1">
					<div
						className={cn(
							"w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl",
							isUser
								? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
								: "bg-gradient-to-br from-gray-200 to-gray-300"
						)}
					>
						{isUser ? (
							<div className="w-6 h-6 flex items-center justify-center">
								<Image src="/you.png" alt="Fluxo" width={20} height={20} className="rounded-sm" />
							</div>
						) : (
							<div className="w-6 h-6 flex items-center justify-center">
								<Image
									src="/assistant.png"
									alt="Fluxo"
									width={20}
									height={20}
									className="rounded-sm"
								/>
							</div>
						)}
					</div>
				</div>

				{/* Message Content */}
				<div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
					{/* Enhanced Role Badge */}
					<div
						className={cn(
							"mb-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300",
							isUser
								? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg"
								: "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200 shadow-sm"
						)}
					>
						{isUser ? "You" : "Fluxo"}
					</div>

					{/* Premium Message Bubble */}
					<div
						className={cn(
							"relative px-6 py-4 rounded-3xl transition-all duration-300 group-hover:shadow-xl",
							isUser
								? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg rounded-tr-lg"
								: "bg-gradient-to-br from-white to-gray-50 text-gray-900 border border-gray-200 shadow-lg rounded-tl-lg backdrop-blur-sm"
						)}
					>
						{/* Message text */}
						<div
							className={cn(
								"text-sm leading-relaxed whitespace-pre-wrap",
								isUser ? "text-gray-100" : "text-gray-800"
							)}
						>
							{message.content}
						</div>

						{/* Subtle shine effect */}
						<div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
					</div>

					{/* Enhanced Timestamp */}
					<div
						className={cn(
							"mt-2 px-2 py-1 text-xs font-medium transition-all duration-300",
							isUser
								? "text-gray-500 group-hover:text-gray-400"
								: "text-gray-500 group-hover:text-gray-600"
						)}
					>
						<span className="opacity-75 group-hover:opacity-100 transition-opacity duration-300">
							{formatTime(message.timestamp)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MessageBubble;
