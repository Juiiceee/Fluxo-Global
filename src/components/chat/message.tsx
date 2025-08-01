"use client";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useState } from "react";
import equal from "fast-deep-equal";
import { cn } from "@/lib/utils";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatMessage } from "@/lib/types";
import { useDataStream } from "@/components/data-stream-provider";
import { PencilEditIcon, SparklesIcon } from "@/components/icons";
import { Markdown } from "../MarkDown";
import { GenericToolConfirmation } from "./ToolConfirm";
import { useAgent } from "@/hooks/useAgent";

// Type narrowing is handled by TypeScript's control flow analysis
// The AI SDK provides proper discriminated unions for tool calls

const PurePreviewMessage = ({
	chatId,
	message,
	isLoading,
	setMessages,
	regenerate,
	requiresScrollPadding,
	addToolResult,
}: {
	chatId: string;
	message: ChatMessage;
	isLoading: boolean;
	setMessages: UseChatHelpers<ChatMessage>["setMessages"];
	regenerate: UseChatHelpers<ChatMessage>["regenerate"];
	requiresScrollPadding: boolean;
	addToolResult: (args: { toolCallId: string; output: string }) => void;
}) => {
	const [mode, setMode] = useState<"view">("view");
	const { agent, isReady } = useAgent();
	const attachmentsFromMessage = message.parts.filter((part) => part.type === "file");

	useDataStream();

	if (!isReady) {
		return <ThinkingMessage />;
	}

	if (!agent) {
		return <ThinkingMessage />;
	}

	return (
		<AnimatePresence>
			<motion.div
				data-testid={`message-${message.role}`}
				className="w-full mx-auto max-w-3xl px-4 group/message"
				initial={{ y: 5, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				data-role={message.role}
			>
				<div
					className={cn("flex gap-4 w-full", {
						// Messages utilisateur: alignés à droite avec avatar à droite
						"ml-auto max-w-2xl w-fit flex-row-reverse": message.role === "user",
						// Messages assistant: alignés à gauche avec avatar à gauche
						"": message.role === "assistant",
					})}
				>
					{/* Avatar pour l'assistant (à gauche) */}
					{message.role === "assistant" && (
						<div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
							<div className="translate-y-px">
								<SparklesIcon size={14} />
							</div>
						</div>
					)}

					{/* Avatar pour l'utilisateur (à droite) */}
					{message.role === "user" && (
						<div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-primary">
							<div className="translate-y-px">
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="text-black"
								>
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
									<circle cx="12" cy="7" r="4" />
								</svg>
							</div>
						</div>
					)}

					<div
						className={cn("flex flex-col gap-4 w-full text-black", {
							"min-h-96": message.role === "assistant" && requiresScrollPadding,
						})}
					>
						{message.parts?.map((part, index) => {
							const { type } = part;
							const key = `message-${message.id}-part-${index}`;

							if (type === "text") {
								if (mode === "view") {
									return (
										<div key={key} className="flex flex-row gap-2 items-start">
											<div
												data-testid="message-content"
												className={cn(
													"flex flex-col gap-4",
													{
														"bg-black/22 border border-black/10 text-black px-3 py-2 rounded-xl":
															message.role === "user",
													},
													{
														"bg-black/90 text-white px-3 py-2 rounded-xl":
															message.role === "assistant",
													}
												)}
											>
												<Markdown>{part.text}</Markdown>
											</div>
										</div>
									);
								}
							}

							// Handle any tool confirmation (generic for all tools)
							if (type.startsWith("tool-")) {
								const toolName = type.replace("tool-", "");

								// Check if this is a tool call
								if ("toolCallId" in part && "input" in part) {
									// Find the action from the agent's actions by name
									const action = agent.actions.find((a) => a.name === toolName);

									if (action) {
										return (
											<div key={part.toolCallId} className="skeleton">
												<GenericToolConfirmation
													agent={agent}
													toolCallId={part.toolCallId}
													toolName={toolName}
													args={part.input}
													action={action}
													addToolResult={addToolResult}
												/>
											</div>
										);
									}
								}
							}
						})}
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export const PreviewMessage = memo(PurePreviewMessage, (prevProps, nextProps) => {
	if (prevProps.isLoading !== nextProps.isLoading) return false;
	if (prevProps.message.id !== nextProps.message.id) return false;
	if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding) return false;
	if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

	return false;
});

export const ThinkingMessage = () => {
	const role = "assistant";

	return (
		<motion.div
			data-testid="message-assistant-loading"
			className="w-full mx-auto max-w-3xl px-4 group/message min-h-96"
			initial={{ y: 5, opacity: 0 }}
			animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
			data-role={role}
		>
			<div
				className={cn(
					"flex  gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
					{
						"group-data-[role=user]/message:bg-muted": true,
					}
				)}
			>
				<div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
					<SparklesIcon size={14} />
				</div>

				<div className="flex flex-col gap-2 w-full">
					<div className="flex flex-col gap-4 text-muted-foreground">Hmm...</div>
				</div>
			</div>
		</motion.div>
	);
};
