import "dotenv/config";
import { REST, Routes, SlashCommandBuilder } from "discord.js";

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  new SlashCommandBuilder()
    .setName("link-account")
    .setDescription("Link your Discord account to your existing user account")
    .addStringOption(option =>
      option.setName("email")
        .setDescription("Your account email address")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("verify-link")
    .setDescription("Verify your Discord account")
    .addStringOption(option =>
      option.setName("token")
        .setDescription("The token sent to your email")
        .setRequired(true)
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