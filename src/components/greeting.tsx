import Image from 'next/image';

export const Greeting = () => {

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
			<div className="relative mb-8">
				<Image src="/borderFluxo.png" alt="Fluxo" width={100} height={100} />
			</div>

			<div className="space-y-4 max-w-md">
				<h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
					Welcome to Fluxo Chat
				</h2>
				<p className="text-gray-600 leading-relaxed">
					You can ask me to swap tokens, check your balance, or do anything you want.
				</p>

				<div className="flex flex-wrap gap-2 justify-center pt-4">
					{[
						"🔄 Swap tokens",
						"💰 Check your balance",
						"📈 Check your transactions",
						"⚡ Do anything you want",
					].map((tag, index) => (
						<span
							key={index}
							className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:shadow-md transition-shadow duration-200"
						>
							{tag}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};
