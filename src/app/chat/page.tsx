"use client";

import { ConnectButton } from "@/components/ConnectButton";
import { useAgent } from "@/hooks/useAgent";

export default function Chat() {
	const { agent, isReady } = useAgent();

	console.log(agent?.actions);

	return (
		<div className="min-h-screen p-8">
			<div className="flex flex-col gap-4">
				<h1 className="text-2xl font-bold">Chat</h1>
				<div className="flex justify-end">
					<ConnectButton />
				</div>
			</div>
			{!isReady && <div>Loading...</div>}
			{isReady && <div>{agent?.actions.map((action) => action.name)}</div>}
		</div>
	);
}
