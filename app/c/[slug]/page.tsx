import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";

type CardData = {
  name: string;
  title: string;
  email: string;
  phone: string;
  links: string[];
};

const mockCards: Record<string, CardData> = {
  demo: {
    name: "Demo Card",
    title: "Demo User",
    email: "demo@novatok.com",
    phone: "(555) 555-5555",
    links: ["Instagram", "X", "YouTube"],
  },
};

export default function CardPage({
  params,
}: {
  params: { slug: string };
}) {
  const card = mockCards[params.slug];

  if (!card) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-700">
          Card not found
        </h1>
      </main>
    );
  }

  const url =
    typeof window !== "undefined"
      ? window.location.href
      : `https://novatok-clickcard.vercel.app/c/${params.slug}`;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-8 space-y-6 border">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {card.name}
            </h1>
            <p className="text-gray-500 text-sm">
              {card.title}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Email:</span>{" "}
            {card.email}
          </p>
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {card.phone}
          </p>
          <p>
            <span className="font-semibold">Links:</span>{" "}
            {card.links.join(", ")}
          </p>
        </div>

        {/* QR Code */}
        <div className="bg-gray-100 rounded-xl p-6 flex justify-center">
          <QRCodeCanvas value={url} size={180} />
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link
            href="/"
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}