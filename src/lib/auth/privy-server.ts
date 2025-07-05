"use server";
// lib/auth/privy-server.ts
import { PrivyClient } from "@privy-io/server-auth";

// Initialize Privy server client
const privyClient = new PrivyClient(
	process.env.NEXT_PUBLIC_PRIVY_ID!,
	process.env.PRIVY_APP_SECRET! // Add this to your .env
);

/**
 * Verifies a user's Privy token on the server
 *
 * @param privyToken JWT token from client side
 * @returns User data if valid, null if invalid
 */
export async function verifyPrivyToken(privyToken: string) {
	try {
		// Verify the token with Privy's server SDK
		const verified = await privyClient.verifyAuthToken(privyToken);

		if (!verified) {
			console.error("Failed to verify Privy token");
			return null;
		}

		const user = await privyClient.getUserById(verified.userId);
		if (!user.wallet) {
			throw new Error("User has no wallet");
		}
		const { address } = user.wallet;

		return {
			userId: verified.userId,
			verified: true,
			address,
		};
	} catch (error: unknown) {
		console.error("Error verifying Privy token:", error);
		return null;
	}
}
