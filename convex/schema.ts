import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { eventValidator } from "./type";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),

  authSessions: defineTable({
    userId: v.id("users"),
    expirationTime: v.number(),
  }).index("userId", ["userId"]),

  authAccounts: defineTable({
    userId: v.id("users"),
    provider: v.string(),
    providerAccountId: v.string(),
    secret: v.optional(v.string()),
    emailVerified: v.optional(v.string()),
    phoneVerified: v.optional(v.string()),
  })
    .index("userIdAndProvider", ["userId", "provider"])
    .index("providerAndAccountId", ["provider", "providerAccountId"]),

  authRefreshTokens: defineTable({
    sessionId: v.id("authSessions"),
    expirationTime: v.number(),
    firstUsedTime: v.optional(v.number()),
    // This is the ID of the refresh token that was exchanged to create this one.
    parentRefreshTokenId: v.optional(v.id("authRefreshTokens")),
  })
    // Sort by creationTime
    .index("sessionId", ["sessionId"])
    .index("sessionIdAndParentRefreshTokenId", [
      "sessionId",
      "parentRefreshTokenId",
    ]),

  authVerificationCodes: defineTable({
    accountId: v.id("authAccounts"),
    provider: v.string(),
    code: v.string(),
    expirationTime: v.number(),
    verifier: v.optional(v.string()),
    emailVerified: v.optional(v.string()),
    phoneVerified: v.optional(v.string()),
  })
    .index("accountId", ["accountId"])
    .index("code", ["code"]),

  authVerifiers: defineTable({
    sessionId: v.optional(v.id("authSessions")),
    signature: v.optional(v.string()),
  }).index("signature", ["signature"]),

  authRateLimits: defineTable({
    identifier: v.string(),
    lastAttemptTime: v.number(),
    attemptsLeft: v.number(),
  }).index("identifier", ["identifier"]),

    // Discord account linking
  discordLinks: defineTable({
    userId: v.id("users"),
    discordUserId: v.string(), // Discord's user ID (e.g., "123456789012345678")
    discordUsername: v.string(), // Discord username (e.g., "john_doe")
    discordDiscriminator: v.optional(v.string()), // Legacy discriminator (e.g., "#1234")
    linkedAt: v.number(), // When the link was created
    verifiedAt: v.optional(v.number()), // When the link was verified
    isActive: v.boolean(), // Whether the link is currently active
  })
    .index("userId", ["userId"])
    .index("discordUserId", ["discordUserId"])
    .index("discordUsername", ["discordUsername"])
    .index("activeLinks", ["isActive", "userId"]),

  // Temporary verification codes for Discord linking
  discordVerificationCodes: defineTable({
    discordUserId: v.string(),
    discordUsername: v.string(),
    discordDiscriminator: v.optional(v.string()),
    email: v.string(),
    code: v.string(), // 6-digit verification code
    expiresAt: v.number(),
    usedAt: v.optional(v.number()),
  })
    .index("discordUserId", ["discordUserId"])
    .index("email", ["email"])
    .index("code", ["code"])
    .index("expiresAt", ["expiresAt"]),

  events: defineTable(eventValidator).index("createdBy", ["createdBy"]),
});
