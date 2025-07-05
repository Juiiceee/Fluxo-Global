"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

// B2B Tool Template Card
const B2BToolCard = () => (
	<div className="w-full max-w-md mx-auto mt-6 rounded-2xl bg-black/60 border border-white/10 overflow-hidden">
		{/* Chat conversation header */}
		<div className="bg-black/80 p-3 border-b border-white/10 flex items-center justify-between">
			<div className="flex items-center">
				<div className="w-6 h-6 mr-2">
					<Image
						src="/borderFluxo.png"
						alt="Fluxo"
						width={24}
						height={24}
						className="w-full h-full"
					/>
				</div>
				<span className="text-sm text-zinc-300">Fluxo Agent</span>
			</div>
			<div className="w-2 h-2 rounded-full bg-green-500"></div>
		</div>

		{/* Chat conversation */}
		<div className="p-4 space-y-4">
			{/* User message */}
			<div className="flex justify-end">
				<div className="bg-amber-400/10 rounded-xl rounded-tr-sm p-3 max-w-xs">
					<p className="text-sm">Swap 10 ETH for USDC using [Your Protocol]</p>
				</div>
			</div>

			{/* AI response with tool */}
			<div className="flex">
				<div className="bg-zinc-800/50 rounded-xl rounded-tl-sm p-3 max-w-xs">
					<p className="text-sm mb-3">
						I&apos;ll help you swap 10 ETH for USDC using [Your Protocol].
					</p>

					{/* Tool card */}
					<div className="bg-black/60 rounded-lg p-3 border border-zinc-700">
						<div className="flex items-center mb-2">
							<div className="w-6 h-6 rounded-md bg-black/80 flex items-center justify-center p-1">
								<Image
									src="/borderFluxo.png"
									alt="Fluxo"
									width={16}
									height={16}
									className="w-full h-full"
								/>
							</div>
							<span className="ml-2 text-xs font-medium">[Your Protocol]</span>
						</div>
						<div className="text-xs text-zinc-400">
							Swapping 2 ETH for ~4158 USDC
							<div className="h-1 w-full bg-zinc-800 rounded-full mt-1 overflow-hidden">
								<div className="h-full w-3/4 bg-amber-400/70 rounded-full"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
);

export default function BusinessProtocolSection() {
	return (
		<div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
			{/* B2B Showcase */}
			<div className="bg-black/30 border border-white/10 rounded-xl p-6 md:p-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
					<div>
						<h3 className="text-xl md:text-2xl font-semibold mb-4">For Businesses & Protocols</h3>
						<p className="text-muted-foreground mb-6">
							Integrate your protocol directly into Fluxo&apos;s AI agent ecosystem. Custom tools
							allow your users to interact with your protocol through natural language.
						</p>
						<div className="mb-6">
							<h4 className="text-lg font-medium mb-3">Benefits include:</h4>
							<ul className="space-y-2">
								<li className="flex items-start gap-2">
									<CheckCircle2 size={18} className="mt-1 text-amber-400 flex-shrink-0" />
									<span>Seamless integration with your existing API</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle2 size={18} className="mt-1 text-amber-400 flex-shrink-0" />
									<span>Reach new users through natural language interface</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle2 size={18} className="mt-1 text-amber-400 flex-shrink-0" />
									<span>Custom-branded tools in the Fluxo ecosystem</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle2 size={18} className="mt-1 text-amber-400 flex-shrink-0" />
									<span>Analytics dashboard for user engagement</span>
								</li>
							</ul>
						</div>

						<Button>Schedule a Demo</Button>
					</div>

					<div className="flex items-center justify-center">
						<B2BToolCard />
					</div>
				</div>
			</div>
		</div>
	);
}
