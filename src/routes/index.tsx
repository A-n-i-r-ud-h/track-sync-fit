import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Flame, LineChart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-hero">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-gradient text-primary-foreground">
            <Activity className="h-4 w-4" />
          </span>
          FitTrack Pro
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/auth">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="bg-primary text-primary-foreground hover:opacity-90">
              Get started
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Built for consistency, not vanity
          </div>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            Track workouts.
            <br />
            <span className="bg-accent-gradient bg-clip-text text-transparent">
              Own your progress.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            A no-nonsense fitness tracker. Log a workout in seconds, watch calories add up, and see
            your weekly momentum at a glance.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/auth">
              <Button size="lg" className="bg-primary text-primary-foreground shadow-glow hover:opacity-90">
                Start tracking free
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline">
                See how it works
              </Button>
            </a>
          </div>
        </div>

        <section
          id="features"
          className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[
            {
              icon: Zap,
              title: "Log in seconds",
              body: "Exercise, minutes, calories, done. No 40-field forms.",
            },
            {
              icon: Flame,
              title: "Calories that add up",
              body: "Today's total, this week's total — always at the top of your dashboard.",
            },
            {
              icon: LineChart,
              title: "Weekly momentum",
              body: "A clean chart of the last 7 days. Streaks become visible.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-card p-6 shadow-card transition-colors hover:border-primary/40"
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-accent">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} FitTrack Pro</span>
          <span>Move a little every day.</span>
        </div>
      </footer>
    </div>
  );
}
