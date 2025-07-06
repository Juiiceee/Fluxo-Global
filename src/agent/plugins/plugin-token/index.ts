import { EvmAgentKit } from "@/agent";
import { TransferAction } from "./transfer/actions/Transfer";
import { transfer } from "./transfer/tools/Transfer";
import { Plugin } from "@/agent/types";
import { bridgeWithOFT } from "./LayerZero/tools/BridgeToken";
import { BridgeWithLZ } from "./LayerZero/actions/BridgeToken";
// Define and export the plugin
const TokenPlugin = {
	name: "token",

	// Combine all tools
	methods: {
		transfer,
		bridgeWithOFT
	},

	// Combine all actions
	actions: [TransferAction, BridgeWithLZ],

	// Initialize function
	initialize: function (agent: EvmAgentKit): void {
		// Initialize all methods with the agent instance
		Object.entries(this.methods).forEach(([methodName, method]) => {
			if (typeof method === "function") {
				this.methods[methodName] = method.bind(null, agent);
			}
		});
	},
} satisfies Plugin;

// Default export for convenience
export default TokenPlugin;
