import { http, createConfig } from "wagmi";
import {
	mainnet,
	sepolia,
	arbitrum,
	arbitrumSepolia,
	base,
	baseSepolia,
	optimism,
	optimismSepolia,
	polygon,
	polygonAmoy,
} from "wagmi/chains";

export const config = createConfig({
	chains: [mainnet, arbitrum, base, optimism],
	transports: {
		[mainnet.id]: http(),
		[arbitrum.id]: http(),
		[base.id]: http(),
		[optimism.id]: http(),
	},
});
