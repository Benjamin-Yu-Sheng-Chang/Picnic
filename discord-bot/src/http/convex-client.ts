import "dotenv/config";
import { ConvexHttpClient } from "convex/browser";

// Import without .js extension for better compatibility
import { api } from "../convex/_generated/api";

// Export the client for use in other files
export const convexClient = new ConvexHttpClient(process.env.CONVEX_DEV_URL!);

// Example usage function (instead of top-level await)
export async function testDiscordLinking() {
  try {
    const result = await convexClient.mutation(api.discord.linking.sendOTP, {
      email: "yusheng3077@gmail.com",
      discordUserId: "1234567890",
      discordUsername: "test",
      discordDiscriminator: "1234",
    });
    console.log("OTP sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
}

// Helper functions for Discord bot commands
export async function sendDiscordOTP(args: {
  email: string;
  discordUserId: string;
  discordUsername: string;
  discordDiscriminator?: string;
}) {
  return await convexClient.mutation(api.discord.linking.sendOTP, args);
}

export async function verifyDiscordLink(args: {
  token: string;
  discordUserId: string;
}) {
  return await convexClient.mutation(api.discord.linking.verifyLink, args);
}