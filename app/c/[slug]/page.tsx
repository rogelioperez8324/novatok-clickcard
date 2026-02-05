"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function AuthPage() {
  const router = useRouter();

  const supabase = useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState<"signup" | "login" | "logout" | null>(
    null
  );

  async function handleSignup() {
    setErr(null);
    setMsg(null);
    setLoading("signup");

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) throw error;

      setMsg("Signup success. Check your email if confirmation is enabled.");
    } catch (e: any) {
      setErr(e?.message ?? "Signup failed");
    } finally {
      setLoading(null);
    }
  }

  async function handleLogin() {
    setErr(null);
    setMsg(null);
    setLoading("login");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // If confirm email is ON, Supabase may block session until verified
      if (!data.session) {
        setErr("Email not confirmed");
        return;
      }

      setMsg("Logged in. Redirecting...");
      // ✅ send user somewhere useful
      router.push("/dashboard");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Login failed");
    } finally {
      setLoading(null);
    }
  }

  async function handleLogout() {
    setErr(null);
    setMsg(null);
    setLoading("logout");

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setMsg("Logged out.");
    } catch (e: any) {
      setErr(e?.message ?? "Logout failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to home
        </Link>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Login / Sign up</h1>
          <p className="text-gray-500 text-sm">
            Use your email + password to access your ClickCard.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {err && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </div>
          )}

          {msg && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {msg}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 pt-2">
            <button
              onClick={handleSignup}
              disabled={loading !== null}
              className="rounded-lg bg-blue-600 text-white font-semibold py-2 hover:bg-blue-700 disabled:opacity-60"
            >
              {loading === "signup" ? "..." : "Sign up"}
            </button>

            <button
              onClick={handleLogin}
              disabled={loading !== null}
              className="rounded-lg border border-gray-300 font-semibold py-2 hover:bg-gray-50 disabled:opacity-60"
            >
              {loading === "login" ? "..." : "Log in"}
            </button>

            <button
              onClick={handleLogout}
              disabled={loading !== null}
              className="rounded-lg border border-gray-300 font-semibold py-2 hover:bg-gray-50 disabled:opacity-60"
            >
              {loading === "logout" ? "..." : "Log out"}
            </button>
          </div>

          <p className="text-xs text-gray-500 pt-2">
            Tip: If "Confirm email" is ON in Supabase, check your inbox after
            signing up.
          </p>
        </div>
      </div>
    </main>
  );
}