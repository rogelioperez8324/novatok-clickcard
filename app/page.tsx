"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function signUp() {
    setLoading(true);
    setMsg(null);
    setErr(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth`,
        },
      });
      if (error) throw error;
      setMsg("Signup success. Check your email if confirmation is enabled.");
    } catch (e: any) {
      setErr(e?.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  async function logIn() {
    setLoading(true);
    setMsg(null);
    setErr(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setMsg("Logged in.");
    } catch (e: any) {
      setErr(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function logOut() {
    setLoading(true);
    setMsg(null);
    setErr(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setMsg("Logged out.");
    } catch (e: any) {
      setErr(e?.message ?? "Logout failed");
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || !email || !password;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to home
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900">Login / Sign up</h1>
            <p className="text-gray-600 mt-1">
              Use your email + password to access your ClickCard.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {err && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  {err}
                </div>
              )}
              {msg && (
                <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
                  {msg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={signUp}
                  disabled={disabled}
                  className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "..." : "Sign up"}
                </button>

                <button
                  onClick={logIn}
                  disabled={disabled}
                  className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-800 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "..." : "Log in"}
                </button>

                <button
                  onClick={logOut}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-800 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "..." : "Log out"}
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Tip: If “Confirm email” is ON in Supabase, check your inbox after
            signing up.
          </p>
        </div>
      </div>
    </main>
  );
}