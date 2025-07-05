"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createUserAction } from "@/lib/actions/user";

interface ConnectButtonProps {
	className?: string;
	width?: string;
	height?: string;
	showDisconnect?: boolean;
}

export function ConnectButton({
	className,
	width = "auto",
	height = "auto",
	showDisconnect = true,
}: ConnectButtonProps) {
	const { ready, authenticated, login, logout } = usePrivy();
	const { address } = useAccount();
	const [isHovered, setIsHovered] = useState(false);
	const [previousAuthState, setPreviousAuthState] = useState<boolean | null>(null);

	// Calculate responsive sizes based on height
	const getResponsiveSizes = () => {
		if (height === "auto") {
			return {
				fontSize: "text-base",
				padding: "px-6 py-3",
				iconSize: "w-6 h-6",
				iconTextSize: "w-3 h-3",
				dotSize: "w-2 h-2",
				disconnectIconSize: "w-4 h-4",
				tooltipOffset: "top-full mt-2",
			};
		}

		const heightValue = parseInt(height.replace(/[^\d]/g, ""));

		if (heightValue <= 35) {
			return {
				fontSize: "text-xs",
				padding: "px-3 py-1",
				iconSize: "w-4 h-4",
				iconTextSize: "w-2 h-2",
				dotSize: "w-1.5 h-1.5",
				disconnectIconSize: "w-3 h-3",
				tooltipOffset: "top-full mt-1",
			};
		} else if (heightValue <= 45) {
			return {
				fontSize: "text-sm",
				padding: "px-4 py-2",
				iconSize: "w-5 h-5",
				iconTextSize: "w-2.5 h-2.5",
				dotSize: "w-1.5 h-1.5",
				disconnectIconSize: "w-3.5 h-3.5",
				tooltipOffset: "top-full mt-1",
			};
		} else {
			return {
				fontSize: "text-base",
				padding: "px-6 py-3",
				iconSize: "w-6 h-6",
				iconTextSize: "w-3 h-3",
				dotSize: "w-2 h-2",
				disconnectIconSize: "w-4 h-4",
				tooltipOffset: "top-full mt-2",
			};
		}
	};

	const sizes = getResponsiveSizes();

	// Style object for custom dimensions
	const customStyle = {
		width: width,
		height: height,
		minHeight: height === "auto" ? undefined : height,
	};

	// Handle authentication state changes
	useEffect(() => {
		if (previousAuthState === null) {
			// First render, just set the current state without showing toast
			setPreviousAuthState(authenticated);
			return;
		}

		if (!previousAuthState && authenticated) {
			// User just connected
			toast.success("You are connected to the network", {
				duration: 3000,
			});
		} else if (previousAuthState && !authenticated) {
			// User just disconnected (but not through our logout function)
			toast.success("You are disconnected from the network", {
				duration: 3000,
			});
		}

		setPreviousAuthState(authenticated);
	}, [authenticated, previousAuthState]);

	const formatAddress = (addr: string) => {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	};

	if (authenticated && !isAuthenticated) {
		toast.success("You are connected to the network", {
			duration: 3000,
		});
		setIsAuthenticated(true);
		
		// Create user if they don't exist
		const createUserIfNeeded = async () => {
			if (address) {
				try {
					const result = await createUserAction(
						address,
						`User ${address.slice(0, 6)}...${address.slice(-4)}`
					);
					
					if (!result.success) {
						console.error('Failed to create user:', result.error);
					}
				} catch (error) {
					console.error('Error creating user:', error);
				}
			}
		};
		
		createUserIfNeeded();
	}

	const handleLogout = async () => {
		await logout();
		// Toast will be handled by useEffect when authentication changes
	};

	const copyAddress = async () => {
		if (address) {
			try {
				await navigator.clipboard.writeText(address);
				toast.success("Address copied to clipboard!", {
					duration: 3000,
				});
			} catch (err) {
				console.error("Failed to copy address:", err);
				toast.error("Failed to copy address", {
					description: "Please try again",
					duration: 3000,
				});
			}
		}
	};

	const disableLogin = !ready || authenticated;

	if (!authenticated) {
		return (
			<button
				disabled={disableLogin}
				onClick={login}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				style={customStyle}
				className={`
					relative overflow-hidden group
					${sizes.padding} rounded-2xl
					font-semibold text-white ${sizes.fontSize}
					bg-secondary
					hover:from-primary/90 hover:to-secondary/90
					transition-all duration-200 ease-out
					transform hover:scale-[1.02] hover:shadow-xl
					disabled:opacity-50 disabled:cursor-not-allowed
					disabled:hover:scale-100 disabled:hover:shadow-none
					focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
					active:scale-95
					border border-transparent
					flex items-center justify-center
					${className}
				`}
			>
				<div className="relative z-10 flex items-center justify-center gap-2">
					<span className="whitespace-nowrap">Connect Wallet</span>
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
			style={customStyle}
			className={`
				relative group
				${sizes.padding} rounded-2xl
				bg-secondary dark:bg-gray-900
				border border-gray-200 dark:border-gray-800
				shadow-sm hover:shadow-md
				transition-all duration-200 ease-out
				hover:border-gray-300 dark:hover:border-gray-700
				cursor-pointer
				flex items-center
				${className}
			`}
		>
			<div className="flex items-center gap-2 w-full min-w-0">
				{/* Network indicator */}
				<div className="flex items-center gap-1.5 flex-shrink-0">
					<div className="relative">
						<div className={`${sizes.dotSize} rounded-full bg-green-500`} />
						<div
							className={`absolute inset-0 ${sizes.dotSize} rounded-full bg-green-500 animate-ping opacity-75`}
						/>
					</div>
					<div className="h-3 w-px bg-gray-300 dark:bg-gray-700" />
				</div>

				{address && (
					<div className="flex items-center gap-1.5 flex-1 min-w-0">
						{/* Wallet icon */}
						<div
							className={`${sizes.iconSize} rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0`}
						>
							<svg
								className={`${sizes.iconTextSize} text-white`}
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
							</svg>
						</div>
						<div
							onClick={copyAddress}
							className="relative group/address cursor-pointer min-w-0 flex-1"
						>
							<span
								className={`${sizes.fontSize} font-mono text-gray-900 dark:text-gray-100 hover:text-primary transition-colors duration-200 truncate block`}
							>
								{formatAddress(address)}
							</span>
							{/* Tooltip amélioré - positionné en bas */}
							<div
								className={`absolute ${sizes.tooltipOffset} left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap transition-opacity duration-200 pointer-events-none opacity-0 group-hover/address:opacity-100 z-[100]`}
							>
								Click to copy full address
							</div>
						</div>
					</div>
				)}

				{/* Disconnect section */}
				{showDisconnect && (
					<div
						onClick={handleLogout}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
						className={`
							relative flex items-center gap-1 px-2 py-1 rounded-xl
							font-medium text-gray-700 dark:text-gray-300
							transition-all duration-200 ease-out
							transform hover:scale-105 flex-shrink-0 group/disconnect
							${isHovered ? "text-red-600 dark:text-red-400" : ""}
						`}
					>
						<svg
							className={`${sizes.disconnectIconSize} transition-transform duration-200 ${isHovered ? "rotate-12" : ""}`}
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
						<span className={`${sizes.fontSize} whitespace-nowrap`}>Disconnect</span>

						{/* Tooltip pour disconnect - positionné en bas */}
						<div
							className={`absolute ${sizes.tooltipOffset} left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap transition-opacity duration-200 pointer-events-none opacity-0 group-hover/disconnect:opacity-100 z-[100]`}
						>
							Disconnect wallet
						</div>

						{/* Hover background for disconnect area */}
						<div
							className={`
								absolute inset-0 bg-red-50 dark:bg-red-900/20 rounded-xl
								transition-opacity duration-200 ease-out
								${isHovered ? "opacity-100" : "opacity-0"}
							`}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
