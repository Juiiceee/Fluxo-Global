import Action from "./action";
import Footer from "./footer";
import Header from "./header";
import Hero from "./hero";

export default function Landing() {
	return (
		<div className="flex flex-col min-h-screen bg-white">
			<section id="section0">
				<Header />
			</section>

			<main className="flex-1">
				<section
					className="relative pt-4 pb-16 md:pt-8 md:pb-28 lg:pt-12 lg:pb-36 bg-white"
					id="section1"
				>
					<Hero />
				</section>

				{/* Final CTA */}
				<section
					className="pt-12 pb-28 md:pt-16 md:pb-40 text-center bg-gradient-to-b from-white to-gray-50"
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
