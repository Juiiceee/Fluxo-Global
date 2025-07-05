import { createPublicClient, createWalletClient, http, PublicClient, WalletClient } from "viem";
import { EvmAgentKit } from "./core";
import { Config, Plugin } from "./types";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";
import TokenPlugin from "./plugins/plugin-token";

export const usedPlugins: Plugin[] = [TokenPlugin];

const agentMiddleware = (agent: EvmAgentKit): EvmAgentKit => {
	for (const plugin of usedPlugins) {
		agent = agent.use(plugin);
	}
	return agent;
};

export const agentBuilder = (wallet: WalletClient, rpc: PublicClient, config?: Config) => {
	return agentMiddleware(new EvmAgentKit(wallet, rpc, config ?? {}));
};

export const defaultAgentBuilder = (_wallet?: WalletClient) => {
	const pk = generatePrivateKey();
	const account = privateKeyToAccount(pk);
	const wallet =
		_wallet ??
		createWalletClient({
			account,
			chain: mainnet,
			transport: http(),
		});
	const publicClient = createPublicClient({
		transport: http(),
		chain: mainnet,
	});
	return agentMiddleware(agentBuilder(wallet, publicClient));
};
