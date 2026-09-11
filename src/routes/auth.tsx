import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { trackEventAndWait } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): { next?: string } => {
    const next = s.next;
    if (typeof next === "string" && next.startsWith("/") && !next.startsWith("//")) {
      return { next };
    }
    return {};
  },
  component: AuthPage,
});

const credsSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

function friendly(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "That email and password don't match.";
  if (m.includes("already registered") || m.includes("user already"))
    return "That email already has an account — sign in instead.";
  if (m.includes("email not confirmed")) return "Confirm your email first, then sign in.";
  return message;
}

function AuthPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { next } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const goAfterAuth = () => {
    queryClient.removeQueries({ queryKey: ["profile"] });
    if (next) {
      window.location.href = next;
      return;
    }
    navigate({ to: "/dashboard", replace: true });
  };

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) goAfterAuth();
      else setChecking(false);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = credsSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (mode === "signup" && fullName.trim().length < 2) {
      toast.error("Tell us your name so we can personalize your dashboard");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            data: { display_name: fullName.trim(), full_name: fullName.trim() },
            emailRedirectTo: next
              ? `${window.location.origin}${next}`
              : `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        await trackEventAndWait("sign_up", { method: "email" });

        if (!data.session) {
          toast.success("Check your inbox to confirm your email, then sign in.");
          setMode("signin");
          setPassword("");
          setLoading(false);
          return;
        }
        toast.success(`Welcome, ${fullName.trim().split(" ")[0]}!`);
      } else {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
      }
      goAfterAuth();
    } catch (err) {
      toast.error(friendly(err instanceof Error ? err.message : "Something went wrong"));
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    goAfterAuth();
  };

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-hero">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-4 py-10">
      <div className="w-full max-w-md animate-rise">
        <Link
          to="/"
          className="mb-6 flex items-center justify-center gap-2 font-display text-lg font-semibold"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-gradient text-primary-foreground">
            <Activity className="h-4 w-4" />
          </span>
          FitTrack Pro
        </Link>
        <Card className="border-border bg-card p-6 shadow-card">
          <h1 className="font-display text-2xl font-semibold">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to log workouts and see your progress."
              : "Start tracking in under a minute."}
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-6 w-full"
            onClick={google}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.6 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.95S8.78 6.5 12 6.5c1.83 0 3.06.78 3.76 1.45l2.57-2.48C16.66 3.99 14.55 3 12 3 6.98 3 3 6.98 3 12s3.98 9 9 9c5.2 0 8.63-3.65 8.63-8.79 0-.59-.07-1.04-.28-1.11z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Your name</Label>
                <Input
                  id="fullName"
                  autoComplete="name"
                  placeholder="Alex Carter"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={80}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:opacity-90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait…
                </>
              ) : mode === "signin" ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-medium text-primary hover:underline"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}
