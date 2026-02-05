import Link from "next/link";
import QRCode from "qrcode.react";

type CardData = {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  links?: { label: string; url: string }[];
  avatarColor?: string; // gradient helper
};

const MOCK: Record<string, CardData> = {
  demo: {
    name: "Demo User",
    title: "Creator",
    email: "demo@novatok.com",
    phone: "(555) 555-5555",
    links: [
      { label: "Instagram", url: "https://instagram.com" },
      { label: "X", url: "https://x.com" },
      { label: "YouTube", url: "https://youtube.com" },
    ],
    avatarColor: "from-blue-500 to-purple-600",
  },
  jose: {
    name: "Jose Leon",
    title: "Founder",
    email: "joseleonb48@gmail.com",
    links: [{ label: "NovaTok", url: "https://novatok.tech" }],
    avatarColor: "from-indigo-500 to-fuchsia-600",
  },
};

function cleanTel(phone?: string) {
  if (!phone) return "";
  return phone.replace(/[^\d+]/g, "");
}

export default async function CardPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const card = MOCK[slug];

  if (!card) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">Card not found</h1>
            <p className="mt-2 text-gray-600">
              No card exists for <span className="font-semibold">{slug}</span>.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Go home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const tel = cleanTel(card.phone);
  const shareUrl =
    process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/c/${slug}`
      : `/c/${slug}`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-md">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Home
            </Link>
            <span className="text-xs rounded-full bg-gray-100 px-3 py-1 text-gray-600">
              /c/{slug}
            </span>
          </div>

          {/* Card */}
          <div className="mt-4 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            {/* Header gradient */}
            <div className={`h-28 bg-gradient-to-r ${card.avatarColor ?? "from-blue-500 to-purple-600"}`} />

            <div className="-mt-10 px-6 pb-6">
              {/* Avatar */}
              <div className="flex items-end justify-between">
                <div className="h-20 w-20 rounded-2xl bg-white p-1 shadow-md">
                  <div
                    className={`h-full w-full rounded-2xl bg-gradient-to-br ${
                      card.avatarColor ?? "from-blue-500 to-purple-600"
                    }`}
                  />
                </div>

                <button
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        typeof window !== "undefined"
                          ? window.location.href
                          : shareUrl
                      );
                      alert("Link copied!");
                    } catch {
                      alert("Could not copy link");
                    }
                  }}
                >
                  Copy link
                </button>
              </div>

              {/* Identity */}
              <h1 className="mt-4 text-2xl font-bold text-gray-900">
                {card.name}
              </h1>
              {card.title ? (
                <p className="mt-1 text-sm text-gray-600">{card.title}</p>
              ) : null}

              {/* Quick actions */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                {card.email ? (
                  <a
                    href={`mailto:${card.email}`}
                    className="rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
                  >
                    Email
                  </a>
                ) : (
                  <div className="rounded-xl bg-gray-100 px-4 py-3 text-center font-semibold text-gray-400">
                    Email
                  </div>
                )}

                {tel ? (
                  <a
                    href={`tel:${tel}`}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-center font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    Call
                  </a>
                ) : (
                  <div className="rounded-xl bg-gray-100 px-4 py-3 text-center font-semibold text-gray-400">
                    Call
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-gray-900">Links</h2>
                <div className="mt-3 space-y-2">
                  {(card.links ?? []).map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 hover:bg-gray-50"
                    >
                      <span className="font-medium">{l.label}</span>
                      <span className="text-gray-400">↗</span>
                    </a>
                  ))}
                  {(!card.links || card.links.length === 0) && (
                    <div className="rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-500">
                      No links added yet.
                    </div>
                  )}
                </div>
              </div>

              {/* QR */}
              <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">Scan</p>
                  <p className="text-xs text-gray-500">opens this card</p>
                </div>
                <div className="mt-4 flex justify-center rounded-xl bg-white p-4">
                  <QRCode value={shareUrl} size={180} />
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            NovaTok ClickCard
          </p>
        </div>
      </div>
    </main>
  );
}