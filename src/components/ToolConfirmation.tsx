// src/components/chat/tools/ToolConfirmation.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Info, Loader2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Action, createVercelAITools, EvmAgentKit, executeAction } from "@/agent";
import { toast } from "sonner";

interface ToolConfirmationProps {
	agent: EvmAgentKit;
	toolCallId: string;
	toolName: string;
	args: Record<string, any>;
	action: Action;
	addToolResult?: (args: { toolCallId: string; result: string }) => void;
}

export default function ToolConfirmation({
	agent,
	toolCallId,
	toolName,
	args,
	action,
	addToolResult,
}: ToolConfirmationProps) {
	const [isProcessing, setIsProcessing] = useState(false);
	const [isConfirmed, setIsConfirmed] = useState(false);
	const [isRejected, setIsRejected] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);

	// Get tool info from the registry using action.name
	const toolInfo = createVercelAITools(agent, [action])[action.name];

	// Use displayName from toolInfo, otherwise fall back to action name
	const actionLabel = toolInfo?.name || action.name;
	const actionDescription = toolInfo?.description || "No description available.";
	const logoPath = toolInfo?.profilePicture || "/tool-logos/synto-logo.png";

	const handleConfirm = useCallback(async () => {
		if (!agent || !addToolResult) return;

		setIsProcessing(true);
		setIsConfirmed(true);
		setDialogOpen(false);

		try {
			// Execute the action
			const result = await executeAction(action, agent, args);

			// Return the result
			addToolResult({
				toolCallId,
				result: JSON.stringify({
					...result,
					success: true,
				}),
			});

			toast.success(`${actionLabel} completed`);
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			console.error("Error executing tool:", errorMessage);

			// Return error
			addToolResult({
				toolCallId,
				result: JSON.stringify({
					success: false,
					error: errorMessage,
				}),
			});

			toast.error(`${actionLabel} failed: ${errorMessage}`);
		} finally {
			setIsProcessing(false);
		}
	}, [agent, addToolResult, action, args, toolCallId, actionLabel]);

	const handleReject = () => {
		if (!addToolResult) return;
		setIsRejected(true);
		setDialogOpen(false);

		addToolResult({
			toolCallId,
			result: JSON.stringify({
				success: false,
				error: "User rejected the operation",
			}),
		});

		toast.info("Operation cancelled");
	};

	// Simplified display for confirmed/rejected state
	if (isConfirmed || isRejected) {
		return (
			<Card className="w-full my-3 border border-border/30">
				<CardContent className="p-3">
					<div className="flex items-center gap-2 py-1">
						{isConfirmed ? (
							isProcessing ? (
								<div className="flex items-center text-sm">
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Processing {actionLabel}...
								</div>
							) : (
								<div className="flex items-center text-sm text-[#14F195]">
									<Check className="h-4 w-4 mr-2" />
									{actionLabel} confirmed
								</div>
							)
						) : (
							<div className="flex items-center text-sm text-muted-foreground">
								<X className="h-4 w-4 mr-2" />
								{actionLabel} cancelled
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		);
	}

	// Format arguments into a form-like view for the dialog
	const formatArgs = () => {
		const entries = Object.entries(args);
		if (entries.length === 0) return null;

		return (
			<div className="space-y-3">
				{entries.map(([key, value]) => {
					// Format the value based on its type
					let displayValue = value;
					let isObject = false;

					if (typeof value === "object" && value !== null) {
						try {
							displayValue = JSON.stringify(value, null, 2);
							isObject = true;
						} catch (error: unknown) {
							console.error("Error formatting value:", error);
							displayValue = String(value);
						}
					} else {
						displayValue = String(value);
					}

					return (
						<div key={key} className="border-b border-border/20 pb-3 last:border-0">
							<label className="text-sm font-medium block mb-1">{key}</label>
							<div
								className={`text-sm text-muted-foreground rounded bg-muted/30 p-2 ${
									isObject ? "whitespace-pre font-mono text-xs overflow-x-auto" : "break-words"
								}`}
							>
								{displayValue}
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<>
			<Card
				className="w-full my-3 cursor-pointer transition-colors hover:bg-accent/10"
				onClick={() => setDialogOpen(true)}
			>
				<CardContent className="p-4 pb-2">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-3">
							<Avatar className="h-8 w-8">
								<AvatarImage src={logoPath} alt={actionLabel} />
								<AvatarFallback>{actionLabel.slice(0, 2).toUpperCase()}</AvatarFallback>
							</Avatar>
							<div>
								<span className="font-medium text-sm">{actionLabel}</span>
								<p className="text-xs text-muted-foreground mt-1">{actionDescription}</p>
							</div>
						</div>
						<Info className="h-5 w-5 text-muted-foreground" />
					</div>

					<div className="mt-3">
						<p className="text-sm font-medium">
							{toolInfo?.confirmationMessage || `Please confirm this operation to continue.`}
						</p>
						<p className="text-xs text-muted-foreground mt-1">Click to see details</p>
					</div>
				</CardContent>

				<CardFooter className="flex justify-end gap-2 px-4 py-3">
					<Button
						variant="secondary"
						size="sm"
						onClick={(e) => {
							e.stopPropagation();
							handleReject();
						}}
						className="h-8"
					>
						Cancel
					</Button>
					<Button
						size="sm"
						onClick={(e) => {
							e.stopPropagation();
							setDialogOpen(true); // Changed to open dialog instead of confirming
						}}
						className="h-8"
					>
						Confirm
					</Button>
				</CardFooter>
			</Card>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader className="flex flex-row items-center gap-3 pb-2">
						<Avatar className="h-10 w-10">
							<AvatarImage src={logoPath} alt={actionLabel} />
							<AvatarFallback>{actionLabel.slice(0, 2).toUpperCase()}</AvatarFallback>
						</Avatar>
						<div>
							<DialogTitle className="text-lg">{actionLabel}</DialogTitle>
							<p className="text-sm text-muted-foreground mt-1">{actionDescription}</p>
						</div>
					</DialogHeader>

					<div className="mt-3 mb-4">
						<p className="text-sm text-muted-foreground">You&apos;re about to use this action:</p>
						<p className="text-base font-medium mt-2 border-l-4 pl-3 py-1 border-primary">
							{toolInfo?.confirmationMessage || `Please confirm this operation to continue.`}
						</p>
					</div>

					{Object.keys(args).length > 0 ? (
						<>
							<div className="mt-2 mb-1">
								<h4 className="text-sm font-medium">Arguments</h4>
							</div>

							<ScrollArea className="max-h-[300px] pr-2 -mr-2">{formatArgs()}</ScrollArea>
						</>
					) : (
						<p className="text-sm text-muted-foreground mt-2">
							No arguments needed for this action
						</p>
					)}

					<div className="flex justify-end gap-2 mt-4">
						<Button variant="secondary" size="sm" onClick={handleReject}>
							Cancel
						</Button>
						<Button size="sm" onClick={handleConfirm}>
							Confirm
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
