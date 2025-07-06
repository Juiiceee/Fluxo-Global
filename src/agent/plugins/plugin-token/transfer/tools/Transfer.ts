import { EvmAgentKit } from "@/agent";
import { Erc20TransferRequest } from "../types";

// ERC20 Transfer ABI (just the transfer function)
const ERC20_TRANSFER_ABI = [
	{
		constant: false,
		inputs: [
			{
				name: "_to",
				type: "address",
			},
			{
				name: "_value",
				type: "uint256",
			},
		],
		name: "transfer",
		outputs: [
			{
				name: "",
				type: "bool",
			},
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "decimals",
		outputs: [
			{
				name: "",
				type: "uint8",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
] as const;

/**
 * Transfer ERC20 tokens to a recipient address
 * @param agent EvmAgentKit instance
 * @param params ERC20 transfer parameters
 * @returns Transaction hash
 * @throws {Error} If the transfer fails
 */
export async function transfer(agent: EvmAgentKit, params: Erc20TransferRequest) {
	try {
		// Validate addresses
		if (!params.to.startsWith("0x") || params.to.length !== 42) {
			throw new Error("Invalid recipient address format");
		}
		if (!params.tokenAddress.startsWith("0x") || params.tokenAddress.length !== 42) {
			throw new Error("Invalid token address format");
		}
		if (!agent.wallet.account) {
			throw new Error("Wallet account not found");
		}

		if (params.tokenAddress === "0x0000000000000000000000000000000000000000") {
			const hash = await agent.wallet.sendTransaction({
				account: agent.wallet.account,
				to: params.to as `0x${string}`,
				value: BigInt(+params.amount * 1e18),
				chain: agent.wallet.chain
			});

			return hash
		}

		const decimals = await agent.connection.readContract({
			account: agent.wallet.account,
			address: params.tokenAddress as `0x${string}`,
			abi: ERC20_TRANSFER_ABI,
			functionName: "decimals",
		});

		const {request} = await agent.connection.simulateContract({
			account: agent.wallet.account,
			address: params.tokenAddress as `0x${string}`,
			abi: ERC20_TRANSFER_ABI,
			functionName: "transfer",
			chain: agent.wallet.chain,
			args: [params.to as `0x${string}`, BigInt(+params.amount * 10 ** decimals)],
		});

		return await agent.wallet.writeContract(request);
		} catch (error: unknown) {
			console.error("Error in ERC20 transfer:", error);
			throw error;
		}
	} 