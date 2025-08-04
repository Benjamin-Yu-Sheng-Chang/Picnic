import {
  CreateEventArgs,
  createEventArgs,
  CreateUserArgs,
  DeleteEventArgs,
  deleteEventArgs,
  listEventsArgs,
  ListEventsArgs,
  UpdateEventArgs,
  updateEventArgs,
} from "./type";


import * as Model from "./model";
import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "_generated/server";

export const createUser = mutation({
  args: {
    email: v.string(),
    discordUserId: v.string(),
    discordUsername: v.string(),
    discordDiscriminator: v.string(),
  },
  handler: async (ctx: MutationCtx, args: CreateUserArgs) => {
    return await Model.CreateUser(ctx, args);
  },
});

export const listEvents = query({
  args: listEventsArgs,
  handler: async (ctx: QueryCtx, args: ListEventsArgs) => {
    return await Model.ListEvents(ctx, { discordUserId: args.discordUserId });
  },
});

export const createEvent = mutation({
  args: createEventArgs,
  handler: async (ctx: MutationCtx, args: CreateEventArgs) => {
    return await Model.CreateEvent(ctx, args);
  },
});

export const updateEvent = mutation({
  args: updateEventArgs,
  handler: async (ctx: MutationCtx, args: UpdateEventArgs) => {
    return await Model.UpdateEvent(ctx, args);
  }
});

export const deleteEvent = mutation({
  args: deleteEventArgs,
  handler: async (ctx: MutationCtx, args: DeleteEventArgs) => {
    return await Model.DeleteEvent(ctx, args);
  },
});

