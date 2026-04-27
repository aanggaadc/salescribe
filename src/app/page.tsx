import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { LogIn, UserPlus, ArrowRight } from "lucide-react";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-obsidian-950 overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-volt-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-obsidian-500/10 rounded-full blur-3xl" />
        <div className="noise absolute inset-0" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="font-display font-bold text-xl tracking-tight">
          <span className="text-white">Sale</span>
          <span className="gradient-text">Scribe</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="btn-ghost flex items-center justify-center p-2 sm:px-4 sm:py-2 text-sm"
            title="Sign in"
          >
            <LogIn size={18} />
            <span className="hidden sm:inline ml-2">Sign in</span>
          </Link>

          <Link
            href="/auth/register"
            className="btn-primary flex items-center justify-center p-2 sm:px-5 sm:py-2.5 text-sm glow-volt"
            title="Get started free"
          >
            <UserPlus size={18} />
            <span className="hidden sm:inline ml-2">Get started</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-volt-400/10 border border-volt-400/20 rounded-full px-4 py-1.5 mb-8 text-volt-300 text-sm font-display font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-volt-300 animate-pulse" />
          Powered by Google Gemini AI
        </div>

        <h1 className="font-display font-extrabold text-3xl md:text-7xl leading-[1.05] tracking-tight mb-6">
          Turn product info into
          <br />
          <span className="gradient-text">sales machines</span>
        </h1>

        <p className="text-obsidian-300 text-md md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-body">
          Fill in your product details. Our AI generates persuasive,
          conversion-optimized sales pages in seconds — complete with headlines,
          benefits, social proof, and CTAs.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          {/* Primary CTA */}
          <Link
            href="/auth/register"
            className="btn-primary flex items-center justify-center gap-2 text-sm md:text-base px-6 sm:px-8 py-3 sm:py-4 glow-volt w-full sm:w-auto"
          >
            Generate your first page
            <ArrowRight size={18} />
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/auth/login"
            className="btn-secondary flex items-center justify-center gap-2 text-sm md:text-base px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
          >
            <LogIn size={18} />
            <span>Sign in</span>
          </Link>
        </div>

        {/* Features row */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              icon: "⚡",
              title: "Instant Generation",
              desc: "From raw product info to full sales copy in under 10 seconds.",
            },
            {
              icon: "🎯",
              title: "Conversion-Focused",
              desc: "Every section built on proven direct-response copywriting principles.",
            },
            {
              icon: "💾",
              title: "Save & Iterate",
              desc: "Store all your pages, regenerate sections, export clean HTML.",
            },
          ].map((f) => (
            <div key={f.title} className="card group hover:glow-volt">
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="font-display font-semibold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-obsidian-300 text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
