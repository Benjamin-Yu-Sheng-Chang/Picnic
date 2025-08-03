import "dotenv/config";
import { 
  Client, 
  GatewayIntentBits, 
  SlashCommandBuilder, 
  REST, 
  Routes,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType
} from "discord.js";
import { createServer } from "http";

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ] 
});

// Slash command definition - Required options must come first!
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  new SlashCommandBuilder()
    .setName('test')
    .setDescription('Basic test command like Discord\'s example'),

  new SlashCommandBuilder()
    .setName('link-account')
    .setDescription('Link your Discord account to your existing user account')
    .addStringOption(option =>
      option.setName('email')
        .setDescription('Your account email address')
        .setRequired(true)
    ),
    
  new SlashCommandBuilder()
    .setName('create-schedule')
    .setDescription('Create a new schedule event')
    // Required options first
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Event title')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('start')
        .setDescription('Start time (Unix timestamp)')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('end')
        .setDescription('End time (Unix timestamp)')
        .setRequired(true))
    // Optional options after required ones
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Event description')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('allday')
        .setDescription('Is this an all-day event?')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('color')
        .setDescription('Event color (hex code)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('location')
        .setDescription('Event location')
        .setRequired(false))
    .addNumberOption(option =>
      option.setName('price')
        .setDescription('Event price')
        .setRequired(false))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

client.on("ready", async (c) => {
  console.log(`🤖 Logged in as ${c.user.username}`);
  console.log(`🆔 Bot ID: ${c.user.id}`);
  console.log(`🌐 Convex URL: ${process.env.CONVEX_HTTP_URL}`);
  
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

// Helper function like in Discord's example
function getRandomEmoji() {
  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply({
      content: '🏓 Pong!',
      ephemeral: true
    });
  }

  if (interaction.commandName === 'test') {
    await interaction.reply({
      content: `hello world ${getRandomEmoji()}`,
      ephemeral: true
    });
  }

  if (interaction.commandName === 'link-account') {
    const email = interaction.options.getString('email', true);
    const discordUserId = interaction.user.id;
    const discordUsername = interaction.user.username;

    console.log('🔗 Account linking request:', {
      email,
      discordUserId,
      discordUsername,
    });

    await interaction.reply({
      content: `🔗 Account linking initiated!\n\n**Discord:** ${discordUsername} (${discordUserId})\n**Email:** ${email}\n\n*In a real implementation, this would send a verification email.*`,
      ephemeral: true
    });
  }

  if (interaction.commandName === 'create-schedule') {
    await handleCreateSchedule(interaction);
  }
});

async function handleCreateSchedule(interaction: ChatInputCommandInteraction) {
  const title = interaction.options.getString('title', true);
  const description = interaction.options.getString('description');
  const start = interaction.options.getInteger('start', true);
  const end = interaction.options.getInteger('end', true);
  const allDay = interaction.options.getBoolean('allday');
  const color = interaction.options.getString('color');
  const location = interaction.options.getString('location');
  const price = interaction.options.getNumber('price');

  // Debug logging
  console.log('📝 Creating schedule with data:', {
    title, description, start, end, allDay, color, location, price,
    userId: interaction.user.id,
    convexUrl: process.env.CONVEX_HTTP_URL
  });

  try {
    // Call the Convex HTTP endpoint
    const response = await fetch(`${process.env.CONVEX_HTTP_URL}/create-schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
        // Note: You'll need to handle authentication/user ID properly
        userId: interaction.user.id // Using Discord user ID as placeholder
      }),
    });

    console.log('📡 Response status:', response.status);

    if (response.ok) {
      const result = await response.json() as { eventId: string; message?: string };
      console.log('✅ Success response:', result);
      await interaction.reply({
        content: `✅ Schedule created successfully! Event ID: ${result.eventId}`,
        ephemeral: true
      });
    } else {
      const error = await response.text();
      console.log('❌ Error response:', error);
      await interaction.reply({
        content: `❌ Failed to create schedule: ${error}`,
        ephemeral: true
      });
    }
  } catch (error) {
    console.error('Error creating schedule:', error);
    await interaction.reply({
      content: '❌ An error occurred while creating the schedule.',
      ephemeral: true
    });
  }
}

client.login(process.env.DISCORD_TOKEN);

// Optional: Simple health check server
const PORT = process.env.PORT || 3000;
const server = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      bot: client.user?.username || 'not ready',
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🌐 Health check server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});