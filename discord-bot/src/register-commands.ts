import "dotenv/config";
import { REST, Routes, SlashCommandBuilder } from "discord.js";

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  new SlashCommandBuilder()
    .setName("test")
    .setDescription("Basic test command like Discord's example"),

  new SlashCommandBuilder()
    .setName("link-account")
    .setDescription("Link your Discord account to your existing user account")
    .addStringOption(option =>
      option.setName("email")
        .setDescription("Your account email address")
        .setRequired(true)
    ),
    
  new SlashCommandBuilder()
    .setName("create-schedule")
    .setDescription("Create a new schedule event")
    // Required options first
    .addStringOption((option) =>
      option.setName("title").setDescription("Event title").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("start")
        .setDescription("Start time (Unix timestamp)")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("end")
        .setDescription("End time (Unix timestamp)")
        .setRequired(true)
    )
    // Optional options after required ones
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Event description")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("allday")
        .setDescription("Is this an all-day event?")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("Event color (hex code)")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("location")
        .setDescription("Event location")
        .setRequired(false)
    )
    .addNumberOption((option) =>
      option
        .setName("price")
        .setDescription("Event price")
        .setRequired(false)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

async function registerCommands() {
  try {
    console.log("🔄 Started refreshing application (/) commands.");

    const appId = process.env.DISCORD_APP_ID;
    if (!appId) {
      throw new Error("Missing DISCORD_APP_ID environment variable");
    }

    await rest.put(Routes.applicationCommands(appId), { body: commands });

    console.log("✅ Successfully reloaded application (/) commands.");
    console.log("🎯 Registered commands:");
    commands.forEach((cmd) => console.log(`   /${cmd.name} - ${cmd.description}`));
  } catch (error) {
    console.error("❌ Error registering commands:", error);
  }
}

registerCommands();