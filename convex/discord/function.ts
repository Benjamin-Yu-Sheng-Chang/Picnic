import { mutation, MutationCtx } from "../_generated/server";
import { ConvexError } from "convex/values";
import { DiscordCreateEventArgs, discordCreateEventArgs, DiscordDeleteEventArgs, discordDeleteEventArgs, DiscordUpdateEventArgs, discordUpdateEventArgs } from "../type";
import * as Model from "../model";

export const discordCreateEvent = mutation({
  args: discordCreateEventArgs,
  handler: async (ctx: MutationCtx, args: DiscordCreateEventArgs) => {
    const link = await Model.GetDiscordLink(ctx, { discordUserId: args.discordUserId });
    if (!link) {
      throw new ConvexError("Discord link not found");
    }
    return await Model.CreateEvent(ctx, { ...args, userId: link.userId });
  },
});

export const discordUpdateEvent = mutation({
  args: discordUpdateEventArgs,
  handler: async (ctx: MutationCtx, args: DiscordUpdateEventArgs) => {
    const link = await Model.GetDiscordLink(ctx, { discordUserId: args.discordUserId });
    if (!link) {
      throw new ConvexError("Discord link not found");
    }
    return await Model.UpdateEvent(ctx, { ...args, userId: link.userId });
  },
});

export const discordDeleteEvent = mutation({
  args: discordDeleteEventArgs,
  handler: async (ctx: MutationCtx, args: DiscordDeleteEventArgs) => {
    const link = await Model.GetDiscordLink(ctx, { discordUserId: args.discordUserId });
    if (!link) {
      throw new ConvexError("Discord link not found");
    }
    return await Model.DeleteEvent(ctx, { ...args, userId: link.userId });
  },
});