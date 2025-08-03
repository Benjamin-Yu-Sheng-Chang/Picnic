# Discord Bot - WebSocket Gateway

A Discord bot using the WebSocket Gateway approach for handling Discord slash commands and integrating with Convex.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Setup

Create a `.env` file:

```env
# Discord Configuration
DISCORD_TOKEN=your_bot_token
DISCORD_APP_ID=your_application_id
DISCORD_PUBLIC_KEY=your_public_key

# Convex Configuration
CONVEX_HTTP_URL=https://your-deployment.convex.cloud

# Server Configuration (for health check)
PORT=3000
```

### 3. Register Commands

```bash
bun run register-commands
```

### 4. Start the Bot

```bash
bun run dev
```

## 🎯 Available Commands

- `/ping` - Simple test command that replies "🏓 Pong!"
- `/test` - Test command with random emoji
- `/create-schedule` - Create a new calendar event via Convex

## 📁 Project Structure

```
src/
├── index.ts                # Main WebSocket Gateway bot
├── interactions-server.ts  # Alternative HTTP interactions server
├── register-commands.ts    # Script to register commands with Discord
└── ...

.env                       # Environment variables
package.json              # Project configuration
```

## 🔧 Scripts

- `bun run dev` - Start the WebSocket Gateway bot (recommended)
- `bun run dev-interactions` - Start the HTTP interactions server (alternative)
- `bun run register-commands` - Register slash commands with Discord
- `bun run build` - Build for production
- `bun run start` - Start production build

## 🏗️ How It Works

This bot uses Discord's **WebSocket Gateway API**:

- **Persistent connection** to Discord via WebSocket
- **Real-time** event handling
- **Simpler setup** - no public URL needed for development
- **Built-in health check server** on port 3000

## 🔍 Debugging

Health check endpoint: `http://localhost:3000/health`

```bash
curl http://localhost:3000/health
```

You should see the bot online in Discord and the slash commands should work immediately after starting with `bun run dev`.
