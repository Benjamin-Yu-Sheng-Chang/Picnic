# Discord Account Linking Guide

## 🔐 Secure Account Linking Pattern

### Option 1: Link Command with Verification Code

```typescript
// 1. User runs /link-account command
app.post("/interactions", verifyDiscordRequest, async (c: any) => {
  const interaction = c.get("body");

  if (interaction.data.name === "link-account") {
    const discordUserId = interaction.member?.user?.id || interaction.user?.id;
    const email = interaction.data.options.find(
      (opt) => opt.name === "email",
    )?.value;

    // Generate a temporary verification code
    const verificationCode = generateRandomCode();

    // Store temporarily (Redis, database, etc.)
    await storeVerificationCode(discordUserId, email, verificationCode);

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    return c.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `✅ Verification code sent to ${email}. Check your email and use /verify-link <code>`,
        flags: MessageFlags.Ephemeral,
      },
    });
  }
});
```

### Option 2: Web-based OAuth Flow

```typescript
// Discord user clicks a link that includes their Discord user ID
app.get("/auth/discord/:discordUserId", async (c) => {
  const discordUserId = c.req.param("discordUserId");

  // Redirect to your login page with Discord context
  return c.redirect(
    `/login?discord_user=${discordUserId}&state=${generateState()}`,
  );
});

// After user logs into your existing account
app.post("/auth/link", async (c) => {
  const { discordUserId, userToken, state } = await c.req.json();

  // Verify the user token belongs to an authenticated user
  const user = await validateUserToken(userToken);

  if (user) {
    // Create the link
    await linkDiscordAccount(user.id, discordUserId);
    return c.json({ success: true });
  }
});
```

### Option 3: Database Schema for Account Linking

```sql
-- Users table (your existing users)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  created_at TIMESTAMP
);

-- Discord account links
CREATE TABLE discord_links (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  discord_user_id VARCHAR(255) UNIQUE,
  discord_username VARCHAR(255),
  discord_discriminator VARCHAR(10),
  linked_at TIMESTAMP,
  verified_at TIMESTAMP
);

-- Temporary verification codes
CREATE TABLE verification_codes (
  id UUID PRIMARY KEY,
  discord_user_id VARCHAR(255),
  email VARCHAR(255),
  code VARCHAR(10),
  expires_at TIMESTAMP,
  used_at TIMESTAMP
);
```

## 🛡️ Security Best Practices

### 1. Verify Both Sides

```typescript
async function linkAccounts(existingUserId: string, discordUserId: string) {
  // Verify the existing user is authenticated
  const user = await getAuthenticatedUser(existingUserId);
  if (!user) throw new Error("User not authenticated");

  // Verify Discord user ID format
  if (!/^\d{17,19}$/.test(discordUserId)) {
    throw new Error("Invalid Discord user ID format");
  }

  // Check if Discord account is already linked
  const existingLink = await getDiscordLink(discordUserId);
  if (existingLink) {
    throw new Error("Discord account already linked to another user");
  }

  // Create the link
  await createDiscordLink(user.id, discordUserId);
}
```

### 2. Rate Limiting

```typescript
// Limit linking attempts per Discord user
const attempts = await getRecentLinkAttempts(discordUserId);
if (attempts > 5) {
  throw new Error("Too many linking attempts. Try again later.");
}
```

### 3. Audit Trail

```typescript
// Log all linking activities
await logActivity({
  action: "discord_link_created",
  userId: user.id,
  discordUserId: discordUserId,
  timestamp: new Date(),
  metadata: { verification_method: "email" },
});
```

## 🎯 Implementation Example

### Add Link Command to Your Bot

```typescript
// In register-commands.ts
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
  .setDescription("Verify your account link with the code from email")
  .addStringOption(option =>
    option.setName("code")
      .setDescription("Verification code from email")
      .setRequired(true)
  ),
```

### In Your Convex Functions

```typescript
// convex/discord.ts
export const linkDiscordAccount = mutation({
  args: {
    userId: v.id("users"),
    discordUserId: v.string(),
    verificationCode: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the code
    const storedCode = await ctx.db
      .query("verificationCodes")
      .filter(
        (q) =>
          q.eq(q.field("discordUserId"), args.discordUserId) &&
          q.eq(q.field("code"), args.verificationCode) &&
          q.gt(q.field("expiresAt"), Date.now()),
      )
      .first();

    if (!storedCode) {
      throw new Error("Invalid or expired verification code");
    }

    // Create the link
    await ctx.db.insert("discordLinks", {
      userId: args.userId,
      discordUserId: args.discordUserId,
      verifiedAt: Date.now(),
    });

    // Mark code as used
    await ctx.db.patch(storedCode._id, { usedAt: Date.now() });
  },
});
```

## 🔑 Key Points

1. **Discord User ID Format**: Always 17-19 digit strings
2. **Permanence**: Discord user IDs never change (unlike usernames)
3. **Uniqueness**: Each Discord user has exactly one ID
4. **Trust Level**: High - comes through verified Discord interactions
5. **Privacy**: Don't expose Discord IDs publicly, treat as sensitive data

## ⚠️ Security Warnings

- Never trust client-side Discord user IDs
- Always verify through Discord's interaction system
- Implement rate limiting on linking attempts
- Use temporary verification codes with expiration
- Log all linking activities for audit purposes
- Check for existing links before creating new ones
