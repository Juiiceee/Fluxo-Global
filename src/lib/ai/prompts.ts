import { ArtifactKind } from "@/hooks/use-artifact";

export const regularPrompt = "TODO";

export const systemPrompt = ({ selectedChatModel }: { selectedChatModel: string }) => {
	return `${regularPrompt}`;
};

export const updateDocumentPrompt = (
	currentContent: string | null,
	type: ArtifactKind,
  ) =>
	type === 'text'
	  ? `\
  Improve the following contents of the document based on the given prompt.
  
  ${currentContent}
  `
	  : type === 'code'
		? `\
  Improve the following code snippet based on the given prompt.
  
  ${currentContent}
  `
		: type === 'sheet'
		  ? `\
  Improve the following spreadsheet based on the given prompt.
  
  ${currentContent}
  `
		  : '';