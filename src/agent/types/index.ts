import type { z } from "zod";
import type { EvmAgentKit } from "../core";

export interface Plugin {
	name: string;
	methods: Record<string, any>;
	actions: Action[];
	initialize(agent: EvmAgentKit): void;
}

export interface Config {
	OPENAI_API_KEY?: string;
	PERPLEXITY_API_KEY?: string;
	PRIORITY_LEVEL?: "medium" | "high" | "veryHigh"; // medium, high, or veryHigh
	COINGECKO_PRO_API_KEY?: string;
	COINGECKO_DEMO_API_KEY?: string;
	MESSARI_API_KEY?: string;
}

/**
 * Example of an action with input and output
 */
export interface ActionExample {
	input: Record<string, any>;
	output: Record<string, any>;
	explanation: string;
}

/**
 * Handler function type for executing the action
 */
export type Handler = (
	agent: EvmAgentKit,
	input: Record<string, any>
) => Promise<Record<string, any>>;

/**
 * Main Action interface inspired by ELIZA
 * This interface makes it easier to implement actions across different frameworks
 */
export interface Action {
	/**
	 * Unique name of the action
	 */
	name: string;

	/**
	 * Alternative names/phrases that can trigger this action
	 */
	similes: string[];

	/**
	 * Detailed description of what the action does
	 */
	description: string;

	/**
	 * Array of example inputs and outputs for the action
	 * Each inner array represents a group of related examples
	 */
	examples: ActionExample[][];

	/**
	 * Zod schema for input validation
	 */
	schema: z.ZodType<any>;

	/**
	 * Function that executes the action
	 */
	handler: Handler;
}
