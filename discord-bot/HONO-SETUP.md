# Discord Bot with Hono Interactions Endpoint

## 🎯 Two Approaches Available

### 1. Gateway API (Current - `src/index.ts`)

- Bot connects via WebSocket to Discord
- Good for development
- No need for public URL

### 2. Interactions Endpoint (New - `src/interactions-server.ts`)

- Discord sends HTTP requests to your server
- More scalable for production
- Requires public URL or tunneling

## 🚀 Quick Start with Hono Interactions

### Step 1: Install Dependencies

```bash
bun install
```

### Step 2: Environment Variables

```env
# Discord Configuration
DISCORD_TOKEN=your_bot_token
DISCORD_APP_ID=your_application_id
DISCORD_PUBLIC_KEY=your_public_key

# Convex Configuration
CONVEX_HTTP_URL=https://your-deployment.convex.cloud

# Server Configuration
PORT=3000
```

### Step 3: Register Commands

```bash
bun run register-commands
```

### Step 4: Start Interactions Server

```bash
bun run dev-interactions
```

## 🌐 Setting Up Discord Application

1. **Go to Discord Developer Portal** → Your Application → General Information
2. **Copy these values to your `.env`:**
   - Application ID → `DISCORD_APP_ID`
   - Public Key → `DISCORD_PUBLIC_KEY`

3. **Set Interactions Endpoint URL:**
   - Go to "Interactions Endpoint URL"
   - For local development: `https://your-ngrok-url.ngrok.io/interactions`
   - For production: `https://yourdomain.com/interactions`

## 🔧 Local Development with Tunneling

Since Discord needs to reach your server, use ngrok or similar:

```bash
# Install ngrok
npm install -g ngrok

# Start your Hono server
bun run dev-interactions

# In another terminal, expose port 3000
ngrok http 3000
```

Copy the ngrok URL and set it as your Interactions Endpoint URL in Discord:
`https://abc123.ngrok.io/interactions`

## 📊 Testing

### Health Check

```bash
curl http://localhost:3000/health
```

### Discord Command

```
/create-schedule title:"Test Event" start:1735689600 end:1735693200
```

## 🔄 Switching Between Approaches

**Use Gateway API (current):**

```bash
bun run dev
```

**Use Interactions Endpoint (Hono):**

```bash
bun run dev-interactions
```

## 🏗️ Production Deployment

1. **Deploy your Hono server** to a platform like Railway, Fly.io, or Vercel
2. **Set the Interactions Endpoint URL** in Discord Developer Portal
3. **No need for persistent WebSocket connection**

## 🎯 Benefits of Hono Approach

- ✅ **Stateless** - no persistent connections
- ✅ **Scalable** - can handle multiple instances
- ✅ **Production-ready** - HTTP-based architecture
- ✅ **Fast** - Hono is optimized for modern runtimes
- ✅ **Secure** - Request signature verification built-in
