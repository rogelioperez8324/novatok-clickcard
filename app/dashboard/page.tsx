export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          You’re logged in ✅
        </p>

        <div className="mt-6 rounded-xl border p-4 text-sm text-gray-700">
          Next step: add “Create my ClickCard” form here.
        </div>
      </div>
    </main>
  );
}