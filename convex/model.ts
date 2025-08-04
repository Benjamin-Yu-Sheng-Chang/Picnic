import { CreateEventArgs, DeleteEventArgs, UpdateEventArgs, UserId, ValidateDiscordLinkArgs } from "./type";
import { MutationCtx, QueryCtx } from "./_generated/server";

export async function ListEvents(ctx: QueryCtx, args: { userId: UserId }) {
   const events = await ctx.db
      .query("events")
      .withIndex("createdBy", (q: any) => q.eq("createdBy", args.userId))
      .collect();

   return events;
}

export async function CreateEvent(ctx: MutationCtx, args: CreateEventArgs & { userId: UserId }) {
  const eventToCreate = {
    title: args.title,
    start: args.start,
    end: args.end,
    ...(args.allDay && { allDay: args.allDay }),
    ...(args.description && { description: args.description }),
    ...(args.location && { location: args.location }),
    ...(args.price && { price: args.price }),
    createdBy: args.userId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  
  const newEventId = await ctx.db.insert("events", eventToCreate);
 return newEventId;
}

export async function UpdateEvent(ctx: MutationCtx, args: UpdateEventArgs & { userId: UserId }) {
   const existingEvent = await ctx.db.get(args.eventId);
    if (!existingEvent || existingEvent.createdBy !== args.userId) {
      throw new Error("Event not found or not authorized");
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
}

export async function DeleteEvent(ctx: MutationCtx, args: DeleteEventArgs & { userId: UserId }) {
  const existingEvent = await ctx.db.get(args.eventId);
  if (!existingEvent || existingEvent.createdBy !== args.userId) {
    throw new Error("Event not found or not authorized");
  }
  await ctx.db.delete(args.eventId);
}

export async function GetDiscordLink(ctx: QueryCtx | MutationCtx, args: ValidateDiscordLinkArgs) {
    const existingLink = await ctx.db.query("discordLinks").withIndex("discordUserId", (q: any) => q.eq("discordUserId", args.discordUserId)).unique();
    return existingLink;
}
