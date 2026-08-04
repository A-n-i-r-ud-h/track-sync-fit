import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "workout_summary",
  title: "Workout summary",
  description:
    "Summarise the signed-in user's training over the last N days: total workouts, minutes and calories.",
  inputSchema: {
    days: z.number().int().min(1).max(365).optional().describe("Look-back window in days (default 7)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ days }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const window = days ?? 7;
    const since = new Date(Date.now() - (window - 1) * 86400000)
      .toISOString()
      .slice(0, 10);
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("workouts")
      .select("duration_minutes, calories, workout_date")
      .gte("workout_date", since);
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    const rows = data ?? [];
    const summary = {
      days: window,
      since,
      workouts: rows.length,
      total_minutes: rows.reduce((s, r) => s + (r.duration_minutes ?? 0), 0),
      total_calories: rows.reduce((s, r) => s + (r.calories ?? 0), 0),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(summary) }],
      structuredContent: summary,
    };
  },
});
