import { usePublicClient, useWalletClient } from "wagmi";
import { agentBuilder } from "../agent/agentBuilder";
import { useCallback } from "react";

export function useAgent() {
	const { data: walletClient } = useWalletClient();
	const publicClient = usePublicClient();
	console.log(walletClient, publicClient);
	const getAgent = useCallback(() => {
		if (!walletClient || !publicClient) {
			return null;
		}

		return agentBuilder(walletClient, publicClient);
	}, [walletClient, publicClient]);

	return {
		agent: getAgent(),
		isReady: !!walletClient && !!publicClient
	};
}
