import { createPublicClient, createWalletClient, http, PublicClient, WalletClient } from "viem";
import { EvmAgentKit } from "./core";
import { Config } from "./types";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

export const agentBuilder = (wallet: WalletClient, rpc: PublicClient, config?: Config) => {
	return new EvmAgentKit(wallet, rpc, config ?? {});
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
	return agentBuilder(wallet, publicClient);
};
