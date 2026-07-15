import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Flame, LineChart, Zap, Dumbbell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

const weekBars = [40, 65, 30, 78, 55, 90, 70];
const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-hero">
      {/* Ambient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full opacity-40 blur-3xl animate-float"
        style={{ background: "radial-gradient(circle, oklch(0.68 0.22 320) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 -left-32 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl animate-drift"
        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
      />

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-accent-gradient text-primary-foreground animate-pulse-ring">
            <Activity className="h-4 w-4" />
          </span>
          FitTrack Pro
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/auth">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="bg-primary text-primary-foreground hover:opacity-90">
              Get started
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-8">
        {/* Split hero: content left, mock dashboard right */}
        <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-10">
          <div className="animate-rise" style={{ animationDelay: "0.05s" }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Built for consistency, not vanity
            </div>
            <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Track workouts.
              <br />
              <span className="bg-accent-gradient bg-clip-text text-transparent">
                Own your progress.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              A no-nonsense fitness tracker. Log a workout in seconds, watch calories add up,
              and see your weekly momentum at a glance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth">
                <Button size="lg" className="group bg-primary text-primary-foreground shadow-glow hover:opacity-90">
                  Start tracking free
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline">See how it works</Button>
              </a>
            </div>

            {/* Stat strip */}
            <div className="mt-12 grid max-w-lg grid-cols-3 gap-6">
              {[
                { k: "12k+", v: "workouts logged" },
                { k: "97%", v: "weekly retention" },
                { k: "< 10s", v: "to log one set" },
              ].map((s, i) => (
                <div
                  key={s.v}
                  className="animate-rise"
                  style={{ animationDelay: `${0.2 + i * 0.08}s` }}
                >
                  <div className="font-display text-2xl font-semibold text-foreground">{s.k}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mock dashboard card */}
          <div
            className="relative animate-rise"
            style={{ animationDelay: "0.25s" }}
          >
            <div className="absolute -inset-4 rounded-3xl bg-accent-gradient opacity-20 blur-2xl" />
            <div className="relative rounded-2xl border border-border bg-card/80 p-5 shadow-card backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">This week</div>
                  <div className="font-display text-2xl font-semibold">3,240 kcal</div>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent">
                  <Flame className="h-4 w-4 text-primary" />
                </span>
              </div>

              <div className="mt-6 flex h-40 items-end gap-2">
                {weekBars.map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full animate-bar rounded-md bg-accent-gradient"
                      style={{ height: `${h}%`, animationDelay: `${0.4 + i * 0.07}s` }}
                    />
                    <span className="text-[10px] text-muted-foreground">{weekDays[i]}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { icon: Dumbbell, label: "Push day", meta: "45 min · 420 kcal" },
                  { icon: Activity, label: "Zone 2 run", meta: "30 min · 310 kcal" },
                ].map((r, i) => (
                  <div
                    key={r.label}
                    className="animate-rise flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3"
                    style={{ animationDelay: `${0.9 + i * 0.1}s` }}
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-md bg-accent">
                      <r.icon className="h-4 w-4 text-primary" />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{r.label}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{r.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mt-28">
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Everything you need. <span className="text-muted-foreground">Nothing you don't.</span>
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Zap, title: "Log in seconds", body: "Exercise, minutes, calories, done. No 40-field forms." },
              { icon: Flame, title: "Calories that add up", body: "Today's total and this week's total — always at the top." },
              { icon: LineChart, title: "Weekly momentum", body: "A clean chart of the last 7 days. Streaks become visible." },
            ].map((f, i) => (
              <div
                key={f.title}
                className="group relative animate-rise overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <div
                  aria-hidden
                  className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                  style={{ background: "var(--gradient-accent)" }}
                />
                <div className="relative mb-4 grid h-11 w-11 place-items-center rounded-xl bg-accent transition-transform duration-300 group-hover:scale-110">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="relative text-lg font-semibold">{f.title}</h3>
                <p className="relative mt-1 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} FitTrack Pro</span>
          <span>Move a little every day.</span>
        </div>
      </footer>
    </div>
  );
}
