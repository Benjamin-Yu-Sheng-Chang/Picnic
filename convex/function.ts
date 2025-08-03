import {
  createEventArgs,
  deleteEventArgs,
  UpdateEventArgs,
  updateEventArgs,
} from "./type";
import { authMutation, authQuery } from "./utils";

export const listEvents = authQuery({
  args: {},
  handler: async (ctx: any) => {
    const events = await ctx.db
      .query("events")
      .withIndex("createdBy", (q: any) => q.eq("createdBy", ctx.userId))
      .collect();

    return events;
  },
});

export const createEvent = authMutation({
  args: createEventArgs,
  handler: async (ctx: any, args: any) => {
    const newEventId = await ctx.db.insert("events", {
      ...args,
      createdBy: ctx.userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return newEventId;
  },
});

export const updateEvent = authMutation({
  args: updateEventArgs,
  handler: async (ctx: any, args: any) => {
    const existingEvent = await ctx.db.get(args.eventId);
    if (!existingEvent) {
      throw new Error("Event not found");
    }
    const patchData: Omit<UpdateEventArgs, "eventId"> = {
      ...(args.title &&
        args.title !== existingEvent.title && { title: args.title }),
      ...(args.description &&
        args.description !== existingEvent.description && {
          description: args.description,
        }),
      ...(args.start &&
        args.start !== existingEvent.start && { start: args.start }),
      ...(args.end && args.end !== existingEvent.end && { end: args.end }),
      ...(args.allDay &&
        args.allDay !== existingEvent.allDay && { allDay: args.allDay }),
      ...(args.color &&
        args.color !== existingEvent.color && { color: args.color }),
      ...(args.location &&
        args.location !== existingEvent.location && {
          location: args.location,
        }),
      ...(args.price &&
        args.price !== existingEvent.price && { price: args.price }),
    };
    if (Object.keys(patchData).length === 0) {
      return;
    }
    await ctx.db.patch(args.eventId, {
      ...patchData,
      updatedAt: Date.now(),
    });
    return;
  },
});

export const deleteEvent = authMutation({
  args: deleteEventArgs,
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args.eventId);
    return;
  },
});

// Internal mutation for creating events from external sources (like Discord bot)
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const createEventInternal = internalMutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    start: v.number(),
    end: v.number(),
    allDay: v.optional(v.boolean()),
    color: v.optional(v.string()),
    location: v.optional(v.string()),
    price: v.optional(v.number()),
    discordUserId: v.string(), // Discord user ID
  },
  returns: v.id("events"),
  handler: async (ctx, args) => {
    const { discordUserId, ...eventData } = args;
    
    // Find or create a user for this Discord user
    // First, try to find a user with a matching external ID or create a system user
    let userId: any;
    
    try {
      // Look for existing system user (you might want to create one manually first)
      const systemUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("name"), "Discord Bot"))
        .first();
      
      if (systemUser) {
        userId = systemUser._id;
      } else {
        // Create a system user for Discord events
        userId = await ctx.db.insert("users", {
          name: "Discord Bot",
          email: "discord-bot@system.local"
        });
      }
    } catch (error) {
      // If there's an issue with user creation, we'll need to handle it
      throw new Error(`Failed to get or create user: ${error}`);
    }
    
    // Create the event
    const newEventId = await ctx.db.insert("events", {
      ...eventData,
      createdBy: userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return newEventId;
  },
});
