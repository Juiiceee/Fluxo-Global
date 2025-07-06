import { z } from "zod";

// Schema for ERC20 transfer
export const lzTransferSchema = z.object({
	fromChain: z.string().describe("Source chain name"),
	toChain: z.string().describe("Destination chain name"),
	addGasQty: z.string().describe("Amount of gas to add to the transaction"),
	tokenAddress: z.string().describe("ERC20 token contract address"),
	amount: z.string().describe("Amount of tokens to transfer (in token units)"),
});

export const lzTransferSchemaTool = lzTransferSchema.extend({
	synthetic: z.string().describe("Synthetic address of the token"),
	tokenAddress: z.string().describe("ERC20 token contract address"),
	amount: z.string().describe("Amount of tokens to transfer (in token units)"),
	addGasQty: z.string().describe("Amount of gas to add to the transaction"),
	fromChain: z.string().describe("Source chain name"),
	toChain: z.string().describe("Destination chain name"),
});

// Type definitions
export type LzTransferRequest = z.infer<typeof lzTransferSchema>;
export type LzTransferRequestTool = z.infer<typeof lzTransferSchemaTool>;
