import "dotenv/config";
import { REST, Routes, SlashCommandBuilder } from "discord.js";

export const PING_COMMAND = "ping";
export const LINK_ACCOUNT_COMMAND = "link-account";
export const VERIFY_LINK_COMMAND = "verify-link";
export const CREATE_EVENT_COMMAND = "create-event";
export const UPDATE_EVENT_COMMAND = "update-event";
export const DELETE_EVENT_COMMAND = "delete-event";

export const commands = [
  new SlashCommandBuilder()
    .setName(PING_COMMAND)
    .setDescription("Replies with Pong!"),

  new SlashCommandBuilder()
    .setName(LINK_ACCOUNT_COMMAND)
    .setDescription("Link your Discord account to your existing user account")
    .addStringOption(option =>
      option.setName("email")
        .setDescription("Your account email address")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName(VERIFY_LINK_COMMAND)
    .setDescription("Verify your Discord account")
    .addStringOption(option =>
      option.setName("token")
        .setDescription("The token sent to your email")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName(CREATE_EVENT_COMMAND)
    .setDescription("Create a new event")
    .addStringOption(option =>
      option.setName("title")
        .setDescription("The title of the event")
        .setRequired(true)
    ).addStringOption(option => 
      option.setName("start")
        .setDescription("The start time of the event")
        .setRequired(true)
    ).addStringOption(option =>
      option.setName("end")
        .setDescription("The end time of the event")
        .setRequired(true)
    ).addStringOption(option =>
      option.setName("description")
        .setDescription("The description of the event")
        .setRequired(false)
    ).addBooleanOption(option =>
      option.setName("all-day")
        .setDescription("Whether the schedule is all day")
        .setRequired(false)
    ).addStringOption(option =>
      option.setName("location")
        .setDescription("The location of the event")
        .setRequired(false)
    ).addNumberOption(option =>
      option.setName("price")
        .setDescription("The price of the event")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName(UPDATE_EVENT_COMMAND)
    .setDescription("Update an event")
    .addStringOption(option =>
      option.setName("event-id")
        .setDescription("The ID of the event")
        .setRequired(true)
    ).addStringOption(option =>
      option.setName("title")
        .setDescription("The title of the event")
        .setRequired(false)
    ).addStringOption(option =>
      option.setName("start")
        .setDescription("The start time of the event")
        .setRequired(false)
    ).addStringOption(option =>
      option.setName("end")
        .setDescription("The end time of the event")
        .setRequired(false)
    ).addStringOption(option =>
      option.setName("description")
        .setDescription("The description of the event")
        .setRequired(false)
    ).addBooleanOption(option =>
      option.setName("all-day")
        .setDescription("Whether the schedule is all day")
        .setRequired(false)
    ).addStringOption(option =>
      option.setName("location")
        .setDescription("The location of the event")
        .setRequired(false)
    ).addNumberOption(option =>
      option.setName("price")
        .setDescription("The price of the event")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName(DELETE_EVENT_COMMAND)
    .setDescription("Delete an event")
    .addStringOption(option =>
      option.setName("event-id")
        .setDescription("The ID of the event")
        .setRequired(true)
    )
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