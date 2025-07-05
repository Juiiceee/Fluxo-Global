import {
	convertToModelMessages,
	createUIMessageStream,
	JsonToSseTransformStream,
	smoothStream,
	stepCountIs,
	streamText,
} from "ai";
import { systemPrompt } from "@/lib/ai/prompts";
import {
	createStreamId,
	deleteChatById,
	getChatById,
	getMessageCountByUserAddress,
	getMessagesByChatId,
	saveChat,
	saveMessages,
} from "@/lib/db/queries";
import { convertToUIMessages, generateUUID } from "@/lib/utils";
import { isProductionEnvironment } from "@/lib/constants";
import { postRequestBodySchema, type PostRequestBody } from "./schema";
import { createResumableStreamContext, type ResumableStreamContext } from "resumable-stream";
import { after } from "next/server";
import { ChatSDKError } from "@/lib/errors";
import { generateTitleFromUserMessage } from "../../actions";
import { myProvider } from "@/lib/ai/providers";
import { defaultAgentBuilder } from "@/agent/agentBuilder";
import { createWalletClient, http } from "viem";
import { createVercelAITools } from "@/agent";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

export const maxDuration = 60;

let globalStreamContext: ResumableStreamContext | null = null;

export function getStreamContext() {
	if (!globalStreamContext) {
		try {
			globalStreamContext = createResumableStreamContext({
				waitUntil: after,
			});
		} catch (error: any) {
			if (error.message.includes("REDIS_URL")) {
				console.log(" > Resumable streams are disabled due to missing REDIS_URL");
			} else {
				console.error(error);
			}
		}
	}

	return globalStreamContext;
}

export async function POST(request: Request) {
	let requestBody: PostRequestBody;

	try {
		const json = await request.json();
		requestBody = postRequestBodySchema.parse(json);
	} catch (error) {
		console.error(error);
		return new Response("Bad Request", { status: 400 });
	}

	try {
		const { id, userAddress, message, selectedChatModel } = requestBody;

		const pk = generatePrivateKey();
		const account = privateKeyToAccount(pk);
		const wallet = createWalletClient({
			account,
			chain: mainnet,
			transport: http(),
		});
		if (userAddress) wallet.account.address = userAddress as `0x${string}`;
		const agent = defaultAgentBuilder(wallet);
		const vercelTools = createVercelAITools(agent, agent.actions);

		const messageCount = await getMessageCountByUserAddress({
			userAddress,
			differenceInHours: 24,
		});

		const chat = await getChatById({ id });

		if (!chat) {
			const title = await generateTitleFromUserMessage({
				message,
			});

			await saveChat({
				id,
				userAddress,
				title,
			});
		} else {
			if (chat.userAddress !== userAddress) {
				return new Response("Forbidden", { status: 403 });
			}
		}

		const messagesFromDb = await getMessagesByChatId({ id });
		const uiMessages = [...convertToUIMessages(messagesFromDb), message];

		await saveMessages({
			messages: [
				{
					chatId: id,
					id: message.id,
					role: "user",
					parts: message.parts,
					attachments: [],
					createdAt: new Date(),
				},
			],
		});

		const streamId = generateUUID();
		await createStreamId({ streamId, chatId: id });

		console.log(JSON.stringify(uiMessages, null, 2));

		const stream = createUIMessageStream({
			execute: ({ writer: dataStream }) => {
				const result = streamText({
					model: myProvider.languageModel(selectedChatModel),
					system: systemPrompt({ userAddress }),
					messages: convertToModelMessages(uiMessages),
					stopWhen: stepCountIs(5),
					experimental_activeTools:
						selectedChatModel === "chat-model-reasoning"
							? []
							: Object.keys(vercelTools),
					experimental_transform: smoothStream({ chunking: "word" }),
					tools: vercelTools,
					experimental_telemetry: {
						isEnabled: isProductionEnvironment,
						functionId: "stream-text",
					},
				});

				result.consumeStream();

				dataStream.merge(
					result.toUIMessageStream({
						sendReasoning: true,
					})
				);
			},
			generateId: generateUUID,
			onFinish: async ({ messages }) => {
				await saveMessages({
					messages: messages.map((message) => ({
						id: message.id,
						role: message.role,
						parts: message.parts as any,
						createdAt: new Date(),
						attachments: [] as any,
						chatId: id,
					})),
				});
			},
			onError: (error) => {
				console.log(error);
				return "Oops, an error occurred!";
			},
		});

		const streamContext = getStreamContext();

		if (streamContext) {
			return new Response(
				await streamContext.resumableStream(streamId, () =>
					stream.pipeThrough(new JsonToSseTransformStream())
				)
			);
		} else {
			return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
		}
	} catch (error) {
		if (error instanceof ChatSDKError) {
			return error.toResponse();
		}
		console.error("Unexpected error:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}

export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");

	if (!id) {
		return new ChatSDKError("bad_request:api").toResponse();
	}

	//TODO :  add the auth check for msg deletion

	const session = {} as any;

	if (!session?.user) {
		return new ChatSDKError("unauthorized:chat").toResponse();
	}

	const chat = await getChatById({ id });

	if (!chat) return new ChatSDKError("not_found:chat").toResponse();

	if (chat.userAddress !== session.user.address) {
		return new ChatSDKError("forbidden:chat").toResponse();
	}

	const deletedChat = await deleteChatById({ id });

	return Response.json(deletedChat, { status: 200 });
}
