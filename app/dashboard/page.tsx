"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

type Card = {
  id: string;
  slug: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [slug, setSlug] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // ✅ Load user session
  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);
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
      setCards(data);
    }
  };

  useEffect(() => {
    if (user) fetchCards();
  }, [user]);

  // ✅ Create new card
  const createCard = async () => {
    if (!slug.trim()) {
      alert("Slug is required");
      return;
    }

    const { error } = await supabase.from("cards").insert([
      {
        slug,
        display_name: displayName,
        bio,
        avatar_url: avatarUrl,
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
          className="w-full border p-2 rounded mb-3"
        />

        <button
          onClick={createCard}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Card
        </button>
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
                  <p className="font-bold">{card.display_name}</p>
                  <p className="text-sm text-gray-500">/{card.slug}</p>
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
