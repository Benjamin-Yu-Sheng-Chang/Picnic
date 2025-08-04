"use client";

import { CalendarEvent, EventCalendar } from "@/components/event-calendar";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useDiscordId } from "./contexts/DiscordContext";

export default function Calendar() {
  const discordId = useDiscordId();
  const eventsData = useQuery(api.function.listEvents, { discordUserId: discordId });

  const events: CalendarEvent[] =
    eventsData?.map((event: any) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    })) ?? [];

  return <EventCalendar events={events} />;
}

