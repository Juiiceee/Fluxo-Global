"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import Footer from "@/components/landing/footer";

export default function LandingPage() {
	return (
		<Suspense fallback={<LandingPageFallback />}>
			<LandingPageContent />
		</Suspense>
	);
}

// Simple fallback component to show while the content is loading
function LandingPageFallback() {
	return (
		<div className="flex flex-col min-h-screen bg-white">
			<div className="flex-1 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-pulse">
						<div className="h-8 w-24 bg-gray-100 mx-auto rounded mb-4"></div>
						<div className="h-12 w-64 bg-gray-50 mx-auto rounded mb-6"></div>
						<div className="h-4 w-48 bg-gray-50 mx-auto rounded"></div>
					</div>
				</div>
			</div>
		</div>
	);
}

function LandingPageContent() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const scrollToSection = (sectionId: string) => {
		const section = document.getElementById(sectionId);
		if (section) {
			section.scrollIntoView({ behavior: "smooth" });
		}
	};

	if (!mounted) {
		return null;
	}

	return (
		<div className="flex flex-col min-h-screen bg-white">
			<section id="section0">
				<header className="py-6 px-4 sm:px-6 md:px-8 bg-white border-b border-gray-100">
					<div className="container max-w-6xl mx-auto flex items-center justify-between">
						{/* Logo on left */}
						<div className="flex items-center space-x-2">
							<div className="text-2xl font-light tracking-wide text-black">
								Fluxo
							</div>
						</div>

						{/* Centered navigation */}
						<nav className="hidden md:flex items-center text-gray-600 space-x-8">
							<Link
								href="/chat"
								className="px-4 py-2 hover:text-black transition-colors duration-300 font-medium"
							>
								Chat
							</Link>
							<Link
								href="/configure"
								className="px-4 py-2 hover:text-black transition-colors duration-300 font-medium"
							>
								Tools
							</Link>
						</nav>

						{/* Connect button on right */}
						<div className="">
							<Button 
								variant="outline" 
								size="sm" 
								className="border-black text-black hover:bg-black hover:text-white transition-all duration-300"
							>
								Connect
							</Button>
						</div>
					</div>
				</header>
			</section>
			
			{/* Hero */}
			<main className="flex-1">
				<section
					className="relative py-20 md:py-32 lg:py-40 bg-white"
					id="section1"
				>
					<div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
						{/* Status Badge */}
						<div className="mb-8">
							<Badge variant="outline" className="rounded-full border-gray-300 text-gray-600 bg-white px-4 py-2">
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
								Use blockchain.<br />
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
								onClick={() => scrollToSection("section2")}
								variant="ghost"
								size="lg"
								className="text-gray-400 hover:text-black transition-colors duration-300"
							>
								<ChevronDown className="animate-bounce" size={24} />
							</Button>
						</div>
					</div>
				</section>

				{/* Final CTA */}
				<section className="py-28 md:py-40 text-center bg-gradient-to-b from-white to-gray-50" id="section5">
					<div className="container max-w-5xl mx-auto px-4">
						<h2 className="text-5xl sm:text-6xl md:text-7xl font-light mb-12 leading-tight text-black tracking-tight">
							Blockchain is for <br />
							<span className="font-normal bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600">
								Everyone
							</span>
						</h2>
						<div className="flex flex-row justify-center gap-6 mb-20">
							<Button 
								asChild 
								size="lg"
								className="bg-black text-white hover:bg-gray-800 transition-all duration-300 px-8 py-4 text-lg font-medium"
							>
								<Link href="/agent">Try now</Link>
							</Button>
						</div>
						<div className="flex justify-center">
							<Button
								onClick={() => scrollToSection("section0")}
								variant="ghost"
								size="lg"
								className="text-gray-400 hover:text-black transition-colors duration-300"
							>
								<ChevronUp className="animate-bounce" size={32} />
							</Button>
						</div>
					</div>
				</section>
			</main>
			{/* Footer */}
			<Footer />
		</div>
	);
}
