"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Auto redirect if session already exists
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/dashboard");
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) router.replace("/dashboard");
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    setMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Logged in. Redirecting...");
    router.replace("/dashboard");
  };

  const handleSignup = async () => {
    setLoading(true);
    setMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Signup successful. Now log in.");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Login / Sign up</h1>

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {msg && <p className="text-sm mb-3">{msg}</p>}

        <div className="flex gap-2">
          <button
            onClick={handleSignup}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded"
          >
            Sign up
          </button>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex-1 bg-black text-white py-2 rounded"
          >
            Log in
          </button>
        </div>
      </div>
    </main>
  );
}