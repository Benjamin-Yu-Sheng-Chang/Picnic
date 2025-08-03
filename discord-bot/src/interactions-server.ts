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

const app = new Hono();

// Helper function like in Discord's example
function getRandomEmoji() {
  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'];
  return emojis[Math.floor(Math.random() * emojis.length)];
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
  const { type, id, data } = c.get("body");

  console.log("📥 Received interaction:", type);

  /**
   * Handle verification requests
   */
  if (type === InteractionType.Ping) {
    console.log("🏓 Responding to ping");
    return c.json({ type: InteractionResponseType.Pong, id: id });
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

    // "test" command (following Discord's official example pattern)
    if (name === "test") {
      return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `hello world ${getRandomEmoji()}`,
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    // "link-account" command
    if (name === "link-account") {
      return await handleLinkAccountCommand(c, { type, id, data, options });
    }

    // "create-schedule" command
    if (name === "create-schedule") {
      return await handleCreateScheduleCommand(c, { type, id, data, options });
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

async function handleCreateScheduleCommand(c: any, interaction: any) {
  const { options } = interaction;
  // Parse options
  const getOption = (name: string) => 
    options?.find((opt) => opt.name === name)?.value;

  const title = getOption("title");
  const start = getOption("start");
  const end = getOption("end");
  const description = getOption("description");
  const allDay = getOption("allday");
  const color = getOption("color");
  const location = getOption("location");
  const price = getOption("price");

  console.log("📝 Creating schedule with data:", {
    title, description, start, end, allDay, color, location, price,
    userId: interaction.member?.user?.id || interaction.user?.id,
  });

  try {
    // Call Convex HTTP endpoint
    const response = await fetch(`${process.env.CONVEX_HTTP_URL}/create-schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        start,
        end,
        allDay,
        color,
        location,
        price,
        userId: interaction.member?.user?.id || interaction.user?.id,
      }),
    });

    console.log("📡 Convex response status:", response.status);

    if (response.ok) {
      const result = await response.json() as { eventId: string; message?: string };
      console.log("✅ Success response:", result);

      return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `✅ Schedule created successfully! Event ID: ${result.eventId}`,
          flags: MessageFlags.Ephemeral,
        },
      });
    } else {
      const error = await response.text();
      console.log("❌ Error response:", error);

      return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `❌ Failed to create schedule: ${error}`,
          flags: MessageFlags.Ephemeral,
        },
      });
    }
  } catch (error) {
    console.error("❌ Error creating schedule:", error);

    return c.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "❌ An error occurred while creating the schedule.",
        flags: MessageFlags.Ephemeral,
      },
    });
  }
}

async function handleLinkAccountCommand(c: any, interaction: any) {
  const { options } = interaction;
  const getOption = (name: string) => 
    options?.find((opt) => opt.name === name)?.value;

  const email = getOption("email");
  const discordUserId = interaction.member?.user?.id || interaction.user?.id;
  const discordUsername = interaction.member?.user?.username || interaction.user?.username;

  console.log("🔗 Account linking request:", {
    email,
    discordUserId,
    discordUsername,
  });

  try {
    // Here you would typically:
    // 1. Validate email format
    // 2. Check if Discord account already linked
    // 3. Send verification email or create link directly
    // 4. Store in your database

    // For now, we'll just simulate success
    return c.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `🔗 Account linking initiated!\n\n**Discord:** ${discordUsername} (${discordUserId})\n**Email:** ${email}\n\n*In a real implementation, this would send a verification email.*`,
        flags: MessageFlags.Ephemeral,
      },
    });
  } catch (error) {
    console.error("❌ Error linking account:", error);
    return c.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "❌ An error occurred while linking your account.",
        flags: MessageFlags.Ephemeral,
      },
    });
  }
}

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