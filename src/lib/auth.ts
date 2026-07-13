/**
 * SalesNova AI — Auth Helper Functions
 * 
 * Client-side authentication utilities for login, register, logout,
 * and session management using Supabase Auth.
 * 
 * In demo mode (placeholder credentials), auth functions return
 * mock results to allow dashboard exploration without a real database.
 */

import { createClient, isDemoMode } from "@/lib/supabase/client";

export interface AuthResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

/** Demo user profile returned when running with placeholder credentials */
const DEMO_USER = {
  id: "demo-user-001",
  email: "demo@salesnova.ai",
  fullName: "Demo Admin",
  role: "admin",
  avatarUrl: null,
  status: "active",
} as const;

/**
 * Sign in with email and password.
 * In demo mode, returns success immediately to allow dashboard access.
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  if (isDemoMode()) {
    console.info("[SalesNova] Demo mode — bypassing authentication.");
    return { success: true, redirectTo: "/dashboard" };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message?.includes("Invalid login credentials")) {
        return { success: false, error: "Invalid email or password. Please try again." };
      }
      if (error.message?.includes("Email not confirmed")) {
        return { success: false, error: "Please verify your email address before signing in." };
      }
      return { success: false, error: error.message };
    }

    return { success: true, redirectTo: "/dashboard" };
  } catch (err) {
    console.error("[SalesNova] Sign-in error:", err);
    return { success: false, error: "Unable to connect to authentication server. Please try again." };
  }
}

/**
 * Register a new account with email, password, and full name.
 * In demo mode, returns success immediately.
 */
export async function signUpWithEmail(
  fullName: string,
  email: string,
  password: string
): Promise<AuthResult> {
  if (isDemoMode()) {
    console.info("[SalesNova] Demo mode — bypassing registration.");
    return { success: true, redirectTo: "/dashboard" };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      if (error.message?.includes("already registered")) {
        return { success: false, error: "An account with this email already exists." };
      }
      return { success: false, error: error.message };
    }

    return {
      success: true,
      redirectTo: "/dashboard",
    };
  } catch (err) {
    console.error("[SalesNova] Sign-up error:", err);
    return { success: false, error: "Unable to connect to authentication server. Please try again." };
  }
}

/**
 * Sign in with Google OAuth.
 * Redirects to the Supabase OAuth callback route.
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  if (isDemoMode()) {
    console.info("[SalesNova] Demo mode — Google OAuth unavailable.");
    return { success: false, error: "Google sign-in requires a configured Supabase project." };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[SalesNova] Google OAuth error:", err);
    return { success: false, error: "Unable to initiate Google sign-in." };
  }
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<AuthResult> {
  if (isDemoMode()) {
    return { success: true, redirectTo: "/login" };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, redirectTo: "/login" };
  } catch (err) {
    return { success: true, redirectTo: "/login" };
  }
}

/**
 * Get the currently authenticated user's profile.
 * Returns a demo user in demo mode.
 */
export async function getCurrentUser() {
  if (isDemoMode()) {
    return { ...DEMO_USER };
  }

  try {
    const supabase = createClient() as any;
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return null;

    // Fetch extended profile from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email || "",
      fullName: profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
      role: profile?.role || "outreach_agent",
      avatarUrl: profile?.avatar_url || null,
      status: profile?.status || "active",
    };
  } catch (err) {
    console.error("[SalesNova] getCurrentUser error:", err);
    return null;
  }
}

/**
 * Send a password reset email.
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  if (isDemoMode()) {
    return { success: false, error: "Password reset requires a configured Supabase project." };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[SalesNova] Password reset error:", err);
    return { success: false, error: "Unable to send reset email. Please try again." };
  }
}
