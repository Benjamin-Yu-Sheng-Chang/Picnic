import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { internal } from "./_generated/api";

const http = httpRouter();

auth.addHttpRoutes(http);

// HTTP action for creating schedule from Discord bot
http.route({
  path: "/create-schedule",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();
      
      // Validate the request body
      const { title, description, start, end, allDay, color, location, price, userId } = body;
      
      if (!title || !start || !end) {
        return new Response(JSON.stringify({ error: "Missing required fields: title, start, end" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Note: In a real implementation, you'd want to properly handle user authentication
      // For now, we'll need to either create a user or find an existing one
      // This is a simplified version that assumes userId corresponds to a Discord user
      
      // Create the event using the existing createEvent mutation
      const eventData = {
        title,
        ...(description && { description }),
        start: Number(start),
        end: Number(end),
        ...(allDay !== undefined && { allDay }),
        ...(color && { color }),
        ...(location && { location }),
        ...(price !== undefined && { price })
      };

      // Use the internal mutation that doesn't require auth
      const eventId = await ctx.runMutation(internal.function.createEventInternal, {
        ...eventData,
        discordUserId: userId
      });

      return new Response(JSON.stringify({ 
        success: true, 
        eventId,
        message: "Schedule created successfully" 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
      
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      return new Response(JSON.stringify({ 
        error: "Failed to create schedule",
        details: error.message 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

export default http;
