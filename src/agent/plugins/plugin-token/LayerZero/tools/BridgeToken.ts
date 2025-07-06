import { EvmAgentKit } from "@/agent";
import { LzTransferRequest, LzTransferRequestTool } from "../types";
import { OFT_ABI } from "../types/abi";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { getAddress } from "viem";

const ERC20_ABI = [
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
	{
		constant: false,
		inputs: [
			{
				name: "_spender",
				type: "address",
			},
			{
				name: "_value",
				type: "uint256",
			},
		],
		name: "approve",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{
				name: "_owner",
				type: "address",
			},
		],
		name: "balanceOf",
		outputs: [
			{
				name: "balance",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{
				name: "_owner",
				type: "address",
			},
			{
				name: "_spender",
				type: "address",
			},
		],
		name: "allowance",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
] as const;

const mapChainToEid = new Map<string, number>([
	["ethereum", 30101],
	["arbitrum", 30110],
	["base", 30184],
	["abstract", 30324],
	["optimism", 30111],
]);

/**
 * Transfer ERC20 tokens to a recipient address
 * @param agent EvmAgentKit instance
 * @param params ERC20 transfer parameters
 * @returns Transaction hash
 * @throws {Error} If the transfer fails
 */
export async function bridgeWithOFT(agent: EvmAgentKit, params: LzTransferRequestTool) {
	try {
		// Validate addresses
		if (!params.tokenAddress.startsWith("0x") || params.tokenAddress.length !== 42)
			throw new Error("Invalid token address format");

		if (!agent.wallet.account) throw new Error("Wallet account not found");

		const eid = mapChainToEid.get(params.toChain.toLowerCase());
		if (!eid) throw new Error("Invalid chain");

		const decimals = await agent.connection.readContract({
			account: agent.wallet.account,
			address: params.tokenAddress as `0x${string}`,
			abi: ERC20_ABI,
			functionName: "decimals",
		});

		const amountLD = BigInt(+params.amount * 10 ** decimals);

		// Check token balance
		const tokenBalance = await agent.connection.readContract({
			account: agent.wallet.account,
			address: params.tokenAddress as `0x${string}`,
			abi: ERC20_ABI,
			functionName: "balanceOf",
			args: [agent.wallet.account.address],
		});

		if (tokenBalance < amountLD)
			throw new Error(`Insufficient token balance. Have: ${tokenBalance}, Need: ${amountLD}`);

		// Check allowance (if OFT contract needs approval to spend tokens)
		const allowance = await agent.connection.readContract({
			account: agent.wallet.account,
			address: params.tokenAddress as `0x${string}`,
			abi: ERC20_ABI,
			functionName: "allowance",
			args: [agent.wallet.account.address, params.synthetic as `0x${string}`],
		});


		if (allowance < amountLD) {
			// Request approval transaction
			const { request } = await agent.connection.simulateContract({
				account: agent.wallet.account,
				address: getAddress(params.tokenAddress),
				abi: ERC20_ABI,
				functionName: "approve",
				args: [getAddress(params.synthetic), amountLD],
			});
			const approvalHash = await agent.wallet.writeContract(request);
			await agent.connection.waitForTransactionReceipt({ hash: approvalHash });
		}

		// Check native balance for fees
		const nativeBalance = await agent.connection.getBalance({
			address: agent.wallet.account.address,
		});

		const options = Options.newOptions();
		if (params.addGasQty !== "0")
			options.addExecutorLzReceiveOption(1000000, +params.addGasQty * 1e18);

		const sendParams = {
			dstEid: eid,
			to: `0x${"0".repeat(24)}${agent.wallet.account.address.slice(2)}` as `0x${string}`,
			amountLD: amountLD,
			minAmountLD: amountLD,
			extraOptions: options.toHex() as `0x${string}`,
			// extraOptions: "0x" as `0x${string}`,
			composeMsg: "0x" as `0x${string}`,
			oftCmd: "0x" as `0x${string}`,
		};

		const fees = await agent.connection.readContract({
			account: agent.wallet.account,
			address: params.synthetic as `0x${string}`,
			abi: OFT_ABI,
			functionName: "quoteSend",
			args: [sendParams, false],
		});

		if (nativeBalance < fees.nativeFee) {
			throw new Error(
				`Insufficient native balance for fees. Have: ${nativeBalance}, Need: ${fees.nativeFee}`
			);
		}

		const { request } = await agent.connection.simulateContract({
			account: agent.wallet.account,
			address: params.synthetic as `0x${string}`,
			abi: OFT_ABI,
			functionName: "send",
			args: [sendParams, fees, agent.wallet.account.address],
			value: fees.nativeFee,
		});

		return await agent.wallet.writeContract(request);
	} catch (error: unknown) {
		throw error;
	}
}
