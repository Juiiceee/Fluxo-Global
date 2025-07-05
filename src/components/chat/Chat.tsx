"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import ChatInput from "./ChatInput";
import { cn } from "@/components/utils";
import { Message } from "@/types/chat";
import Image from "next/image";
import { ConnectButton } from "../ConnectButton";
import { Attachment, ChatMessage } from "@/lib/types";
import { useDataStream } from "../data-stream-provider";
import { useChat } from "@ai-sdk/react";
import { fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
import { DefaultChatTransport } from "ai";
import { toast } from "sonner";
import { ChatSDKError } from "@/lib/errors";
import { useSearchParams } from "next/navigation";
import { useAutoResume } from "@/hooks/use-auto-resume";
import { useQueryClient } from "@tanstack/react-query";
import { PostRequestBody } from "@/app/(chat)/api/chat/schema";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";

interface ChatLayoutProps {
	className?: string;
	id: string;
	initialMessages: ChatMessage[];
	initialChatModel: string;
	isReadonly: boolean;
	autoResume: boolean;
	address: string;
}

export function Chat({
	id,
	initialMessages,
	initialChatModel,
	isReadonly,
	autoResume,
	className,
	address,
}: ChatLayoutProps) {
	const queryClient = useQueryClient();
	const { setDataStream } = useDataStream();
	const { ready, user } = usePrivy();
	const searchParams = useSearchParams();
	const query = searchParams.get("query");
	const [hasAppendedQuery, setHasAppendedQuery] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const { messages, setMessages, sendMessage, status, stop, regenerate, resumeStream } =
		useChat<ChatMessage>({
			id,
			messages: initialMessages,
			experimental_throttle: 100,
			generateId: generateUUID,
			transport: new DefaultChatTransport({
				api: "/api/chat",
				fetch: fetchWithErrorHandlers,
				prepareSendMessagesRequest({ messages, id, body }) {
					return {
						body: {
							id,
							message: messages.at(-1)! as any,
							selectedChatModel: initialChatModel as "chat-model" | "chat-model-reasoning",
							userAddress: address,
							...body,
						} satisfies PostRequestBody,
					};
				},
			}),
			onData: (dataPart) => {
				setDataStream((ds) => (ds ? [...ds, dataPart] : []));
			},
			onFinish: () => {
				queryClient.invalidateQueries({ queryKey: ["chat-history"] });
			},
			onError: (error) => {
				if (error instanceof ChatSDKError) {
					toast.error(error.message);
				}
			},
		});

	useEffect(() => {
		if (query && !hasAppendedQuery) {
			sendMessage({
				role: "user" as const,
				parts: [{ type: "text", text: query }],
			});

			setHasAppendedQuery(true);
			window.history.replaceState({}, "", `/chat/${id}`);
		}
	}, [query, sendMessage, hasAppendedQuery, id]);

	const [attachments, setAttachments] = useState<Array<Attachment>>([]);

	useAutoResume({
		autoResume,
		initialMessages,
		resumeStream,
		setMessages,
	});

	const handleSendMessage = async (message: string, attachments?: Attachment[]) => {
		if (!message.trim()) return;

		await sendMessage({
			role: "user" as const,
			parts: [{ type: "text", text: message }],
		});

		setAttachments([]);
	};

	// Convert ChatMessage to Message for ChatArea
	const convertedMessages: Message[] = messages
		.filter((msg) => msg.role !== "system")
		.map((msg) => ({
			id: msg.id,
			content: msg.parts?.find((part) => part.type === "text")?.text || "",
			role: msg.role as "user" | "assistant",
			timestamp: new Date(),
		}));

	if (!ready || !user?.wallet?.address) return <div>Loading...</div>;

	return (
		<div className={cn("h-screen flex flex-col overflow-hidden", className)}>
			{/* Premium Header */}
			<header className="relative bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200/50 backdrop-blur-sm z-30">
				<div className="absolute inset-0 bg-gradient-to-r from-black/[0.02] via-transparent to-black/[0.02]"></div>
				<div className="relative px-6 flex items-center justify-between">
					{/* Left: Logo and Brand */}
					<div className="flex items-center space-x-4">
						{/* Hamburger menu button */}

						<Link href="/">
							<Image
								src="/borderFluxo.png"
								alt="Fluxo"
								width={50}
								height={50}
								className="rounded-lg"
							/>
						</Link>
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className={`
								p-2 rounded-lg transition-all duration-200 ease-out
								hover:bg-gray-100 active:scale-95
								group flex items-center justify-center
								${sidebarOpen ? "text-gray-600 hover:text-gray-800" : "text-gray-500 hover:text-gray-700"}
							`}
							aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
						>
							<svg
								className="w-5 h-5 transition-transform duration-200"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>

					{/* Right: Action Button and Status */}
					<div className="flex items-center space-x-4">
						<ConnectButton height="30px" />
					</div>
				</div>
			</header>

			{/* Main Content Area */}
			<div className="flex-1 flex overflow-hidden">
				{/* Sidebar */}
				<div
					className={cn(
						"transform transition-all duration-300 ease-in-out bg-white border-r border-gray-200/50 flex-shrink-0 overflow-hidden",
						sidebarOpen ? "w-64 translate-x-0 opacity-100" : "w-0 -translate-x-64 opacity-0"
					)}
				>
					<div className="w-64 h-full">
						<Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
					</div>
				</div>

				{/* Chat Content */}
				<div className="flex-1 flex flex-col min-h-0 overflow-hidden transition-all duration-300 ease-in-out">
					{/* Chat Header with New Chat button */}
					<div className="mt-4 ml-4 flex-shrink-0">
						<div className="flex items-center justify-start">
							<button className="px-4 py-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95">
								New Chat
							</button>
						</div>
					</div>

					{/* Chat Content */}
					<div className="flex-1 flex flex-col min-h-0">
						<ChatArea messages={convertedMessages} isLoading={false} />
						<ChatInput onSendMessage={handleSendMessage} isLoading={false} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Chat;
