import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

export default function () {
	return (
		<div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
			<div className="flex flex-col lg:flex-row items-center justify-between gap-12">
				<div className="w-full lg:w-1/2">
					<h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight mb-8 text-black">
						Meet your AI Agent
					</h2>
					<p className="text-lg lg:text-xl text-gray-600 max-w-lg mb-12 font-light leading-relaxed">
						Talk to your agent like a friend and get things done instantly. Send money, check your
						balance, or trade tokens with a simple message. Just tell it what you want and it
						happens.
					</p>
					<div className="flex gap-4">
						<Button
							asChild
							size="lg"
							className="bg-black text-white hover:bg-gray-800 transition-all duration-300 px-8 py-3"
						>
							<Link href="/agent">Start Chatting</Link>
						</Button>
					</div>
				</div>
				<div className="w-full lg:w-1/3 flex justify-center">
					<div className="relative w-4/5 sm:w-3/5 md:w-2/3 lg:w-full max-w-[280px] overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
						<Image
							src="/borderFluxo.png"
							alt="AI Agent in Action"
							width={300}
							height={500}
							className="w-full h-auto object-cover"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
