"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // If already logged in, go straight to dashboard
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data.session) router.push("/dashboard");
    })();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  async function handleSignup() {
    setLoading(true);
    setErr(null);
    setMsg(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth`,
      },
    });

    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }

    setMsg("Signup success. Check your email if confirmation is enabled.");
    setLoading(false);
  }

  async function handleLogin() {
    setLoading(true);
    setErr(null);
    setMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      setMsg("Logged in. Redirecting...");
      router.push("/dashboard"); // ✅ THIS is what you were missing
      return;
    }

    setMsg("Logged in.");
    setLoading(false);
  }

  async function handleLogout() {
    setLoading(true);
    setErr(null);
    setMsg(null);

    const { error } = await supabase.auth.signOut();
    if (error) setErr(error.message);
    else setMsg("Logged out.");

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link href="/" className="text-sm text-gray-600 hover:underline">
          ← Back to home
        </Link>

        <div className="mt-4 rounded-2xl bg-white shadow p-8 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Login / Sign up</h1>
          <p className="mt-1 text-gray-600">
            Use your email + password to access your ClickCard.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSignup}
                disabled={loading || !email || !password}
                className="flex-1 rounded-lg bg-blue-600 text-white font-semibold py-2 hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Working..." : "Sign up"}
              </button>

              <button
                onClick={handleLogin}
                disabled={loading || !email || !password}
                className="flex-1 rounded-lg border border-gray-300 bg-white text-gray-900 font-semibold py-2 hover:bg-gray-50 disabled:opacity-60"
              >
                Log in
              </button>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex-1 rounded-lg border border-gray-300 bg-white text-gray-900 font-semibold py-2 hover:bg-gray-50 disabled:opacity-60"
              >
                Log out
              </button>
            </div>

            <p className="pt-3 text-xs text-gray-500">
              Tip: If “Confirm email” is ON in Supabase, check your inbox after signing up.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}