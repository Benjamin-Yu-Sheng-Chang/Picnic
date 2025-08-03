# Testing the Discord Bot & Convex Integration

## 🎯 Method 1: Test in Discord (Recommended)

1. **Start your bot:**

   ```bash
   bun run dev
   # or
   npm run dev
   ```

2. **Use the slash command in Discord:**

   ```
   /create-schedule title:"Team Meeting" start:1735689600 end:1735693200
   ```

3. **Watch the console logs** for debug information.

## 🧪 Method 2: Test HTTP Endpoint Directly

1. **Update the Convex URL** in `test-endpoint.js`
2. **Run the test script:**
   ```bash
   npm run test-endpoint
   ```

## 📝 Example Commands for Discord

### Basic event:

```
/create-schedule title:"Quick Meeting" start:1735689600 end:1735693200
```

### Full event with all options:

```
/create-schedule title:"Company Retreat" start:1735689600 end:1735693200 description:"Annual company retreat" allday:true color:"#ff5500" location:"Beach Resort" price:150.00
```

## 🔧 Unix Timestamp Helpers

- **Current time + 1 hour:** `Math.floor(Date.now()/1000) + 3600`
- **Current time + 2 hours:** `Math.floor(Date.now()/1000) + 7200`
- **Online converter:** [epochconverter.com](https://www.epochconverter.com/)

## 🐛 Debugging Checklist

1. ✅ Convex deployment is live
2. ✅ `CONVEX_HTTP_URL` is correct in `.env`
3. ✅ `DISCORD_TOKEN` is set
4. ✅ Bot has permissions in Discord server
5. ✅ Console shows debug logs when command is used

## ❓ Common Issues

- **"Missing permissions"** → Reinvite bot with application.commands scope
- **"Invalid timestamp"** → Use Unix timestamps (seconds, not milliseconds)
- **"HTTP 404"** → Check Convex URL and deployment status
- **"No response"** → Check environment variables and console logs
