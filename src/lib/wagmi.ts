import { createConfig } from '@privy-io/wagmi'
import { http } from 'wagmi'
import { mainnet, arbitrum, base, optimism } from 'wagmi/chains'

export const config = createConfig({
	chains: [mainnet, arbitrum, base, optimism],
	transports: {
		[mainnet.id]: http(),
		[arbitrum.id]: http(),
		[base.id]: http(),
		[optimism.id]: http(),
	},
});
