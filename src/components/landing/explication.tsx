export default function Explication() {
	return (
		<div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 className="text-5xl sm:text-6xl md:text-7xl font-light text-center mb-20 sm:mb-24 md:mb-28 text-black tracking-tight">
				10 sec Setup, <br />
				<span className="font-normal">literally.</span>
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
				<div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
					<div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-6">
						<span className="font-medium">1</span>
					</div>
					<h3 className="text-xl font-medium mb-4 text-black">Connect Wallet</h3>
					<p className="text-gray-600 font-light leading-relaxed">
						Link your wallet to access your personalized AI agent.
					</p>
				</div>

				<div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
					<div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center mb-6">
						<span className="font-medium">2</span>
					</div>
					<h3 className="text-xl font-medium mb-4 text-black">Customize Agent</h3>
					<p className="text-gray-600 font-light leading-relaxed">
						Configure your agent with the tools you need for your crypto journey.
					</p>
				</div>

				<div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
					<div className="w-12 h-12 rounded-full bg-gray-600 text-white flex items-center justify-center mb-6">
						<span className="font-medium">3</span>
					</div>
					<h3 className="text-xl font-medium mb-4 text-black">Use It</h3>
					<p className="text-gray-600 font-light leading-relaxed">
						Done! <br />I told you it was easy.
					</p>
				</div>
			</div>
		</div>
	);
}
