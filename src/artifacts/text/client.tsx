import { Artifact } from "@/components/create-artifact";
import {
	ClockRewind,
	CopyIcon,
	MessageIcon,
	PenIcon,
	RedoIcon,
	UndoIcon,
} from "@/components/icons";
import { toast } from "sonner";

interface TextArtifactMetadata {}

export const textArtifact = new Artifact<"text", TextArtifactMetadata>({
	kind: "text",
	description: "Useful for text content, like drafting essays and emails.",
	initialize: async ({ documentId, setMetadata }) => {},
	onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
		if (streamPart.type === "data-textDelta") {
			setArtifact((draftArtifact) => {
				return {
					...draftArtifact,
					content: draftArtifact.content + streamPart.data,
					isVisible:
						draftArtifact.status === "streaming" &&
						draftArtifact.content.length > 400 &&
						draftArtifact.content.length < 450
							? true
							: draftArtifact.isVisible,
					status: "streaming",
				};
			});
		}
	},
	content: ({
		mode,
		status,
		content,
		isCurrentVersion,
		currentVersionIndex,
		onSaveContent,
		getDocumentContentById,
		isLoading,
		metadata,
	}) => {
		if (isLoading) {
			return <div>Loading...</div>;
		}

		return <div className="flex flex-row py-8 md:p-20 px-4">{content}</div>;
	},
	actions: [
		{
			icon: <ClockRewind size={18} />,
			description: "View changes",
			onClick: ({ handleVersionChange }) => {
				handleVersionChange("toggle");
			},
			isDisabled: ({ currentVersionIndex, setMetadata }) => {
				if (currentVersionIndex === 0) {
					return true;
				}

				return false;
			},
		},
		{
			icon: <UndoIcon size={18} />,
			description: "View Previous version",
			onClick: ({ handleVersionChange }) => {
				handleVersionChange("prev");
			},
			isDisabled: ({ currentVersionIndex }) => {
				if (currentVersionIndex === 0) {
					return true;
				}

				return false;
			},
		},
		{
			icon: <RedoIcon size={18} />,
			description: "View Next version",
			onClick: ({ handleVersionChange }) => {
				handleVersionChange("next");
			},
			isDisabled: ({ isCurrentVersion }) => {
				if (isCurrentVersion) {
					return true;
				}

				return false;
			},
		},
		{
			icon: <CopyIcon size={18} />,
			description: "Copy to clipboard",
			onClick: ({ content }) => {
				navigator.clipboard.writeText(content);
				toast.success("Copied to clipboard!");
			},
		},
	],
	toolbar: [
		{
			icon: <PenIcon />,
			description: "Add final polish",
			onClick: ({ sendMessage }) => {
				sendMessage({
					role: "user",
					parts: [
						{
							type: "text",
							text: "Please add final polish and check for grammar, add section titles for better structure, and ensure everything reads smoothly.",
						},
					],
				});
			},
		},
		{
			icon: <MessageIcon />,
			description: "Request suggestions",
			onClick: ({ sendMessage }) => {
				sendMessage({
					role: "user",
					parts: [
						{
							type: "text",
							text: "Please add suggestions you have that could improve the writing.",
						},
					],
				});
			},
		},
	],
});
