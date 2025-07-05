"use client";

import { ChatMessage } from "@/lib/types";
import { Chat } from "./Chat";
import { usePrivy } from "@privy-io/react-auth";

interface ChatLayoutProps {
	className?: string;
	id: string;
	initialMessages: ChatMessage[];
	initialChatModel: string;
	isReadonly: boolean;
	autoResume: boolean;
}
//Basically, we're forced to wrap the chat inside this "intermediary" because we have to give
// the address as a property (due to the useChat hook fns not getting updated after rerenders).
// Since the parent component is a server component, we can't use useEffect to update the address.
// So, we have to wrap the chat inside this "intermediary" component.
export function ChatWrapper({
	id,
	initialMessages,
	initialChatModel,
	isReadonly,
	autoResume,
	className,
}: ChatLayoutProps) {
	const { ready, user } = usePrivy();
	if (!ready || !user?.wallet?.address) return <div>Loading...</div>;
	return (
		<Chat
			key={id}
			id={id}
			address={user.wallet.address}
			initialMessages={initialMessages}
			initialChatModel={initialChatModel}
			isReadonly={isReadonly}
			autoResume={autoResume}
			className={className}
		/>
	);
}
