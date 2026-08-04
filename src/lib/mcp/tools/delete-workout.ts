import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "delete_workout",
  title: "Delete workout",
  description: "Delete one of the signed-in user's workouts by its id.",
  inputSchema: { id: z.string().uuid().describe("Workout id to delete.") },
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("workouts")
      .delete()
      .eq("id", id)
      .select("id");
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data || data.length === 0)
      return {
        content: [{ type: "text", text: "No workout found with that id." }],
        isError: true,
      };
    return { content: [{ type: "text", text: `Deleted workout ${id}` }] };
  },
});
