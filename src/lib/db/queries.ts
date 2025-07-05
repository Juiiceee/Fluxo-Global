import "server-only";

import { prisma } from "../prisma";
import { ChatSDKError } from "../errors";
import { Address } from "viem";
import { User as PrismaUser, Chat as PrismaChat, Message } from "@/generated/prisma";
import { InputJsonValue } from "@prisma/client/runtime/library";

// Type definitions based on Prisma models
export type User = PrismaUser;
export type Chat = PrismaChat;
export type DBMessage = Message;

export async function getUserByWalletAddress(walletAddress: Address): Promise<Array<User>> {
	try {
		const users = await prisma.user.findMany({
			where: {
				walletAddress: walletAddress,
			},
		});
		return users;
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to get user by wallet address");
	}
}

export async function createUser(walletAddress: string, name: string) {
	try {
		return await prisma.user.create({
			data: {
				walletAddress,
				name,
				enabledTools: [],
			},
		});
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to create user");
	}
}

export async function saveChat({
	id,
	userAddress,
	title,
}: {
	id: string;
	userAddress: string;
	title: string;
}) {
	try {
		return await prisma.chat.create({
			data: {
				id,
				title,
				userAddress,
				createdAt: new Date(),
			},
		});
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to save chat");
	}
}

export async function deleteChatById({ id }: { id: string }) {
	try {
		// Delete related records first
		await prisma.message.deleteMany({
			where: { chatId: id },
		});

		await prisma.stream.deleteMany({
			where: { chatId: id },
		});

		// Delete the chat
		const deletedChat = await prisma.chat.delete({
			where: { id },
		});

		return deletedChat;
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to delete chat by id");
	}
}

export async function getChatsByUserId({
	id,
	limit,
	startingAfter,
	endingBefore,
}: {
	id: string;
	limit: number;
	startingAfter: string | null;
	endingBefore: string | null;
}) {
	try {
		const extendedLimit = limit + 1;
		let whereClause: any = { userId: id };

		if (startingAfter) {
			const selectedChat = await prisma.chat.findUnique({
				where: { id: startingAfter },
			});

			if (!selectedChat) {
				throw new ChatSDKError("not_found:database", `Chat with id ${startingAfter} not found`);
			}

			whereClause = {
				...whereClause,
				createdAt: {
					gt: selectedChat.createdAt,
				},
			};
		} else if (endingBefore) {
			const selectedChat = await prisma.chat.findUnique({
				where: { id: endingBefore },
			});

			if (!selectedChat) {
				throw new ChatSDKError("not_found:database", `Chat with id ${endingBefore} not found`);
			}

			whereClause = {
				...whereClause,
				createdAt: {
					lt: selectedChat.createdAt,
				},
			};
		}

		const filteredChats = await prisma.chat.findMany({
			where: whereClause,
			orderBy: {
				createdAt: "desc",
			},
			take: extendedLimit,
		});

		const hasMore = filteredChats.length > limit;

		return {
			chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
			hasMore,
		};
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to get chats by user id");
	}
}

export async function getChatById({ id }: { id: string }) {
	try {
		const chat = await prisma.chat.findUnique({
			where: { id },
		});
		return chat;
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
	}
}

export async function saveMessages({ messages }: { messages: Array<DBMessage> }) {
	try {
		return await prisma.message.createMany({
			data: messages.map((message) => ({
				...message,
				parts: message.parts as InputJsonValue,
				attachments: message.attachments as InputJsonValue,
			})),
		});
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to save messages");
	}
}

export async function getMessagesByChatId({ id }: { id: string }) {
	try {
		return await prisma.message.findMany({
			where: {
				chatId: id,
			},
			orderBy: {
				createdAt: "asc",
			},
		});
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to get messages by chat id");
	}
}

export async function getMessageById({ id }: { id: string }) {
	try {
		return await prisma.message.findMany({
			where: {
				id: id,
			},
		});
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to get message by id");
	}
}

export async function deleteMessagesByChatIdAfterTimestamp({
	chatId,
	timestamp,
}: {
	chatId: string;
	timestamp: Date;
}) {
	try {
		const messagesToDelete = await prisma.message.findMany({
			where: {
				chatId: chatId,
				createdAt: {
					gte: timestamp,
				},
			},
			select: {
				id: true,
			},
		});

		const messageIds = messagesToDelete.map((message: { id: string }) => message.id);

		if (messageIds.length > 0) {
			return await prisma.message.deleteMany({
				where: {
					chatId: chatId,
					id: {
						in: messageIds,
					},
				},
			});
		}
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to delete messages by chat id after timestamp"
		);
	}
}

export async function getMessageCountByUserAddress({
	userAddress,
	differenceInHours,
}: {
	userAddress: string;
	differenceInHours: number;
}) {
	try {
		const twentyFourHoursAgo = new Date(Date.now() - differenceInHours * 60 * 60 * 1000);

		const count = await prisma.message.count({
			where: {
				chat: {
					userAddress,
				},
				createdAt: {
					gte: twentyFourHoursAgo,
				},
				role: "user",
			},
		});

		return count;
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to get message count by user id");
	}
}

export async function createStreamId({ streamId, chatId }: { streamId: string; chatId: string }) {
	try {
		await prisma.stream.create({
			data: {
				id: streamId,
				chatId,
				createdAt: new Date(),
			},
		});
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to create stream id");
	}
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
	try {
		const streams = await prisma.stream.findMany({
			where: {
				chatId: chatId,
			},
			orderBy: {
				createdAt: "asc",
			},
			select: {
				id: true,
			},
		});

		return streams.map((stream: { id: string }) => stream.id);
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to get stream ids by chat id");
	}
}
