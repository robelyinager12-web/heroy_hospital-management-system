import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-center px-4">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
        HEROY Hospital Management System
      </h1>
      <p className="mt-4 text-slate-400 max-w-xl">
        Enterprise-grade hospital management platform — landing page coming soon.
      </p>
      <Link
        href="/login"
        className="mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition"
      >
        Sign in
      </Link>
    </main>
  );
}
