import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "log_workout",
  title: "Log workout",
  description:
    "Log a workout for the signed-in user: exercise name, duration in minutes, calories burned and the date.",
  inputSchema: {
    name: z.string().trim().min(1).max(100).describe("Exercise name, e.g. Running."),
    duration_minutes: z.number().int().min(1).max(1440).describe("Duration in minutes."),
    calories: z.number().int().min(0).max(20000).describe("Calories burned."),
    workout_date: z
      .string()
      .optional()
      .describe("Workout date, ISO format YYYY-MM-DD. Defaults to today."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ name, duration_minutes, calories, workout_date }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("workouts")
      .insert({
        user_id: ctx.getUserId(),
        name,
        duration_minutes,
        calories,
        workout_date: workout_date ?? new Date().toISOString().slice(0, 10),
      })
      .select("id, name, duration_minutes, calories, workout_date");
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data?.[0] ?? null) }],
      structuredContent: { workout: data?.[0] ?? null },
    };
  },
});
