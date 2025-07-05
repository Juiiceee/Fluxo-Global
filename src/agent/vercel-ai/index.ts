import { tool } from "ai";
import type { EvmAgentKit } from "../core";
import type { Action } from "../types/action";
import { executeAction } from "../utils/actionExecutor";

export function createEvmTools(evmAgentKit: EvmAgentKit, actions: Action[]): Record<string, any> {
	const tools: Record<string, any> = {};

	if (actions.length > 128) {
		console.warn(
			`Too many actions provided. Only a maximum of 128 actions allowed. You provided ${
				actions.length
			}, the last ${actions.length - 128} will be ignored.`
		);
	}

	for (const action of actions.slice(0, 127)) {
		// Validate action structure
		if (!action || !action.name || !action.schema) {
			console.warn(`Skipping invalid action:`, action);
			continue;
		}

		try {
			// Create tool with action name as key (not numeric index)
			// Temporarily removing execute function to test schema conversion
			tools[action.name] = tool({
				description: action.description,
				inputSchema: action.schema,
			});
			console.log(`Successfully created tool: ${action.name}`);
		} catch (error) {
			console.error(`Failed to create tool ${action.name}:`, error);
			console.error("Schema:", action.schema);
		}
	}

	return tools;
}
