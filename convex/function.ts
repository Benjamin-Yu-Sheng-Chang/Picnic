import {
  createEventArgs,
  deleteEventArgs,
  UpdateEventArgs,
  updateEventArgs,
} from "./type";
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
  handler: async (ctx, args) => {
    await ctx.db.delete(args.eventId);
    return;
  },
});
