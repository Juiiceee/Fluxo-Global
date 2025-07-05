import { PublicClient, WalletClient } from "viem";
import { EvmAgentKit } from "./core";
import { Config } from "./types";

export const agentBuilder = (wallet: WalletClient, rpc: PublicClient, config?: Config) => {
	return new EvmAgentKit(wallet, rpc, config ?? {});
};
