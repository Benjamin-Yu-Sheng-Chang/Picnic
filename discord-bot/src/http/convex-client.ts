import "dotenv/config";
import { ConvexHttpClient } from "convex/browser";

import { api } from "../convex/_generated/api";
import * as chrono from 'chrono-node';
import { ConvexError } from "convex/values";

export const convexClient = new ConvexHttpClient(process.env.CONVEX_DEV_URL!);

// Helper functions for Discord bot commands
export async function sendOTP(args: {
  email: string;
  discordUserId: string;
  discordUsername: string;
  discordDiscriminator?: string;
}) {
  return await convexClient.mutation(api.discord.linking.sendOTP, args);
}

export async function verifyOTP(args: {
  token: string;
  discordUserId: string;
}) {
  return await convexClient.mutation(api.discord.linking.verifyOTP, args);
}

export function parseStartAndEndDate(start?: string, end?: string) {
  try {
    const startDate = start ? new Date(chrono.parseDate(start) || new Date()) : undefined;
    const endDate = end ? new Date(chrono.parseDate(end) || new Date()) : undefined;
    if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
      throw new Error("Start date must be before end date");
    }
    return {
      start: startDate?.getTime(),
      end: endDate?.getTime(),
    };
  } catch (error) {
    console.error("Error parsing start and end date", error);
    throw new ConvexError("Invalid start or end date");
  }
}

export async function createEvent(args: {
  discordUserId: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  "all-day"?: boolean;
  location?: string;
  price?: number;
}) {
  if(!args.discordUserId) {
    console.error("Discord user ID is required");
    throw new ConvexError("Discord user ID is required");
  }
  const { start, end } = parseStartAndEndDate(args.start, args.end);
  if (!start || !end) {
    console.error("Invalid start or end date");
    throw new ConvexError("Invalid start or end date");
  }
  return await convexClient.mutation(api.function.createEvent, {
    ...args,
    start,
    end,
    allDay: args["all-day"] ? true : false,
    "all-day": undefined,
  });
}


export async function updateEvent(args: {
  eventId: string;
  discordUserId: string;
  title?: string;
  description?: string;
  start?: string;
  end?: string;
  "all-day"?: boolean;
  location?: string;
  price?: number;
}) { 
  if(!args.eventId || !args.discordUserId) {
    throw new ConvexError("Event ID and Discord user ID are required");
  }
  const { start, end } = parseStartAndEndDate(args.start, args.end);

  return await convexClient.mutation(api.function.updateEvent, {
    ...args,
    start,
    end,
    allDay: args["all-day"] ? true : false,
    "all-day": undefined,
  });
}

export async function deleteEvent(args: {
  eventId: string;
  discordUserId: string;
}) {
  if(!args.eventId || !args.discordUserId) {
    throw new ConvexError("Event ID is required");
  }
  return await convexClient.mutation(api.function.deleteEvent, {
    eventId: args.eventId,
    discordUserId: args.discordUserId,
  });
}