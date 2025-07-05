"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/components/utils";

interface ChatInputProps {
	onSendMessage: (message: string) => void;
	isLoading?: boolean;
	className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading = false, className }) => {
	const [inputValue, setInputValue] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue.trim() && !isLoading) {
			onSendMessage(inputValue.trim());
			setInputValue("");

			// Reset textarea height
			if (textareaRef.current) {
				textareaRef.current.style.height = "auto";
			}
		}
	};

	const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInputValue(e.target.value);

		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 56)}px`;
		}
	};

	return (
		<div
			className={cn(
				"border-t border-gray-200/50 bg-gradient-to-r from-white via-gray-50 to-white",
				className
			)}
		>
			<div className="max-w-4xl mx-auto px-6 py-6">
				<form onSubmit={handleSubmit} className="relative">
					<div
						className={cn(
							"relative bg-gradient-to-r from-white to-gray-50 border-2 rounded-3xl transition-all duration-300 shadow-lg backdrop-blur-sm",
							isFocused
								? "border-gray-300 shadow-xl shadow-gray-200/50"
								: "border-gray-200 hover:border-gray-250"
						)}
					>
						{/* Input area */}
						<div className="flex items-end px-4 py-3 space-x-4">
							<div className="flex-1 relative">
								<Textarea
									ref={textareaRef}
									value={inputValue}
									onChange={handleInputChange}
									onKeyDown={handleKeyPress}
									onFocus={() => setIsFocused(true)}
									onBlur={() => setIsFocused(false)}
									placeholder="Type your message..."
									className="min-h-[36px] max-h-[56px] resize-none border-0 bg-transparent focus:ring-0 focus:outline-none placeholder:text-gray-400 text-gray-900 px-0 py-1 transition-all duration-200 placeholder:transition-colors placeholder:duration-300 focus:placeholder:text-gray-300"
									rows={1}
									disabled={isLoading}
								/>
							</div>

							{/* Premium Send Button */}
							<Button
								type="submit"
								disabled={!inputValue.trim() || isLoading}
								className={cn(
									"relative px-5 py-2 h-10 rounded-2xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
									"bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800",
									"text-white shadow-lg hover:shadow-xl active:scale-95",
									"disabled:hover:from-gray-900 disabled:hover:via-gray-800 disabled:hover:to-gray-900 disabled:active:scale-100"
								)}
							>
								{isLoading ? (
									<div className="flex items-center space-x-1.5">
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
										<span className="text-xs font-medium">Sending</span>
									</div>
								) : (
									<div className="flex items-center space-x-1.5">
										<svg
											className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-0.5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
											/>
										</svg>
										<span className="text-xs font-medium">Send</span>
									</div>
								)}
							</Button>
						</div>

						{/* Shimmer effect */}
						<div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-gray-100/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
					</div>
				</form>

				{/* Minimal Footer */}
				<div className="mt-3 flex items-center justify-between">
					<div className="flex items-center space-x-6">
						<div className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
							<kbd className="px-1.5 py-0.5 bg-gray-50/80 text-gray-600 rounded text-[10px] font-mono border border-gray-200/50 shadow-sm">
								↵
							</kbd>
							<span className="font-medium">send</span>
						</div>
						<div className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
							<kbd className="px-1.5 py-0.5 bg-gray-50/80 text-gray-600 rounded text-[10px] font-mono border border-gray-200/50 shadow-sm">
								⇧ ↵
							</kbd>
							<span className="font-medium">new line</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatInput;
