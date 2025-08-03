import { Doc } from "@/../convex/_generated/dataModel";

export type CalendarView = "month" | "week" | "day" | "agenda";

export type CalendarEvent = Doc<"events">;

export type EventColor =
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "orange";
