import { v } from "convex/values";
import { omit } from "convex-helpers";
import { partial } from "convex-helpers/validators";

export const eventValidator = {
  // frontend
  title: v.string(),
  description: v.optional(v.string()),
  start: v.number(),
  end: v.number(),
  allDay: v.optional(v.boolean()),
  color: v.optional(v.string()),
  location: v.optional(v.string()),

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
