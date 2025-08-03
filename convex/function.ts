import { createEventArgs, deleteEventArgs, updateEventArgs } from "./type";
import { authMutation, authQuery } from "./utils";

export const listEvents = authQuery({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db
      .query("events")
      .withIndex("createdBy", (q) => q.eq("createdBy", ctx.userId))
      .collect();
    return events;
  },
});

export const createEvent = authMutation({
  args: createEventArgs,
  handler: async (ctx, args) => {
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
  handler: async (ctx, args) => {
    await ctx.db.patch(args.eventId, {
      ...args,
      updatedAt: Date.now(),
    });
    return;
  },
});

export const deleteEvent = authMutation({
  args: deleteEventArgs,
  handler: async (ctx, args) => {
    await ctx.db.delete(args.eventId);
    return;
  },
});
