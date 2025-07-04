import Image from "next/image";
import Link from "next/link";
import LandingLink from "./Link";

export default function Footer() {
	return (
		<footer className="py-8 border-t border-white/10">
			<div className="container max-w-6xl mx-auto px-4">
				<div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
					<div className="flex items-center space-x-2">
						<Image src="/whiteFluxo.png" alt="Fluxo" width={50} height={50} className="w-12 h-12" />
						<span className="text-muted-foreground text-black">Fluxo © 2025</span>
					</div>

					<div className="flex flex-col md:flex-row items-center gap-3">
						<span className="text-sm text-muted-foreground text-black">Proud participant of</span>
						<Link
							href="https://www.ethglobal.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:opacity-80 transition-opacity"
						>
							<div className="flex border items-center px-4 py-2 rounded-lg">
								<Image
									src="/ethCannes.svg"
									alt="Colosseum Hackathon"
									width={150}
									height={40}
									className="h-8 w-auto"
								/>
							</div>
						</Link>
					</div>
					<LandingLink />
				</div>
			</div>
		</footer>
	);
}
