import Action from "./action";
import Footer from "./footer";
import Header from "./header";
import Hero from "./hero";
import BusinessProtocolSection from "./BusinessProtocolSection";
import Meet from "./meet";
import Explication from "./explication";

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
				{/* AI Agent Preview Section */}
				<section className="bg-white" id="section2">
					<Meet />
				</section>

				{/* Setup Section */}
				<section className="bg-white py-24 md:py-32">
					<Explication />
				</section>

				<section className="py-24 bg-white md:py-32">
					<BusinessProtocolSection />
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
