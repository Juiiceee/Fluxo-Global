import { Action, EvmAgentKit } from "@/agent";
import { erc20TransferSchema } from "../types";
import { transfer } from "../tools/Transfer";
import { normalize } from "viem/ens";

const TransferAction: Action = {
	name: "ERC20_TRANSFER",
	similes: ["transfer token", "send token", "transfer erc20"],
	description: `Transfer ERC20 tokens to a recipient address, if users wants to transfer native token, use the token address 0x0000000000000000000000000000000000000000.`,
	examples: [
		[
			{
				input: {
					to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
					tokenAddress: "0xA0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8C8",
					amount: "100",
				},
				output: {
					status: "success",
					message: "ERC20 transfer completed successfully",
					txHash: "0x1234567890abcdef...",
				},
				explanation: "Transfer 100 tokens to the specified address",
			},
		],
	],
	schema: erc20TransferSchema,
	handler: async (agent: EvmAgentKit, input: Record<string, unknown>) => {
		try {
			const transferRequest = erc20TransferSchema.parse(input);
			// Check if the recipient address is an ENS name
			if (transferRequest.to.endsWith(".eth")) {
				const address = await agent.connection.getEnsAddress({
					name: normalize(transferRequest.to),
				});
				if (!address) {
					throw new Error(`Could not resolve ENS name ${transferRequest.to}`);
				}
				transferRequest.to = address;
			} else if (!transferRequest.to.match(/^0x[a-fA-F0-9]{40}$/)) {
				throw new Error("Invalid Ethereum address format");
			}
			const txHash = await transfer(agent, transferRequest);

			return {
				status: "success",
				message: "ERC20 transfer completed successfully",
				txHash,
				to: transferRequest.to,
				tokenAddress: transferRequest.tokenAddress,
				amount: transferRequest.amount,
			};
		} catch (error: unknown) {
			return {
				status: "error",
				message: error as string,
			};
		}
	},
};

export { TransferAction };
