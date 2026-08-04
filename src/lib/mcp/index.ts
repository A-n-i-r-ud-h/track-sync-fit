import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listWorkoutsTool from "./tools/list-workouts";
import logWorkoutTool from "./tools/log-workout";
import deleteWorkoutTool from "./tools/delete-workout";
import workoutSummaryTool from "./tools/workout-summary";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "fittrack-simple",
  title: "FitTrack Simple",
  version: "0.1.0",
  instructions:
    "Tools for FitTrack, a fitness tracking app. Log workouts, list them, delete them, and summarise recent training for the signed-in user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listWorkoutsTool, logWorkoutTool, deleteWorkoutTool, workoutSummaryTool],
});
