import ChatLayout, { Chat } from "@/components/chat/Chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
	title: "AI Assistant - Premium Chat Experience",
	description:
		"Experience the future of conversational AI with our premium chat interface. Elegant, intuitive, and powerful.",
};

export default async function Page() {
	const id = generateUUID();

	const cookieStore = await cookies();
	const modelIdFromCookie = cookieStore.get("chat-model");

	if (!modelIdFromCookie) {
		return (
			<>
				<Chat
					key={id}
					id={id}
					initialMessages={[]}
					initialChatModel={DEFAULT_CHAT_MODEL}
					isReadonly={false}
					autoResume={false}
				/>
				<DataStreamHandler />
			</>
		);
	}

	return (
		<>
			<Chat
				key={id}
				id={id}
				initialMessages={[]}
				initialChatModel={modelIdFromCookie.value}
				isReadonly={false}
				autoResume={false}
			/>
			<DataStreamHandler />
		</>
	);
}
