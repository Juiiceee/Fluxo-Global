"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import ChatInput from "./ChatInput";
import { cn } from "@/components/utils";
import { Message } from "@/types/chat";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "../ConnectButton";

interface ChatLayoutProps {
	className?: string;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ className }) => {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			content:
				"Welcome to your premium AI assistant experience. I'm here to help you with thoughtful conversations, creative tasks, and intelligent analysis. How may I assist you today?",
			role: "assistant",
			timestamp: new Date(Date.now() - 300000), // 5 minutes ago
		},
		{
			id: "2",
			content: "Bonjour ! Comment puis-je vous aider avec votre développement React ?",
			role: "user",
			timestamp: new Date(Date.now() - 250000),
		},
		{
			id: "3",
			content:
				"Excellent ! Je serais ravi de vous aider avec React. Voici quelques domaines dans lesquels je peux vous assister :\n\n• **Architecture des composants** - Structuration et organisation de votre code\n• **Gestion d'état** - Redux, Zustand, Context API\n• **Performance** - Optimisations et bonnes pratiques\n• **Testing** - Tests unitaires et d'intégration\n• **TypeScript** - Intégration et typage avancé\n\nQuelle est votre question spécifique ?",
			role: "assistant",
			timestamp: new Date(Date.now() - 200000),
		},
		{
			id: "4",
			content: "J'aimerais savoir comment optimiser les performances de mon application React.",
			role: "user",
			timestamp: new Date(Date.now() - 150000),
		},
		{
			id: "5",
			content:
				"Excellente question ! L'optimisation des performances React est cruciale pour une bonne expérience utilisateur. Voici les principales stratégies :\n\n**1. Mémorisation des composants :**\n```jsx\nconst MemoizedComponent = React.memo(MyComponent);\n```\n\n**2. useMemo et useCallback :**\n```jsx\nconst expensiveValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);\nconst memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);\n```\n\n**3. Code splitting :**\n```jsx\nconst LazyComponent = lazy(() => import('./Component'));\n```\n\n**4. Virtualisation des listes :**\nUtilisez react-window pour les grandes listes.\n\nSouhaitez-vous que je détaille une de ces techniques ?",
			role: "assistant",
			timestamp: new Date(Date.now() - 100000),
		},
		{
			id: "6",
			content: "Pouvez-vous me donner plus de détails sur la virtualisation des listes ?",
			role: "user",
			timestamp: new Date(Date.now() - 50000),
		},
		{
			id: "7",
			content:
				"Bien sûr ! La virtualisation des listes est une technique puissante pour gérer de grandes quantités de données.\n\n**Problème :** Afficher 10,000 éléments DOM cause des problèmes de performance.\n\n**Solution :** N'afficher que les éléments visibles + quelques éléments tampons.\n\n**Avec react-window :**\n```jsx\nimport { FixedSizeList as List } from 'react-window';\n\nconst Row = ({ index, style }) => (\n  <div style={style}>\n    Item {index}\n  </div>\n);\n\nconst MyList = () => (\n  <List\n    height={600}\n    itemCount={10000}\n    itemSize={50}\n  >\n    {Row}\n  </List>\n);\n```\n\n**Avantages :**\n• Performance constante même avec 100k+ items\n• Utilisation mémoire optimisée\n• Scroll fluide\n\nC'est particulièrement utile pour les tableaux, feeds, ou listes d'éléments !",
			role: "assistant",
			timestamp: new Date(Date.now() - 10000),
		},
	]);

	const [isLoading, setIsLoading] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const handleSendMessage = async (content: string) => {
		if (!content.trim()) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			content: content.trim(),
			role: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setIsLoading(true);

		try {
			// Simulate API response with more sophisticated placeholder
			setTimeout(() => {
				const assistantMessage: Message = {
					id: (Date.now() + 1).toString(),
					content: `I appreciate your message: "${content}". \n\nThis premium chat interface is designed to provide you with an exceptional conversational experience. While I'm currently in demonstration mode, the full API integration will enable me to provide intelligent, contextual responses tailored to your specific needs.\n\nIs there anything specific you'd like to explore or discuss?`,
					role: "assistant",
					timestamp: new Date(),
				};

				setMessages((prev) => [...prev, assistantMessage]);
				setIsLoading(false);
			}, 2000);
		} catch (error) {
			console.error("Error sending message:", error);
			setIsLoading(false);

			const errorMessage: Message = {
				id: (Date.now() + 2).toString(),
				content:
					"I apologize, but I encountered an issue processing your request. Please try again, and I'll be happy to assist you.",
				role: "assistant",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		}
	};

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

					<ChatArea messages={messages} isLoading={isLoading} />
					<ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
				</div>
			</div>
		</div>
	);
};

export default ChatLayout;
