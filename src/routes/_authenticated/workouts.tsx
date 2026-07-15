import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/workouts")({
  component: WorkoutsPage,
});

type Workout = {
  id: string;
  name: string;
  duration_minutes: number;
  calories: number;
  workout_date: string;
};

const workoutSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  duration: z.coerce.number().int().positive().max(1440),
  calories: z.coerce.number().int().min(0).max(10000),
  date: z.string().min(1, "Date is required"),
});

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function WorkoutsPage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [date, setDate] = useState(todayISO());

  const { data, isLoading } = useQuery({
    queryKey: ["workouts", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workouts")
        .select("id,name,duration_minutes,calories,workout_date")
        .order("workout_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Workout[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const parsed = workoutSchema.safeParse({ name, duration, calories, date });
      if (!parsed.success) throw new Error(parsed.error.issues[0].message);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not signed in");
      const { error } = await supabase.from("workouts").insert({
        user_id: userData.user.id,
        name: parsed.data.name,
        duration_minutes: parsed.data.duration,
        calories: parsed.data.calories,
        workout_date: parsed.data.date,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Workout logged");
      setName("");
      setDuration("");
      setCalories("");
      setDate(todayISO());
      qc.invalidateQueries({ queryKey: ["workouts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("workouts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["workouts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const workouts = data ?? [];

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Workouts</h1>
        <p className="mt-1 text-sm text-muted-foreground">Log a session and browse your history.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card className="h-fit border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold">Log workout</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
            className="mt-4 space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Exercise</Label>
              <Input
                id="name"
                placeholder="e.g. Running"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  max={1440}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  min={0}
                  max={10000}
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={todayISO()}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:opacity-90"
              disabled={create.isPending}
            >
              {create.isPending ? "Saving…" : "Add workout"}
            </Button>
          </form>
        </Card>

        <Card className="border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold">History</h2>
          {isLoading ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
          ) : workouts.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No workouts yet. Add your first one on the left.
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {workouts.map((w) => (
                <li key={w.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{w.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(w.workout_date).toLocaleDateString()} · {w.duration_minutes} min ·{" "}
                      <span className="text-primary">{w.calories} kcal</span>
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove.mutate(w.id)}
                    disabled={remove.isPending}
                    aria-label="Delete workout"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
