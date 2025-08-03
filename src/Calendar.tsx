"use client";

import { EventCalendar, type CalendarEvent } from "@/components/event-calendar";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// Sample events data with hardcoded times
const sampleEvents: CalendarEvent[] = [
  {
    _id: "1" as Id<"events">,
    _creationTime: Date.now(),
    title: "Annual Planning",
    description: "Strategic planning for next year",
    start: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 days before today
    end: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 days before today
    allDay: true,
    color: "sky",
    location: "Main Conference Hall",
    createdBy: "1" as Id<"users">,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export default function Component() {
  const eventsData = useQuery(api.function.listEvents, {});

  const events =
    eventsData?.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    })) ?? [];

  return <EventCalendar events={events} />;
}
