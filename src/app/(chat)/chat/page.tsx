import ChatLayout from "@/components/chat/ChatLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "AI Assistant - Premium Chat Experience",
	description:
		"Experience the future of conversational AI with our premium chat interface. Elegant, intuitive, and powerful.",
};

export default function ChatPage() {
	return <ChatLayout />;
}
