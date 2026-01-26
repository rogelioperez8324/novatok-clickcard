type Props = { params: { slug: string } };

export default function PublicCardPage({ params }: Props) {
  const { slug } = params;

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <div className="rounded-2xl border p-6 shadow-sm">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
        <h1 className="mt-4 text-2xl font-semibold">Demo Card</h1>
        <p className="text-sm text-muted-foreground">Slug: {slug}</p>

        <div className="mt-6 space-y-2 text-sm">
          <p><span className="font-medium">Email:</span> demo@novatok.com</p>
          <p><span className="font-medium">Phone:</span> (555) 555-5555</p>
          <p><span className="font-medium">Links:</span> Instagram, X, YouTube</p>
        </div>

        <div className="mt-6 rounded-xl bg-zinc-100 p-6 text-center text-sm">
          QR placeholder (next: generate real QR for this URL)
        </div>
      </div>
    </main>
  );
}
