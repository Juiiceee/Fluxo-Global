import type { Action, Config, Plugin } from "../types";

/**
 * Defines a type that merges all plugin methods into the `methods` object
 */
type PluginMethods<T> = T extends Plugin ? T["methods"] : Record<string, never>;

/**
 * Main class for interacting with blockchain.
 *
 * @example
 * // Define a plugin
 * const tokenPlugin = {
 *    name: "tokenPlugin",
 *    actions: [],
 *    methods: {
 *      transferToken: (to: string, amount: number) => {
 *        console.log(`Transferring ${amount} to ${to}`);
 *      },
 *    },
 *    initialize: (agent: any) => {},
 * };
 *
 * @example
 * // Create EvmAgentKit instance
 * const agent = new EvmAgentKit({
 *  signTransaction: async (tx) => {},
 *  signAllTransactions: async (txs) => {},
 *  sendTransaction: async (tx) => {},
 *  publicKey: "SomePublicKey",
 * }, "<rpcUrl>", {});
 *
 * @example
 * // Add plugin
 * const agentWithPlugins = agent.use(tokenPlugin);
 *
 * @example
 * // Use plugin method
 * agentWithPlugins.methods.transferToken("SomePublicKey", 100);
 */
export class EvmAgentKit<TPlugins = Record<string, never>> {
  public connection: any;
  public config: Config;
  public wallet: any;
  private plugins: Map<string, Plugin> = new Map();

  public methods: TPlugins = {} as TPlugins;
  public actions: Action[] = [];

  constructor(wallet: any, rpc_url: string, config: Config) {
    this.connection = 2;
    this.wallet = wallet;
    this.config = config;
  }

  /**
   * Adds a plugin and registers its methods inside `methods`
   */
  use<P extends Plugin>(
    plugin: P,
  ): EvmAgentKit<TPlugins & PluginMethods<P>> {
    if (this.plugins.has(plugin.name)) {
      return this as EvmAgentKit<TPlugins & PluginMethods<P>>;
    }
    plugin.initialize(this as EvmAgentKit);

    // Register plugin methods inside `methods`
    for (const [methodName, method] of Object.entries(plugin.methods)) {
      if ((this.methods as Record<string, unknown>)[methodName]) {
        throw new Error(`Method ${methodName} already exists in methods`);
      }
      (this.methods as Record<string, unknown>)[methodName] =
        method.bind(plugin);
    }

    for (const action of plugin.actions) {
      this.actions.push(action);
    }

    this.plugins.set(plugin.name, plugin);
    return this as EvmAgentKit<TPlugins & PluginMethods<P>>;
  }
}
