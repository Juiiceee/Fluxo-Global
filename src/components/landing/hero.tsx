import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { scrollToSection } from "../utils";

export default function Hero() {
	return (
		<div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
			{/* Status Badge */}
			<div className="mb-8">
				<Badge
					variant="outline"
					className="rounded-full border-gray-300 text-gray-600 bg-white px-4 py-2"
				>
					<span
						className="size-2 animate-pulse rounded-full bg-green-500 mr-2"
						aria-hidden="true"
					></span>
					Live
				</Badge>
			</div>

			{/* Headlines */}
			<div className="text-center mb-12">
				<h1 className="text-4xl md:text-5xl lg:text-7xl font-light text-black mb-6 tracking-tight leading-tight">
					Use blockchain.
					<br />
					<span className="font-normal">Use Flexo.</span>
				</h1>
				<p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
					Blockchain is complicated. Fluxo makes it simple.
				</p>
			</div>

			{/* FLUXO title */}
			<div className="w-full overflow-hidden my-8">
				<div className="text-center">
					<h2 className="text-8xl md:text-9xl lg:text-[12rem] font-thin text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-400 tracking-[0.2em] select-none">
						FLUXO
					</h2>
				</div>
			</div>

			{/* Brief explanation */}
			<div className="text-center max-w-2xl mx-auto mb-12">
				<p className="text-lg text-gray-600 font-light">
					AI Agent for DeFi and On-Chain operations.
				</p>
			</div>

			{/* CTA buttons */}
			<div className="flex flex-col sm:flex-row gap-4 mb-16">
				<Button
					asChild
					size="lg"
					className="bg-black text-white hover:bg-gray-800 transition-all duration-300 px-8 py-3 text-base font-medium"
				>
					<Link href="/chat">Try Chat</Link>
				</Button>
				<Button
					asChild
					size="lg"
					variant="outline"
					className="border-black text-black hover:bg-black hover:text-white transition-all duration-300 px-8 py-3 text-base font-medium"
				>
					<Link href="/configure">Explore Tools</Link>
				</Button>
			</div>

			<div className="flex justify-center mt-20">
				<Button
					onClick={() => scrollToSection("section1")}
					variant="ghost"
					size="lg"
					className="text-gray-400 hover:text-black transition-colors duration-300"
				>
					<ChevronDown className="animate-bounce" size={24} />
				</Button>
			</div>
		</div>
	);
}
