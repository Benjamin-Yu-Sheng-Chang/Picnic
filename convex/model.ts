import { CreateEventArgs, CreateUserArgs, DeleteEventArgs, ListEventsArgs, UpdateEventArgs, UserId, ValidateDiscordAccountArgs } from "./type";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { ConvexError } from "convex/values";

export async function CreateUser(ctx: MutationCtx, args: CreateUserArgs) {
  return await ctx.db.insert("users", { email: args.email, discordUserId: args.discordUserId, discordUsername: args.discordUsername, discordDiscriminator: args.discordDiscriminator, createdAt: Date.now() });
}

export async function ListEvents(ctx: QueryCtx, args: ListEventsArgs) {
  const user = await GetUserWithDiscordId(ctx, { discordUserId: args.discordUserId });
  if (!user) return [];
   const events = await ctx.db
      .query("events")
      .withIndex("createdBy", (q: any) => q.eq("createdBy", user._id))
      .collect();

   return events;
}

export async function CreateEvent(ctx: MutationCtx, args: CreateEventArgs) {
  const user = await GetUserWithDiscordId(ctx, { discordUserId: args.discordUserId });
  if (!user) {
    throw new ConvexError("User not found");
  }
  const eventToCreate = {
    title: args.title,
    start: args.start,
    end: args.end,
    ...(args.allDay && { allDay: args.allDay }),
    ...(args.description && { description: args.description }),
    ...(args.location && { location: args.location }),
    ...(args.price && { price: args.price }),
    createdBy: user._id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  
  const newEventId = await ctx.db.insert("events", eventToCreate);
  
  const event = await ctx.db.get(newEventId);
  return event;
}

export async function UpdateEvent(ctx: MutationCtx, args: UpdateEventArgs) {
  const user = await GetUserWithDiscordId(ctx, { discordUserId: args.discordUserId });
  if (!user) {
    throw new ConvexError("User not found");
  }
  const existingEvent = await ctx.db.get(args.eventId);
  if (!existingEvent || existingEvent.createdBy !== user._id) {
    throw new ConvexError("Event not found or not authorized");
  }
    const patchData: Omit<UpdateEventArgs, "eventId" | "discordUserId"> = {
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
  const updatedEvent = await ctx.db.get(args.eventId);
  return updatedEvent;
}

export async function DeleteEvent(ctx: MutationCtx, args: DeleteEventArgs) {
  const user = await GetUserWithDiscordId(ctx, { discordUserId: args.discordUserId });
  if (!user) {
    throw new ConvexError("User not found");
  }
  const existingEvent = await ctx.db.get(args.eventId);
  if (!existingEvent || existingEvent.createdBy !== user._id) {
    throw new ConvexError("Event not found or not authorized");
  }
  await ctx.db.delete(args.eventId);
}

export async function GetUserWithDiscordId(ctx: QueryCtx | MutationCtx, args: ValidateDiscordAccountArgs) {
    const existingUser = await ctx.db.query("users").withIndex("discordUserId", (q: any) => q.eq("discordUserId", args.discordUserId)).first();
    return existingUser;
}
