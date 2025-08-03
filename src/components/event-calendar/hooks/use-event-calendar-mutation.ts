import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

export const useEventCalendarMutation = () => {
  const createEvent = useMutation(api.function.createEvent);
  const updateEvent = useMutation(api.function.updateEvent);
  const deleteEvent = useMutation(api.function.deleteEvent);

  return {
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
