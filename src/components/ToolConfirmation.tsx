"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle, XCircle, Loader2, Eye, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ToolConfirmationProps {
	/** Whether the confirmation dialog is open */
	open: boolean;
	/** Callback to handle open/close state */
	onOpenChange: (open: boolean) => void;
	/** Title of the action being confirmed */
	title: string;
	/** Description of the action */
	description?: string;
	/** Arguments/parameters for the action */
	args?: Record<string, any>;
	/** Result data (if action completed) */
	result?: any;
	/** Current state of the action */
	state: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
	/** Error message if action failed */
	error?: string;
	/** Callback when user confirms the action */
	onConfirm?: () => void;
	/** Callback when user cancels the action */
	onCancel?: () => void;
	/** Custom className for the dialog content */
	className?: string;
}

interface DetailModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	data: any;
	args: Record<string, any>;
}

function DetailModal({ open, onOpenChange, title, data, args }: DetailModalProps) {
	const [activeTab, setActiveTab] = React.useState<'formatted' | 'raw'>('formatted');
	
	const hasResults = data && Object.keys(data).length > 0;
	const hasArgs = args && Object.keys(args).length > 0;

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success('Copied to clipboard');
		} catch (err) {
			toast.error('Failed to copy');
		}
	};

	const downloadData = () => {
		const dataToExport = hasResults 
			? { result: data, arguments: args }
			: { arguments: args };
		const dataStr = JSON.stringify(dataToExport, null, 2);
		const blob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${title.replace(/\s+/g, '-').toLowerCase()}-${hasResults ? 'result' : 'params'}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const formatData = (obj: any) => {
		if (typeof obj !== 'object' || obj === null) {
			return (
				<div className="text-sm text-muted-foreground break-all">
					{String(obj)}
				</div>
			);
		}

		return Object.entries(obj).map(([key, value]) => (
			<div key={key} className="border-b border-border last:border-b-0 py-3">
				<div className="font-medium text-sm text-foreground mb-1">{key}</div>
				<div className="text-sm text-muted-foreground break-all">
					{typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
				</div>
			</div>
		));
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
							<Eye className="w-4 h-4 text-primary-foreground" />
						</div>
						{title}
					</DialogTitle>
					<DialogDescription>
						{hasResults ? 'Detailed result information' : 'Action parameters'}
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-hidden">
					{/* Tab Navigation */}
					<div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg">
						<Button
							variant={activeTab === 'formatted' ? 'default' : 'ghost'}
							size="sm"
							onClick={() => setActiveTab('formatted')}
							className="flex-1"
						>
							Formatted
						</Button>
						<Button
							variant={activeTab === 'raw' ? 'default' : 'ghost'}
							size="sm"
							onClick={() => setActiveTab('raw')}
							className="flex-1"
						>
							Raw JSON
						</Button>
					</div>

					{/* Content */}
					<div className="border rounded-lg p-4 bg-muted/50 max-h-96 overflow-y-auto">
						{activeTab === 'formatted' ? (
							<div className="space-y-6">
								{hasResults ? (
									<>
										<div>
											<h3 className="font-medium text-foreground mb-3">Result</h3>
											<div className="space-y-2">
												<div className="flex justify-between items-center py-2 border-b border-border">
													<span className="text-sm font-medium">Status</span>
													<span className="text-sm text-green-600 dark:text-green-400 font-medium">
														success
													</span>
												</div>
												{formatData(data)}
											</div>
										</div>
										{hasArgs && (
											<div>
												<h3 className="font-medium text-foreground mb-3">Arguments Used</h3>
												<div className="space-y-2">
													{formatData(args)}
												</div>
											</div>
										)}
									</>
								) : (
									hasArgs && (
										<div>
											<h3 className="font-medium text-foreground mb-3">Arguments</h3>
											<div className="space-y-2">
												{formatData(args)}
											</div>
										</div>
									)
								)}
							</div>
						) : (
							<pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
								{hasResults 
									? JSON.stringify({ result: data, arguments: args }, null, 2)
									: JSON.stringify({ arguments: args }, null, 2)
								}
							</pre>
						)}
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => {
							const dataToExport = hasResults 
								? { result: data, arguments: args }
								: { arguments: args };
							copyToClipboard(JSON.stringify(dataToExport, null, 2));
						}}
						className="gap-2"
					>
						<Copy className="w-4 h-4" />
						Copy
					</Button>
					<Button onClick={downloadData} className="gap-2">
						<Download className="w-4 h-4" />
						Download
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function ToolConfirmation({
	open,
	onOpenChange,
	title,
	description,
	args = {},
	result,
	state,
	error,
	onConfirm,
	onCancel,
	className
}: ToolConfirmationProps) {
	const [showDetailModal, setShowDetailModal] = React.useState(false);

	const getStateConfig = () => {
		switch (state) {
			case 'pending':
				return {
					icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
					title: 'Confirm Action',
					description: description || 'Are you sure you want to proceed?',
					showButtons: true,
					showDetailsButton: false,
					iconBg: 'bg-amber-500/10 border-amber-500/20',
				};
			case 'processing':
				return {
					icon: <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />,
					title: 'Processing...',
					description: 'Please wait while we process your request.',
					showButtons: false,
					showDetailsButton: false,
					iconBg: 'bg-blue-500/10 border-blue-500/20',
				};
			case 'completed':
				return {
					icon: <CheckCircle className="w-5 h-5 text-green-500" />,
					title: 'Completed',
					description: 'Action completed successfully.',
					showButtons: false,
					showDetailsButton: true,
					iconBg: 'bg-green-500/10 border-green-500/20',
				};
			case 'failed':
				return {
					icon: <XCircle className="w-5 h-5 text-red-500" />,
					title: 'Failed',
					description: error || 'Action failed. Please try again.',
					showButtons: false,
					showDetailsButton: false,
					iconBg: 'bg-red-500/10 border-red-500/20',
				};
			case 'cancelled':
				return {
					icon: <XCircle className="w-5 h-5 text-gray-500" />,
					title: 'Cancelled',
					description: 'Action was cancelled.',
					showButtons: false,
					showDetailsButton: false,
					iconBg: 'bg-gray-500/10 border-gray-500/20',
				};
			default:
				return {
					icon: <AlertTriangle className="w-5 h-5 text-gray-500" />,
					title: 'Unknown State',
					description: 'Unknown state.',
					showButtons: false,
					showDetailsButton: false,
					iconBg: 'bg-gray-500/10 border-gray-500/20',
				};
		}
	};

	const config = getStateConfig();

	const handleConfirm = () => {
		onConfirm?.();
	};

	const handleCancel = () => {
		onCancel?.();
		// Ne pas fermer automatiquement le dialog
		// onOpenChange(false);
	};

	const handleViewDetails = () => {
		setShowDetailModal(true);
	};

	const formatArgs = () => {
		if (!args || Object.keys(args).length === 0) return null;

		return (
			<div className="mt-4 p-3 rounded-lg bg-muted/50 border">
				<div className="text-sm font-medium text-foreground mb-2">Arguments:</div>
				<div className="space-y-1">
					{Object.entries(args).map(([key, value]) => (
						<div key={key} className="flex justify-between items-start gap-2">
							<span className="text-sm font-medium text-muted-foreground">{key}:</span>
							<span className="text-sm text-foreground text-right break-all max-w-xs">
								{typeof value === 'object' ? JSON.stringify(value) : String(value)}
							</span>
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<>
			{/* Carré/carte de confirmation */}
			<div
				className={cn(
					"border rounded-lg p-4 bg-card cursor-pointer transition-all hover:shadow-md hover:border-primary/50",
					className
				)}
				onClick={() => setShowDetailModal(true)}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className={cn(
							"w-10 h-10 rounded-lg border-2 flex items-center justify-center flex-shrink-0",
							config.iconBg
						)}>
							{config.icon}
						</div>
						<div className="text-left">
							<div className="font-medium text-base text-foreground">
								{title}
							</div>
							<div className="text-sm text-muted-foreground">
								{config.description}
							</div>
						</div>
					</div>

					{/* Boutons Cancel/Confirm */}
					{config.showButtons && (
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									handleCancel();
								}}
							>
								Cancel
							</Button>
							<Button
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									handleConfirm();
								}}
							>
								Confirm
							</Button>
						</div>
					)}

					{/* Bouton View Details pour les actions terminées */}
					{config.showDetailsButton && (
						<Button
							variant="outline"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								setShowDetailModal(true);
							}}
						>
							View Details
						</Button>
					)}
				</div>

				{/* Arguments preview */}
				{Object.keys(args).length > 0 && (
					<div className="mt-3 pt-3 border-t border-border/50">
						<div className="text-xs text-muted-foreground mb-2">
							Arguments ({Object.keys(args).length})
						</div>
						<div className="flex flex-wrap gap-2">
							{Object.entries(args).slice(0, 3).map(([key, value]) => (
								<div key={key} className="text-xs bg-muted px-2 py-1 rounded">
									<span className="font-medium">{key}:</span>{" "}
									<span className="text-muted-foreground">
										{typeof value === 'object' 
											? JSON.stringify(value).substring(0, 20) + '...'
											: String(value).substring(0, 20) + (String(value).length > 20 ? '...' : '')
										}
									</span>
								</div>
							))}
							{Object.keys(args).length > 3 && (
								<div className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
									+{Object.keys(args).length - 3} more
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Dialog de détails */}
			<DetailModal
				open={showDetailModal}
				onOpenChange={setShowDetailModal}
				title={title}
				data={result}
				args={args}
			/>
		</>
	);
}

export default ToolConfirmation;
