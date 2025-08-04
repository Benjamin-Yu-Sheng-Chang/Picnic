import "dotenv/config";
import { Hono } from "hono";
import * as nacl from "tweetnacl";
import {
  InteractionType,
  InteractionResponseType,
  ApplicationCommandOptionType,
  ComponentType,
  MessageFlags,
} from "discord.js";
import { sendDiscordOTP, verifyDiscordLink } from "./http/convex-client";
import { ConvexError } from "convex/values";

const app = new Hono();



// Discord verification middleware
const verifyDiscordRequest = async (c: any, next: () => Promise<void>) => {
  const signature = c.req.header("x-signature-ed25519");
  const timestamp = c.req.header("x-signature-timestamp");
  const body = await c.req.text();

  if (!signature || !timestamp) {
    return c.text("Missing signature headers", 401);
  }

  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!publicKey) {
    console.error("Missing DISCORD_PUBLIC_KEY");
    return c.text("Server configuration error", 500);
  }

  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, "hex"),
    Buffer.from(publicKey, "hex")
  );

  if (!isVerified) {
    return c.text("Invalid request signature", 401);
  }

  // Store the parsed body for the route handler
  c.set("body", JSON.parse(body));
  await next();
};

// Health check endpoint  
app.get("/health", (c: any) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Discord Interactions Server",
  });
});

// Discord interactions endpoint
app.post("/interactions", verifyDiscordRequest, async (c: any) => {
  // Interaction type and data (following Discord's official pattern)
  const { type, id, data, member } = c.get("body");

  console.log("📥 Member:", member);

  /**
   * Handle verification requests
   */
  if (type === InteractionType.Ping) {
    console.log("🏓 Responding to ping");
    return c.json({ type: InteractionResponseType.Pong});
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.ApplicationCommand) {
    const { name, options } = data;

    console.log(`⚡ Command received: /${name}`);

    // "ping" command
    if (name === "ping") {
      return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "🏓 Pong! " + id,
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    if (name === "link-account") {
      try {
        await sendDiscordOTP({
        email: options[0].value, // email is the first option
        discordUserId: member.user.id,
        discordUsername: member.user.username,
        discordDiscriminator: member.user.discriminator,
       });
       return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "Linking account, please check your email for the verification code",
        },
      });
      } catch (error) {
        if(error instanceof ConvexError) {
          return c.json({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              content: error.message,
            },
          });
        }
        return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: "Unknown error sending Discord OTP",
          },
        });
      }
    }

    if (name === "verify-link") {
      try {
        await verifyDiscordLink({
          token: options[0].value, // token is the first option
          discordUserId: member.user.id,
        });
        return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: "Verification successful",
          },
        });
      } catch (error) {
        if(error instanceof ConvexError) {
          return c.json({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              content: error.message,
            },
          });
        }
        return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: "Unknown error verifying Discord link",
          },
        });
      }
    }
  }

  // Unknown command
  return c.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: "Unknown command",
      flags: MessageFlags.Ephemeral,
    },
  });
});


const PORT = process.env.PORT || 3000;

console.log(`🌐 Starting Discord Interactions Server on port ${PORT}`);
console.log(`📍 Interactions endpoint: http://localhost:${PORT}/interactions`);
console.log(`🔍 Health check: http://localhost:${PORT}/health`);

// Start the server
Bun.serve({
  port: PORT,
  fetch: app.fetch,
});

console.log(`✅ Server is now listening on port ${PORT}`);