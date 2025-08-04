# 🎉 Picnic - Discord Event Management System

This project leverages Convex and Resend for the backend, with a lightweight Vite frontend for viewing and managing scheduled events. The core functionality centers around a Discord bot tightly integrated with Convex, allowing users to create, update, and delete events directly through Discord interactions. Additionally, we implemented a custom OTP-based Discord account verification system, using Resend to send email codes and link user identities. While the current version focuses on core scheduling and account linking, future improvements could include features like event participation, reminders, and richer Discord UI components.

**[Demo Link](https://www.youtube.com/watch?v=1jdms3HfBZ4)**

## 🚀 Features

### Core Functionality

- **Discord Bot Integration**: Create, update, and delete events directly from Discord using slash commands
- **Real-time Event Management**: Powered by Convex for instant data synchronization
- **Email Verification**: Custom OTP implementation using Resend for Discord account verification
- **Web Dashboard**: Clean Vite-powered frontend to view and manage events
- **Natural Language Dates**: Smart date parsing using chrono-node (e.g., "tomorrow at 3pm")

### Discord Commands

- `/create-event` - Create new events with title, dates, description, location, and price
- `/update-event` - Modify existing events
- `/delete-event` - Remove events
- `/verify-account` - Link Discord account with email verification
- `/create-account` - Register new user accounts

## 🛠️ Tech Stack

### Backend

- **[Convex](https://convex.dev)** - Real-time database and backend functions
- **[Resend](https://resend.com)** - Email service for OTP verification
- **[Discord.js](https://discord.js.org)** - Discord bot framework

### Frontend

- **[Vite](https://vitejs.dev)** - Lightning-fast development and build tool
- **[React 19](https://react.dev)** - UI framework with latest features
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first styling
- **[TypeScript](https://typescriptlang.org)** - Type safety throughout

### Additional Tools

- **[Hono](https://hono.dev)** - Lightweight web framework for Discord interactions
- **[chrono-node](https://github.com/wanasit/chrono)** - Natural language date parsing
- v - Fast JavaScript runtime for Discord bot

## 📁 Project Structure

```
picnic/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React Context providers (Discord auth)
│   └── Calendar.tsx       # Main calendar view
├── convex/                 # Backend functions and schema
│   ├── schema.ts          # Database schema definitions
│   ├── function.ts        # Main CRUD operations
│   ├── model.ts          # Data layer logic
│   └── discord/          # Discord-specific functions
├── discord-bot/           # Discord bot application
│   ├── src/
│   │   ├── index.ts      # Main bot logic
│   │   ├── register-commands.ts  # Slash command definitions
│   │   └── http/         # Convex client integration
│   └── package.json      # Bot-specific dependencies
└── package.json          # Main project dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Discord Application with Bot Token
- Resend API Key for email services
- Convex account

### 1. Clone and Install

```bash
git clone <repository-url>
cd picnic
bun install

# Install Discord bot dependencies
cd discord-bot
bun install
cd ..
```

### 2. Environment Setup

#### Main Project (.env.local)

```env
CONVEX_DEPLOYMENT=your-convex-deployment
NEXT_PUBLIC_CONVEX_URL=your-convex-url
RESEND_API_KEY=your-resend-api-key
```

#### Discord Bot (.env)

```env
DISCORD_TOKEN=your-discord-bot-token
DISCORD_APP_ID=your-discord-application-id
CONVEX_DEV_URL=your-convex-url
```

**[Discord Doc](https://discord.com/developers/docs/activities/building-an-activity)**

### 3. Database Setup

```bash
# Initialize Convex and deploy schema
npm run dev:backend
```

### 4. Discord Bot Setup

```bash
cd discord-bot

# Register slash commands
bun run register-commands

# Start the bot
bun run dev
```

### 5. Start Frontend

```bash
npm run dev:frontend
```
