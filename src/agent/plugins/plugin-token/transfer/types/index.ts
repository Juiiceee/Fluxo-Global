import { z } from "zod";

// Schema for ERC20 transfer
export const erc20TransferSchema = z.object({
	to: z.string().describe("Recipient wallet address"),
	tokenAddress: z.string().describe("ERC20 token contract address"),
	amount: z.string().describe("Amount of tokens to transfer (in token units)"),
});

// Type definitions
export type Erc20TransferRequest = z.infer<typeof erc20TransferSchema>; 