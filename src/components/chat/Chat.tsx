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
import { useArtifactSelector } from "@/hooks/use-artifact";
import { useAutoResume } from "@/hooks/use-auto-resume";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { PostRequestBody } from "@/app/(chat)/api/chat/schema";
import { usePrivy } from "@privy-io/react-auth";

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
	const [sidebarOpen, setSidebarOpen] = useState(false);
	
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

	const searchParams = useSearchParams();
	const query = searchParams.get("query");

	const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

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
		<div className={cn("h-screen flex flex-col", className)}>
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
						></button>
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
				<div
					className={cn(
						"fixed inset-y-0 left-0 z-20 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
						sidebarOpen ? "translate-x-0" : "-translate-x-full"
					)}
				>
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
					<ChatArea messages={convertedMessages} isLoading={false} />
					<ChatInput onSendMessage={handleSendMessage} isLoading={false} />
				</div>
			</div>
		</div>
	);
}

export default Chat;
