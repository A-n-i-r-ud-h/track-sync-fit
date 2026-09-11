import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Flame, Dumbbell, Timer, Plus } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, firstNameOf } from "@/hooks/useProfile";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

type Workout = {
  id: string;
  name: string;
  duration_minutes: number;
  calories: number;
  workout_date: string;
};

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function last7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    );
  }
  return days;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const { data: profile } = useProfile();
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["workouts", "recent"],
    staleTime: 30_000,
    queryFn: async () => {
      const start = last7Days()[0];
      const { data, error } = await supabase
        .from("workouts")
        .select("id,name,duration_minutes,calories,workout_date")
        .gte("workout_date", start)
        .order("workout_date", { ascending: false });
      if (error) throw error;
      return data as Workout[];
    },
  });

  const workouts = data ?? [];
  const today = todayISO();
  const todays = workouts.filter((w) => w.workout_date === today);
  const todayCalories = todays.reduce((s, w) => s + w.calories, 0);
  const todayMinutes = todays.reduce((s, w) => s + w.duration_minutes, 0);

  const chartData = last7Days().map((date) => {
    const day = workouts.filter((w) => w.workout_date === date);
    const label = new Date(date).toLocaleDateString(undefined, { weekday: "short" });
    return {
      day: label,
      calories: day.reduce((s, w) => s + w.calories, 0),
    };
  });

  const stats = [
    {
      label: "Calories today",
      value: todayCalories.toLocaleString(),
      icon: Flame,
      suffix: "kcal",
    },
    {
      label: "Workouts today",
      value: todays.length.toString(),
      icon: Dumbbell,
      suffix: todays.length === 1 ? "session" : "sessions",
    },
    {
      label: "Active minutes today",
      value: todayMinutes.toString(),
      icon: Timer,
      suffix: "min",
    },
  ];

  return (
    <AppShell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Today</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Link to="/workouts">
          <Button className="bg-primary text-primary-foreground hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            Log workout
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-3xl font-semibold">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.suffix}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 border-border bg-card p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Weekly calories</h2>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "color-mix(in oklab, var(--color-primary) 10%, transparent)" }}
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  color: "var(--color-foreground)",
                }}
              />
              <Bar
                dataKey="calories"
                fill="var(--color-primary)"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="mt-6 border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold">Recent workouts</h2>
        {isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : workouts.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No workouts yet. Log your first one to see stats appear.
            </p>
            <Link to="/workouts" className="mt-4 inline-block">
              <Button size="sm" className="bg-primary text-primary-foreground hover:opacity-90">
                Log workout
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {workouts.slice(0, 6).map((w) => (
              <li key={w.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{w.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(w.workout_date).toLocaleDateString()} · {w.duration_minutes} min
                  </p>
                </div>
                <span className="text-sm font-semibold text-primary">{w.calories} kcal</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AppShell>
  );
}
