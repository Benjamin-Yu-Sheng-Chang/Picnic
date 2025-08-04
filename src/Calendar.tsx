"use client";

import { CalendarEvent, EventCalendar } from "@/components/event-calendar";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

export default function Component() {
  const eventsData = useQuery(api.function.listEvents, {});

  const events: CalendarEvent[] =
    eventsData?.map((event: any) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    })) ?? [];

  return <EventCalendar events={events} />;
}
