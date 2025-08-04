import "dotenv/config";
import { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes,
} from "discord.js";

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ] 
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

client.on("ready", async (c) => {
  console.log(`🤖 Logged in as ${c.user.username}`);
  console.log(`🆔 Bot ID: ${c.user.id}`);
  console.log(`🌐 Convex URL: ${process.env.CONVEX_DEV_URL}`);
  
  try {
    console.log('🔄 Started refreshing application (/) commands.');

    // Use environment variable for app ID if available, otherwise use bot's user ID
    const appId = process.env.DISCORD_APP_ID || c.user.id;
    
    await rest.put(
      Routes.applicationCommands(appId),
      { body: commands },
    );

    console.log('✅ Successfully reloaded application (/) commands.');
    console.log('🎯 Available commands:');
    commands.forEach(cmd => console.log(`   /${cmd.name} - ${cmd.description}`));
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
});

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
import { createEvent, sendDiscordOTP, updateEvent, verifyDiscordLink, deleteEvent } from "./http/convex-client";
import { ConvexError } from "convex/values";
import { commands, CREATE_EVENT_COMMAND, DELETE_EVENT_COMMAND, LINK_ACCOUNT_COMMAND, PING_COMMAND, UPDATE_EVENT_COMMAND, VERIFY_LINK_COMMAND } from "./register-commands";

const app = new Hono();

const logMessage = (c: any, message: string) => {
  return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: message,
          },
        });
}

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
  const { type, data, member } = c.get("body");
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
    if (name === PING_COMMAND) {
      return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "🏓 Pong! " + id,
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    if (name === LINK_ACCOUNT_COMMAND) {
      try {
        await sendDiscordOTP({
        email: options[0].value, // email is the first option
        discordUserId: member.user.id,
        discordUsername: member.user.username,
        discordDiscriminator: member.user.discriminator,
       });
       return logMessage(c, "Linking account, please check your email for the verification code");
      } catch (error) {
        if(error instanceof ConvexError) {
          return logMessage(c, error.message);
        }
        return logMessage(c, "Unknown error sending Discord OTP");
      }
    }

    if (name === VERIFY_LINK_COMMAND) {
      try {
        await verifyDiscordLink({
          token: options[0].value, // token is the first option
          discordUserId: member.user.id,
        });
        return logMessage(c, "Verification successful");
      } catch (error) {
        if(error instanceof ConvexError) {
          return logMessage(c, error.message);
        }
        return logMessage(c, "Unknown error verifying Discord link");
      }
    }

    if (name === CREATE_EVENT_COMMAND) {
      console.log("🔄 Creating event");
      try {
        await createEvent({
          // title: options[0].value,
          // start: options[1].value,
          // end: options[2].value,
          // description: options[3].value,
          // allDay: options[4].value,
          // location: options[5].value,
          // price: options[6].value,
          // discordUserId: member.user.id,
          discordUserId: member.user.id,
          title: "Test",
          start: "2025-08-03T12:00:00.000Z",
          end: "2025-08-03T13:00:00.000Z",
        });
        return logMessage(c, "Event created");
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
            content: "Unknown error creating schedule",
          },
        });
      }
    }

    if (name === UPDATE_EVENT_COMMAND) {
      try {
        await updateEvent({
          eventId: options[0].value,
          title: options[1].value,
          start: options[2].value,
          end: options[3].value,
          description: options[4].value,
          allDay: options[5].value,
          location: options[6].value,
          price: options[7].value,
          discordUserId: member.user.id,
        });
        return logMessage(c, "Event updated");
      } catch (error) {
        if(error instanceof ConvexError) {
          return logMessage(c, error.message);
        }
        return logMessage(c, "Unknown error updating event");
      }
    }

    if (name === DELETE_EVENT_COMMAND) {
      try {
        await deleteEvent({
          eventId: options[0].value,
          discordUserId: member.user.id,
        });
        return logMessage(c, "Event deleted");
      } catch (error) {
        if(error instanceof ConvexError) {
          return logMessage(c, error.message);
        }
        return logMessage(c, "Unknown error deleting event");
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