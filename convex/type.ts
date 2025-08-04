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

export const discordCreateEventArgs = {
  ...createEventArgs,
  discordUserId: v.string(),
}
export const discordUpdateEventArgs = {
  ...updateEventArgs,
  discordUserId: v.string(),
}
export const discordDeleteEventArgs = {
  ...deleteEventArgs,
  discordUserId: v.string(),
}

const _createEventArgs = v.object(createEventArgs);
const _updateEventArgs = v.object(updateEventArgs);
const _deleteEventArgs = v.object(deleteEventArgs);
const _discordCreateEventArgs = v.object(discordCreateEventArgs)
const _discordUpdateEventArgs = v.object(discordUpdateEventArgs)
const _discordDeleteEventArgs = v.object(discordDeleteEventArgs)

export type CreateEventArgs = Infer<typeof _createEventArgs>;
export type UpdateEventArgs = Infer<typeof _updateEventArgs>;
export type DeleteEventArgs = Infer<typeof _deleteEventArgs>;
export type DiscordCreateEventArgs = Infer<typeof _discordCreateEventArgs>;
export type DiscordUpdateEventArgs = Infer<typeof _discordUpdateEventArgs>;
export type DiscordDeleteEventArgs = Infer<typeof _discordDeleteEventArgs>;

// for frontend
export type CalendarEvent = Omit<Doc<"events">, "start" | "end"> & {
  start: Date;
  end: Date;
};
export type EventId = Id<"events">;
export type UserId = Id<"users">;

export const linkDiscordAccountValidator = {
  email: v.string(),
  discordUserId: v.string(),
  discordUsername: v.string(),
  discordDiscriminator: v.optional(v.string()),
};

export const verifyLinkValidator = {
  token: v.string(),
  discordUserId: v.string(),
};

export const validateDiscordLinkValidator = {
  discordUserId: v.string(),
};

export const linkDiscordAccountArgs = v.object(linkDiscordAccountValidator);
export const verifyLinkArgs = v.object(verifyLinkValidator);
export const validateDiscordLinkArgs = v.object(validateDiscordLinkValidator);

export type LinkDiscordAccountArgs = Infer<typeof linkDiscordAccountArgs>;
export type VerifyLinkArgs = Infer<typeof verifyLinkArgs>;
export type ValidateDiscordLinkArgs = Infer<typeof validateDiscordLinkArgs>;
