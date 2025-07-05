import { textDocumentHandler } from "@/artifacts/text/server";
import { UIMessageStreamWriter } from "ai";
import { ChatMessage } from "@/lib/types";
import { ArtifactKind } from "@/hooks/use-artifact";

export interface CreateDocumentCallbackProps {
	id: string;
	title: string;
	dataStream: UIMessageStreamWriter<ChatMessage>;
	walletAddress: string;
}

export interface UpdateDocumentCallbackProps {
	document: any;
	description: string;
	dataStream: UIMessageStreamWriter<ChatMessage>;
	walletAddress: string;
}

export interface DocumentHandler<T = ArtifactKind> {
	kind: T;
	onCreateDocument: (args: CreateDocumentCallbackProps) => Promise<void>;
	onUpdateDocument: (args: UpdateDocumentCallbackProps) => Promise<void>;
}

export function createDocumentHandler<T extends ArtifactKind>(config: {
	kind: T;
	onCreateDocument: (params: CreateDocumentCallbackProps) => Promise<string>;
	onUpdateDocument: (params: UpdateDocumentCallbackProps) => Promise<string>;
}): DocumentHandler<T> {
	return {
		kind: config.kind,
		onCreateDocument: async (args: CreateDocumentCallbackProps) => {
			const draftContent = await config.onCreateDocument({
				id: args.id,
				title: args.title,
				dataStream: args.dataStream,
				walletAddress: args.walletAddress,
			});

			return;
		},
		onUpdateDocument: async (args: UpdateDocumentCallbackProps) => {
			const draftContent = await config.onUpdateDocument({
				document: args.document,
				description: args.description,
				dataStream: args.dataStream,
				walletAddress: args.walletAddress,
			});

			return;
		},
	};
}

/*
 * Use this array to define the document handlers for each artifact kind.
 */
export const documentHandlersByArtifactKind: Array<DocumentHandler> = [textDocumentHandler];

export const artifactKinds = ["text", "code", "image", "sheet"] as const;
