"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../lib/wagmi";
import { mainnet } from "viem/chains";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<PrivyProvider
			appId={process.env.NEXT_PUBLIC_PRIVY_ID || ""}
			config={{
				// Customize Privy's appearance in your app
				appearance: {
					theme: "dark",
					accentColor: "#676FFF",
					logo: "https://your-logo-url.com/logo.svg",
				},
				// Create embedded wallets for users who don't have a wallet
				embeddedWallets: {
					createOnLogin: "users-without-wallets",
				},
				loginMethods: ["wallet", "email", "google", "twitter", "apple"],
				defaultChain: mainnet,
			}}
		>
			<QueryClientProvider client={queryClient}>
				<WagmiProvider config={config}>{children}</WagmiProvider>
			</QueryClientProvider>
		</PrivyProvider>
	);
}
