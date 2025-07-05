"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { useState } from "react";

export function ConnectButton() {
	const { ready, authenticated, login, logout } = usePrivy();
	const { address, isConnected } = useAccount();
	const [isHovered, setIsHovered] = useState(false);

	const formatAddress = (addr: string) => {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	};

	const disableLogin = !ready || authenticated;

	if (!authenticated) {
		return (
			<button
				disabled={disableLogin}
				onClick={login}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				className={`
					relative overflow-hidden group
					px-6 py-3 rounded-2xl
					font-semibold text-white text-base
					bg-secondary
					hover:from-primary/90 hover:to-secondary/90
					transition-all duration-200 ease-out
					transform hover:scale-[1.02] hover:shadow-xl
					disabled:opacity-50 disabled:cursor-not-allowed
					disabled:hover:scale-100 disabled:hover:shadow-none
					focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
					active:scale-95
					border border-transparent
				`}
			>
				<div className="relative z-10 flex items-center justify-center gap-2">
					<span>Connect Wallet</span>
				</div>

				{/* Animated shimmer effect */}
				<div
					className={`
						absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
						transition-all duration-1000 ease-out
						${isHovered ? "translate-x-full opacity-100" : "-translate-x-full opacity-0"}
					`}
				/>

				{/* Subtle glow effect */}
				<div
					className={`
						absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30
						blur-sm transition-opacity duration-300 ease-out
						${isHovered ? "opacity-100" : "opacity-0"}
					`}
				/>
			</button>
		);
	}

	return (
		<div
			className={`
				relative overflow-hidden group
				px-4 py-3 rounded-2xl
				bg-secondary dark:bg-gray-900
				border border-gray-200 dark:border-gray-800
				shadow-sm hover:shadow-md
				transition-all duration-200 ease-out
				hover:border-gray-300 dark:hover:border-gray-700
				cursor-pointer
			`}
		>
			<div className="flex items-center gap-3">
				{/* Network indicator */}
				<div className="flex items-center gap-2">
					<div className="relative">
						<div className="w-2 h-2 rounded-full bg-green-500" />
						<div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
					</div>
					<div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
				</div>

				{address && (
					<div className="flex items-center gap-2">
						{/* Wallet icon */}
						<div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
							<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
							</svg>
						</div>
						<span className="text-sm font-mono text-gray-900 dark:text-gray-100">
							{formatAddress(address)}
						</span>
					</div>
				)}

				{/* Disconnect section */}
				<div
					onClick={logout}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					className={`
						relative flex items-center gap-2 px-3 py-1 rounded-xl
						font-medium text-gray-700 dark:text-gray-300
						transition-all duration-200 ease-out
						transform hover:scale-105
						${isHovered ? "text-red-600 dark:text-red-400" : ""}
					`}
				>
					<svg
						className={`w-4 h-4 transition-transform duration-200 ${isHovered ? "rotate-12" : ""}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						/>
					</svg>
					<span className="text-sm">Disconnect</span>

					{/* Hover background for disconnect area */}
					<div
						className={`
							absolute inset-0 bg-red-50 dark:bg-red-900/20 rounded-xl
							transition-opacity duration-200 ease-out
							${isHovered ? "opacity-100" : "opacity-0"}
						`}
					/>
				</div>
			</div>
		</div>
	);
}
