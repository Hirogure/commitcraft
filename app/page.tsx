import CommitTool from "@/components/CommitTool";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center pt-24 pb-16 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-sm font-medium">Powered by Claude AI</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">
            Commit<span className="text-green-400">Craft</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 font-medium max-w-xl mx-auto mb-2">
            Turn your git diff into the perfect commit message — instantly.
          </p>
          <p className="text-gray-500 max-w-md mx-auto">
            Paste any diff, get 3 ready-to-use{" "}
            <span className="text-gray-300">Conventional Commits</span>–style messages.
            No sign-up. No fluff.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <a
              href="#tool"
              className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-400
                text-gray-950 font-bold text-sm transition-colors shadow-lg shadow-green-900/40"
            >
              Try it free →
            </a>
            <a
              href="#pricing"
              className="px-6 py-3 rounded-xl border border-gray-700 hover:border-gray-500
                text-gray-300 font-medium text-sm transition-colors"
            >
              See pricing
            </a>
          </div>
        </div>
      </section>

      {/* ── TOOL ────────────────────────────────────────────────────────── */}
      <section className="py-10 px-4">
        <CommitTool />
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-2xl font-bold mb-10 text-gray-100">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Paste your diff",
                desc: "Run git diff or git diff --staged and paste the output.",
              },
              {
                step: "2",
                title: "Click Generate",
                desc: "Claude reads your diff and crafts 3 distinct commit messages.",
              },
              {
                step: "3",
                title: "Copy & commit",
                desc: "One click copies your favourite message. Done.",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5"
              >
                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 font-bold text-sm flex items-center justify-center mb-3">
                  {step}
                </div>
                <p className="font-semibold text-gray-100 mb-1">{title}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Simple pricing</h2>
          <p className="text-gray-500 mb-12">No credit card required to try.</p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-7 text-left">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Free
              </p>
              <p className="text-4xl font-extrabold mb-1">$0</p>
              <p className="text-gray-500 text-sm mb-6">Forever free · no card needed</p>
              <ul className="space-y-2.5 text-sm text-gray-300">
                {[
                  "3 generations per day",
                  "All commit types",
                  "1-click copy",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#tool"
                className="mt-7 block text-center py-2.5 rounded-xl border border-gray-700
                  text-gray-300 text-sm font-medium hover:border-gray-500 transition-colors"
              >
                Get started
              </a>
            </div>

            {/* Pro */}
            <div className="relative bg-gray-900 border border-green-500/50 rounded-2xl p-7 text-left shadow-xl shadow-green-900/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-gray-950 text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
              <p className="text-sm font-semibold text-green-400 uppercase tracking-widest mb-4">
                Pro
              </p>
              <p className="text-4xl font-extrabold mb-1">$9</p>
              <p className="text-gray-500 text-sm mb-6">per month · cancel anytime</p>
              <ul className="space-y-2.5 text-sm text-gray-300">
                {[
                  "Unlimited generations",
                  "All commit types",
                  "1-click copy",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              {/* Replace href with your Lemon Squeezy checkout URL */}
              <a
                href="https://hirowisdom.lemonsqueezy.com/checkout/buy/e127402d-c267-4c9e-b9eb-3300629345b4"
                className="mt-7 block text-center py-2.5 rounded-xl
                  bg-green-500 hover:bg-green-400 text-gray-950 text-sm font-bold
                  transition-colors shadow-md shadow-green-900/30"
              >
                Upgrade to Pro →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-gray-800 py-8 px-4 text-center text-sm text-gray-600">
        <p>
          CommitCraft &copy; {new Date().getFullYear()} &middot; Built with{" "}
          <a href="https://nextjs.org" className="hover:text-gray-400 transition-colors">Next.js</a>
          {" & "}
          <a href="https://anthropic.com" className="hover:text-gray-400 transition-colors">Claude</a>
        </p>
      </footer>
    </main>
  );
}
