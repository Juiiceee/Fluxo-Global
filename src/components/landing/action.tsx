import { ChevronUp } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { scrollToSection } from "../utils";

export default function Action() {
	return (
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
	);
}
