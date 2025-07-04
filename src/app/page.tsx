"use client";

import { Suspense, useEffect, useState } from "react";
import Footer from "@/components/landing/footer";
import Header from "@/components/landing/header";
import First from "@/components/landing/first";
import Action from "@/components/landing/action";

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

	if (!mounted) {
		return null;
	}

	return (
		<div className="flex flex-col min-h-screen bg-white">
			<section id="section0">
				<Header />
			</section>

			<main className="flex-1">
				<section className="relative py-20 md:py-32 lg:py-40 bg-white" id="section1">
					<First />
				</section>

				{/* Final CTA */}
				<section
					className="py-28 md:py-40 text-center bg-gradient-to-b from-white to-gray-50"
					id="section5"
				>
					<Action />
				</section>
			</main>
			{/* Footer */}
			<Footer />
		</div>
	);
}
