"use client";

import { Suspense, useEffect, useState } from "react";
import Landing from "@/components/landing/landing";
import Image from "next/image";

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

	return <Landing />;
}
