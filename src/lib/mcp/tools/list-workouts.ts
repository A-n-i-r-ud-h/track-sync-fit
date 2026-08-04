import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_workouts",
  title: "List workouts",
  description:
    "List the signed-in user's logged workouts, newest first. Optionally filter by date range.",
  inputSchema: {
    from: z
      .string()
      .optional()
      .describe("Earliest workout date, ISO format YYYY-MM-DD."),
    to: z
      .string()
      .optional()
      .describe("Latest workout date, ISO format YYYY-MM-DD."),
    limit: z.number().int().min(1).max(200).optional().describe("Max rows (default 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ from, to, limit }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("workouts")
      .select("id, name, duration_minutes, calories, workout_date")
      .order("workout_date", { ascending: false })
      .limit(limit ?? 50);
    if (from) query = query.gte("workout_date", from);
    if (to) query = query.lte("workout_date", to);
    const { data, error } = await query;
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { workouts: data ?? [] },
    };
  },
});
