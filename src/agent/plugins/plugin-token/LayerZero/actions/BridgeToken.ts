import { Action, EvmAgentKit } from "@/agent";
import { LzTransferRequestTool, lzTransferSchema } from "../types";
import { bridgeWithOFT } from "../tools/BridgeToken";

const BridgeWithLZ: Action = {
	name: "LZ_TRANSFER",
	similes: ["bridge token", "cross-chain transfer", "layerzero bridge", "lz transfer"],
	description: `Bridge tokens across different chains using LayerZero protocol. Specify the source chain, destination chain, token address, amount to transfer, and optional gas quantity to add.`,
	examples: [
		[
			{
				input: {
					fromChain: "ethereum",
					toChain: "arbitrum",
					tokenAddress: "0xA0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8C8",
					amount: "100",
					addGasQty: "0.01",
				},
				output: {
					status: "success",
					message: "Token bridge completed successfully",
					signature: "0x1234567890abcdef...",
				},
				explanation: "Bridge 100 tokens from Ethereum to Arbitrum with 0.01 additional gas",
			},
		],
	],
	schema: lzTransferSchema,
	handler: async (agent: EvmAgentKit, input: Record<string, unknown>) => {
		try {
			console.log("TransferAction", input);
			const transferRequest = lzTransferSchema.parse(input);

			const response = await fetch(
				`https://metadata.layerzero-api.com/v1/metadata/experiment/ofts/list?chainNames=ethereum&symbols=USDT0&protocols=wBTC%2CZRO%20Token%2CUSDT0`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			const data = await response.json();
			console.log("data", data);
			const udst0 = data.USDT0[0].deployments.ethereum.address;
			const udst = data.USDT0[0].deployments.ethereum.innerTokenAddress;
			console.log("udst0", udst0);
			transferRequest.tokenAddress = udst0;
			const fullTransferRequest: LzTransferRequestTool = {
				...transferRequest,
				tokenAddress: udst,
				synthetic: udst0,
			};
			const signature = await bridgeWithOFT(agent, fullTransferRequest);

			return {
				status: "success",
				message: "ERC20 transfer completed successfully",
				signature: signature,
				to: transferRequest.toChain,
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

export { BridgeWithLZ };
