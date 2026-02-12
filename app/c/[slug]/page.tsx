import { supabase } from "@/lib/supabaseClient";

export default async function PublicCardPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  // Fetch card from Supabase
  const { data: card, error } = await supabase
    .from("cards")
    .select("*")
    .eq("slug", slug)
    .single();

  // Not found
  if (error || !card) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="p-8 rounded-xl border shadow text-center">
          <h1 className="text-2xl font-bold">Card not found</h1>
          <p className="text-gray-500 mt-2">
            No ClickCard exists for: <b>{slug}</b>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#05080f] text-white px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl text-center">
        {/* Avatar */}
        {card.avatar_url && (
          <img
            src={card.avatar_url}
            alt="Avatar"
            className="w-24 h-24 rounded-full mx-auto mb-4 border border-white/20"
          />
        )}

        {/* Name */}
        <h1 className="text-3xl font-bold">{card.display_name}</h1>

        {/* Bio */}
        {card.bio && (
          <p className="text-white/70 mt-2 text-sm">{card.bio}</p>
        )}

        {/* Email */}
        {card.email && (
          <p className="mt-4 text-sm text-white/80">
            📧 {card.email}
          </p>
        )}

        {/* Phone */}
        {card.phone && (
          <p className="mt-2 text-sm text-white/80">
            📱 {card.phone}
          </p>
        )}

        {/* CTA */}
        <div className="mt-6">
          <a
            href="/login"
            className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 transition"
          >
            Create Your Own ClickCard
          </a>
        </div>
      </div>
    </main>
  );
}