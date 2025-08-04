import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { eventValidator } from "./type";

export default defineSchema({
  users: defineTable({
    discordUserId: v.string(), // Discord's user ID (e.g., "123456789012345678")
    discordUsername: v.string(), // Discord username (e.g., "john_doe")
    discordDiscriminator: v.optional(v.string()), // Legacy discriminator (e.g., "#1234")
    email: v.string(),
    createdAt: v.number(),
    verifiedAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("discordUserId", ["discordUserId"])
    .index("discordUsername", ["discordUsername"]),

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
