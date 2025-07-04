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
				<section className="relative py-20 md:py-32 lg:py-40 bg-white" id="section1">
					<Hero />
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
