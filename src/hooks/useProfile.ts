import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<Profile | null> => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("id,display_name,avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;

      const meta = (user.user_metadata ?? {}) as Record<string, string | undefined>;
      const fallbackName =
        meta.display_name ?? meta.full_name ?? meta.name ?? user.email?.split("@")[0] ?? null;

      if (!data) {
        // Profile row missing (e.g. account created before profiles existed) — create it.
        await supabase
          .from("profiles")
          .insert({ id: user.id, display_name: fallbackName, avatar_url: meta.avatar_url ?? null });
        return {
          id: user.id,
          display_name: fallbackName,
          avatar_url: meta.avatar_url ?? null,
          email: user.email ?? null,
        };
      }

      return {
        id: data.id,
        display_name: data.display_name ?? fallbackName,
        avatar_url: data.avatar_url ?? meta.avatar_url ?? null,
        email: user.email ?? null,
      };
    },
  });
}

export function initialsOf(name?: string | null, email?: string | null) {
  const source = (name ?? email ?? "").trim();
  if (!source) return "?";
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export function firstNameOf(name?: string | null, email?: string | null) {
  const source = (name ?? email?.split("@")[0] ?? "").trim();
  if (!source) return "there";
  const first = source.split(/[\s._-]+/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1);
}
