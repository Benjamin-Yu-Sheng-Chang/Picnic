"use client";

import { EventCalendar, type CalendarEvent } from "@/components/event-calendar";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// Sample events data with hardcoded times
const sampleEvents: CalendarEvent[] = [
  {
    _id: "1" as Id<"events">,
    _creationTime: Date.now(),
    title: "Annual Planning",
    description: "Strategic planning for next year",
    start: Date.now() - 24 * 60 * 60 * 1000, // 24 days before today
    end: Date.now() - 23 * 60 * 60 * 1000, // 23 days before today
    allDay: true,
    color: "sky",
    location: "Main Conference Hall",
    createdBy: "1" as Id<"users">,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export default function Component() {
  // const events = useQuery(api.function.listEvents, {});
  const events = sampleEvents;
  const createEvent = useMutation(api.function.createEvent);
  const updateEvent = useMutation(api.function.updateEvent);
  const deleteEvent = useMutation(api.function.deleteEvent);

  const handleEventAdd = (event: CalendarEvent) => {
    createEvent(event);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    updateEvent(updatedEvent);
  };

  const handleEventDelete = (eventId: Id<"events">) => {
    deleteEvent({ eventId });
  };

  return (
    <EventCalendar
      events={events}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
    />
  );
}
