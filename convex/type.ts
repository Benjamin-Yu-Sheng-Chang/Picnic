import { Infer, v } from "convex/values";
import { omit } from "convex-helpers";
import { partial } from "convex-helpers/validators";
import { Doc, Id } from "./_generated/dataModel";

export const eventValidator = {
  // frontend
  title: v.string(),
  description: v.optional(v.string()),
  start: v.number(),
  end: v.number(),
  allDay: v.optional(v.boolean()),
  color: v.optional(v.string()),
  location: v.optional(v.string()),
  price: v.optional(v.number()),

  createdBy: v.id("users"),
  createdAt: v.number(),
  updatedAt: v.number(),
};

export const updateEventArgs = {
  eventId: v.id("events"),
  ...partial(omit(eventValidator, ["createdBy", "createdAt", "updatedAt"])),
};

export const deleteEventArgs = {
  eventId: v.id("events"),
};

export const createEventArgs = omit(eventValidator, [
  "createdBy",
  "createdAt",
  "updatedAt",
]);

const _createEventArgs = v.object(createEventArgs);
const _updateEventArgs = v.object(updateEventArgs);
const _deleteEventArgs = v.object(deleteEventArgs);

export type CreateEventArgs = Infer<typeof _createEventArgs>;
export type UpdateEventArgs = Infer<typeof _updateEventArgs>;
export type DeleteEventArgs = Infer<typeof _deleteEventArgs>;

// for frontend
export type CalendarEvent = Omit<Doc<"events">, "start" | "end"> & {
  start: Date;
  end: Date;
};
export type EventId = Id<"events">;
