import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Check if the app is running with placeholder/demo Supabase credentials.
 * When true, the app operates in demo mode with mock data.
 */
export function isDemoMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url.includes("dfaROygbNm5IX12OtHAEyA") || url === "https://placeholder.supabase.co";
}

/**
 * Create a typed Supabase browser client.
 * Includes a fetch interceptor to gracefully handle network failures
 * in demo/development environments.
 */
export function createClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options) => {
          try {
            return await fetch(url, options);
          } catch (err) {
            // Intercept network failures to prevent Next.js error overlay in dev
            if (isDemoMode()) {
              console.warn("[SalesNova] Network fetch intercepted (demo mode).");
              return new Response(
                JSON.stringify({ error_description: "demo_mode", error: "demo_mode" }),
                {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                }
              );
            }
            throw err;
          }
        },
      },
    }
  );
}
