"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle, XCircle, Loader2, Eye } from "lucide-react";
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
	onConfirm?: () => void;
	onCancel?: () => void;
}

function DetailModal({ open, onOpenChange, title, data, args, onConfirm, onCancel }: DetailModalProps) {
	const [activeTab, setActiveTab] = React.useState<'formatted' | 'raw'>('formatted');
	
	const hasResults = data && Object.keys(data).length > 0;
	const hasArgs = args && Object.keys(args).length > 0;



	const formatData = (obj: any) => {
		if (typeof obj !== 'object' || obj === null) {
			return (
				<div className="text-sm text-muted-foreground break-all">
					{String(obj)}
				</div>
			);
		}

		return Object.entries(obj).map(([key, value]) => (
			<div key={key} className="border-b border-border/30 last:border-b-0 py-3">
				<div className="font-medium text-sm text-foreground mb-1">{key}</div>
				<div className="text-sm text-muted-foreground break-all font-mono">
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
							className="flex-1 text-black"
						>
							Formatted
						</Button>
						<Button
							variant={activeTab === 'raw' ? 'default' : 'ghost'}
							size="sm"
							onClick={() => setActiveTab('raw')}
							className="flex-1 text-black"
						>
							Raw JSON
						</Button>
					</div>

					{/* Content */}
					<div className="border border-border/50 rounded-lg p-4 bg-muted/30 max-h-96 overflow-y-auto">
						{activeTab === 'formatted' ? (
							<div className="space-y-6">
								{hasResults ? (
									<>
										<div>
											<h3 className="font-semibold text-foreground mb-3 text-base">Result</h3>
											<div className="space-y-2">
												<div className="flex justify-between items-center py-2 border-b border-border">
													<span className="text-sm font-medium">Status</span>
													<span className="text-sm font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
														success
													</span>
												</div>
												{formatData(data)}
											</div>
										</div>
										{hasArgs && (
											<div>
												<h3 className="font-semibold text-foreground mb-3 text-base">Arguments Used</h3>
												<div className="space-y-2">
													{formatData(args)}
												</div>
											</div>
										)}
									</>
								) : (
									hasArgs && (
										<div>
											<h3 className="font-semibold text-foreground mb-3 text-base">Arguments</h3>
											<div className="space-y-2">
												{formatData(args)}
											</div>
										</div>
									)
								)}
							</div>
						) : (
							<pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
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
							onCancel?.();
							onOpenChange(false);
						}}
						className="bg-gray-900 text-white border-gray-900 hover:bg-gray-800 hover:border-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:border-gray-100 dark:hover:bg-gray-200 dark:hover:border-gray-200"
					>
						Cancel
					</Button>
					<Button 
						onClick={() => {
							onConfirm?.();
							onOpenChange(false);
						}}
						className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600"
					>
						Confirm
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
					icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
					title: 'Confirm Action',
					description: description || 'Are you sure you want to proceed?',
					showButtons: true,
					showDetailsButton: false,
					iconBg: 'bg-amber-100 border-amber-300 dark:bg-amber-500/10 dark:border-amber-500/20',
					cardBg: 'bg-black border-2 border-amber-400 dark:bg-black dark:border-amber-500/40',
					titleColor: 'text-amber-900 dark:text-amber-100',
					descriptionColor: 'text-amber-800 dark:text-amber-200',
				};
			case 'processing':
				return {
					icon: <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />,
					title: 'Processing...',
					description: 'Please wait while we process your request.',
					showButtons: false,
					showDetailsButton: false,
					iconBg: 'bg-blue-100 border-blue-300 dark:bg-blue-500/10 dark:border-blue-500/20',
					cardBg: 'bg-blue-50 border-2 border-blue-400 dark:bg-blue-500/5 dark:border-blue-500/40',
					titleColor: 'text-blue-900 dark:text-blue-100',
					descriptionColor: 'text-blue-800 dark:text-blue-200',
				};
			case 'completed':
				return {
					icon: <CheckCircle className="w-5 h-5 text-green-600" />,
					title: 'Completed',
					description: 'Action completed successfully.',
					showButtons: false,
					showDetailsButton: true,
					iconBg: 'bg-green-100 border-green-300 dark:bg-green-500/10 dark:border-green-500/20',
					cardBg: 'bg-green-50 border-2 border-green-400 dark:bg-green-500/5 dark:border-green-500/40',
					titleColor: 'text-green-900 dark:text-green-100',
					descriptionColor: 'text-green-800 dark:text-green-200',
				};
			case 'failed':
				return {
					icon: <XCircle className="w-5 h-5 text-red-600" />,
					title: 'Failed',
					description: error || 'Action failed. Please try again.',
					showButtons: false,
					showDetailsButton: false,
					iconBg: 'bg-red-100 border-red-300 dark:bg-red-500/10 dark:border-red-500/20',
					cardBg: 'bg-red-50 border-2 border-red-400 dark:bg-red-500/5 dark:border-red-500/40',
					titleColor: 'text-red-900 dark:text-red-100',
					descriptionColor: 'text-red-800 dark:text-red-200',
				};
			case 'cancelled':
				return {
					icon: <XCircle className="w-5 h-5 text-gray-600" />,
					title: 'Cancelled',
					description: 'Action was cancelled.',
					showButtons: false,
					showDetailsButton: false,
					iconBg: 'bg-gray-100 border-gray-300 dark:bg-gray-500/10 dark:border-gray-500/20',
					cardBg: 'bg-gray-50 border-2 border-gray-400 dark:bg-gray-500/5 dark:border-gray-500/40',
					titleColor: 'text-gray-900 dark:text-gray-100',
					descriptionColor: 'text-gray-800 dark:text-gray-200',
				};
			default:
				return {
					icon: <AlertTriangle className="w-5 h-5 text-gray-600" />,
					title: 'Unknown State',
					description: 'Unknown state.',
					showButtons: false,
					showDetailsButton: false,
					iconBg: 'bg-gray-100 border-gray-300 dark:bg-gray-500/10 dark:border-gray-500/20',
					cardBg: 'bg-gray-50 border-2 border-gray-400 dark:bg-gray-500/5 dark:border-gray-500/40',
					titleColor: 'text-gray-900 dark:text-gray-100',
					descriptionColor: 'text-gray-800 dark:text-gray-200',
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
					"rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:shadow-current/5",
					config.cardBg,
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
							<div className={cn("font-semibold text-base", config.titleColor)}>
								{title}
							</div>
							<div className={cn("text-sm", config.descriptionColor)}>
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
								className="bg-gray-900 text-white border-gray-900 hover:bg-gray-800 hover:border-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:border-gray-100 dark:hover:bg-gray-200 dark:hover:border-gray-200"
							>
								Cancel
							</Button>
							<Button
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									handleConfirm();
								}}
								className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600"
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
							className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600"
						>
							View Details
						</Button>
					)}
				</div>

				{/* Arguments preview */}
				{Object.keys(args).length > 0 && (
					<div className="mt-3 pt-3 border-t border-current/10">
						<div className={cn("text-xs font-medium mb-2", config.descriptionColor)}>
							Arguments ({Object.keys(args).length})
						</div>
						<div className="flex flex-wrap gap-2">
							{Object.entries(args).slice(0, 3).map(([key, value]) => (
								<div 
									key={key} 
									className={cn(
										"text-xs px-2 py-1 rounded border",
										"bg-white/50 border-current/20 dark:bg-white/5 dark:border-current/20"
									)}
								>
									<span className={cn("font-medium", config.titleColor)}>{key}:</span>{" "}
									<span className={config.descriptionColor}>
										{typeof value === 'object' 
											? JSON.stringify(value).substring(0, 20) + '...'
											: String(value).substring(0, 20) + (String(value).length > 20 ? '...' : '')
										}
									</span>
								</div>
							))}
							{Object.keys(args).length > 3 && (
								<div className={cn(
									"text-xs px-2 py-1 rounded border",
									"bg-white/50 border-current/20 dark:bg-white/5 dark:border-current/20",
									config.descriptionColor
								)}>
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
				onConfirm={handleConfirm}
				onCancel={handleCancel}
			/>
		</>
	);
}

export default ToolConfirmation;
