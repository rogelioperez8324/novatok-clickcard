"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Card = {
  id: string;
  slug: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [plan, setPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  // Form state
  const [slug, setSlug] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // ✅ Load user session
  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);

      // Fetch plan from user profile or subscriptions table
      // Try user profile first
      let userPlan = "free";
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", data.user.id)
        .single();
      if (profile && profile.plan) {
        userPlan = profile.plan;
      } else {
        // fallback: check subscriptions table
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("plan")
          .eq("user_id", data.user.id)
          .single();
        if (sub && sub.plan) userPlan = sub.plan;
      }
      setPlan(userPlan);
      setLoading(false);
    };
    loadSession();
  }, [router]);

  // ✅ Fetch cards
  const fetchCards = async () => {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCards(data as Card[]);
    }
  };

  useEffect(() => {
    if (user) fetchCards();
  }, [user]);

  // Card creation limits by plan
  const planLimits: Record<string, number | null> = {
    free: 1,
    pro: 5,
    business: null, // unlimited
  };

  // ✅ Create new card
  const createCard = async () => {
    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) {
      alert("Slug is required");
      return;
    }
    // Enforce card creation limit
    const limit = planLimits[plan] ?? 1;
    if (limit !== null && cards.length >= limit) {
      alert(`Your plan (${plan}) allows up to ${limit} card${limit > 1 ? "s" : ""}. Upgrade to create more.`);
      return;
    }
    const { error } = await supabase.from("cards").insert([
      {
        slug: cleanSlug,
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        email: email.trim() || null,
        phone: phone.trim() || null,
        user_id: user.id,
      },
    ]);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    // Reset form
    setSlug("");
    setDisplayName("");
    setBio("");
    setAvatarUrl("");
    setEmail("");
    setPhone("");
    fetchCards();
  };

  // ✅ Logout
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Cards</h1>
        <button
          onClick={logout}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Logout
        </button>
      </div>

      {/* Create Card Form */}
      <div className="border rounded-lg p-4 mb-8">
        <h2 className="text-xl font-semibold mb-3">Create New Card</h2>
        {(() => {
          const limit = planLimits[plan] ?? 1;
          const atLimit = limit !== null && cards.length >= limit;
          if (atLimit) {
            return (
              <div className="mb-4">
                <p className="text-red-600 font-semibold mb-2">
                  You have reached the card limit for your plan ({plan}).
                </p>
                <Link
                  href="/pricing"
                  className="inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 font-semibold"
                >
                  Upgrade Plan
                </Link>
              </div>
            );
          }
          return (
            <>
              <input
                placeholder="Slug (ex: jose)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <input
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <input
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <input
                placeholder="Avatar URL"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              />
              <button
                onClick={createCard}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Create Card
              </button>
            </>
          );
        })()}
      </div>

      {/* Cards List */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Your Existing Cards</h2>

        {cards.length === 0 ? (
          <p>No cards yet. Create your first one above.</p>
        ) : (
          <ul className="space-y-3">
            {cards.map((card) => (
              <li
                key={card.id}
                className="border rounded p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{card.display_name || card.slug}</p>
                  <p className="text-sm text-gray-500">/{card.slug}</p>
                  {(card.email || card.phone) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {card.email ? `Email: ${card.email}` : ""}
                      {card.email && card.phone ? " • " : ""}
                      {card.phone ? `Phone: ${card.phone}` : ""}
                    </p>
                  )}
                </div>

                <a
                  href={`/c/${card.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  View →
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}