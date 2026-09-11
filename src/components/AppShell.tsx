import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Activity, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProfile, initialsOf } from "@/hooks/useProfile";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: profile } = useProfile();
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    await queryClient.cancelQueries();
    await supabase.auth.signOut();
    queryClient.clear();
    navigate({ to: "/auth", replace: true });
  };

  const nav = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/workouts", label: "Workouts" },
  ] as const;

  return (
    <div className="min-h-screen bg-hero">
      <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-gradient text-primary-foreground">
                <Activity className="h-4 w-4" />
              </span>
              FitTrack Pro
            </Link>
            <nav className="hidden gap-1 sm:flex">
              {nav.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                />
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-semibold text-foreground">
                  {initialsOf(profile?.display_name, profile?.email)}
                </span>
              )}
              <span className="max-w-[10rem] truncate text-sm text-muted-foreground">
                {profile?.display_name ?? profile?.email ?? ""}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut} disabled={signingOut}>
              <LogOut className="mr-2 h-4 w-4" />
              {signingOut ? "Signing out…" : "Sign out"}
            </Button>
          </div>
        </div>
        <nav className="flex gap-1 border-t border-border px-6 py-2 sm:hidden">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  active ? "bg-accent text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
