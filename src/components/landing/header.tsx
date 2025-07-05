import Link from "next/link";
import { ConnectButton } from "@/components/ConnectButton";

export default function Header() {
	return (
		<header className="py-6 px-4 sm:px-6 md:px-8 bg-white border-b border-gray-100">
			<div className="container max-w-6xl mx-auto flex items-center justify-between">
				{/* Logo on left */}
				<div className="flex items-center space-x-2">
					<div className="text-2xl font-light tracking-wide text-black">Fluxo</div>
				</div>

				{/* Centered navigation */}
				<nav className="hidden md:flex items-center text-gray-600 space-x-8">
					<Link
						href="/chat"
						className="px-4 py-2 hover:text-black transition-colors duration-300 font-medium"
					>
						Chat
					</Link>
					<Link
						href="/configure"
						className="px-4 py-2 hover:text-black transition-colors duration-300 font-medium"
					>
						Tools
					</Link>
				</nav>

				{/* Connect button on right */}
				<ConnectButton />
			</div>
		</header>
	);
}
