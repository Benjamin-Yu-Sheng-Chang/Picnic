import {
  CreateEventArgs,
  createEventArgs,
  DeleteEventArgs,
  deleteEventArgs,
  UpdateEventArgs,
  updateEventArgs,
} from "./type";
import { authMutation, AuthMutationCtx, authQuery, AuthQueryCtx } from "./utils";

import * as Model from "./model";

export const listEvents = authQuery({
  args: {},
  handler: async (ctx: AuthQueryCtx) => {
    return await Model.ListEvents(ctx, { userId: ctx.userId });
  },
});

export const createEvent = authMutation({
  args: createEventArgs,
  handler: async (ctx: AuthMutationCtx, args: CreateEventArgs) => {
    return await Model.CreateEvent(ctx, { ...args, userId: ctx.userId });
  },
});

export const updateEvent = authMutation({
  args: updateEventArgs,
  handler: async (ctx: AuthMutationCtx, args: UpdateEventArgs) => {
    return await Model.UpdateEvent(ctx, { ...args, userId: ctx.userId });
  }
});

export const deleteEvent = authMutation({
  args: deleteEventArgs,
  handler: async (ctx: AuthMutationCtx, args: DeleteEventArgs) => {
    return await Model.DeleteEvent(ctx, { ...args, userId: ctx.userId });
  },
});

